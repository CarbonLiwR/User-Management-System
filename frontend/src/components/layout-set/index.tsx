import { Layout, Menu } from 'antd';
const { Header, Content, Footer } = Layout;

function LayoutSet() {
    return (
        <Layout>
            <Header>
                <Menu theme="dark" mode="horizontal">
                    {/* 菜单项 */}
                </Menu>
            </Header>
            <Content>
                {/*{children}  // 嵌套内容*/}
            </Content>
            <Footer>
                © 2024 Company Name
            </Footer>
        </Layout>
    );
}

export default LayoutSet;