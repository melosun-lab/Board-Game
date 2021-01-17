import React from "react";
import { Query } from 'react-apollo'
import { gql } from 'apollo-boost'
import withStyles from "@material-ui/core/styles/withStyles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import ThumbUpIcon from "@material-ui/icons/ThumbUpTwoTone";
import Divider from "@material-ui/core/Divider";
import format from  'date-fns/format'
import SportsEsportsIcon from '@material-ui/icons/SportsEsports';
import Root from '../Root'
import Error from '../components/Shared/Error'
import Loading from '../components/Shared/Loading'
import { createGenerateClassName, ExpansionPanel, FormControl, InputLabel } from "@material-ui/core";
import GameStarter from "../components/Shared/GameStarter";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";


const Profile = ({ classes,match }) => { 
  const id = match.params.id
  return (
    <Query query={PROFILE_QUERY} variables = {{id}}>
      {({ data, loading, error}) => {
        if (loading) return <Loading />
        if (error) return <Error error={error} />
        return (
        <div>
           <card className={classes.card}>
            <CardHeader
              avatar={<Avatar>{data.user.username[0]}</Avatar>}
              title={data.user.username}
              subheader={`Joined ${format(data.user.dateJoined, 'MMM Do, YYYY')}`}

            />

          </card>
          <ListItem className={classes.root}>
          <h1>Profile</h1>
            </ListItem>

          <Typography variant="body1">
          <ListItem button>
          {`Username: ${data.user.username}`}
            </ListItem>

            <ListItem button>

            {`NickName: ${data.user.nickname}`}
            </ListItem>
            <ListItem button>
            {`Friend: ${data.user.frineds}`}
            </ListItem>
          </Typography>

          <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} >
        <ExpansionPanelDetails className={classes.details}>
          <ListItem className={classes.root}>
          Manage Accouunt
          </ListItem>
          </ExpansionPanelDetails>
          </ExpansionPanelSummary>
          </ExpansionPanel>

        </div>
        )
        }}
    </Query>

);

}


const PROFILE_QUERY = gql`
  query ($id: Int!) {
  user (id: $id) {
    username
    nickname
    dateJoined
    friends
    roomSet{
      id
      url
      capacity
      members
      owner {
        id
      }
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
export default withStyles(styles)(Profile);