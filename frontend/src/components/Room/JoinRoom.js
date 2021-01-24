import React, { useContext } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { Mutation } from "react-apollo";
import { gql } from "apollo-boost";
import IconButton from "@material-ui/core/IconButton";
// import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import { UserContext, ME_QUERY } from "../../Root";
// import {GET_ROOMS_QUERY} from "../../pages/App";
// import {SEARCH_ROOMS_QUERY} from "./SearchRooms";
// import UpdateRoom from "./UpdateRoom";

const JoinRoom = ({ classes, roomId }) => {
  const currentUser = useContext(UserContext);
  const username = currentUser.username;

  const handleDisableJoinRoom = () => {
    const memberRoom = currentUser.memberset;
    const ownerRoom = currentUser.ownerset;
    const isUserIn = (memberRoom.findIndex(({ id }) => id === roomId) > -1)||
                      (ownerRoom.findIndex(({ id }) => id === roomId) > -1);
    return isUserIn;
  }
  return (
    <Mutation
      mutation = {UPDATE_MEMBER_MUTATION}
      variables = {{ id: roomId, members: username }}
      refetchQueries={() => [{ query: ME_QUERY}]}
      onCompleted = {data => {
        console.log({ data });
      }}
      >
      {updateRoom => (
      <IconButton className={classes.iconButton} onClick={event =>{
        event.stopPropagation();
        updateRoom();
      }} disabled={handleDisableJoinRoom()}>
        Join
      </IconButton>
    )}</Mutation>

  );
};

const UPDATE_MEMBER_MUTATION = gql `
  mutation ($id: Int!, $members: String!){
    updateRoom(id: $id, members: $members) {
      room {
        id
      }
    }
  }
`
const styles = theme => ({
  iconButton: {
    color: "deeppink"
  },
  icon: {
    marginLeft: theme.spacing.unit / 2
  }
});

export default withStyles(styles)(JoinRoom);
