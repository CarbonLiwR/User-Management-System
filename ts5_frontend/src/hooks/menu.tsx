import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
    fetchMenuTree,
    fetchMenuDetail,
    createMenu,
    updateMenu,
    deleteMenu
} from '../service/menuService';
import { AppDispatch } from "../store";
import { SysMenuReq, SysMenuTreeParams } from '../api/menu';

// 自定义 Hook 来处理菜单相关的 dispatch 操作
export function useDispatchMenu() {
    const dispatch = useDispatch<AppDispatch>();

    // 获取菜单树
    const getMenuTree = useCallback((params: SysMenuTreeParams) => {
        return dispatch(fetchMenuTree(params));
    }, [dispatch]);

    // 获取菜单详情
    const getMenuDetail = useCallback((menuId: number) => {
        return dispatch(fetchMenuDetail(menuId));
    }, [dispatch]);

    // 创建菜单
    const createNewMenu = useCallback((menuData: SysMenuReq) => {
        return dispatch(createMenu(menuData));
    }, [dispatch]);

    // 更新菜单
    const updateMenuInfo = useCallback((menuId: number, menuData: SysMenuReq) => {
        return dispatch(updateMenu({ menuId, menuData }));
    }, [dispatch]);

    // 删除菜单
    const removeMenu = useCallback((menuId: number) => {
        return dispatch(deleteMenu(menuId));
    }, [dispatch]);

    return {
        getMenuTree,
        getMenuDetail,
        createNewMenu,
        updateMenuInfo,
        removeMenu,
    };
}
