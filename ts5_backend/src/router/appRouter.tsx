import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from "../store";
import { useMemo } from 'react';
import LoginPage from "../pages/login/login";
import LayoutContainer from '../layout';
import AdminRolePage from "../pages/admin/role";
import AdminMenuPage from "../pages/admin/menu";
import AdminUserPage from "../pages/admin/user";
import AdminDeptPage from "../pages/admin/dept";

function AppRouter() {
    // 从 Redux 中获取用户信息
    const userInfo = useSelector((state: RootState) => state.user);

    // 计算用户是否已登录，基于用户信息中的用户名是否存在
    const isLoggedIn = useMemo(() => !!userInfo?.username, [userInfo]);

    return (
        <Router>
            <Routes>
                {/* 未登录用户会被重定向到登录页面 */}
                {!isLoggedIn && (
                    <Route path="*" element={<Navigate to="/login" replace />} />
                )}

                {/* 登录页面 */}
                <Route path="/login" element={<LoginPage />} />

                {/* 受保护的页面，只有登录后才能访问 */}
                {isLoggedIn && (
                    <Route path="/" element={<LayoutContainer />}>
                        {/* 默认首页 - 角色管理 */}
                        <Route index element={<AdminRolePage />} />

                        {/* 各个管理页面 */}
                        <Route path="admin/role" element={<AdminRolePage />} />
                        <Route path="admin/menu" element={<AdminMenuPage />} />
                        <Route path="admin/user" element={<AdminUserPage />} />
                        <Route path="admin/dept" element={<AdminDeptPage />} />
                    </Route>
                )}
            </Routes>
        </Router>
    );
}

export default AppRouter;
