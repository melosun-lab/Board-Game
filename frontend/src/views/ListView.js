import React from 'react'
import { Link } from 'react-router-dom'

import { Query } from 'react-apollo'
import { gql } from 'apollo-boost'

import { graphql } from 'react-apollo'


const ListView = () => (
    <Query query={GET_USERS_QUERY}>
        {
            ({ data, loading, error }) => {
                if (loading) return <div>Loading</div>
                if (error) return <div>Error</div>
                return <div>{JSON.stringify(data)}</div>
            }
        }
    </Query>
)
export default ListView

const GET_USERS_QUERY = gql `
{
    users{
        id
        username
    }
}
`
