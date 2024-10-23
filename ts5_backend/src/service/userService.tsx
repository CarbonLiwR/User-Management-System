import {createAsyncThunk} from '@reduxjs/toolkit';
import {
    CaptchaRes,
    getCaptcha,
    LoginData,
    LoginRes,
    RegisterData,
    RegisterRes,
    registerUser,
    userLogin,
    userLogout
} from '../api/auth';
import {getUserInfo} from '../api/user';
import {clearToken, setToken} from '../utils/auth';

export const fetchUserInfo = createAsyncThunk(
    'user/fetchUserInfo',
    async (_, { rejectWithValue }) => {
        try {
            return await getUserInfo();
        } catch (error: unknown) {
            // 使用与其他 thunk 一致的错误处理逻辑
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response: { data?: never } };
                if (err.response && 'data' in err.response) {
                    return rejectWithValue(err.response.data);
                }
            }
            return rejectWithValue('Failed to fetch user info');
        }
    }
);

// 异步Thunk用于登录
export const loginUser = createAsyncThunk(
    'user/login',
    async (loginForm: LoginData, { rejectWithValue }) => {
        try {
            const response = await userLogin(loginForm);
            return response as LoginRes;
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response: { data?: never } };
                if (err.response && 'data' in err.response) {
                    return rejectWithValue(err.response.data);
                }
            }
            return rejectWithValue('An unexpected login error occurred');
        }
    }
);

// 异步Thunk用于注册
export const register = createAsyncThunk(
    'user/register',
    async (registerForm: RegisterData, { rejectWithValue }) => {
        try {
            const response = await registerUser(registerForm);
            return response as RegisterRes;
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response: { data?: never } };
                if (err.response && 'data' in err.response) {
                    return rejectWithValue(err.response.data);
                }
            }
            return rejectWithValue('An unexpected register error occurred');
        }
    }
);

// 异步Thunk用于登出
export const logout = createAsyncThunk(
    'user/logout',
    async (_, { rejectWithValue }) => {
        try {
            const response = await userLogout();
            clearToken();
            return response;
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response: { data?: never } };
                if (err.response && 'data' in err.response) {
                    return rejectWithValue(err.response.data);
                }
            }
            return rejectWithValue('An unexpected error occurred during logout');
        }
    }
);

// 异步Thunk用于获取验证码
export const fetchCaptcha = createAsyncThunk(
    'user/fetchCaptcha',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getCaptcha();
            return response as CaptchaRes;
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response: { data?: never } };
                if (err.response && 'data' in err.response) {
                    return rejectWithValue(err.response.data);
                }
            }
            return rejectWithValue('Failed to fetch captcha');
        }
    }
);
