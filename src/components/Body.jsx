import React, { Component } from "react";
import { Switch, Route,Redirect  } from "react-router-dom";
import { links } from './links';

class Body extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <Switch>
                {links.map((o, i) => <Route path={o.path} exact={true} key={i}>{o.component}</Route>)}
            </Switch>
        );
    }
}

export default Body;