import React from "react";
import withRoot from "./withRoot";
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';

const Root = () => (
    <Query query={ME_QUERY}>
        {({ data, loading, error }) => {
            if (loading) return <div>Loading</div>
            if (error) return <div>Error</div>
            return <div>{JSON.stringify(data)}</div>
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
