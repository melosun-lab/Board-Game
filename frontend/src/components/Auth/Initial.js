import React, { useState } from "react";
import Login from './Login';
import Register from './Register';
import withStyles from "@material-ui/core/styles/withStyles";
const Initial = ({ classes }) => {
    const [newUser, setNewUser] = useState(true)
    return newUser ? (
        <Register setNewUser={setNewUser} />
        ) : (
        <Login setNewUser={setNewUser}/>
    )

  };

  const styles = theme => ({
    container: {
      margin: "0 auto",
      maxWidth: 960,
      padding: theme.spacing.unit * 2
    }
  });
  
  export default withStyles(styles)(Initial);
  