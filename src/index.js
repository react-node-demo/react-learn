import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react';

import "antd/dist/antd.css";
import "@/assets/css/base.css";
import store from "./redux/store";
import { persistor } from '@/redux/store'

ReactDOM.render(
    <Provider store={store}>
        <PersistGate persistor={persistor}>
            <App />
        </PersistGate>
    </Provider>,
    document.querySelector("#root")
);
