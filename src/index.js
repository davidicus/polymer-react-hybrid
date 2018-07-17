//import npm modules
import React from "react";
import { render } from "react-dom";
import { BrowserRouter, Route } from "react-router-dom";
// import { Router, Route, IndexRoute } from "react-router";
import { Provider } from "react-redux";

//import project modules
import store from "./store";
import App from "App";
// import Counter from "Counter";
require("main");
require("reset");

// In browser a11y testing, only in development
// if (__DEV__) {
//   var axe = require("react-axe");
//   axe(React, ReactDOM, 1000);
// }

const router = (
  <Provider store={store}>
    <BrowserRouter>
      <Route path="/" component={App} />
      {/* <IndexRoute component={Counter} /> */}

      {/* </Route> */}
    </BrowserRouter>
  </Provider>
);

render(router, document.getElementById("mount"));
