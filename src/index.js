import React from "react";
import ReactDOM from "react-dom/client";

import { BrowserRouter } from "react-router-dom";

import "./index.css";

import App from "./App";

import ReactPixel from 'react-facebook-pixel';
ReactPixel.init('4440091866260875');
ReactPixel.pageView();

const root = ReactDOM.createRoot(
  document.getElementById("root")
);

root.render(

  <BrowserRouter>

    <App />

  </BrowserRouter>
);