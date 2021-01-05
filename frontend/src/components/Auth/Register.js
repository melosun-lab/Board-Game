import React, { useState } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { Mutation } from 'react-apollo';
import { gql } from 'apollo-boost';
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import FormControl from "@material-ui/core/FormControl";
import Paper from "@material-ui/core/Paper";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import Gavel from "@material-ui/icons/Gavel";
import VerifiedUserTwoTone from "@material-ui/icons/VerifiedUserTwoTone";
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import { create } from "jss";
import Error from "../Shared/Error"

function Transition(props) {
  return <Slide direction="up" {...props} />
}

function GetRandomName() {
  const first = firstNickname[Math.floor(Math.random() * firstNickname.length)]
  const last = lastNickName[Math.floor(Math.random() * lastNickName.length)]
  return first+last
}

const Register = ({ classes, setNewUser }) => {
  const [username, setUsername] = useState("")
  const [nickname, setNickname] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [email, setEmail] = useState("")
  const [open, setOpen] = useState(false)
  const [showPassword, setShowPassWord] =  useState(false)
  const [showConfirm, setShowConfirm] =  useState(false)

  const handleSubmit = (event, createUser) => {
    event.preventDefault()
    createUser()
  }
  const handleClickShowPassword = () =>{
    setShowPassWord(!showPassword)
  }
  const handleClickShowConfirm = () =>{
    setShowConfirm(!showConfirm)
  }
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  
  return (
  <div className = {classes.root}>
    <Paper className = {classes.paper}>
      <Avatar className = {classes.avatar}>
        <Gavel />
      </Avatar>  
      <Typography variant = "headline">
        Register
      </Typography>
      <Mutation 
        mutation = {REGISTER_MUTATION} 
        variables={{ username, nickname, password, email}} 
        onCompleted={data => {
          
          if (confirm === password)
            setOpen(true)
        }}
      >
        {(createUser, { loading, error }) => {
          return(
            <form onSubmit={event => handleSubmit(event, createUser)} className = {classes.form}>
              <FormControl margin = "normal" required fullWidth>
                <InputLabel htmlFor = "username">
                  Username
                </InputLabel>
                <Input id = "username" onChange = {event => setUsername(event.target.value)}/>
              </FormControl>
              <FormControl margin = "normal" required fullWidth>
                <InputLabel htmlFor = "email">
                  Email
                </InputLabel>
                <Input id = "email" onChange = {event => setEmail(event.target.value)}/>
              </FormControl>
              <FormControl margin = "normal" fullWidth>
                <InputLabel htmlFor = "nickname">
                  Nickname
                </InputLabel>
                <Input id = "nickname" onChange = {event => setNickname(event.target.value)}/>
              </FormControl>
              <FormControl margin = "normal" required fullWidth>
                <InputLabel htmlFor = "password">
                  Password
                </InputLabel>
                <Input id = "password" type ={showPassword ? "text" : "password"} onChange = {event => setPassword(event.target.value)} endAdornment = 
                {
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }/>
              </FormControl>
              <FormControl margin = "normal" required fullWidth>
                <InputLabel htmlFor = "confirm">
                  Confirm
                </InputLabel>
                <Input id = "confirm" type ={showConfirm ? "text" : "password"} onChange = {event => setConfirm(event.target.value)} endAdornment = 
                {
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowConfirm}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showConfirm ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }/>
              </FormControl>
              <Button
                type = "submit"
                fullWidth
                variant = "contained"
                color = "secondary"
                onClick = {() => {
                  nickname === "" && setNickname(GetRandomName)
                }}
                disabled={loading || !username.trim() || !password.trim()}
                className = {classes.submit}>
                  {loading ? "Registering..." : "Register"}
              </Button>
              <Button
                onClick={() => setNewUser(false)}
                color = "primary"
                variant = "outlined"
                fullWidth
              >
                Previous user? Log in here
              </Button>
              {/* Error Handling */}
              {error && <Error error={error}/>}
            </form>
          )
        }}
      </Mutation> 
    </Paper>

      {/* Success Dialog */}
      < Dialog
        open={open}
        disableBackdropClick={true}
        TransitionComponent={Transition}
      >
        <DialogTitle>
          <VerifiedUserTwoTone className={classes.icon} />
          New Account
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            User {username} successfully created!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="primary" variant="contained" onClick={() => setNewUser(false)}>
            Login
          </Button>
        </DialogActions>
      </Dialog>
    </div>
    );
};

const REGISTER_MUTATION = gql`
mutation ($username: String!, $nickname: String!, $password:String!, $email:String!){
  createUser(username:$username, nickname:$nickname, password:$password, email:$email){
    user{
      username
      nickname
		}
  }
}
`

