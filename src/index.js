import React from "react";
import ReactDOM from "react-dom";
import { AppContainer } from "react-hot-loader";
import "antd/dist/antd.css";
import App from "./containers/AppContainer";

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById("root")
  );
};

render(App);

if (module.hot) {
  module.hot.accept("./containers/AppContainer", () => {
    render(App);
  });
}
