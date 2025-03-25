import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector, TypedUseSelectorHook } from 'react-redux';
import {
    fetchAllLLMModels,
    fetchLLMModelList,
    fetchLLMModelDetail,
    createLLMModel,
    updateLLMModel,
    deleteLLMModel
} from '../service/llmModelService';
import { RootState, AppDispatch } from '../store';
import {resetLLMModelInfo, setLLMModelInfo, setLLMModelStateInfo} from '../store/llmModelSlice';
import {LLMModelCreateReq, LLMModelDetail, LLMModelState, LLMModelUpdateReq, GetLLMModelListParam} from "../types/llmModelType";


export function useDispatchLLMModel() {
    const dispatch = useDispatch<AppDispatch>();

    // Get all LLMModels
    const getAllLLMModels = useCallback((llmProviderUuid: string) => {
        return dispatch(fetchAllLLMModels(llmProviderUuid));
    }, [dispatch]);

    // Get LLMModel list (pagination)
    const getLLMModelList = useCallback((params?: GetLLMModelListParam) => {
        return dispatch(fetchLLMModelList(params));
    }, [dispatch]);

    // Get LLMModel details
    const getLLMModelDetail = useCallback((llmModelUuid: string) => {
        return dispatch(fetchLLMModelDetail(llmModelUuid));
    }, [dispatch]);

    // Create a new LLMModel
    const addLLMModel = useCallback((llmModelData: LLMModelCreateReq) => {
        return dispatch(createLLMModel(llmModelData));
    }, [dispatch]);

    // Update LLMModel information
    const updateLLMModelInfo = useCallback((modelUuid: string, data: LLMModelUpdateReq) => {
        return dispatch(updateLLMModel({ modelUuid, data }));
    }, [dispatch]);

    // Delete LLMModels
    const removeLLMModel = useCallback((pk: string) => {
        return dispatch(deleteLLMModel(pk));
    }, [dispatch]);

    // Set partial LLMModel info (partial update)
    const setLLMModelPartialInfo = useCallback((llmModelInfo: Partial<LLMModelDetail>) => {
        dispatch(setLLMModelInfo(llmModelInfo));
    }, [dispatch]);

    // Reset LLMModel info
    const resetLLMModel = useCallback(() => {
        dispatch(resetLLMModelInfo());
    }, [dispatch]);

    // Reset Compile info
    const setLLMModelStatePartialInfo = useCallback((llmModelStateInfo: Partial<LLMModelState>) => {
        dispatch(setLLMModelStateInfo(llmModelStateInfo));
    }, [dispatch]);

    return {
        getAllLLMModels,
        getLLMModelList,
        getLLMModelDetail,
        addLLMModel,
        updateLLMModelInfo,
        removeLLMModel,
        setLLMModelPartialInfo,
        resetLLMModel,
        setLLMModelStatePartialInfo
    };
}

// Create a typed useSelector hook
export const useLLMModelSelector: TypedUseSelectorHook<RootState> = useSelector;
