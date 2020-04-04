import React, { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Header from './Header.jsx';
import Body from './Body.jsx';
import Modal from './Modal.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class App extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <Router basename="/#">
        <ToastContainer />
        <Header />
        <Body />
        <Modal />
      </Router>
    );
  }
}

export default App;