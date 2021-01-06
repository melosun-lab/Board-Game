import React from "react";
import { Link } from 'react-router-dom'
import withStyles from "@material-ui/core/styles/withStyles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import JoinRoom from "./JoinRoom";
import DeleteRoom from "./DeleteRoom";
import UpdateRoom from "./UpdateRoom";
import CreateRoom from "./CreateRoom";

const RoomList = ({ classes, rooms }) => (
  <List>
    {rooms.map(room => (
      <ExpansionPanel key={room.id}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} >
          <ListItem className={classes.root}>
            <JoinRoom />
            <ListItemText
              primaryTypographyProps={{
                variant: "subheading",
                color: "primary"
              }}
              primary={`Room ID: ${room.id}`}
              secondary={
                <Link className={classes.link} to={`/profile/${room.owner.id}`}>
                  {`Owner: ${room.owner.username}`}
                </Link>
              }
            />
          </ListItem>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.details}>
          <Typography variant="body1">
            {`Capacity: ${room.capacity}`}
            <br />
            {`Members: ${room.members}`}
          </Typography>
        </ExpansionPanelDetails>
        <ExpansionPanelActions>
          <UpdateRoom />
          <DeleteRoom />
        </ExpansionPanelActions>
      </ExpansionPanel>
    ))}
  </List>
)

const styles = {
  root: {
    display: "flex",
    flexWrap: "wrap"
  },
  details: {
    alignItems: "center"
  },
  link: {
    color: "#424242",
    textDecoration: "none",
    "&:hover": {
      color: "black"
    }
  }
};

export default withStyles(styles)(RoomList);
