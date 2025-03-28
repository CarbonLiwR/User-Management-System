#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from datetime import datetime

from backend.app.admin.schema.user import GetUserInfoNoRelationDetail, GetUserInfoListDetails, GetCurrentUserInfoDetail
from backend.common.schema import SchemaBase


class GetSwaggerToken(SchemaBase):
    access_token: str
    token_type: str = 'Bearer'
    user: GetCurrentUserInfoDetail


class AccessTokenBase(SchemaBase):
    access_token: str
    access_token_type: str = 'Bearer'
    access_token_expire_time: datetime


class GetNewToken(AccessTokenBase):
    pass


class GetLoginToken(AccessTokenBase):
    user: GetCurrentUserInfoDetail

class GetRegisterToken(AccessTokenBase):
    pass
