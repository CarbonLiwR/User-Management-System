import { createAsyncThunk } from '@reduxjs/toolkit';
import {
    SysMenuReq,
    SysMenuTreeParams,
    querySysMenuTree,
    querySysMenuDetail,
    createSysMenu,
    updateSysMenu,
    deleteSysMenu
} from '../api/menu';

// 获取菜单树的异步操作
export const fetchMenuTree = createAsyncThunk(
    'menu/fetchMenuTree',
    async (params: SysMenuTreeParams, { rejectWithValue }) => {
        try {
            const response = await querySysMenuTree(params);
            return response;
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response: { data?: never } };
                if (err.response && 'data' in err.response) {
                    return rejectWithValue(err.response.data);
                }
            }
            return rejectWithValue('Failed to fetch menu tree');
        }
    }
);

// 获取菜单详情的异步操作
export const fetchMenuDetail = createAsyncThunk(
    'menu/fetchMenuDetail',
    async (menuId: number, { rejectWithValue }) => {
        try {
            const response = await querySysMenuDetail(menuId);
            return response;
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response: { data?: never } };
                if (err.response && 'data' in err.response) {
                    return rejectWithValue(err.response.data);
                }
            }
            return rejectWithValue('Failed to fetch menu detail');
        }
    }
);

// 创建菜单的异步操作
export const createMenu = createAsyncThunk(
    'menu/createMenu',
    async (menuData: SysMenuReq, { rejectWithValue }) => {
        try {
            const response = await createSysMenu(menuData);
            return response;
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response: { data?: never } };
                if (err.response && 'data' in err.response) {
                    return rejectWithValue(err.response.data);
                }
            }
            return rejectWithValue('Failed to create menu');
        }
    }
);

// 更新菜单的异步操作
export const updateMenu = createAsyncThunk(
    'menu/updateMenu',
    async ({ menuId, menuData }: { menuId: number; menuData: SysMenuReq }, { rejectWithValue }) => {
        try {
            const response = await updateSysMenu(menuId, menuData);
            return response;
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response: { data?: never } };
                if (err.response && 'data' in err.response) {
                    return rejectWithValue(err.response.data);
                }
            }
            return rejectWithValue('Failed to update menu');
        }
    }
);

// 删除菜单的异步操作
export const deleteMenu = createAsyncThunk(
    'menu/deleteMenu',
    async (menuId: number, { rejectWithValue }) => {
        try {
            const response = await deleteSysMenu(menuId);
            return response;
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response: { data?: never } };
                if (err.response && 'data' in err.response) {
                    return rejectWithValue(err.response.data);
                }
            }
            return rejectWithValue('Failed to delete menu');
        }
    }
);
