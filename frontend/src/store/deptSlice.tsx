import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    fetchDeptTree,
    fetchAllDepts,
    fetchDeptDetail,
    createDept,
    updateDept,
    deleteDept,
} from '../service/deptService';
import { SysDeptRes, SysDeptTreeRes } from '../api/dept';

// 部门状态的接口
export interface DeptState {
    depts: SysDeptRes[];
    deptTree: SysDeptTreeRes[] | null;
    deptDetails: SysDeptRes | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    total: number;
}

// 初始状态
const initialState: DeptState = {
    depts: [],
    deptTree: null,
    deptDetails: null,
    status: 'idle',
    error: null,
    total: 0,
};

// 部门 slice
const deptSlice = createSlice({
    name: 'dept',
    initialState,
    reducers: {
        // 重置部门信息
        resetDeptInfo: (state) => {
            state.depts = [];
            state.deptTree = null;
            state.deptDetails = null;
            state.status = 'idle';
            state.error = null;
            state.total = 0;
        },
        // 设置部分部门信息
        setDeptInfo: (state, action: PayloadAction<Partial<SysDeptRes>>) => {
            if (state.deptDetails) {
                state.deptDetails = { ...state.deptDetails, ...action.payload };
            }
        },
    },
    extraReducers: (builder) => {
        // 获取部门树
        builder
            .addCase(fetchDeptTree.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchDeptTree.fulfilled, (state, action: PayloadAction<SysDeptTreeRes[]>) => {
                state.status = 'succeeded';
                state.deptTree = action.payload;
            })
            .addCase(fetchDeptTree.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });

        // 获取所有部门
        builder
            .addCase(fetchAllDepts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAllDepts.fulfilled, (state, action: PayloadAction<SysDeptRes[]>) => {
                state.status = 'succeeded';
                state.depts = action.payload;
                state.total = action.payload.length;  // 假设总数就是部门列表长度
            })
            .addCase(fetchAllDepts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });

        // 获取部门详情
        builder
            .addCase(fetchDeptDetail.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchDeptDetail.fulfilled, (state, action: PayloadAction<SysDeptRes>) => {
                state.status = 'succeeded';
                state.deptDetails = action.payload;
            })
            .addCase(fetchDeptDetail.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });

        // 创建部门
        builder
            .addCase(createDept.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createDept.fulfilled, (state, action: PayloadAction<SysDeptRes>) => {
                state.status = 'succeeded';
                state.depts.push(action.payload);  // 将新创建的部门添加到部门列表
            })
            .addCase(createDept.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });

        // 更新部门
        builder
            .addCase(updateDept.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateDept.fulfilled, (state, action: PayloadAction<SysDeptRes>) => {
                state.status = 'succeeded';
                const index = state.depts.findIndex((dept) => dept.id === action.payload.id);
                if (index !== -1) {
                    state.depts[index] = action.payload;  // 更新部门列表中的部门信息
                }
            })
            .addCase(updateDept.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });

        // 删除部门
        builder
            .addCase(deleteDept.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteDept.fulfilled, (state, action: PayloadAction<number>) => {
                state.status = 'succeeded';
                state.depts = state.depts.filter((dept) => dept.id !== action.payload);  // 过滤掉已删除的部门
            })
            .addCase(deleteDept.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

// 导出 actions
export const { resetDeptInfo, setDeptInfo } = deptSlice.actions;

// 导出 reducer
export default deptSlice.reducer;
