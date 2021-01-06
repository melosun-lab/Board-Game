
import './App.css';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom'
import React, { Component } from 'react'
import ListView from './views/ListView'
import LoginView from './views/LoginView'
import LogoutView from './views/LogoutView'
import CreateView from './views/CreateView'
import DetailView from './views/DetailView'
import { ApolloProvider } from 'react-apollo'
import ApolloClient from 'apollo-boost';
const apiclient = new ApolloClient({
      uri: 'http://127.0.0.1:8000/graphql/'
    });

class App extends Component {
  render() {
    return (
      <ApolloProvider client={apiclient}>
        <Router>
        <div>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/messages/create/">Create Message</Link></li>
            <li><Link to="/login/">Login</Link></li>
            <li><Link to="/logout/">Logout</Link></li>
          </ul>
          <Route exact path="/" component={ListView} />
          <Route exact path="/login/" component={LoginView} />
          <Route exact path="/logout/" component={LogoutView} />
          <Switch>
            <Route path="/messages/create/" component={CreateView} />
            <Route path="/messages/:id/" component={DetailView} />
          </Switch>
        </div>
      </Router>
      </ApolloProvider>

    )
  }
}

export default App;
