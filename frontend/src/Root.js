import React from "react";

import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import withRoot from "./withRoot";
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import App from './pages/App';
import Profile from './pages/Profile';
import Header from './components/Shared/Header'

const Root = () => (
    <Query query={ME_QUERY}>
        {({ data, loading, error }) => {
            if (loading) return <div>Loading</div>
            if (error) return <div>Error</div>
            const currentUser = data.me
            if (!currentUser.isConfirmed) return <div>Not Activated Account</div>
            return (
                <Router>
                    <>
                    <Header currentUser={currentUser}/>
                    <Switch>
                        <Route exact path="/" component={App} />
                        <Redirect from="/verify-email/:token" to="/"/>
                        <Route path="/profile/:id" component={Profile}/>
                    </Switch>
                    </>
                </Router>
            )
        }}
    </Query>
)

const ME_QUERY = gql`
    {
        me {
            id
            username
            nickname
            email
            isConfirmed
        }
    }
`

// const GET_ROOMS_QUERY = gql `
//     {
//         rooms{
//             id
//             url
//             capacity
//             members
//             owner{
//                 id
//                 username
//             }
//         }
//     }
// `

export default withRoot(Root);
