INSERT INTO fba.sys_dept (id, name, level, sort, leader, phone, email, status, del_flag, parent_id, created_time, updated_time)
VALUES (1, '测试组', 0, 0, null, null, null, 1, 0, null, '2023-06-26 17:13:45', null);

INSERT INTO fba.sys_menu (id, title, name, level, sort, icon, path, menu_type, component, perms, status, `show`, cache, remark, parent_id, created_time, updated_time)
VALUES  (1, '系统管理', 'admin', 0, 6, 'IconSettings', '', 0, null, null, 1, 1, 1, null, null, '2023-07-27 19:23:00', null),
        (2, '部门管理', 'SysDept', 0, 0, null, 'admin/dept', 1, '', null, 1, 1, 1, null, 1, '2023-07-27 19:23:42', null),
        (3, '新增', '', 0, 0, null, null, 2, null, 'sys:dept:add', 1, 1, 1, null, 2, '2024-01-07 11:37:00', null),
        (4, '编辑', '', 0, 0, null, null, 2, null, 'sys:dept:edit', 1, 1, 1, null, 2, '2024-01-07 11:37:29', null),
        (5, '删除', '', 0, 0, null, null, 2, null, 'sys:dept:del', 1, 1, 1, null, 2, '2024-01-07 11:37:44', null),
        (6, '用户管理', 'SysUser', 0, 0, null, 'admin/user', 1, '', null, 1, 1, 1, null, 1, '2023-07-27 19:25:13', null),
        (7, '编辑用户角色', '', 0, 0, null, null, 2, null, 'sys:user:role:edit', 1, 1, 1, null, 6, '2024-01-07 12:04:20', null),
        (8, '注销', '', 0, 0, null, null, 2, null, 'sys:user:del', 1, 1, 1, '用户注销 != 用户登出，注销之后用户将从数据库删除', 6, '2024-01-07 02:28:09', null),
        (9, '角色管理', 'SysRole', 0, 2, null, 'admin/role', 1, '', null, 1, 1, 1, null, 1, '2023-07-27 19:25:45', null),
        (10, '新增', '', 0, 0, null, null, 2, null, 'sys:role:add', 1, 1, 1, null, 9, '2024-01-07 11:58:37', null),
        (11, '编辑', '', 0, 0, null, null, 2, null, 'sys:role:edit', 1, 1, 1, null, 9, '2024-01-07 11:58:52', null),
        (12, '删除', '', 0, 0, null, null, 2, null, 'sys:role:del', 1, 1, 1, null, 9, '2024-01-07 11:59:07', null),
        (13, '编辑角色菜单', '', 0, 0, null, null, 2, null, 'sys:role:menu:edit', 1, 1, 1, null, 9, '2024-01-07 01:59:39', null),

INSERT INTO fba.sys_role (id, name, data_scope, status, remark, created_time, updated_time)
VALUES (1, '超级管理权限', 1, 1, null, '2024-10-27 17:17:17', null);

INSERT INTO fba.sys_role_menu (id, role_id, menu_id)
VALUES (1, 1, 1);

-- 密码明文：123456
INSERT INTO fba.sys_user (id, uuid, username, nickname, password, salt, email, is_superuser, is_staff, status, is_multi_login, avatar, phone, join_time, last_login_time, dept_id, created_time, updated_time)
VALUES (1, 'af4c804f-3966-4949-ace2-3bb7416ea926', 'admin', '管理员', '$2b$12$RJXAtJodRw37ZQGxTPlu0OH.aN5lNXG6yvC4Tp9GIQEBmMY/YCc.m', 'bcNjV', 'admin@example.com', 1, 1, 1, 0, null, null, '2023-06-26 17:13:45', null, 1, '2023-06-26 17:13:45', null);

INSERT INTO fba.sys_user_role (id, user_id, role_id)
VALUES (1, 1, 1);