const styles = theme => ({
  root: {
    width: "auto",
    display: "block",
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up("md")]: {
      width: 400,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing.unit * 2
  },
  title: {
    marginTop: theme.spacing.unit * 2,
    color: theme.palette.openTitle
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%",
    marginTop: theme.spacing.unit
  },
  submit: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2
  },
  icon: {
    padding: "0px 2px 2px 0px",
    verticalAlign: "middle",
    color: "green"
  }
});

export default withStyles(styles)(Register);


const firstNickname = [
  "admirer",
  "arm",
  "axe",
  "back",
  "bane",
  "baker",
  "basher",
  "beard",
  "bearer",
  "bender",
  "blade",
  "bleeder",
  "blender",
  "blood",
  "boiler",
  "bone",
  "boot",
  "borer",
  "born",
  "bow",
  "breaker",
  "breeder",
  "bringer",
  "brow",
  "builder",
  "chaser",
  "chiller",
  "collar",
  "counter",
  "curser",
  "dancer",
  "deck",
  "dottir",
  "doubter",
  "dreamer",
  "drinker",
  "drowner",
  "ear",
  "eater",
  "face",
  "fearer",
  "friend",
  "foot",
  "fury",
  "gorer",
  "grim",
  "grinder",
  "grower",
  "growth",
  "hacker",
  "hall",
  "hammer",
  "hand",
  "hands",
  "head",
  "hilt",
  "hugger",
  "hunter",
  "killer",
  "leg",
  "licker",
  "liker",
  "lost",
  "lover",
  "maker",
  "mender",
  "minder",
  "miner",
  "mocker",
  "monger",
  "neck",
  "puncher",
  "rage",
  "rhyme",
  "rider",
  "ringer",
  "roarer",
  "roller",
  "sailor",
  "screamer",
  "sequel",
  "server",
  "shield",
  "shoe",
  "singer",
  "skinner",
  "slinger",
  "slugger",
  "sniffer",
  "son",
  "smasher",
  "speaker",
  "stinker",
  "sucker",
  "sword",
  "tail",
  "tamer",
  "taster",
  "thigh",
  "tongue",
  "tosser",
  "tracker",
  "washer",
  "wielder",
  "wing",
  "wisher",
  "wrath"
]

const lastNickName = [
  "Aesir",
  "Axe",
  "Battle",
  "Bear",
  "Berg",
  "Biscuit",
  "Black",
  "Blade",
  "Blood",
  "Blue",
  "Boar",
  "Board",
  "Bone",
  "Cage",
  "Cave",
  "Chain",
  "Cloud",
  "Coffee",
  "Code",
  "Death",
  "Dragon",
  "Dwarf",
  "Eel",
  "Egg",
  "Elk",
  "Fire",
  "Fjord",
  "Flame",
  "Flour",
  "Forge",
  "Fork",
  "Fox",
  "Frost",
  "Furnace",
  "Cheese",
  "Giant",
  "Glacier",
  "Goat",
  "God",
  "Gold",
  "Granite",
  "Griffon",
  "Grim",
  "Haggis",
  "Hall",
  "Hamarr",
  "Helm",
  "Horn",
  "Horse",
  "House",
  "Huskarl",
  "Ice",
  "Iceberg",
  "Icicle",
  "Iron",
  "Jarl",
  "Kelp",
  "Kettle",
  "Kraken",
  "Lake",
  "Light",
  "Long",
  "Mace",
  "Mead",
  "Maelstrom",
  "Mail",
  "Mammoth",
  "Man",
  "Many",
  "Mountain",
  "Mutton",
  "Noun",
  "Oath",
  "One",
  "Owl",
  "Pain",
  "Peak",
  "Pine",
  "Pot",
  "Rabbit",
  "Rat",
  "Raven",
  "Red",
  "Refreshingbeverage",
  "Ring",
  "Rime",
  "Rock",
  "Root",
  "Rune",
  "Salmon",
  "Sap",
  "Sea",
  "Seven",
  "Shield",
  "Ship",
  "Silver",
  "Sky",
  "Slush",
  "Smoke",
  "Snow",
  "Spear",
  "Squid",
  "Steam",
  "Stone",
  "Storm",
  "Swine",
  "Sword",
  "Three",
  "Tongue",
  "Torch",
  "Troll",
  "Two",
  "Ulfsark",
  "Umlaut",
  "Unsightly",
  "Valkyrie",
  "Wave",
  "White",
  "Wolf",
  "Woman",
  "Worm",
  "Wyvern"
]