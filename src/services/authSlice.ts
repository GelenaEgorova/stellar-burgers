import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TUser, RequestStatus } from '../utils/types';
import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from './../utils/burger-api';
import { deleteCookie, getCookie, setCookie } from '../utils/cookie';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const signInUser = createAsyncThunk(
  'authentification/signInUSer',
  async (data: TRegisterData) => {
    const res = await registerUserApi(data);
    setCookie('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    return res;
  }
);

export const loginUser = createAsyncThunk(
  'authentification/loginUser',
  async (data: TLoginData) => {
    const res = await loginUserApi(data);
    setCookie('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    return res;
  }
);

export const logOutUser = createAsyncThunk(
  'authentication/logOutUser',
  async () => {
    await logoutApi();
    localStorage.removeItem('refreshToken');
    deleteCookie('accessToken');
  }
);

export const updateUser = createAsyncThunk(
  'authentication/updateUser',
  async (data: Partial<TRegisterData>) => {
    await updateUserApi(data);
    return getUserApi();
  }
);

export const checkUserAuth = createAsyncThunk(
  'auth/checkUserAuth',
  async (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      getUserApi()
        .then((res) => dispatch(setUser(res.user)))
        .catch(() => {
          localStorage.removeItem('refreshToken');
          deleteCookie('accessToken');
        })
        .finally(() => dispatch(setIsAuthChecked(true)));
    } else {
      dispatch(setIsAuthChecked(true));
    }
  }
);

interface IUserState {
  user: TUser | null;
  isAuthChecked: boolean;
  error: string | null | undefined;
  loading: boolean;
  requestStatus: RequestStatus;
}

export const initialState: IUserState = {
  user: null,
  isAuthChecked: false,
  error: null,
  loading: false,
  requestStatus: RequestStatus.Idle
};

export const authSlice = createSlice({
  name: 'authentification',
  initialState,
  reducers: {
    setIsAuthChecked: (state, action: PayloadAction<boolean>) => {
      state.isAuthChecked = action.payload;
    },
    setUser: (state, action: PayloadAction<TUser | null>) => {
      state.user = action.payload;
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(signInUser.pending, (state) => {
        state.loading = true;
        state.requestStatus = RequestStatus.Loading;
      })
      .addCase(signInUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthChecked = true;
        state.user = action.payload.user;
        state.requestStatus = RequestStatus.Success;
      })
      .addCase(signInUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.requestStatus = RequestStatus.Failed;
      });
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.requestStatus = RequestStatus.Loading;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthChecked = true;
        state.user = action.payload.user;
        state.requestStatus = RequestStatus.Success;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.requestStatus = RequestStatus.Failed;
      });
    builder
      .addCase(logOutUser.fulfilled, (state) => {
        state.user = null;
        state.requestStatus = RequestStatus.Success;
      })
      .addCase(logOutUser.rejected, (state, action) => {
        state.error = action.error.message;
        state.requestStatus = RequestStatus.Failed;
      });
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.requestStatus = RequestStatus.Success;
    });
  },
  selectors: {
    UserSelector: (state) => state.user,
    AuthCheckedSelector: (state) => state.isAuthChecked,
    UserNameSelector: (state) => state.user?.name
  }
});

export const { UserSelector, AuthCheckedSelector, UserNameSelector } =
  authSlice.selectors;

export const { setUser, setIsAuthChecked } = authSlice.actions;
