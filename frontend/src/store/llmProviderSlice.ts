import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    fetchAllLLMProviders,
    fetchLLMProviderList,
    fetchLLMProviderDetail,
    createLLMProvider,
    updateLLMProvider,
    deleteLLMProvider,
    setLLMProviderStatus,
} from '../service/llmProviderService';
import { LLMProviderDetail, LLMProviderPagination, LLMProviderRes, LLMProviderState } from '../types/llmProviderType';

const initialState: LLMProviderState = {
    providers: {
        items: [],
        total: 0,
        page: 1,
        size: 10,
        total_pages: 0,
        links: []
    },
    providerDetail: null,
    status: 'idle',
    error: null,
};

const llmProviderSlice = createSlice({
    name: 'llmProvider',
    initialState,
    reducers: {
        // 重置提供商信息
        resetLLMProviderInfo: (state) => {
            state.providers = {
                items: [],
                total: 0,
                page: 1,
                size: 10,
                total_pages: 0,
                links: []
            };
            state.providerDetail = null;
            state.status = 'idle';
            state.error = null;
        },
        // 更新部分提供商信息
        setLLMProviderInfo: (state, action: PayloadAction<Partial<LLMProviderRes>>) => {
            if (state.providerDetail) {
                state.providerDetail = {
                    ...state.providerDetail,
                    ...action.payload
                };
            }
        },
        // 直接设置状态
        setLLMProviderStateInfo: (state, action: PayloadAction<Partial<LLMProviderState>>) => {
            Object.assign(state, action.payload);
        },
    },
    extraReducers: (builder) => {
        // 获取所有提供商
        builder
            .addCase(fetchAllLLMProviders.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAllLLMProviders.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.providers.items = action.payload;
            })
            .addCase(fetchAllLLMProviders.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });

        // 分页获取提供商列表
        builder
            .addCase(fetchLLMProviderList.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchLLMProviderList.fulfilled, (state, action: PayloadAction<LLMProviderPagination>) => {
                state.status = 'succeeded';
                state.providers = action.payload;
            })
            .addCase(fetchLLMProviderList.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });

        // 获取提供商详情
        builder
            .addCase(fetchLLMProviderDetail.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchLLMProviderDetail.fulfilled, (state, action: PayloadAction<LLMProviderDetail>) => {
                state.status = 'succeeded';
                state.providerDetail = action.payload;
            })
            .addCase(fetchLLMProviderDetail.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });

        // 创建提供商
        builder
            .addCase(createLLMProvider.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createLLMProvider.fulfilled, (state, action: PayloadAction<LLMProviderRes>) => {
                state.status = 'succeeded';
                state.providers.items = [action.payload, ...state.providers.items];
            })
            .addCase(createLLMProvider.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });

        // 更新提供商
        builder
            .addCase(updateLLMProvider.pending, (state) => {
                state.status = 'loading';
            })
            // 修改后
            .addCase(updateLLMProvider.fulfilled, (state, action: PayloadAction<LLMProviderRes>) => {
                state.status = 'succeeded';

                // 同时更新 providers 列表和 providerDetail
                const updatedProvider = action.payload;

                // 更新 providers 列表
                state.providers.items = state.providers.items.map(p =>
                    p.uuid === updatedProvider.uuid ? updatedProvider : p
                );

                // 如果当前正在查看的就是被修改的 provider
                if (state.providerDetail?.uuid === updatedProvider.uuid) {
                    state.providerDetail = {...state.providerDetail, ...updatedProvider};
                }
            })
            .addCase(updateLLMProvider.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });

        // 删除提供商
        builder
            .addCase(deleteLLMProvider.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteLLMProvider.fulfilled, (state, action: PayloadAction<string>) => {
                state.status = 'succeeded';
                state.providers.items = state.providers.items.filter(
                    p => p.uuid !== action.payload
                );
            })
            .addCase(deleteLLMProvider.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });

        // 设置提供商状态
        builder
            .addCase(setLLMProviderStatus.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(setLLMProviderStatus.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const provider = state.providers.items.find(
                    p => p.uuid === action.payload.uuid
                );
                if (provider) {
                    provider.status = action.payload.status;
                }
            })
            .addCase(setLLMProviderStatus.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

// 导出 actions
export const {
    resetLLMProviderInfo,
    setLLMProviderInfo,
    setLLMProviderStateInfo
} = llmProviderSlice.actions;

export default llmProviderSlice.reducer;