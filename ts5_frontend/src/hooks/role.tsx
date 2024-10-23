import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { fetchAllRoles, fetchRoleList, fetchRoleDetail, createRole, updateRole, deleteRole, updateRoleMenu } from '../service/roleService';
import { resetRoleInfo, setRoleInfo } from '../store/roleSlice';
import { SysRoleReq, SysRoleMenuReq, SysRoleParams, SysRoleDeleteParams } from '../api/role';
import { AppDispatch } from '../store';

// 自定义 Hook 来处理角色相关的 dispatch 操作
export function useDispatchRole() {
    const dispatch = useDispatch<AppDispatch>();

    // 获取所有角色
    const getAllRoles = useCallback(() => {
        return dispatch(fetchAllRoles());
    }, [dispatch]);

    // 获取角色列表
    const getRoleList = useCallback((params: SysRoleParams) => {
        return dispatch(fetchRoleList(params));
    }, [dispatch]);

    // 获取角色详情
    const getRoleDetail = useCallback((roleId: number) => {
        return dispatch(fetchRoleDetail(roleId));
    }, [dispatch]);

    // 创建角色
    const createNewRole = useCallback((roleData: SysRoleReq) => {
        return dispatch(createRole(roleData));
    }, [dispatch]);

    // 更新角色
    const updateRoleInfo = useCallback((roleId: number, roleData: SysRoleReq) => {
        return dispatch(updateRole({ roleId, data: roleData }));
    }, [dispatch]);

    // 删除角色
    const removeRole = useCallback((deleteParams: SysRoleDeleteParams) => {
        return dispatch(deleteRole(deleteParams));
    }, [dispatch]);

    // 更新角色菜单
    const updateRoleMenus = useCallback((roleId: number, menuData: SysRoleMenuReq) => {
        return dispatch(updateRoleMenu({ roleId, data: menuData }));
    }, [dispatch]);

    // 设置角色信息（部分更新）
    const setRolePartialInfo = useCallback((roleInfo: Partial<SysRoleReq>) => {
        dispatch(setRoleInfo(roleInfo));
    }, [dispatch]);

    // 重置角色信息
    const resetRole = useCallback(() => {
        dispatch(resetRoleInfo());
    }, [dispatch]);

    return {
        getAllRoles,
        getRoleList,
        getRoleDetail,
        createNewRole,
        updateRoleInfo,
        removeRole,
        updateRoleMenus,
        setRolePartialInfo,
        resetRole,
    };
}
