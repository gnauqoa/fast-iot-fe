import {
  AuthActionResponse,
  AuthProvider,
  CheckResponse,
  PermissionResponse,
} from '@refinedev/core';
import {} from 'constants';
import { REFRESH_TOKEN_KEY, TOKEN_KEY, TOKEN_EXPIRES_AT_KEY, USER_DATA_KEY } from '@/constants';
import { extractRoleInfoFromToken } from '@/utility/user';
import { axiosInstance } from '@/utility/axios';
import { AxiosResponse } from 'axios';
import { IUser } from 'interfaces/user';
import { connectSocket } from '../utility/socket';

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    try {
      const response: AxiosResponse<{
        refreshToken: string;
        token: string;
        tokenExpires: number;
        user: IUser;
      }> = await axiosInstance.post(`/auth/email/login`, {
        email,
        password,
      });

      const data = response.data;

      if (data.token) {
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(data.user));
        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
        localStorage.setItem(TOKEN_EXPIRES_AT_KEY, data.tokenExpires.toString());

        const userRoleId = extractRoleInfoFromToken(data.token);
        const resourcePathToRedirect = userRoleId?.id === 1 ? '/users' : 'devices';
        connectSocket();

        return {
          success: true,
          redirectTo: resourcePathToRedirect,
        };
      } else {
        return {
          success: false,
          error: {
            name: 'LoginError',
            message: 'Invalid username or password',
          },
        };
      }
    } catch (error) {
      console.error('Error occurred during login:', error);
      return {
        success: false,
        error: {
          name: 'LoginError',
          message: 'An error occurred during login.',
        },
      };
    }
  },
  logout: async (): Promise<AuthActionResponse> => {
    localStorage.removeItem(TOKEN_KEY);
    axiosInstance.defaults.headers.common['Authorization'] = undefined;
    return {
      success: true,
      redirectTo: '/login',
    };
  },
  check: async (): Promise<CheckResponse> => {
    return {
      authenticated: !!localStorage.getItem(TOKEN_KEY),
    };
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onError: async (error: any): Promise<AuthActionResponse> => {
    // Implement your error handling logic here
    console.error(error);
    return {
      success: false,
    };
  },
  getIdentity: async () => {
    try {
      const data: AxiosResponse<IUser> = await axiosInstance.get(`/auth/me`);
      return data.data;
    } catch (error) {
      console.error('Error occurred during getIdentity:', error);
      return null;
    }
  },
  getPermissions: async (): Promise<PermissionResponse> => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      const userRoleId = extractRoleInfoFromToken(token);
      if (userRoleId !== null) {
        return userRoleId.id;
      }
    }
    return 1;
  },
};
