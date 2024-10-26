import React, { useState, useEffect, useCallback } from 'react';
import { Layout, Menu, Breadcrumb, Image } from 'antd';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { SettingOutlined, FileSearchOutlined,HomeOutlined } from '@ant-design/icons';
import CustomHeader from "../components/customHeader";
import logoImage from '../assets/images/favicon.ico';
import { useDispatchUser } from "../hooks";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const breadcrumbNameMap: Record<string, string> = {
  '/': '主页',
  '/admin': '系统管理',
  '/admin/user': '用户管理',
  '/admin/dept': '部门管理',
  '/admin/role': '角色管理',
  '/admin/menu': '菜单管理',
  '/worklog': '日志管理',
  '/worklog/search': '搜索日志',
  '/worklog/show': '查看日志',
  '/worklog/add': '添加日志',
};

const LayoutContainer = () => {
  const location = useLocation();
  const pathSnippets = location.pathname.split('/').filter(i => i);
  const { getUserMenu } = useDispatchUser();
  const menu = useSelector((state: RootState) => state.user.menu);

  const refreshMenu = useCallback(() => {
    getUserMenu();
  }, [getUserMenu]);

  useEffect(() => {
    refreshMenu();
  }, [refreshMenu]);

  const breadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    return (
        <Breadcrumb.Item key={url}>
          <Link to={url}>{breadcrumbNameMap[url]}</Link>
        </Breadcrumb.Item>
    );
  });

  // 递归渲染菜单项
  const renderMenuItems = (menuItems) => {
    return menuItems.map((menuItem) => {
      if (menuItem.children && menuItem.children.length > 0 && ! menuItem.path) {
        return (
            <SubMenu key={menuItem.id} icon={<SettingOutlined />} title={menuItem.title}>
              {renderMenuItems(menuItem.children)}
            </SubMenu>
        );
      }
      return (
          <Menu.Item key={menuItem.id}>
            <Link to={menuItem.path}>{menuItem.title}</Link>
          </Menu.Item>
      );
    });
  };

  return (
      <Layout style={{ minHeight: '100vh', backgroundColor: 'white' }}>
        <Sider collapsible theme="light">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '64px' }}>
            <Image src={logoImage} preview={false} width="65px" />
          </div>
          <Menu theme="light" mode="inline" defaultSelectedKeys={['1']}>
            {/* 动态渲染菜单 */}
            <Menu.Item icon={<HomeOutlined />} key="0">
                <Link to="/">主页</Link>
            </Menu.Item>

            <SubMenu key="sub2" icon={<FileSearchOutlined />} title="日志管理">
              <Menu.Item key="5">
                <Link to="/worklog/search">搜索日志</Link>
              </Menu.Item>
              <Menu.Item key="6">
                <Link to="/worklog/show">查看日志</Link>
              </Menu.Item>
              <Menu.Item key="7">
                <Link to="/worklog/add">添加日志</Link>
              </Menu.Item>
            </SubMenu>
            {renderMenuItems(menu)}
          </Menu>
        </Sider>

        <Layout>
          <CustomHeader />
          <Content style={{ margin: '16px 10px 16px 5px' }}>
            <Breadcrumb style={{ margin: '5px 0' }}>
              <Breadcrumb.Item>
                <Link to="/">主页</Link>
              </Breadcrumb.Item>
              {breadcrumbItems}
            </Breadcrumb>
            <div style={{ padding: 12, background: '#fff', minHeight: 'calc(100vh - 160px)'}}>
              <Outlet />
            </div>
          </Content>
          <Footer style={{ textAlign: 'center', padding: '5px' }}>
            Teach 4 Tech ©2024 Created by jxselab
          </Footer>
        </Layout>
      </Layout>
  );
};

export default LayoutContainer;
