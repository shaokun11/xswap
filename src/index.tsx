import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Web3ReactProvider } from "@web3-react/core";
import * as serviceWorker from "./serviceWorker";
import { Provider } from "react-redux";
import store from "./state";
import { getLibrary } from "./utils/web3";
ReactDOM.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <Provider store={store}>
        <App />
      </Provider>
    </Web3ReactProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

serviceWorker.unregister();
