import React, { useState, useEffect } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { Mutation } from 'react-apollo';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import Error from "../Shared/Error"
const Verify = ({ classes, match }) => {

  const token = match.params.token;
  const [sendVerify, setSendVerify] = useState(true)
  const [username, setUsername] = useState("")
  const [sendActivate, setSendActivate] = useState(false)
  const [verifyError, setVerifyError] = useState(false)


  const handleVerify = async (verifyToken) => {
    const res = await verifyToken()
    if (res) {
      setUsername(res.data.verifyToken.payload.username)
      localStorage.setItem('authToken', token)
      console.log("Token correct.")
    }
  }

  useEffect(()=>{
    if (username) {
      setSendActivate(true)
    }
  }, [username])

  const handleActivate= async (updateUser, client) => {
    const res = await updateUser()
    if (res) {
      console.log("User confirmed.")
      client.writeData({ data: { isLoggedIn: true} })
    }
  }


  return (
<div>
    {verifyError ? <div>Error verifying this token</div>:<div>Verifing token!</div>}
    {sendVerify && <Mutation mutation={VERIFY_MUTATION} variables={{ token }} onError = {data => setVerifyError(true)}>
    {(verifyToken, { loading, error}) => {
      setSendVerify(false)
      handleVerify(verifyToken)
      return(null)
    }}
    </Mutation> }

    {sendActivate && <Mutation mutation={ACTIVATE_MUTATION} variables={{username}} onError = {data => setVerifyError(true)}>
    {(updateUser, { loading, error, called, client }) => {
      setSendActivate(false)
      handleActivate(updateUser, client)
      return(null)
    }}
    </Mutation>}
</div>
  );
};

const VERIFY_MUTATION = gql`
  mutation ($token: String!) {
    verifyToken(token: $token) {
      payload
    }
  }
`
const ACTIVATE_MUTATION = gql`
  mutation ($username: String!) {
    updateUser(username: $username, isConfirmed: true) {
      user{
        username
        isConfirmed
        email
      }
    }
  }
`

const styles = theme => ({
  container: {
    margin: "0 auto",
    maxWidth: 960,
    padding: theme.spacing.unit * 2
  }
});

export default withStyles(styles)(Verify);