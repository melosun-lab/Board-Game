import React, { useState, useContext } from "react";
import {gql} from "apollo-boost";
import { Mutation } from "react-apollo";
import withStyles from "@material-ui/core/styles/withStyles";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";
import LibraryMusicIcon from "@material-ui/icons/LibraryMusic";
import Error from "../Shared/Error";
import Loading from "../Shared/Loading";
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { GET_ROOMS_QUERY } from "../../pages/App";
import { UserContext } from "../../Root";
const UpdateRoom = ({ classes, room }) => {
  const currentUser = useContext(UserContext)
  const [open, setOpen] = useState(false)
  const [game, setGame] = useState(room.game)
  const [name, setName] = useState(room.name)
  const [capacity, setCapacity] = useState(String(room.capacity))
  const isCurrentUser = currentUser.id === room.owner.id

  const handleSubmit = (event, updateRoom) => {
    event.preventDefault()
    const url = "game.com"
    const members = ""
    updateRoom({ variables: { roomId: room.id, capacity, name, game, url, members}})
  }
  return isCurrentUser && (
    <>
    {/*Update Room Button*/}
    <IconButton onClick={() => setOpen(true)}>
      <EditIcon />
    </IconButton>

    {/*Create Room Dialog*/}
    <Mutation 
      mutation={UPDATE_ROOM_MUTATION} 
      onCompleted={data => {
        setOpen(false)
      }}
      // refetchQueries={() => [{ query: GET_ROOMS_QUERY }]}
    >
      {(updateRoom, { loading, error }) => {
        if (loading) return <Loading />
        if (error) return <Error error={error} />
        return (
          <Dialog open={open} className={classes.dialog}>
            <form onSubmit={event => handleSubmit(event, updateRoom)}>
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
                    placeholder={name}
                    className={classes.textField}
                    onChange={event => setName(event.target.value)}
                  />
                  <TextField 
                    label="Set Capacity"
                    placeholder={capacity}
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
                  Update Room
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

const UPDATE_ROOM_MUTATION = gql`
  mutation($roomId: Int!, $game: String, $name: String, $url: String, $capacity: String) {
    updateRoom(id: $roomId, name: $name, game: $game, url: $url, capacity:$capacity) {
      room {
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
  }
});

export default withStyles(styles)(UpdateRoom);
