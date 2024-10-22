import { createStore, combineReducers } from "redux";
import MenuReducer from "./menu/reducer";
import UserReducer from "./user/reducer";
import LayoutReducer from "./layout/reducer";
import VisibleReducer from "./visible/reducer";
import ThemeReducer from "./theme/reducer"
// import useUserStore from './user';
const reducer = combineReducers({
  menu: MenuReducer,
  user: UserReducer,
  layout: LayoutReducer,
  componentsVisible: VisibleReducer,
  theme: ThemeReducer
});

const store = createStore(
  reducer,
  import.meta.env.REACT_APP_MODE === "development" &&
  window.__REDUX_DEVTOOLS_EXTENSION__ &&
  window.__REDUX_DEVTOOLS_EXTENSION__()
);
// export {useUserStore}
export default store;
