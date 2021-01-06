import React from "react";
import { Query } from "react-apollo";
import { gql } from "apollo-boost";
import withStyles from "@material-ui/core/styles/withStyles";
import RoomList from "../components/Room/RoomList";
import CreateRoom from "../components/Room/CreateRoom";
import Loading from "../components/Shared/Loading";
import Error from "../components/Shared/Error";

const App = ({ classes }) => {
  return (
    <div className={classes.container}>
      <CreateRoom />
      <Query query={GET_ROOMS_QUERY}>
        {({ data, loading, error}) => {
          if (loading) return <Loading />
          if (error) return <Error error={error} />
          return <RoomList rooms={data.rooms} />
        }}
      </Query>
    </div>
  );
};

const GET_ROOMS_QUERY = gql`
  query getRoomsQuery {
    rooms {
      id
      url
      capacity
      members
      owner {
        id
        username
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

export default withStyles(styles)(App);
