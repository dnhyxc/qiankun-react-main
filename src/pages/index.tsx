import React from "react";
import Loading from "./loading";
import Login from "./login";
import NotFound from "./notFound";
import Failed from "./failed";

const RenderPage = ({ loading, ...props }: any) => {
  console.log(loading, "loadingloadingloading");
  return (
    <React.Fragment>
      {loading && <Loading {...props} />}
      {!loading && props.type === "login" && <Login {...props} />}
      {!loading && props.type === "notfound" && <NotFound {...props} />}
      {!loading && props.type === "failed" && <Failed {...props} />}
    </React.Fragment>
  );
};

export default RenderPage;
