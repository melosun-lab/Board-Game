import React, { useState } from "react";
import { Mutation } from 'react-apollo';
import { gql } from 'apollo-boost';
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import FormControl from "@material-ui/core/FormControl";
import Paper from "@material-ui/core/Paper";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment"
import IconButton from "@material-ui/core/IconButton"
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import Slide from "@material-ui/core/Slide";
import VerifiedUserTwoTone from "@material-ui/icons/VerifiedUserTwoTone";
import Visibility  from "@material-ui/icons/Visibility"
import VisibilityOff from "@material-ui/icons/VisibilityOff"
import Lock from "@material-ui/icons/Lock";
import Error from "../Shared/Error"

function Transition(props) {
  return <Slide direction="up" {...props} />
}

const Login = ({ classes, setNewUser }) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loginErrMsg, setLoginErrMsg] = useState("")
  const [showPassword, setShowPassWord] = useState(false)

  const handleSubmit = async (event, error, tokenAuth, client) => {   
    event.preventDefault()
    const res = await tokenAuth()

    if (res){
      localStorage.setItem('authToken', res.data.tokenAuth.token)
      client.writeData({ data: { isLoggedIn: true} })
    }
  }

  const handleClickShowPassword = () =>{
    setShowPassWord(!showPassword)
  }

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div className = {classes.root}>
      <Paper className = {classes.paper}>
        <Avatar className = {classes.avatar}>
          <Lock />
        </Avatar>  
        <Typography variant = "title">
          Login as Existing User
        </Typography>
        <Mutation 
          mutation={LOGIN_MUTATION} 
          variables={{ username, password }}
          onError = {data =>{
            setLoginErrMsg("The username and/or password you specified are not correct.")
          }}
        >
          {(tokenAuth, { loading, error, called, client }) => {
            return(
              <form onSubmit={event => handleSubmit(event, error, tokenAuth, client)} className = {classes.form}>
                <FormControl margin = "normal" required fullWidth>
                  <InputLabel htmlFor = "username">
                    Username
                  </InputLabel>
                  <Input id = "username" onChange = {event => setUsername(event.target.value)}/>
                </FormControl>
                <FormControl margin = "normal" required fullWidth>
                  <InputLabel htmlFor = "password">
                    Password
                  </InputLabel>
                  <Input id = "password" type = "password" onChange = {event => setPassword(event.target.value)} endAdornment = 
              {
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }/>
                </FormControl>
                <span style={{color: "red"}}>{loginErrMsg}</span>
                <Button
                  type = "submit"
                  fullWidth
                  variant = "contained"
                  color = "primary"
                  disabled={loading || !username.trim() || !password.trim()}
                  className = {classes.submit}
                >
                    
                    {loading ? "Logging in" : "Login"}
                </Button>
                <Button
                  onClick={() => setNewUser(true)}
                  color = "secondary"
                  variant = "outlined"
                  fullWidth
                >
                  New User? Register Here
                </Button>
                {/* Error Handling */}
              </form>
            )
          }}
        </Mutation> 
      </Paper>
    </div>
  )
};

const LOGIN_MUTATION = gql`
  mutation ($username: String!, $password: String!) {
    tokenAuth(username: $username, password: $password) {
      token
    }
  }
`

const styles = theme => ({
  root: {
    width: "auto",
    display: "block",
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up("md")]: {
      width: 400,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing.unit * 2
  },
  title: {
    marginTop: theme.spacing.unit * 2,
    color: theme.palette.secondary.main
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.primary.main
  },
  form: {
    width: "100%",
    marginTop: theme.spacing.unit
  },
  submit: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2
  }
});

export default withStyles(styles)(Login);
