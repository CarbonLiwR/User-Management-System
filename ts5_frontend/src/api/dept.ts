import axios from 'axios';
import qs from 'query-string';
import {SysMenuRes} from "./menu.ts";

export interface SysDeptRes {
  id: number;
  name: string;
  sort: number;
  leader?: string;
  phone?: string;
  email?: string;
  status: 0 | 1;
  created_time: string;
}

export interface SysDeptsRes {
  id: number;
  name: string;
  data_scope: number;
  status: number;
  remark?: string;
  created_time: string;
  menus?: SysMenuRes[];
}

export interface SysDeptTreeRes extends SysDeptRes {
  children?: SysDeptTreeRes[];
}

export interface SysDeptReq {
  name: string;
  parent_id?: number;
  sort?: number;
  worklogStandard?: string;
  leader?: string;
  phone?: string;
  email?: string;
  status: 0 | 1;
}

export interface SysDeptTreeParams {
  name?: string;
  leader?: string;
  phone?: string;
  email?: string;
}

export function querySysDeptTree(
  params: SysDeptTreeParams
): Promise<SysDeptTreeRes[]> {
  return axios.get('/api/v1/sys/depts', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}


export function querySysDeptsAll(): Promise<SysDeptsRes[]> {
  return axios.get('/api/v1/sys/depts/all');
}

export function querySysDeptAllBySysUser(pk: number): Promise<SysDeptsRes[]> {
  return axios.get(`/api/v1/sys/depts/${pk}/all`);
}

export function querySysDeptDetail(pk: number): Promise<SysDeptTreeRes> {
  return axios.get(`/api/v1/sys/depts/${pk}`);
}

export function createSysDept(data: SysDeptReq) {
  return axios.post('/api/v1/sys/depts', data);
}
//这个是修改部门的接口
export function updateSysDept(pk: number, data: SysDeptReq) {
  return axios.put(`/api/v1/sys/depts/${pk}`, data);
}

export function deleteSysDept(pk: number) {
  return axios.delete(`/api/v1/sys/depts/${pk}`);
}
