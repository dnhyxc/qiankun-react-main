import React from "react";
import ReactDOM from "react-dom";

// import { registerMicroApps, start } from "./handleMicro";

import {
  registerMicroApps,
  start,
  runAfterFirstMounted,
  addGlobalUncaughtErrorHandler,
  initGlobalState,
  MicroAppStateActions,
} from "qiankun";

import { login, notfound, failed } from "./pages/config";
import App from "./App";
import "./index.css";

interface IProps {
  loading?: boolean;
  needHeader?: boolean;
  path?: string;
  type?: string;
}

const render = (porps: IProps) => {
  ReactDOM.render(
    <React.StrictMode>
      <App {...porps} />
    </React.StrictMode>,
    document.getElementById("main-root")
  );
};

render({ loading: true });

const appStart = () => {
  // 设置子应用首次加载loading效果
  const loader = (loading: boolean) => render({ loading });

  interface AppParams {
    name: string;
    entry: string;
    activeRule: string;
    container: string;
    loader: (loading: boolean) => void;
    props: {};
  }

  const apps: AppParams[] = [
    {
      name: "reactApp",
      entry: "//localhost:8989",
      activeRule: "/dnhyxc/react",
      container: "#sub-app-viewport",
      loader,
      props: {
        info: "来了老弟",
        routerBase: "/dnhyxc/react", // 给子应用下发的基础路由
      },
    },
    {
      name: "vueApp",
      entry: "//localhost:8686",
      activeRule: "/dnhyxc/vue",
      container: "#sub-app-viewport",
      loader,
      props: {
        routerBase: "/dnhyxc/vue", // 给子应用下发的基础路由
      },
    },
  ];

  // 注册子应用
  registerMicroApps(apps);

  start({
    sandbox: {
      // strictStyleIsolation: true, // 使用 shadow dom 解决样式冲突，该方式兼容性较差
      experimentalStyleIsolation: true, // 通过添加选择器范围来解决样式冲突
    },
  });

  // 微前端启动进入第一个子应用后回调函数
  runAfterFirstMounted(() => {
    console.log("[MainApp] first app mounted");
  });

  // 添加全局异常捕获
  addGlobalUncaughtErrorHandler((event) => {
    console.error("异常捕获", event);
    const { message } = event as any;

    const errorApp: AppParams[] = [];

    apps.forEach((i) => {
      if (message && message.includes(i.name)) {
        errorApp.splice(0, 1, i);
      }
    });

    // 加载失败时提示
    if (
      message &&
      message.includes("died in status LOADING_SOURCE_CODE") &&
      errorApp.length &&
      window.location.pathname === errorApp[0].activeRule
    ) {
      render(failed);
    }
  });

  const initState = {
    AppName: "micro-react-main",
  };
  initGlobalState(initState);
};

const actions: MicroAppStateActions = initGlobalState({});
(window as any).__MAIN_GLOBALSTATE_ACTIONS__ = actions;
actions.onGlobalStateChange((state, prev) => {
  // state: 变更后的状态; prev 变更前的状态
  console.log("[onGlobalStateChange - master]:", state, prev);
});

// 设置路由拦截
const routeIntercept = () => {
  if (window.location.pathname === "/dnhyxc/login") {
    window.location.href = "/dnhyxc/react";
  } else {
    render(notfound);
  }
};

// 模拟获取用户登录信息
const getUserInfo = () => {
  return true;
};

// 页面加载判断
if (window.location.pathname === "/") {
  window.location.href = "/dnhyxc/react";
} else {
  if (getUserInfo()) {
    routeIntercept();
    appStart();
  } else {
    render(login);
  }
}
