import React, { useState} from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { Mutation } from "react-apollo";
import { gql } from "apollo-boost";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import RoomMember from "./RoomMember";
const RoomOwner = ({ classes, roomdata }) => {
  const [content, setContent] = useState("")
  const handleSubmit = (event, updateRoom) => {
    event.preventDefault()
    updateRoom()
  }
  return (<div>
    <Mutation 
        mutation = {UPDATE_CONTENT_MUTATION} 
        variables={{ id: roomdata.id, content: content}} 
        onCompleted={data => {
          console.log({ data })
        }}
      >
        {(updateRoom, { loading, error }) => {
          return(
            <form onSubmit={event => handleSubmit(event, updateRoom)} className = {classes.form}>
              <div>
              <FormControl margin = "normal" required>
                <InputLabel htmlFor = "content">
                  Drawing Target
                </InputLabel>
                <Input id = "content" onChange = {event => setContent(event.target.value)}/>
              </FormControl>
              </div>
              <div>
              <Button
                type = "submit"
                variant = "contained"
                color = "secondary"
                className = {classes.submit}>
                  {loading ? "Setting..." : "Set Draw Target"}
              </Button>
              </div>
            </form>
          )
        }}
      </Mutation> 
      <RoomMember roomdata={roomdata}></RoomMember></div>);
};

const UPDATE_CONTENT_MUTATION = gql `
  mutation ($id: Int!, $content: String!){
    updateRoom(id: $id, content: $content) {
      room {
        id
        content
      }
    }
  }
`

const styles = theme => ({
  paper: {
    width: "auto",
    display: "block",
    padding: theme.spacing.unit * 2,
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    [theme.breakpoints.up("md")]: {
      width: 650,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  card: {
    display: "flex",
    justifyContent: "center"
  },
  title: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing.unit * 2
  },
  audioIcon: {
    color: "purple",
    fontSize: 30,
    marginRight: theme.spacing.unit
  },
  thumbIcon: {
    color: "green",
    marginRight: theme.spacing.unit
  },
  divider: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit
  }
});

export default withStyles(styles)(RoomOwner);
