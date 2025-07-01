export type IRole = {
  id: number;
  name: UserRole;
  __entity: 'RoleEntity';
};

export enum UserRole {
  ADMIN = 'Admin',
  USER = 'User',
}

export type IStatus = {
  id: number;
  name: string;
  __entity: 'StatusEntity';
};

export type IUser = {
  id: number;
  email: string;
  provider: string;
  socialId: string | null;
  fullName: string;
  firstName: string;
  lastName: string;
  role: IRole;
  status: IStatus;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};
