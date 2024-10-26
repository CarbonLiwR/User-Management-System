import { createAsyncThunk } from '@reduxjs/toolkit';
import {
    querySysRoleAll,
    querySysRoleAllBySysUser,
    querySysMenuTreeBySysRole,
    querySysRoleList,
    querySysRoleDetail,
    createSysRole,
    updateSysRole,
    deleteSysRole,
    updateSysRoleMenu,
    SysRoleReq,
    SysRoleParams,
    SysRoleDeleteParams,
    SysRoleMenuReq,
} from '../api/role';

// 查询所有角色
export const fetchAllRoles = createAsyncThunk(
    'role/fetchAllRoles',
    async (_, { rejectWithValue }) => {
        try {
            return await querySysRoleAll();
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response: { data?: never } };
                if (err.response && 'data' in err.response) {
                    return rejectWithValue(err.response.data);
                }
            }
            return rejectWithValue('Failed to fetch all roles');
        }
    }
);

// 根据用户查询所有角色
export const fetchRolesByUser = createAsyncThunk(
    'role/fetchRolesByUser',
    async (userId: number, { rejectWithValue }) => {
        try {
            return await querySysRoleAllBySysUser(userId);
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response: { data?: never } };
                if (err.response && 'data' in err.response) {
                    return rejectWithValue(err.response.data);
                }
            }
            return rejectWithValue('Failed to fetch roles for the user');
        }
    }
);

// 根据角色查询菜单树
export const fetchRoleMenuTree = createAsyncThunk(
    'role/fetchRoleMenuTree',
    async (roleId: number, { rejectWithValue }) => {
        try {
            return await querySysMenuTreeBySysRole(roleId);
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response: { data?: never } };
                if (err.response && 'data' in err.response) {
                    return rejectWithValue(err.response.data);
                }
            }
            return rejectWithValue('Failed to fetch menu tree for the role');
        }
    }
);

// 查询角色列表
export const fetchRoleList = createAsyncThunk(
    'role/fetchRoleList',
    async (params: SysRoleParams, { rejectWithValue }) => {
        try {
            return await querySysRoleList(params);
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response: { data?: never } };
                if (err.response && 'data' in err.response) {
                    return rejectWithValue(err.response.data);
                }
            }
            return rejectWithValue('Failed to fetch role list');
        }
    }
);

// 查询角色详情
export const fetchRoleDetail = createAsyncThunk(
    'role/fetchRoleDetail',
    async (roleId: number, { rejectWithValue }) => {
        try {
            return await querySysRoleDetail(roleId);
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response: { data?: never } };
                if (err.response && 'data' in err.response) {
                    return rejectWithValue(err.response.data);
                }
            }
            return rejectWithValue('Failed to fetch role details');
        }
    }
);

// 创建角色
export const createRole = createAsyncThunk(
    'role/createRole',
    async (data: SysRoleReq, { rejectWithValue }) => {
        try {
            return await createSysRole(data);
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response: { data?: never } };
                if (err.response && 'data' in err.response) {
                    return rejectWithValue(err.response.data);
                }
            }
            return rejectWithValue('Failed to create role');
        }
    }
);

// 更新角色
export const updateRole = createAsyncThunk(
    'role/updateRole',
    async ({ roleId, data }: { roleId: number; data: SysRoleReq }, { rejectWithValue }) => {
        try {
            return await updateSysRole(roleId, data);
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response: { data?: never } };
                if (err.response && 'data' in err.response) {
                    return rejectWithValue(err.response.data);
                }
            }
            return rejectWithValue('Failed to update role');
        }
    }
);

// 删除角色
export const deleteRole = createAsyncThunk(
    'role/deleteRole',
    async (params: SysRoleDeleteParams, { rejectWithValue }) => {
        try {
            return await deleteSysRole(params);
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response: { data?: never } };
                if (err.response && 'data' in err.response) {
                    return rejectWithValue(err.response.data);
                }
            }
            return rejectWithValue('Failed to delete role(s)');
        }
    }
);

// 更新角色的菜单
export const updateRoleMenu = createAsyncThunk(
    'role/updateRoleMenu',
    async ({ roleId, data }: { roleId: number; data: SysRoleMenuReq }, { rejectWithValue }) => {
        try {
            return await updateSysRoleMenu(roleId, data);
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response: { data?: never } };
                if (err.response && 'data' in err.response) {
                    return rejectWithValue(err.response.data);
                }
            }
            return rejectWithValue('Failed to update role menu');
        }
    }
);
