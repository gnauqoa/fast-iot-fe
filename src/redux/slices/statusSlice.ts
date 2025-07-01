import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { IStatus } from '@/interfaces/user';
import { axiosInstance } from '@/utility/axios';
import { HttpError } from '@refinedev/core';

// Define the state interface
interface StatusState {
  statuses: IStatus[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: StatusState = {
  statuses: [],
  loading: false,
  error: null,
};

// Async thunk for fetching all statuses
export const fetchAllStatuses = createAsyncThunk('status/fetchAllStatuses', async () => {
  try {
    const response = await axiosInstance.get('/statuses');
    return response.data;
  } catch (error) {
    throw error as HttpError;
  }
});

// Async thunk for creating a status
export const createStatus = createAsyncThunk(
  'status/createStatus',
  async (statusData: Omit<IStatus, 'id' | '__entity'>) => {
    try {
      const response = await axiosInstance.post('/statuses', statusData);
      return response.data;
    } catch (error) {
      throw error as HttpError;
    }
  }
);

// Async thunk for updating a status
export const updateStatus = createAsyncThunk(
  'status/updateStatus',
  async ({ id, data }: { id: number; data: Partial<Omit<IStatus, 'id' | '__entity'>> }) => {
    try {
      const response = await axiosInstance.patch(`/statuses/${id}`, data);
      return response.data;
    } catch (error) {
      throw error as HttpError;
    }
  }
);

// Async thunk for deleting a status
export const deleteStatus = createAsyncThunk('status/deleteStatus', async (id: number) => {
  try {
    await axiosInstance.delete(`/statuses/${id}`);
    return id;
  } catch (error) {
    throw error as HttpError;
  }
});

// Create the slice
const statusSlice = createSlice({
  name: 'status',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    resetStatuses: state => {
      state.statuses = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      // Fetch all statuses
      .addCase(fetchAllStatuses.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllStatuses.fulfilled, (state, action) => {
        state.loading = false;
        state.statuses = action.payload;
      })
      .addCase(fetchAllStatuses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch statuses';
      })

      // Create status
      .addCase(createStatus.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.statuses.push(action.payload);
      })
      .addCase(createStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create status';
      })

      // Update status
      .addCase(updateStatus.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.statuses.findIndex(s => s.id === action.payload.id);
        if (index >= 0) {
          state.statuses[index] = action.payload;
        }
      })
      .addCase(updateStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update status';
      })

      // Delete status
      .addCase(deleteStatus.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.statuses = state.statuses.filter(s => s.id !== action.payload);
      })
      .addCase(deleteStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete status';
      });
  },
});

export const { clearError, resetStatuses } = statusSlice.actions;
export default statusSlice.reducer;
