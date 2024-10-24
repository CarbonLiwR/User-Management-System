import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
    fetchDeptTree,
    fetchAllDepts,
    fetchDeptsByUser,
    fetchDeptDetail,
    createDept,
    updateDept,
    deleteDept
} from '../service/deptService';
import { SysDeptReq, SysDeptTreeParams } from '../api/dept';
import { AppDispatch } from '../store';

// Custom Hook to handle department-related dispatch actions
export function useDispatchDept() {
    const dispatch = useDispatch<AppDispatch>();

    // Fetch department tree
    const fetchDeptTreeData = useCallback((params: SysDeptTreeParams) => {
        return dispatch(fetchDeptTree(params));
    }, [dispatch]);

    // Fetch all departments
    const fetchAllDepartments = useCallback(() => {
        return dispatch(fetchAllDepts());
    }, [dispatch]);

    // Fetch departments by user
    const fetchDepartmentsByUser = useCallback((userId: number) => {
        return dispatch(fetchDeptsByUser(userId));
    }, [dispatch]);

    // Fetch department details
    const fetchDepartmentDetail = useCallback((deptId: number) => {
        return dispatch(fetchDeptDetail(deptId));
    }, [dispatch]);

    // Create a new department
    const addDepartment = useCallback((data: SysDeptReq) => {
        return dispatch(createDept(data));
    }, [dispatch]);

    // Update department details
    const updateDepartment = useCallback((deptId: number, data: SysDeptReq) => {
        return dispatch(updateDept({ deptId, data }));
    }, [dispatch]);

    // Delete a department
    const removeDepartment = useCallback((deptId: number) => {
        return dispatch(deleteDept(deptId));
    }, [dispatch]);

    return {
        fetchDeptTreeData,
        fetchAllDepartments,
        fetchDepartmentsByUser,
        fetchDepartmentDetail,
        addDepartment,
        updateDepartment,
        removeDepartment
    };
}
