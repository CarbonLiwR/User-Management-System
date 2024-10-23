import { Layout, Menu, Breadcrumb } from 'antd';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { SettingOutlined, FileOutlined } from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const breadcrumbNameMap: Record<string, string> = {
  '/admin': '系统管理',
  '/admin/user': '用户管理',
  '/admin/dept': '部门管理',
  '/admin/role': '角色管理',
  '/admin/menu': '菜单管理',
  '/login-log': '登录日志',
  '/operation-log': '操作日志',
};

const LayoutContainer = () => {
  const location = useLocation(); // 获取当前路径
  const pathSnippets = location.pathname.split('/').filter(i => i); // 拆分路径为片段

  const breadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    return (
        <Breadcrumb.Item key={url}>
          <Link to={url}>{breadcrumbNameMap[url]}</Link>
        </Breadcrumb.Item>
    );
  });

  return (
      <Layout style={{ minHeight: '100vh', backgroundColor: 'white' }}>
        <Sider collapsible theme="light">
          <div className="logo" style={{ height: '32px', margin: '16px', background: 'rgba(255, 255, 255, 0.2)' }}>寻人
          </div>
          <Menu theme="light" mode="inline" defaultSelectedKeys={['1']}>
            <SubMenu key="sub1" icon={<SettingOutlined />} title="系统管理">
              <Menu.Item key="1">
                <Link to="/admin/user">用户管理</Link>
              </Menu.Item>
              <Menu.Item key="2">
                <Link to="/admin/dept">部门管理</Link>
              </Menu.Item>
              <Menu.Item key="3">
                <Link to="/admin/role">角色管理</Link>
              </Menu.Item>
              <Menu.Item key="4">
                <Link to="/admin/menu">菜单管理</Link>
              </Menu.Item>
            </SubMenu>
            <SubMenu key="sub2" icon={<FileOutlined />} title="日志">
              <Menu.Item key="5">
                <Link to="/login-log">登录日志</Link>
              </Menu.Item>
              <Menu.Item key="6">
                <Link to="/operation-log">操作日志</Link>
              </Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>

        <Layout>
          <Header style={{ background: '#fff', padding: 0 }} />
          <Content style={{ margin: '16px 10px 16px 5px' }}>
            <Breadcrumb style={{ margin: '5px 0' }}>
              <Breadcrumb.Item>
                <Link to="/">主页</Link>
              </Breadcrumb.Item>
              {breadcrumbItems}
            </Breadcrumb>
            <div style={{ padding: 12, background: '#fff', minHeight: 'calc(100vh - 160px)' }}>
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
