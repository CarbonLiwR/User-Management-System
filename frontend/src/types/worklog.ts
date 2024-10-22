export interface WorkLogSubmit {
  group_uuid: string; // 组的唯一标识
  text: string; // 日志内容
}

export interface WorkLogCreate {
  user_uuid: string; // 用户唯一标识
  group_uuid?: string; // 组的唯一标识（可选）
  content?: string; // 日志内容（可选）
  embedding?: Uint8Array; // 嵌入（可选）
  active?: boolean; // 是否有效（可选）
}

export interface WorkLogUpdate {
  content?: string; // 更新的日志内容（可选）
  embedding?: Uint8Array; // 更新的嵌入（可选）
  active?: boolean; // 是否有效（可选）
  update_datetime?: string; // 更新时间（可选，格式为 ISO 8601）
}

export interface WorkLogResponse {
  id: number; // 日志的唯一标识
  uuid: string; // 日志的 UUID
  user_uuid: string; // 用户唯一标识
  group_uuid?: string; // 组的唯一标识（可选）
  content?: string; // 日志内容（可选）
  effect?: string; // 效果（可选）
  create_datetime: string; // 创建时间（格式为 ISO 8601）
  update_datetime: string; // 更新时间（格式为 ISO 8601）
  active?: boolean; // 是否有效（可选）
}