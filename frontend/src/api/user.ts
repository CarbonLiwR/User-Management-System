import axios from './interceptor.ts';
import qs from 'query-string';
import { UserState } from '../types/user';
import { MenuItem } from '../types/menu.tsx';
import { SysDeptRes } from './dept';
import { SysRoleRes } from './role';

export interface SysUserNoRelationRes {
  id: number;
  uuid: string;
  avatar?: string;
  username: string;
  nickname: string;
  email: string;
  phone?: string;
  status: number;
  is_superuser: boolean;
  is_staff: boolean;
  is_multi_login: boolean;
  join_time: string;
  last_login_time: string;
}

export interface SysUserRes extends SysUserNoRelationRes {
  roles: SysRoleRes[];
  depts: SysDeptRes[];
}

export interface SysUserParams {
  dept?: number;
  username?: string;
  phone?: string;
  status?: number;
  page?: number;
  size?: number;
}

export interface SysUserListRes {
  items: SysUserRes[];
  total: number;
}

export interface SysUserDeptReq {
  depts: number[];
}

export interface SysUserRoleReq {
  roles: number[];
}

export interface SysUserAvatarReq {
  url: string;
}

export interface SysUserInfoReq {
  dept_id?: number;
  username: string;
  nickname: string;
  email: string;
  phone?: string;
}

export interface SysUserAddReq {
  dept_id?: number;
  username: string;
  password: string;
  email: string;
  roles: number[];
  depts: SysDeptRes[];
}

export function getUserInfo(): Promise<UserState> {
  return axios.get('http://127.0.0.1:8000/api/v1/sys/users/me');
}

export function getUserMenuList(): Promise<MenuItem[]> {
  return axios.get('/api/v1/sys/menus/sidebar');
}

export function getUserList(params: SysUserParams): Promise<SysUserListRes> {
  return axios.get('/api/v1/sys/users', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function getUser(username: string): Promise<SysUserRes> {
  return axios.get(`/api/v1/sys/users/${username}`);
}

export function updateUserRole(username: string, data: SysUserRoleReq) {
  const data1 = data.roles.map((role) => role.id);
  const data2 = {roles: data1} as SysUserRoleReq;
  return axios.put(`/api/v1/sys/users/${username}/role`, data2);
}

export function updateUserDept(username: string, data: SysUserDeptReq) {
  const data1 = data.depts.map((dept) => dept.id);
  const data2 = {depts: data1} as SysUserDeptReq;
  return axios.put(`/api/v1/sys/users/${username}/dept`, data2);
}

export function changeUserStatus(pk: number) {
  return axios.put(`/api/v1/sys/users/${pk}/status`);
}

export function changeUserSuper(pk: number) {
  return axios.put(`/api/v1/sys/users/${pk}/super`);
}

export function changeUserStaff(pk: number) {
  return axios.put(`/api/v1/sys/users/${pk}/staff`);
}

export function changeUserMulti(pk: number) {
  return axios.put(`/api/v1/sys/users/${pk}/multi`);
}

export function updateUserAvatar(username: string, data: SysUserAvatarReq) {
  return axios.put(`/api/v1/sys/users/${username}/avatar`, data);
}

export function updateUser(username: string, data: SysUserInfoReq) {
  return axios.put(`/api/v1/sys/users/${username}`, data);
}

export function addUser(data: SysUserAddReq): Promise<SysUserNoRelationRes> {
  return axios.post('/api/v1/sys/users/add', data);
}
export function deleteUser(username: string) {
  return axios.delete(`/api/v1/sys/users/${username}`);
}
