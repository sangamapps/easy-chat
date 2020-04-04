import React, { Component } from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import { toast } from 'react-toastify';

class Header extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <Link className="navbar-brand" to="/"><img src="assets/images/favicon.png" width="30" height="30" className="d-inline-block align-top" alt="" />React Sample</Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/page-1">Page-1</Link>
                        </li>
                        <button type="button" className="btn btn-success" onClick={()=>toast.success("wow")}>Notify</button>
                    </ul>
                    <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#exampleModal">Launch demo modal</button>
                </div>
            </nav>
        );
    }
}

export default Header;