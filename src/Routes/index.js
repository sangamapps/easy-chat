import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import LoginContainer from 'Containers/LoginContainer';
import HomeContainer from 'Containers/HomeContainer';
import ChatBoxContainer from 'Containers/ChatBoxContainer';

export default function () {
    const { userInfo } = useSelector(state => state);
    
    return <div className="app-body">
        {userInfo && userInfo._id ?
            <Router>
                <Switch>
                    <Route exact path={"/"} component={HomeContainer} />
                    <Route exact path={"/:_id"} component={ChatBoxContainer} />
                </Switch>
            </Router>
            : <LoginContainer />}
    </div>;
}