// src/utils/routeEmitter.js
import mitt from 'mitt';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const emitter = mitt();

const key = Symbol('ROUTE_CHANGE');

let latestRoute;

export function useRouteChange(handler, immediate = true) {
  const location = useLocation(); // 这是react-router-dom提供的hook，用于获取当前路由位置

  useEffect(() => {
    // 当组件挂载或者location变化时，发射路由变更事件
    setRouteEmitter(location);

    // 清理函数
    return () => {
      removeRouteListener(handler);
    };
  }, [location, handler]);

  useEffect(() => {
    // 注册事件监听
    listenerRouteChange(handler, immediate);

    // 清理函数
    return () => {
      removeRouteListener(handler);
    };
  }, [handler, immediate]);
}

export function setRouteEmitter(location) {
  emitter.emit(key, location);
  latestRoute = location;
}

export function listenerRouteChange(handler, immediate = true) {
  emitter.on(key, handler);
  if (immediate && latestRoute) {
    handler(latestRoute);
  }
}

export function removeRouteListener(handler) {
  emitter.off(key, handler);
}
