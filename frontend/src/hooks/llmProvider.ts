import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector, TypedUseSelectorHook } from 'react-redux';
import {
    fetchAllLLMProviders,
    fetchLLMProviderList,
    fetchLLMProviderDetail,
    createLLMProvider,
    updateLLMProvider,
    deleteLLMProvider
} from '../service/llmProviderService';
import { RootState, AppDispatch } from '../store';
import {resetLLMProviderInfo, setLLMProviderInfo, setLLMProviderStateInfo} from '../store/llmProviderSlice';
import {LLMProviderCreateReq, LLMProviderDetail, LLMProviderState, LLMProviderUpdateReq, GetLLMProviderListParam} from "../types/llmProviderType";


export function useDispatchLLMProvider() {
    const dispatch = useDispatch<AppDispatch>();

    // Get all LLMProviders
    const getAllLLMProviders = useCallback(() => {
        return dispatch(fetchAllLLMProviders());
    }, [dispatch]);

    // Get LLMProvider list (pagination)
    const getLLMProviderList = useCallback((params?: GetLLMProviderListParam) => {
        return dispatch(fetchLLMProviderList(params));
    }, [dispatch]);

    // Get LLMProvider details
    const getLLMProviderDetail = useCallback((llmProviderUuid: string) => {
        return dispatch(fetchLLMProviderDetail(llmProviderUuid));
    }, [dispatch]);

    // Create a new LLMProvider
    const addLLMProvider = useCallback((llmProviderData: LLMProviderCreateReq) => {
        return dispatch(createLLMProvider(llmProviderData));
    }, [dispatch]);

    // Update LLMProvider information
    const updateLLMProviderInfo = useCallback((providerUuid: string, data: LLMProviderUpdateReq) => {
        return dispatch(updateLLMProvider({ providerUuid, data }));
    }, [dispatch]);

    // Delete LLMProviders
    const removeLLMProvider = useCallback((pk: string) => {
        return dispatch(deleteLLMProvider(pk));
    }, [dispatch]);

    // Set partial LLMProvider info (partial update)
    const setLLMProviderPartialInfo = useCallback((llmProviderInfo: Partial<LLMProviderDetail>) => {
        dispatch(setLLMProviderInfo(llmProviderInfo));
    }, [dispatch]);

    // Reset LLMProvider info
    const resetLLMProvider = useCallback(() => {
        dispatch(resetLLMProviderInfo());
    }, [dispatch]);

    // Reset Compile info
    const setLLMProviderStatePartialInfo = useCallback((llmProviderStateInfo: Partial<LLMProviderState>) => {
        dispatch(setLLMProviderStateInfo(llmProviderStateInfo));
    }, [dispatch]);

    return {
        getAllLLMProviders,
        getLLMProviderList,
        getLLMProviderDetail,
        addLLMProvider,
        updateLLMProviderInfo,
        removeLLMProvider,
        setLLMProviderPartialInfo,
        resetLLMProvider,
        setLLMProviderStatePartialInfo
    };
}

// Create a typed useSelector hook
export const useLLMProviderSelector: TypedUseSelectorHook<RootState> = useSelector;
