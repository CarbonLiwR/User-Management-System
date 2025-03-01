import {createAsyncThunk} from '@reduxjs/toolkit';
import {
    addUser,
    changeUserMulti,
    changeUserStaff,
    changeUserStatus,
    changeUserSuper,
    deleteUser,
    getUser,
    getUserInfo,
    getUserList,
    getUserMenuList,
    SysUserAddReq,
    SysUserDeptReq,
    SysUserInfoReq,
    SysUserParams,
    SysUserRoleReq,
    updateUser,
    updateUserDept,
    updateUserRole
} from '../api/user';
import {
    CaptchaRes, forgetPwd,
    getCaptcha,
    LoginData,
    LoginRes,
    RegisterData,
    RegisterRes,
    registerUser, ResetPasswordData,
    userLogin,
    userLogout
} from "../api/auth.tsx";
import {clearToken} from "../utils/auth.ts"; // 假设你在 API 中已经定义了这些函数

// 异步Thunk用于获取用户信息
export const fetchUserInfo = createAsyncThunk(
    'user/fetchUserInfo',
    async (_, { rejectWithValue }) => {
        try {
            return await getUserInfo();
        } catch (error: unknown) {
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

// 异步Thunk用于获取用户列表
export const fetchUserList = createAsyncThunk(
    'user/fetchUserList',
    async (params: SysUserParams, { rejectWithValue }) => {
        try {
            return await getUserList(params);
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response: { data?: never } };
                if (err.response && 'data' in err.response) {
                    return rejectWithValue(err.response.data);
                }
            }
            return rejectWithValue('Failed to fetch user list');
        }
    }
);


export const fetchUserMenu = createAsyncThunk(
    'user/fetchUserMenu',
    async (_, { rejectWithValue }) => {
        try {
            return await getUserMenuList();
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response: { data?: never } };
                if (err.response && 'data' in err.response) {
                    return rejectWithValue(err.response.data);
                }
            }
            return rejectWithValue('Failed to fetch user list');
        }
    }
);

// 异步Thunk用于获取单个用户信息
export const fetchSingleUser = createAsyncThunk(
    'user/fetchSingleUser',
    async (username: string, { rejectWithValue }) => {
        try {
            return await getUser(username);
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response: { data?: never } };
                if (err.response && 'data' in err.response) {
                    return rejectWithValue(err.response.data);
                }
            }
            return rejectWithValue('Failed to fetch user');
        }
    }
);

// 异步Thunk用于添加用户
export const addUserThunk = createAsyncThunk(
    'user/addUser',
    async (userData: SysUserAddReq, { rejectWithValue }) => {
        try {
            return await addUser(userData);
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response: { data?: never } };
                if (err.response && 'data' in err.response) {
                    return rejectWithValue(err.response.data);
                }
            }
            return rejectWithValue('Failed to add user');
        }
    }
);

// 异步Thunk用于更新用户信息
export const updateUserThunk = createAsyncThunk(
    'user/updateUser',
    async ({ username, data }: { username: string; data: SysUserInfoReq }, { rejectWithValue }) => {
        try {
            return await updateUser(username, data);
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response: { data?: never } };
                if (err.response && 'data' in err.response) {
                    return rejectWithValue(err.response.data);
                }
            }
            return rejectWithValue('Failed to update user');
        }
    }
);

export const updateUserRoleThunk = createAsyncThunk(
    'user/updateUserRole',
    async ({ username, data }: { username: string; data: SysUserRoleReq }, { rejectWithValue }) => {
        try {
            return await updateUserRole(username, data);
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response: { data?: never } };
                if (err.response && 'data' in err.response) {
                    return rejectWithValue(err.response.data);
                }
            }
            return rejectWithValue('Failed to update user role');
        }
    }
);

export const updateUserDeptThunk = createAsyncThunk(
    'user/updateUserDept',
    async ({ username, data }: { username: string; data: SysUserDeptReq }, { rejectWithValue }) => {
        try {
            return await updateUserDept(username, data);
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response: { data?: never } };
                if (err.response && 'data' in err.response) {
                    return rejectWithValue(err.response.data);
                }
            }
            return rejectWithValue('Failed to update user dept');
        }
    }
);

// 异步Thunk用于删除用户
export const deleteUserThunk = createAsyncThunk(
    'user/deleteUser',
    async (username: string, { rejectWithValue }) => {
        try {
            return await deleteUser(username);
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response: { data?: never } };
                if (err.response && 'data' in err.response) {
                    return rejectWithValue(err.response.data);
                }
            }
            return rejectWithValue('Failed to delete user');
        }
    }
);

// 异步Thunk用于修改用户状态
export const changeUserStatusThunk = createAsyncThunk(
    'user/changeStatus',
    async (pk: number, { rejectWithValue }) => {
        try {
            return await changeUserStatus(pk);
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response: { data?: never } };
                if (err.response && 'data' in err.response) {
                    return rejectWithValue(err.response.data);
                }
            }
            return rejectWithValue('Failed to change user status');
        }
    }
);

// 异步Thunk用于修改用户是否为超级管理员
export const changeUserSuperThunk = createAsyncThunk(
    'user/changeSuper',
    async (pk: number, { rejectWithValue }) => {
        try {
            return await changeUserSuper(pk);
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response: { data?: never } };
                if (err.response && 'data' in err.response) {
                    return rejectWithValue(err.response.data);
                }
            }
            return rejectWithValue('Failed to change user super status');
        }
    }
);

// 异步Thunk用于修改用户是否是员工
export const changeUserStaffThunk = createAsyncThunk(
    'user/changeStaff',
    async (pk: number, { rejectWithValue }) => {
        try {
            return await changeUserStaff(pk);
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response: { data?: never } };
                if (err.response && 'data' in err.response) {
                    return rejectWithValue(err.response.data);
                }
            }
            return rejectWithValue('Failed to change user staff status');
        }
    }
);

// 异步Thunk用于修改用户是否支持多点登录
export const changeUserMultiThunk = createAsyncThunk(
    'user/changeMultiLogin',
    async (pk: number, { rejectWithValue }) => {
        try {
            return await changeUserMulti(pk);
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response: { data?: never } };
                if (err.response && 'data' in err.response) {
                    return rejectWithValue(err.response.data);
                }
            }
            return rejectWithValue('Failed to change user multi-login status');
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

// 异步Thunk用于修改密码
export const updatePasswordThunk = createAsyncThunk(
    'user/updatePassword',
    async (ResetPassWordParams:ResetPasswordData, { rejectWithValue }) => {
        try {
            return await forgetPwd(ResetPassWordParams); // 调用忘记密码函数
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response: { data?: never } };
                if (err.response && 'data' in err.response) {
                    return rejectWithValue(err.response.data);
                }
            }
            return rejectWithValue('修改密码失败');
        }
    }
);


