// 用户信息
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

export type UserState = {
  user: UserInfo
}

// export type UserInfo = {
//   username: string
//   role: string
//   uuid: number
//   nickname: string
//   isLogin?: boolean
// } | null
// export type UserAction = {
//   role: string
//   info?: UserInfo
// }
