import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { createWeb3ReactRoot, Web3ReactProvider } from "@web3-react/core";
// import {I18nextProvider} from 'react-i18next';
import { HelmetProvider } from "react-helmet-async";

import theme from "./theme";
import store from "./store";
import {App} from "./App";
// import i18n from 'i18n';
import { NetworkContextName } from "./constants/index";

import { getLibrary } from "./utils";
import { Toast } from "./components/Toast";

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName);

// @ts-ignore
if (!!window.ethereum) {
  // @ts-ignore
  window.ethereum.autoRefreshOnNetworkChange = false;
}

ReactDOM.render(
  <HelmetProvider>
    {/* <I18nextProvider i18n={i18n}> */}
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ProviderNetwork getLibrary={getLibrary}>
        <ColorModeScript />
        <Provider store={store}>
          <ChakraProvider resetCSS theme={theme}>
            <Toast></Toast>
            <App />
          </ChakraProvider>
        </Provider>
      </Web3ProviderNetwork>
    </Web3ReactProvider>
    {/* </I18nextProvider> */}
  </HelmetProvider>,
  document.getElementById("root")
);
