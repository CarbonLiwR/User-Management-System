import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    fetchAllRoles,
    fetchRoleList,
    fetchRoleDetail,
    createRole,
    updateRole,
    deleteRole,
    updateRoleMenu
} from '../service/roleService';
import { SysRoleRes, SysRoleListRes } from '../api/role';

// Role State interface
export interface RoleState {
    roles: SysRoleRes[];
    roleDetails: SysRoleRes | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    total: number;
}

// Initial state
const initialState: RoleState = {
    roles: [],
    roleDetails: null,
    status: 'idle',
    error: null,
    total: 0,
};

// Role slice
const roleSlice = createSlice({
    name: 'role',
    initialState,
    reducers: {
        // 重置角色信息
        resetRoleInfo: (state) => {
            state.roles = [];
            state.roleDetails = null;
            state.status = 'idle';
            state.error = null;
            state.total = 0;
        },
        // 设置部分角色信息
        setRoleInfo: (state, action: PayloadAction<Partial<SysRoleRes>>) => {
            if (state.roleDetails) {
                state.roleDetails = { ...state.roleDetails, ...action.payload };
            }
        },
    },
    extraReducers: (builder) => {
        // 获取所有角色
        builder
            .addCase(fetchAllRoles.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAllRoles.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.roles = action.payload;
            })
            .addCase(fetchAllRoles.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });

        // 获取角色列表
        builder
            .addCase(fetchRoleList.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchRoleList.fulfilled, (state, action: PayloadAction<SysRoleListRes>) => {
                state.status = 'succeeded';
                state.roles = action.payload.items;
                state.total = action.payload.total;
            })
            .addCase(fetchRoleList.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });

        // 获取角色详情
        builder
            .addCase(fetchRoleDetail.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchRoleDetail.fulfilled, (state, action: PayloadAction<SysRoleRes>) => {
                state.status = 'succeeded';
                state.roleDetails = action.payload;
            })
            .addCase(fetchRoleDetail.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });

        // 创建角色
        builder
            .addCase(createRole.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createRole.fulfilled, (state, action: PayloadAction<SysRoleRes>) => {
                state.status = 'succeeded';
                state.roles.push(action.payload);
            })
            .addCase(createRole.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });

        // 更新角色
        builder
            .addCase(updateRole.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateRole.fulfilled, (state, action: PayloadAction<SysRoleRes>) => {
                state.status = 'succeeded';
                const index = state.roles.findIndex((role) => role.id === action.payload.id);
                if (index !== -1) {
                    state.roles[index] = action.payload;
                }
            })
            .addCase(updateRole.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });

        // 删除角色
        builder
            .addCase(deleteRole.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteRole.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.roles = state.roles.filter((role) => !action.payload.includes(role.id));
            })
            .addCase(deleteRole.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });

        // 更新角色菜单
        builder
            .addCase(updateRoleMenu.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateRoleMenu.fulfilled, (state, action) => {
                state.status = 'succeeded';
                if (state.roleDetails) {
                    state.roleDetails.menus = action.payload.menus;
                }
            })
            .addCase(updateRoleMenu.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

// 导出 actions
export const { resetRoleInfo, setRoleInfo } = roleSlice.actions;

// 导出 reducer
export default roleSlice.reducer;
