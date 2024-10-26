import axios from 'axios';

export interface LoginData {
    username: string;
    password: string;
    captcha: string;
}

export interface LoginRes {
    access_token: string;
    data: never;
}

export interface CaptchaRes {
    image_type: string;
    image: string;
}

export interface RegisterData {
    username: string;
    password: string;
    nickname: string;
    email: string;
    captcha: string;
}
export interface ResetPasswordData {
    username: string;
    email: string;
    password: string;
    captcha: string;
}

export interface RegisterRes {
    data: string;
    msg: string;
    code: number;
}


export function getCaptcha(): Promise<CaptchaRes> {
    return axios.get('http://127.0.0.1:8000/api/v1/auth/captcha');
}

export function userLogin(data: LoginData): Promise<LoginRes> {
    return axios.post('http://127.0.0.1:8000/api/v1/auth/login', data);
}

export function registerUser(data: RegisterData): Promise<RegisterRes> {
    return axios.post('http://127.0.0.1:8000/api/v1/auth/register', data);
}

export function forgetPwd(data: ResetPasswordData): Promise<RegisterRes> {
    return axios.put('/api/v1/auth/password/reset',data);
}

export function userLogout() {
    return axios.post('/api/v1/auth/logout');
}
