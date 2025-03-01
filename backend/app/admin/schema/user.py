#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from datetime import datetime

from pydantic import ConfigDict, EmailStr, Field, HttpUrl, model_validator
from pymsgbox import password
from typing_extensions import Self

from backend.app.admin.schema.dept import GetDeptListDetails
from backend.app.admin.schema.role import GetRoleListDetails
from backend.common.enums import StatusType
from backend.common.schema import CustomPhoneNumber, SchemaBase
from typing import Optional,Union, List

class AuthSchemaBase(SchemaBase):
    username: str
    password: Optional[str]


class AuthLoginParam(AuthSchemaBase):
    captcha: str
    username_iv: str  # 添加 iv 字段
    password_iv: str  # 添加 iv 字段
    captcha_iv: str  # 添加 iv 字段

class AuthSSOLoginParam(SchemaBase):
    username: str
    username_iv: str  # 添加 iv 字段

class RegisterUserParam(AuthSchemaBase):
    nickname: str
    email: str

class SsoRegisterUserParam(SchemaBase):
    nickname: str


class AuthRegisterParam(SchemaBase):
    username: str
    password: str
    nickname: str
    email: str
    captcha: str
    username_iv: str  # 添加 iv 字段
    nickname_iv: str
    password_iv: str  # 添加 iv 字段
    captcha_iv: str  # 添加 iv 字段
    email_iv: str

class AuthResetPasswordParam(SchemaBase):
    username: str
    email: str
    password: str
    captcha:str
    username_iv: str  # 添加 iv 字段
    password_iv: str  # 添加 iv 字段
    email_iv: str
    captcha_iv: str  # 添加 iv 字段

class AddUserParam(AuthSchemaBase):
    depts: list[int]
    roles: list[int]
    nickname: Optional[str] = None
    email: EmailStr = Field(..., examples=['user@example.com'])

class UserInfoSchemaBase(SchemaBase):
    # dept_id: Optional[int] = None
    username: str
    nickname: str
    email: EmailStr = Field(..., examples=['user@example.com'])
    # phone: Optional[CustomPhoneNumber] = None

class UpdateUserParam(UserInfoSchemaBase):
    pass

class UpdateUserPwdParam(UserInfoSchemaBase):
    password: str

class UpdateUserRoleParam(SchemaBase):
    roles: list[int]

class UpdateUserDeptParam(SchemaBase):
    depts: list[int]

class AvatarParam(SchemaBase):
    url: HttpUrl = Field(..., description='头像 http 地址')


class GetUserInfoNoRelationDetail(UserInfoSchemaBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    uuid: str
    avatar: Optional[str] = None
    status: StatusType = Field(default=StatusType.enable)
    is_superuser: bool
    is_staff: bool
    is_multi_login: bool
    join_time: datetime = None
    last_login_time: Optional[datetime] = None


class GetUserInfoListDetails(GetUserInfoNoRelationDetail):
    model_config = ConfigDict(from_attributes=True)

    depts: list[GetDeptListDetails]
    roles: list[GetRoleListDetails]



class GetCurrentUserInfoDetail(GetUserInfoListDetails):
    model_config = ConfigDict(from_attributes=True)

    depts: Optional[Union[List[GetDeptListDetails], List[str]]] = None
    roles: Optional[Union[List[GetRoleListDetails], List[str]]] = None

    @model_validator(mode='after')
    def handel(self) -> Self:
        """处理部门和角色"""
        depts = self.depts

        # if depts:
        #     self.depts = [dept.name for dept in depts]  # type: ignore
        roles = self.roles

        if roles:
            self.roles = [role.name for role in roles]  # type: ignore
        return self


class CurrentUserIns(GetUserInfoListDetails):
    model_config = ConfigDict(from_attributes=True)


class ResetPasswordParam(SchemaBase):
    old_password: str
    new_password: str
    confirm_password: str
