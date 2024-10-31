import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {
    loginUser,
    logout,
    fetchCaptcha,
    fetchUserInfo,
    fetchUserList,
    fetchUserMenu,
    addUserThunk,
    updateUserThunk,
    deleteUserThunk,
    changeUserStatusThunk,
    changeUserSuperThunk,
    changeUserStaffThunk,
    changeUserMultiThunk, updateUserRoleThunk, updateUserDeptThunk
} from '../service/userService';  // Assuming you have created these Thunks
import {setToken, clearToken} from '../utils/auth';
import {UserState} from "../types";

const initialState: UserState = {
    username: '',
    nickname: '',
    avatar: '',
    captcha: '',
    is_superuser: false,
    is_staff: false,
    roles: '',
    depts: [],
    menu: [],
    status: 'idle',  // 'idle', 'loading', 'succeeded', 'failed'
    error: null as unknown,
    userList: [],
    totalUsers: 0
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // 部分更新用户信息
        setInfo: (state, action: PayloadAction<Partial<UserState>>) => {
            return {...state, ...action.payload}; // 部分更新用户状态
        },

        // 重置用户信息
        resetInfo: (state) => {
            clearToken(); // Clear the token upon reset
            return {...initialState};
        },
    },
    extraReducers: (builder) => {
        // Handle login
        builder
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                setToken(action.payload.access_token); // Set token in storage
                Object.assign(state, action.payload.user);
                localStorage.setItem('userInfo', JSON.stringify(action.payload.user));
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload ?? null;
            });

        // Handle logout
        builder
            .addCase(logout.fulfilled, (state) => {
                state.status = 'succeeded';
                clearToken(); // 清除 token
                clearUserInfo(); // 清除 localStorage 中的用户信息
                return initialState;
            });

        const clearUserInfo = () => {
            localStorage.removeItem('userInfo');
        };

        // Handle captcha fetching
        builder
            .addCase(fetchCaptcha.fulfilled, (state, action) => {
                state.captcha = `data:image/png;base64, ${action.payload.image}`;
                state.status = 'succeeded';
            })
            .addCase(fetchCaptcha.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });

        // Handle fetching user info
        builder
            .addCase(fetchUserInfo.fulfilled, (state, action) => {
                state.status = 'succeeded';
                Object.assign(state, action.payload);
            })
            .addCase(fetchUserInfo.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload ?? 'Failed to fetch user info';
            });

        // Handle fetching user info
        builder
            .addCase(fetchUserMenu.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.menu = action.payload;
            })
            .addCase(fetchUserMenu.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload ?? 'Failed to fetch user info';
            });

        // Handle fetching user list
        builder
            .addCase(fetchUserList.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.userList = action.payload.items;
                state.totalUsers = action.payload.total;
            })
            .addCase(fetchUserList.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload ?? 'Failed to fetch user list';
            });

        // Handle adding a new user
        builder
            .addCase(addUserThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.userList.push(action.payload);
            })
            .addCase(addUserThunk.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload ?? 'Failed to add user';
            });

        // Handle updating a user
        builder
            .addCase(updateUserThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const updatedUserIndex = state.userList.findIndex(user => user.username === action.meta.arg.username);
                if (updatedUserIndex >= 0) {
                    state.userList[updatedUserIndex] = {...state.userList[updatedUserIndex], ...action.meta.arg.data};
                }
            })
            .addCase(updateUserThunk.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload ?? 'Failed to update user';
            });

        // Handle updating a user role
        builder
            .addCase(updateUserRoleThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                console.log("action.meta", action.meta)
                const updatedUserIndex = state.userList.findIndex(user => user.username === action.meta.arg.username);
                if (updatedUserIndex >= 0) {
                    state.userList[updatedUserIndex] = {...state.userList[updatedUserIndex], ...action.meta.arg.data};
                }
            })
            .addCase(updateUserRoleThunk.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload ?? 'Failed to update user';
            });

        // Handle updating a user dept
        builder
            .addCase(updateUserDeptThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const updatedUserIndex = state.userList.findIndex(user => user.username === action.meta.arg.username);
                if (updatedUserIndex >= 0) {
                    state.userList[updatedUserIndex] = {...state.userList[updatedUserIndex], ...action.meta.arg.data};
                }
            })
            .addCase(updateUserDeptThunk.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload ?? 'Failed to update user';
            });

        // Handle deleting a user
        builder
            .addCase(deleteUserThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.userList = state.userList.filter(user => user.username !== action.meta.arg);
            })
            .addCase(deleteUserThunk.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload ?? 'Failed to delete user';
            });

        // Handle changing user status
        builder
            .addCase(changeUserStatusThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const updatedUser = state.userList.find(user => user.id === action.meta.arg);
                if (updatedUser) {
                    updatedUser.status = updatedUser.status === 1 ? 0 : 1;  // Toggle status
                }
            });

        // Handle changing user superuser status
        builder
            .addCase(changeUserSuperThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const updatedUser = state.userList.find(user => user.id === action.meta.arg);
                if (updatedUser) {
                    updatedUser.is_superuser = !updatedUser.is_superuser;  // Toggle superuser
                }
            });

        // Handle changing user staff status
        builder
            .addCase(changeUserStaffThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const updatedUser = state.userList.find(user => user.id === action.meta.arg);
                if (updatedUser) {
                    updatedUser.is_staff = !updatedUser.is_staff;  // Toggle staff status
                }
            });

        // Handle changing user multi-login status
        builder
            .addCase(changeUserMultiThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const updatedUser = state.userList.find(user => user.id === action.meta.arg);
                if (updatedUser) {
                    updatedUser.is_multi_login = !updatedUser.is_multi_login;  // Toggle multi-login
                }
            });
    },
});

export const {resetInfo, setInfo} = userSlice.actions;

export default userSlice.reducer;
