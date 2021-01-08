import React, { useState } from "react";
import {gql} from "apollo-boost";
import { Mutation } from "react-apollo";
import withStyles from "@material-ui/core/styles/withStyles";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import AddIcon from "@material-ui/icons/Add";
import ClearIcon from "@material-ui/icons/Clear";
import LibraryMusicIcon from "@material-ui/icons/LibraryMusic";
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Error from "../Shared/Error";
import Loading from "../Shared/Loading";
import { GET_ROOMS_QUERY } from "../../pages/App";

const CreateRoom = ({ classes }) => {
  const [open, setOpen] = useState(false)
  const [game, setGame] = useState("")
  const [name, setName] = useState("")
  const [capacity, setCapacity] = useState("")

  const handleSubmit = (event, createRoom) => {
    event.preventDefault()
    const url = "game.com"
    const members = ""
    createRoom({ variables: { capacity, name, game, url, members}})
  }
  return (
    <>
    {/*Create Room Button*/}
    <Button onClick={() => setOpen(true)} variant="fab" className={classes.fab} color="secondary">
      {open ? <ClearIcon/> : <AddIcon />}
    </Button>

    {/*Create Room Dialog*/}
    <Mutation 
      mutation={CREATE_ROOM_MUTATION} 
      onCompleted={data => {
        setOpen(false)
      }}
      refetchQueries={() => [{ query: GET_ROOMS_QUERY }]}
    >
      {(createRoom, { loading, error }) => {
        if (loading) return <Loading />
        if (error) return <Error error={error} />
        return (
          <Dialog open={open} className={classes.dialog}>
            <form onSubmit={event => handleSubmit(event, createRoom)}>
              <DialogContent>
                <DialogContentText>
                  Add a Name & Choose a Game
                </DialogContentText>
                <FormControl fullWidth>
                  <InputLabel id="game-select-label">Game</InputLabel>
                  <Select
                    labelId="game-select-label"
                    id="game-select"
                    value={game}
                    onChange={(event) => setGame(event.target.value)}
                  >
                    <MenuItem value={"Game A"}>Game A</MenuItem>
                    <MenuItem value={"Game B"}>Game B</MenuItem>
                  </Select>
                  <TextField 
                    label="Room Name"
                    placeholder="Add Name"
                    className={classes.textField}
                    onChange={event => setName(event.target.value)}
                  />
                  <TextField 
                    label="Set Capacity"
                    placeholder="Set number of players"
                    className={classes.textField}
                    onChange={event => setCapacity(event.target.value)}
                  />
                </FormControl>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpen(false)} className={classes.cancel}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => setOpen(false)} 
                  type="submit" 
                  className={classes.save} 
                  disabled={loading || !capacity.trim() || !name.trim() || !game.trim()}
                >
                  Add Room
                </Button>
              </DialogActions>
            </form>
          </Dialog>
        )
      }}
    </Mutation>
    </>
  )
};

const CREATE_ROOM_MUTATION = gql `
  mutation ($capacity: String!, $name: String!, $game: String!, $url: String!, $members: String!){
    createRoom(capacity: $capacity, name: $name, game: $game, url: $url, members: $members) {
      room {
        id
        capacity
        name
        url
        game
      }
    }
  }
`

const styles = theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  dialog: {
    margin: "0 auto",
    maxWidth: 550
  },
  textField: {
    margin: theme.spacing.unit
  },
  cancel: {
    color: "red"
  },
  save: {
    color: "green"
  },
  button: {
    margin: theme.spacing.unit * 2
  },
  icon: {
    marginLeft: theme.spacing.unit
  },
  input: {
    display: "none"
  },
  fab: {
    position: "fixed",
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
    zIndex: "200"
  }
});

export default withStyles(styles)(CreateRoom);
