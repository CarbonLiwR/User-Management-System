import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from "../store";
import { useMemo } from 'react';
import Homepage from "../pages/home";
import LoginPage from "../pages/login/login";
import RegisterPage from "../pages/login/register";
import LayoutContainer from '../layout';
import PersonalPage from "../pages/personal";
import AdminRolePage from "../pages/admin/role";
import AdminMenuPage from "../pages/admin/menu";
import AdminUserPage from "../pages/admin/user";
import AdminDeptPage from "../pages/admin/dept";
import WorklogSearchPage from "../pages/worklog/search";
import WorklogShowPage from "../pages/worklog/show";
import WorklogAddPage from "../pages/worklog/add";
import WorklogResult from "../pages/worklog/result";

function AppRouter() {
    // 从 Redux 中获取用户信息
    const userInfo = useSelector((state: RootState) => state.user);

    // 计算用户是否已登录，基于用户信息中的用户名是否存在
    const isLoggedIn = useMemo(() => !!userInfo?.username, [userInfo]);

    return (
        <Router>
            <Routes>
                {/* 未登录用户会被重定向到登录页面，除了登录和注册页面 */}
                {!isLoggedIn && (
                    <>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="*" element={<Navigate to="/login" replace />} />
                    </>
                )}

                {/* 受保护的页面，只有登录后才能访问 */}
                {isLoggedIn && (
                    <Route path="/" element={<LayoutContainer />}>
                        <Route index element={<Homepage />} />

                        {/* 各个管理页面 */}
                        <Route path="personal" element={<PersonalPage />} />

                        {/*<Route path="admin" element={<AdminRolePage />} />*/}
                        <Route path="admin/role" element={<AdminRolePage />} />
                        <Route path="admin/menu" element={<AdminMenuPage />} />
                        <Route path="admin/user" element={<AdminUserPage />} />
                        <Route path="admin/dept" element={<AdminDeptPage />} />

                        <Route path="worklog" element={<WorklogSearchPage />} />
                        <Route path="worklog/search" element={<WorklogSearchPage />} />
                        <Route path="worklog/show" element={<WorklogShowPage />} />
                        <Route path="worklog/add" element={<WorklogAddPage />} />
                        <Route path="worklog/result" element={<WorklogResult />} />

                    </Route>
                )}
            </Routes>
        </Router>
    );
}

export default AppRouter;
