import React, { useState } from "react";
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

const options = [
  { value: 'Game A', label: 'Game A' },
]
const CreateRoom = ({ classes }) => {
  const [open, setOpen] = useState(false)
  const [game, setGame] = useState("")
  return (
    <>
    {/*Create Room Button*/}
    <Button onClick={() => setOpen(true)} variant="fab" className={classes.fab} color="secondary">
      {open ? <ClearIcon/> : <AddIcon />}
    </Button>

    {/*Create Room Dialog*/}
    <Dialog open={open} className={classes.dialog}>
      <form>
        <DialogContent>
          <DialogContentText>
            Add a Room
          </DialogContentText>
          <FormControl fullWidth>
            {/* <TextField 
              label="Game"
              placeholder="Choose a game"
              onChange={event => setGame(event.target.value)}
              className={classes.textField}
            /> */}
            <InputLabel id="game-select-label">Game</InputLabel>
            <Select
              labelId="game-select-label"
              id="game-select"
              value={game}
              onChange={(event) => setGame(event.target.value)}
            >
              <MenuItem value={"GameA"}>Game A</MenuItem>
            </Select>
            {console.log(game)}
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} className={classes.cancel}>
            Cancel
          </Button>
          <Button type="submit" className={classes.save} >
            Add Room
          </Button>
        </DialogActions>
      </form>
    </Dialog>
    </>
  )
};

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
