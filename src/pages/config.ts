const login = {
  type: "login",
  path: "/dnhyxc/login",
  needHeader: false,
  loading: false,
};

const notfound = {
  type: "notfound",
  path: "/dnhyxc/login",
  needHeader: true,
  loading: false,
};

const failed = {
  type: "failed",
  path: "/dnhyxc/failed",
  needHeader: true,
  loading: false,
};

export { login, notfound, failed };
