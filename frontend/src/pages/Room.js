import React, { useContext } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import Loading from "../components/Shared/Loading";
import Error from "../components/Shared/Error";
import { UserContext} from "../Root";
import RoomMember from "../components/Room/RoomMember";
import RoomOwner from "../components/Room/RoomOwner";
const Room = ({ classes, match }) => {
  const currentUser = useContext(UserContext);
  console.log(currentUser);
  const roomid = match.params.rid;
  console.log(roomid);
  return (
      <div>
    <Query query={GET_ROOM_QUERY} variables={{ id: roomid }} >
    {({ data, loading, error}) => {
      if (loading) return <Loading />
      if (error) return <Error error={error} />
      const isUserOwner = (data.roomid.owner.id === currentUser.id);
      const isUserMember = (data.roomid.members.findIndex(({ id }) => id === currentUser.id) > -1);
      if (!isUserMember && !isUserOwner) return <div>Not owner or member of this room</div>
      if (isUserOwner) return <RoomOwner></RoomOwner>
      else return <RoomMember></RoomMember>
    }}
  </Query>
  Room
      </div>
  );
};


const GET_ROOM_QUERY = gql`
query ($id: Int!){
  roomid(id: $id){
      id
      members{
          id
      }
      owner{
          id
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

export default withStyles(styles)(Room);
