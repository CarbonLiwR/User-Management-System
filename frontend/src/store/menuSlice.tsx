import { createSlice } from '@reduxjs/toolkit';
import { fetchMenuTree, fetchMenuDetail, createMenu, updateMenu, deleteMenu } from '../service/menuService.tsx';

const menuSlice = createSlice({
    name: 'menu',
    initialState: {
        menuTree: [],
        menuDetail: null,
        status: 'idle', // idle, loading, succeeded, failed
        error: null,
    },
    reducers: {
        resetMenuDetail(state) {
            state.menuDetail = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMenuTree.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchMenuTree.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.menuTree = action.payload;
            })
            .addCase(fetchMenuTree.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload ?? 'Failed to fetch menu tree';
            })
            .addCase(fetchMenuDetail.fulfilled, (state, action) => {
                state.menuDetail = action.payload;
            })
            .addCase(createMenu.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(updateMenu.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(deleteMenu.fulfilled, (state) => {
                state.status = 'succeeded';
            });
    },
});

export const { resetMenuDetail } = menuSlice.actions;
export default menuSlice.reducer;
