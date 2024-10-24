import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
  loginUser,
  logout,
  fetchUserInfo,
  fetchCaptcha,
  fetchUserList,
  addUserThunk,
  updateUserThunk,
  deleteUserThunk,
  changeUserStatusThunk,
  changeUserSuperThunk,
  changeUserStaffThunk,
  changeUserMultiThunk, updateUserRoleThunk, updateUserDeptThunk
} from '../service/userService';  // Assuming you have these thunks created in service
import { setInfo, resetInfo } from '../store/userSlice';
import { UserState } from '../types';
import {SysUserAddReq, SysUserDeptReq, SysUserInfoReq, SysUserParams, SysUserRoleReq} from '../api/user';
import {LoginData} from "../api/auth.tsx";
import { AppDispatch } from "../store";

// Custom Hook to handle user-related dispatch actions
export function useDispatchUser() {
  const dispatch = useDispatch<AppDispatch>();

  // Login action
  const login = useCallback((loginData: LoginData) => {
    return dispatch(loginUser(loginData));
  }, [dispatch]);

  // Logout action
  const logoutUser = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  // Fetch user information
  const fetchUser = useCallback(() => {
    return dispatch(fetchUserInfo());  // Returns a promise
  }, [dispatch]);

  // Fetch user list
  const fetchUsers = useCallback((params: SysUserParams) => {
    return dispatch(fetchUserList(params));  // Fetch users with parameters
  }, [dispatch]);

  // Add a new user
  const addUser = useCallback((userData: SysUserAddReq) => {
    return dispatch(addUserThunk(userData));
  }, [dispatch]);

  // Update existing user
  const updateUser = useCallback((username: string, data: SysUserInfoReq) => {
    return dispatch(updateUserThunk({ username, data }));
  }, [dispatch]);

  // Update existing user role
  const updateUserRole = useCallback((username: string, data) => {
    return dispatch(updateUserRoleThunk({ username, data}));
  }, [dispatch]);

  // Update existing user dept
  const updateUserDept = useCallback((username: string, data: SysUserDeptReq) => {
    return dispatch(updateUserDeptThunk({ username, data }));
  }, [dispatch]);

  // Delete a user
  const deleteUser = useCallback((username: string) => {
    return dispatch(deleteUserThunk(username));
  }, [dispatch]);

  // Change user status
  const changeStatus = useCallback((pk: number) => {
    return dispatch(changeUserStatusThunk(pk));
  }, [dispatch]);

  // Toggle superuser status
  const toggleSuperuser = useCallback((pk: number) => {
    return dispatch(changeUserSuperThunk(pk));
  }, [dispatch]);

  // Toggle staff status
  const toggleStaffStatus = useCallback((pk: number) => {
    return dispatch(changeUserStaffThunk(pk));
  }, [dispatch]);

  // Toggle multi-login status
  const toggleMultiLogin = useCallback((pk: number) => {
    return dispatch(changeUserMultiThunk(pk));
  }, [dispatch]);

  // Set partial user info
  const setUserInfo = useCallback((info: Partial<UserState>) => {
    dispatch(setInfo(info));
  }, [dispatch]);

  // Get captcha image
  const getCaptcha = useCallback(() => {
    return dispatch(fetchCaptcha());
  }, [dispatch]);

  // Reset user information
  const resetUserInfo = useCallback(() => {
    dispatch(resetInfo());
  }, [dispatch]);

  return {
    login,
    logoutUser,
    fetchUser,
    fetchUsers,
    addUser,
    updateUser,
    updateUserDept,
    updateUserRole,
    deleteUser,
    changeStatus,
    toggleSuperuser,
    toggleStaffStatus,
    toggleMultiLogin,
    setUserInfo,
    resetUserInfo,
    getCaptcha,
  };
}
