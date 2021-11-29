import React from "react";
import ReactDOM from "react-dom";

import {
  registerMicroApps,
  start,
  runAfterFirstMounted,
  addGlobalUncaughtErrorHandler,
} from "qiankun";

import "./index.css";
import { login, notfound, failed } from "./pages/config";
import App from "./App";

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
    props: {
      routerBase: string; // 给子应用下发的基础路由
    };
  }

  const apps: AppParams[] = [
    {
      name: "reactApp",
      entry: "//localhost:8989",
      activeRule: "/dnhyxc/react",
      container: "#sub-app-viewport",
      loader,
      props: {
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
  registerMicroApps(apps, {
    beforeLoad: (app): any => {
      console.log("before load app.name=====>>>>>", app.name);
    },
    beforeMount: [
      (app): any => {
        console.log("[LifeCycle] before mount %c%s", "color: green;", app.name);
      },
    ],
    afterMount: [
      (app): any => {
        console.log("[LifeCycle] after mount %c%s", "color: green;", app.name);
      },
    ],
    afterUnmount: [
      (app): any => {
        console.log(
          "[LifeCycle] after unmount %c%s",
          "color: green;",
          app.name
        );
      },
    ],
  });

  start();

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
};

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
