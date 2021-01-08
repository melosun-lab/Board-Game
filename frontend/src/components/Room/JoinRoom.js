import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
// import IconButton from "@material-ui/core/IconButton";
// import ThumbUpIcon from "@material-ui/icons/ThumbUp";

const JoinRoom = ({ classes }) => {
  return <div>Join</div>;
};

const styles = theme => ({
  iconButton: {
    color: "deeppink"
  },
  icon: {
    marginLeft: theme.spacing.unit / 2
  }
});

export default withStyles(styles)(JoinRoom);
