import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import store from 'AppRedux/store';
import Routes from './Routes';
import './FontAwesomeIcons';
import 'styles/common.scss';

function App() {
    return (
        <Provider store={store}>
            <Router>
                <ToastContainer />
                <Routes />
            </Router>
        </Provider>
    );
}

ReactDOM.render(<App />, document.getElementById("container"));