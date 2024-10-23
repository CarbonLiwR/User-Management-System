import './App.css'
import { Provider } from "react-redux";
import store from "./store";
// import LayoutSet from "./components/layout-set";
import AppRouter from "./router/appRouter";
import {ConfigProvider} from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';  // 引入中文包



function App() {
  return (
    <Provider store={store}>
      <ConfigProvider locale={zhCN}>
          <AppRouter />
          {/*<LayoutSet />*/}
      </ConfigProvider>
    </Provider>
  )
}

export default App
