import { createSlice, PayloadAction} from '@reduxjs/toolkit';
import { loginUser, logout, fetchCaptcha,fetchUserInfo} from '../service/userService.tsx';
import { setToken} from '../utils/auth';
import {UserState} from "../types/user.tsx";


const initialState = {
    username: '',
    nickname: '',
    avatar: '',
    captcha: '',
    is_superuser: false,
    is_staff: false,
    roles: '',
    depts: [],
    status: 'idle', // 'idle', 'loading', 'succeeded', 'failed'
    error: null as unknown
};


const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // 部分更新用户信息
        setInfo: (state, action: PayloadAction<Partial<UserState>>) => {
            return { ...state, ...action.payload }; // 部分更新用户状态
        },

        // 重置用户信息
        resetInfo: () => {
            return { ...initialState };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                setToken(action.payload.access_token);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload ?? null;
            })
            .addCase(logout.fulfilled, (state) => {
                state.status = 'succeeded';
                state = initialState;
            })
            .addCase(fetchCaptcha.fulfilled, (state, action) => {
                state.captcha = `data:image/png;base64, ${action.payload.image}`;
                state.status = 'succeeded';
            })
            .addCase(fetchCaptcha.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(fetchUserInfo.fulfilled, (state, action) => {
                state.status = 'succeeded';
                console.log(action.payload);
                Object.assign(state, action.payload);
            })
            .addCase(fetchUserInfo.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload ?? 'Failed to fetch user info';
            });
    }
});


export const { resetUser, setInfo} = userSlice.actions;

export default userSlice.reducer;
