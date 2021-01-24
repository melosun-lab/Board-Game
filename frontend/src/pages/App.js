import React, { useState } from "react";
import { Query } from "react-apollo";
import { gql } from "apollo-boost";
import withStyles from "@material-ui/core/styles/withStyles";
import RoomList from "../components/Room/RoomList";
import CreateRoom from "../components/Room/CreateRoom";
import SearchRooms from "../components/Room/SearchRooms";
import Loading from "../components/Shared/Loading";
import Error from "../components/Shared/Error";

const App = ({ classes }) => {
  const [searchResults, setSearchResults] = useState([]) 
  return (
    <div className={classes.container}>
      <SearchRooms setSearchResults={setSearchResults} />
      <CreateRoom />
      <Query query={GET_ROOMS_QUERY} pollInterval={1000}>
        {({ data, loading, error}) => {
          if (loading) return <Loading />
          if (error) return <Error error={error} />
          console.log(data)
          const rooms = searchResults.length > 0 ? searchResults : data.rooms
          return <RoomList rooms={rooms} />
        }}
      </Query>
    </div>
  );
};

export const GET_ROOMS_QUERY = gql`
  query getRoomsQuery {
    rooms {
      id
      url
      capacity
      members{
        id
        username
      }
      name
      game
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
