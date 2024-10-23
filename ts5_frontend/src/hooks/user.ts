import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser, logout, fetchUserInfo, fetchCaptcha } from '../service/userService';
import { setInfo, resetUser } from '../store/userSlice';
import { UserState } from '../types';
import { LoginData } from '../api/auth';
import { AppDispatch } from "../store";

// 自定义 Hook 来处理用户相关的 dispatch 操作
export function useDispatchUser() {
  const dispatch = useDispatch<AppDispatch>();

  // 登录操作，返回的是 dispatch 的 promise，必须返回以链式调用
  const login = useCallback((loginData: LoginData) => {
    return dispatch(loginUser(loginData));
  }, [dispatch]);

  // 登出操作
  const logoutUser = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  // 获取用户信息
  const fetchUser = useCallback(() => {
    return dispatch(fetchUserInfo()); // 返回 promise 以链式调用
  }, [dispatch]);

  // 设置用户信息（部分更新）
  const setUserInfo = useCallback((info: Partial<UserState>) => {
    dispatch(setInfo(info));
  }, [dispatch]);

  // 获取验证码
  const getCaptcha = useCallback(() => {
    return dispatch(fetchCaptcha());
  }, [dispatch]);

  // 重置用户信息
  const resetUserInfo = useCallback(() => {
    dispatch(resetUser());
  }, [dispatch]);

  return {
    login,
    logoutUser,
    fetchUser,
    setUserInfo,
    resetUserInfo,
    getCaptcha,
  };
}
