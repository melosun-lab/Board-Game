import React from "react";
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import withRoot from "../../withRoot";
import Initial from './Initial';
import Verify from './Verify';

export default withRoot(() => {
  return (
    <Router>
        <Switch>
            <Route exact path="/" component={Initial} />
            <Route path="/verify-email/:token" component={Verify}/>
        </Switch>
    </Router>
)
});
