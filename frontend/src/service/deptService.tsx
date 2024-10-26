import { createAsyncThunk } from '@reduxjs/toolkit';
import {
    querySysDeptTree,
    querySysDeptsAll,
    querySysDeptAllBySysUser,
    querySysDeptDetail,
    createSysDept,
    updateSysDept,
    deleteSysDept,
    SysDeptReq,
    SysDeptTreeParams,
} from '../api/dept';

// 查询部门树
export const fetchDeptTree = createAsyncThunk(
    'dept/fetchDeptTree',
    async (params: SysDeptTreeParams, { rejectWithValue }) => {
        try {
            return await querySysDeptTree(params);
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response: { data?: never } };
                if (err.response && 'data' in err.response) {
                    return rejectWithValue(err.response.data);
                }
            }
            return rejectWithValue('Failed to fetch department tree');
        }
    }
);

// 查询所有部门
export const fetchAllDepts = createAsyncThunk(
    'dept/fetchAllDepts',
    async (_, { rejectWithValue }) => {
        try {
            return await querySysDeptsAll();
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response: { data?: never } };
                if (err.response && 'data' in err.response) {
                    return rejectWithValue(err.response.data);
                }
            }
            return rejectWithValue('Failed to fetch all departments');
        }
    }
);

// 根据用户查询所有部门
export const fetchDeptsByUser = createAsyncThunk(
    'dept/fetchDeptsByUser',
    async (userId: number, { rejectWithValue }) => {
        try {
            return await querySysDeptAllBySysUser(userId);
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response: { data?: never } };
                if (err.response && 'data' in err.response) {
                    return rejectWithValue(err.response.data);
                }
            }
            return rejectWithValue('Failed to fetch departments for the user');
        }
    }
);

// 查询部门详情
export const fetchDeptDetail = createAsyncThunk(
    'dept/fetchDeptDetail',
    async (deptId: number, { rejectWithValue }) => {
        try {
            return await querySysDeptDetail(deptId);
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response: { data?: never } };
                if (err.response && 'data' in err.response) {
                    return rejectWithValue(err.response.data);
                }
            }
            return rejectWithValue('Failed to fetch department details');
        }
    }
);

// 创建部门
export const createDept = createAsyncThunk(
    'dept/createDept',
    async (data: SysDeptReq, { rejectWithValue }) => {
        try {
            return await createSysDept(data);
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response: { data?: never } };
                if (err.response && 'data' in err.response) {
                    return rejectWithValue(err.response.data);
                }
            }
            return rejectWithValue('Failed to create department');
        }
    }
);

// 更新部门
export const updateDept = createAsyncThunk(
    'dept/updateDept',
    async ({ deptId, data }: { deptId: number; data: SysDeptReq }, { rejectWithValue }) => {
        try {
            return await updateSysDept(deptId, data);
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response: { data?: never } };
                if (err.response && 'data' in err.response) {
                    return rejectWithValue(err.response.data);
                }
            }
            return rejectWithValue('Failed to update department');
        }
    }
);

// 删除部门
export const deleteDept = createAsyncThunk(
    'dept/deleteDept',
    async (deptId: number, { rejectWithValue }) => {
        try {
            return await deleteSysDept(deptId);
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response: { data?: never } };
                if (err.response && 'data' in err.response) {
                    return rejectWithValue(err.response.data);
                }
            }
            return rejectWithValue('Failed to delete department');
        }
    }
);
