import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    fetchAllLLMModels,
    fetchLLMModelList,
    fetchLLMModelDetail,
    createLLMModel,
    updateLLMModel,
    deleteLLMModel,
    setLLMModelStatus,
} from '../service/llmModelService';
import { LLMModelDetail, LLMModelPagination, LLMModelRes, LLMModelState } from '../types/llmModelType';

const initialState: LLMModelState = {
    models: {
        items: [],
        total: 0,
        page: 1,
        size: 10,
        total_pages: 0,
        links: []
    },
    modelDetail: null,
    status: 'idle',
    error: null,
};

const llmModelSlice = createSlice({
    name: 'llmModel',
    initialState,
    reducers: {
        // 重置模型信息
        resetLLMModelInfo: (state) => {
            state.models = {
                items: [],
                total: 0,
                page: 1,
                size: 10,
                total_pages: 0,
                links: []
            };
            state.modelDetail = null;
            state.status = 'idle';
            state.error = null;
        },
        // 更新部分模型信息
        setLLMModelInfo: (state, action: PayloadAction<Partial<LLMModelRes>>) => {
            if (state.modelDetail) {
                state.modelDetail = {
                    ...state.modelDetail,
                    ...action.payload
                };
            }
        },
        // 直接设置状态
        setLLMModelStateInfo: (state, action: PayloadAction<Partial<LLMModelState>>) => {
            Object.assign(state, action.payload);
        },
    },
    extraReducers: (builder) => {
        // 获取所有模型
        builder
            .addCase(fetchAllLLMModels.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAllLLMModels.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.models.items = action.payload;
            })
            .addCase(fetchAllLLMModels.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });

        // 分页获取模型列表
        builder
            .addCase(fetchLLMModelList.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchLLMModelList.fulfilled, (state, action: PayloadAction<LLMModelPagination>) => {
                state.status = 'succeeded';
                state.models = action.payload;
            })
            .addCase(fetchLLMModelList.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });

        // 获取模型详情
        builder
            .addCase(fetchLLMModelDetail.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchLLMModelDetail.fulfilled, (state, action: PayloadAction<LLMModelDetail>) => {
                state.status = 'succeeded';
                state.modelDetail = action.payload;
            })
            .addCase(fetchLLMModelDetail.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });

        // 创建模型
        builder
            .addCase(createLLMModel.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createLLMModel.fulfilled, (state, action: PayloadAction<LLMModelRes>) => {
                state.status = 'succeeded';
                state.models.items = [action.payload, ...state.models.items];
            })
            .addCase(createLLMModel.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });

        // 更新模型
        builder
            .addCase(updateLLMModel.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateLLMModel.fulfilled, (state, action: PayloadAction<LLMModelRes>) => {
                state.status = 'succeeded';
                const index = state.models.items.findIndex(
                    m => m.uuid === action.payload.uuid
                );
                if (index !== -1) {
                    state.models.items[index] = action.payload;
                }
            })
            .addCase(updateLLMModel.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });

        // 删除模型
        builder
            .addCase(deleteLLMModel.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteLLMModel.fulfilled, (state, action: PayloadAction<string>) => {
                state.status = 'succeeded';
                state.models.items = state.models.items.filter(
                    m => m.uuid !== action.payload
                );
            })
            .addCase(deleteLLMModel.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });

        // 设置模型状态
        builder
            .addCase(setLLMModelStatus.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(setLLMModelStatus.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const model = state.models.items.find(
                    m => m.uuid === action.payload.uuid
                );
                if (model) {
                    model.status = action.payload.status;
                }
            })
            .addCase(setLLMModelStatus.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });

    },
});

// 导出 actions
export const {
    resetLLMModelInfo,
    setLLMModelInfo,
    setLLMModelStateInfo
} = llmModelSlice.actions;

export default llmModelSlice.reducer;