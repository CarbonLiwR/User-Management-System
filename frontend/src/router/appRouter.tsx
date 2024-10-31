import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from "../store";
import {useEffect, useMemo} from 'react';
import {setInfo} from '../store/userSlice';
import Homepage from "../pages/home";
import LoginPage from "../pages/login/login";
import RegisterPage from "../pages/login/register";
import ForgetPasswordPage from "../pages/login/forget";
import LayoutContainer from '../layout';
import PersonalPage from "../pages/personal";
import AdminRolePage from "../pages/admin/role";
import AdminMenuPage from "../pages/admin/menu";
import AdminUserPage from "../pages/admin/user";
import AdminDeptPage from "../pages/admin/dept";

function AppRouter() {
    const userInfo = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();
    const isLoggedIn = useMemo(() => !!userInfo?.username, [userInfo]);
    const persistedUserInfo = JSON.parse(localStorage.getItem('userInfo'));


    useEffect(() => {
        if (persistedUserInfo) {
            dispatch(setInfo(persistedUserInfo));
        }
    }, [dispatch]);

    useEffect(() => {
        const isLoggedIn = !!userInfo.username;
    }, [userInfo]);

    return (
        <Router>
            <Routes>
                <Route path="/forget" element={<ForgetPasswordPage/>}/>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/register" element={<RegisterPage/>}/>

                {/* 如果没有登录信息，重定向到登录页面 */}
                {!persistedUserInfo && (
                    <>
                        <Route path="*" element={<Navigate to="/login" replace/>}/>
                    </>
                )}

                {/* 受保护的页面，只有登录后才能访问 */}
                {isLoggedIn && (
                    <Route path="/" element={<LayoutContainer/>}>
                        <Route index element={<Homepage/>}/>
                        <Route path="personal" element={<PersonalPage/>}/>
                        <Route path="admin/role" element={<AdminRolePage/>}/>
                        <Route path="admin/menu" element={<AdminMenuPage/>}/>
                        <Route path="admin/user" element={<AdminUserPage/>}/>
                        <Route path="admin/dept" element={<AdminDeptPage/>}/>
                    </Route>
                )}
            </Routes>
        </Router>
    );
}

export default AppRouter;
