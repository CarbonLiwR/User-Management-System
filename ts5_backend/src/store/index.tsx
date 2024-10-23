// src/store.js
import { configureStore } from '@reduxjs/toolkit';

import { combineReducers } from 'redux';
import userReducer from './userSlice.tsx';
// import postsReducer from './postsReducer';

const rootReducer = combineReducers({
    user: userReducer,
    // posts: postsReducer
});


const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(/* 你的自定义中间件 */),
    devTools: process.env.NODE_ENV !== 'production', // 如果不是生产环境则自动使用DevTools
});


export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
