#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from fast_captcha import text_captcha
from sqlalchemy import and_, desc, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload, joinedload
from sqlalchemy.sql import Select
from sqlalchemy_crud_plus import CRUDPlus

from backend.app.admin.model import Role, User ,Dept
from backend.app.admin.model.llm_provider_model import LlmProvider
from backend.app.admin.schema.user import (
    AddUserParam,
    AvatarParam,
    RegisterUserParam,
    UpdateUserParam,
    UpdateUserRoleParam,
    UpdateUserDeptParam, UpdateUserPwdParam,
)
from backend.common.security.jwt import get_hash_password
from backend.utils.timezone import timezone


class CRUDUser(CRUDPlus[User]):
    async def get(self, db: AsyncSession, user_id: int) -> User | None:
        """
        获取用户

        :param db:
        :param user_id:
        :return:
        """
        return await self.select_model(db, user_id)

    async def get_by_username(self, db: AsyncSession, username: str) -> User | None:
        """
        通过 username 获取用户

        :param db: 异步数据库会话
        :param username: 用户名
        :return: 返回找到的用户，或者 None
        """
        stmt = (
            select(self.model)
            .options(selectinload(self.model.depts))
            .options(selectinload(self.model.roles).joinedload(Role.menus))
            .options(selectinload(self.model.llm_models).options(selectinload(LlmProvider.models)))
        )
        filters = []

        if username:
            filters.append(self.model.username == username)
        user = await db.execute(stmt.where(*filters))
        return user.scalars().first()

    async def get_by_nickname(self, db: AsyncSession, nickname: str) -> User | None:
        """
        通过 nickname 获取用户

        :param db:
        :param nickname:
        :return:
        """
        return await self.select_model_by_column(db, nickname=nickname)

    async def update_login_time(self, db: AsyncSession, username: str) -> int:
        """
        更新用户登录时间

        :param db:
        :param username:
        :return:
        """
        return await self.update_model_by_column(db, {'last_login_time': timezone.now()}, username=username)

    async def create(self, db: AsyncSession, obj: RegisterUserParam, *, social: bool = False) -> None:
        """
        创建用户

        :param db:
        :param obj:
        :param social: 社交用户，适配 oauth 2.0
        :return:
        """
        if not social:
            salt = text_captcha(5)
            obj.password = get_hash_password(f'{obj.password}{salt}')
            dict_obj = obj.model_dump()
            dict_obj.update({'is_staff': True, 'salt': salt})
        else:
            dict_obj = obj.model_dump()
            dict_obj.update({'is_staff': True, 'salt': None})
        new_user = self.model(**dict_obj)
        db.add(new_user)

    async def add(self, db: AsyncSession, obj: AddUserParam) -> None:
        """
        后台添加用户

        :param db:
        :param obj:
        :return:
        """
        salt = text_captcha(5)
        obj.password = get_hash_password(f'{obj.password}{salt}')
        dict_obj = obj.model_dump(exclude={'roles', 'depts'})
        dict_obj.update({'salt': salt})
        new_user = self.model(**dict_obj)
        role_list = []
        for role_id in obj.roles:
            role_list.append(await db.get(Role, role_id))
        new_user.roles.extend(role_list)

        dept_list = []
        for dept_id in obj.depts:
            dept_list.append(await db.get(Dept, dept_id))
        new_user.depts.extend(dept_list)
        db.add(new_user)

    async def update_userinfo(self, db: AsyncSession, input_user: int, obj: UpdateUserParam) -> int:
        """
        更新用户信息

        :param db:
        :param input_user:
        :param obj:
        :return:
        """
        return await self.update_model(db, input_user, obj)

    @staticmethod
    async def update_user_pwd(db: AsyncSession, input_user: str, new_password: str) -> None:
        """
        更新用户密码

        :param db: 数据库会话
        :param input_user: 用户对象
        :param new_password: 新密码
        :return: None
        """
        # 获取用户
        user = await user_dao.get_by_username(db, input_user)  # 替换为你的用户数据访问对象
        # 更新密码
        user.password = new_password
        db.add(user)
        await db.commit()

    @staticmethod
    async def update_dept(db: AsyncSession, input_user: User, obj: UpdateUserDeptParam) -> None:
        """
            更新用户部门
            :param db:
            :param input_user:
            :param obj:
            :return:
            """
        # 删除用户所有角色
        for i in list(input_user.depts):
            input_user.depts.remove(i)
        # 添加用户角色
        dept_list = []
        for dept_id in obj.depts:
            dept_list.append(await db.get(Dept, dept_id))
        input_user.depts.extend(dept_list)

    @staticmethod
    async def update_role(db: AsyncSession, input_user: User, obj: UpdateUserRoleParam) -> None:
        """
        更新用户角色

        :param db:
        :param input_user:
        :param obj:
        :return:
        """
        # 删除用户所有角色
        for i in list(input_user.roles):
            input_user.roles.remove(i)
        # 添加用户角色
        role_list = []
        for role_id in obj.roles:
            role_list.append(await db.get(Role, role_id))
        input_user.roles.extend(role_list)


    async def update_avatar(self, db: AsyncSession, input_user: int, avatar: AvatarParam) -> int:
        """
        更新用户头像

        :param db:
        :param input_user:
        :param avatar:
        :return:
        """
        return await self.update_model(db, input_user, {'avatar': avatar.url})

    async def delete(self, db: AsyncSession, user_id: int) -> int:
        """
        删除用户

        :param db:
        :param user_id:
        :return:
        """
        return await self.delete_model(db, user_id)

    async def check_email(self, db: AsyncSession, email: str) -> User | None:
        """
        检查邮箱是否存在

        :param db:
        :param email:
        :return:
        """
        return await self.select_model_by_column(db, email=email)

    async def reset_password(self, db: AsyncSession, pk: int, new_pwd: str) -> int:
        """
        重置用户密码

        :param db:
        :param pk:
        :param new_pwd:
        :return:
        """
        return await self.update_model(db, pk, {'password': new_pwd})

    async def get_list(self, dept: int = None, username: str = None, phone: str = None, status: int = None) -> Select:
        """
        获取用户列表

        :param dept:
        :param username:
        :param phone:
        :param status:
        :return:
        """
        stmt = (
            select(self.model)
            .options(selectinload(self.model.depts))
            .options(selectinload(self.model.roles).selectinload(Role.menus))
            .options(selectinload(self.model.llm_models).options(selectinload(LlmProvider.models)))
            .order_by(desc(self.model.join_time))
        )
        where_list = []
        if dept:
            where_list.append(self.model.dept_id == dept)
        if username:
            where_list.append(self.model.username.like(f'%{username}%'))
        if phone:
            where_list.append(self.model.phone.like(f'%{phone}%'))
        if status is not None:
            where_list.append(self.model.status == status)
        if where_list:
            stmt = stmt.where(and_(*where_list))
        return stmt

    async def get_super(self, db: AsyncSession, user_id: int) -> bool:
        """
        获取用户超级管理员状态

        :param db:
        :param user_id:
        :return:
        """
        user = await self.get(db, user_id)
        return user.is_superuser

    async def get_staff(self, db: AsyncSession, user_id: int) -> bool:
        """
        获取用户后台登录状态

        :param db:
        :param user_id:
        :return:
        """
        user = await self.get(db, user_id)
        return user.is_staff

    async def get_status(self, db: AsyncSession, user_id: int) -> int:
        """
        获取用户状态

        :param db:
        :param user_id:
        :return:
        """
        user = await self.get(db, user_id)
        return user.status

    async def get_multi_login(self, db: AsyncSession, user_id: int) -> bool:
        """
        获取用户多点登录状态

        :param db:
        :param user_id:
        :return:
        """
        user = await self.get(db, user_id)
        return user.is_multi_login

    async def set_super(self, db: AsyncSession, user_id: int, _super: bool) -> int:
        """
        设置用户超级管理员

        :param db:
        :param user_id:
        :param _super:
        :return:
        """
        return await self.update_model(db, user_id, {'is_superuser': _super})

    async def set_staff(self, db: AsyncSession, user_id: int, staff: bool) -> int:
        """
        设置用户后台登录

        :param db:
        :param user_id:
        :param staff:
        :return:
        """
        return await self.update_model(db, user_id, {'is_staff': staff})

    async def set_status(self, db: AsyncSession, user_id: int, status: bool) -> int:
        """
        设置用户状态

        :param db:
        :param user_id:
        :param status:
        :return:
        """
        return await self.update_model(db, user_id, {'status': status})

    async def set_multi_login(self, db: AsyncSession, user_id: int, multi_login: bool) -> int:
        """
        设置用户多点登录

        :param db:
        :param user_id:
        :param multi_login:
        :return:
        """
        return await self.update_model(db, user_id, {'is_multi_login': multi_login})

    async def get_with_relation(self, db: AsyncSession, *, user_id: int = None, username: str = None,user_uuid:str = None) -> User | None:
        """
        获取用户和（部门，角色，菜单）

        :param db:
        :param user_id:
        :param username:
        :return:
        """
        stmt = (
            select(self.model)
            .options(selectinload(self.model.depts))
            .options(selectinload(self.model.roles).joinedload(Role.menus))
            .options(selectinload(self.model.llm_models).options(selectinload(LlmProvider.models)))
        )
        filters = []
        if user_id:
            filters.append(self.model.id == user_id)
        if username:
            filters.append(self.model.username == username)
        if user_uuid:
            filters.append(self.model.uuid == user_uuid)
        if filters:
            stmt = stmt.where(*filters)

        user = await db.execute(stmt)

        return user.scalars().first()


user_dao: CRUDUser = CRUDUser(User)
