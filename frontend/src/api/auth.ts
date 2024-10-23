import axios from 'axios';

export interface LoginData {
  username: string;
  password: string;
  captcha: string;
}

export interface LoginRes {
  access_token: string;
  data: any;
}

export interface CaptchaRes {
  data: {
    data:{
      image_type: string;
      image: string;
    }

  };
}

export interface RegisterData {
  username: string;
  password: string;
  nickname: string;
  email: string;
  captcha: string;
}

export interface RegisterRes {
  data: any;
  msg: string;
  code: number;
}


export function getCaptcha(): Promise<CaptchaRes> {
  return axios.get('http://127.0.0.1:8000/api/v1/auth/captcha');
}

export function login(data: LoginData): Promise<LoginRes> {
  return axios.post('http://127.0.0.1:8000/api/v1/auth/login', data);
}

export function register(data: RegisterData): Promise<RegisterRes> {
    return axios.post('http://127.0.0.1:8000/api/v1/auth/register', data);
}

export function logout() {
  return axios.post('/api/v1/auth/logout');
}
