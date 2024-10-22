import { useEffect, useState } from "react";
import { BrowserRouter, HashRouter } from "react-router-dom";
import { Spin } from "antd";
import Layout from "@/layout";
import Login from "@/pages/login";
import HomePages from "@/pages/worklogsearch";
import { getLocalUser } from "@/utils/index1";
import { useDispatchUser, useStateUserInfo } from "@/store/hooks";

const isHash = import.meta.env.REACT_APP_ROUTER_ISHASH === "1";
const RouterBasename = import.meta.env.REACT_APP_ROUTERBASE || "/";

function AppRouter() {
  const [loading, setLoad] = useState(true);
  const { stateSetUser } = useDispatchUser();
  const userInfo = useStateUserInfo();

  useEffect(() => {
    const localInfo = getLocalUser();
    if (localInfo && localInfo.isLogin) {
      stateSetUser(localInfo);
    }
    setLoad(false);
  }, [stateSetUser]);

  if (loading) {
    return (
      <Spin size="large" wrapperClassName="loading-page" tip="Loading..." />
    );
  }

  if (!userInfo) {
    return <Login />;
  }

  // 确保使用 HashRouter 或 BrowserRouter
  const Router = isHash ? HashRouter : BrowserRouter;

  return (
    <Router basename={isHash ? undefined : RouterBasename}>
      <Layout />
    </Router>
  );
}

export default AppRouter;
