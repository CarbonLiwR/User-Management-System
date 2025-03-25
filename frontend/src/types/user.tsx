import {SysDeptRes} from "../api/dept.ts";

export interface UserState {
    username?: string;
    nickname?: string;
    avatar?: string;
    is_superuser: boolean;
    is_staff: boolean;
    roles: string;
    depts: SysDeptRes[];
    status: string;
    captcha: string;
    error: null
}

export type UserInfo = {
    account: string
    role: string
    user_id: number
    nickname: string
    isLogin?: boolean
} | null

export type UserAction = {
    role: string
    info?: UserInfo
}
