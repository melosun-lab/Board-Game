import React, { useState, useEffect } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { Mutation } from 'react-apollo';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import FormControl from "@material-ui/core/FormControl";
import { FormHelperText } from '@material-ui/core';
import Paper from "@material-ui/core/Paper";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment"
import IconButton from "@material-ui/core/IconButton"
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import Gavel from "@material-ui/icons/Gavel";
import VerifiedUserTwoTone from "@material-ui/icons/VerifiedUserTwoTone";
import Visibility  from "@material-ui/icons/Visibility"
import VisibilityOff from "@material-ui/icons/VisibilityOff"
// import { create } from "jss";
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
  const [email, setEmail] = useState("")
  const [validatePassword, setValidatePassword] = useState("")
  const [open, setOpen] = useState(false)
  const [passwordErr, setPasswordErr] = useState(false)

  const [usernameExist, setUsernameExist] = useState(false)
  const [checkUsername, setCheckUsername] = useState(false)
  const [showPassword, setShowPassWord] = useState(false)
  const [showValidatePassword, setShowValidatePassword] = useState(false)
  const [confirmEmail, setConfirmEmail] = useState(false)
  const [checkEmail, setCheckEmail] = useState(false)
  const [emailExist, setEmailExist] = useState(false)
  const [emailErrText, setEmailErrText] = useState("")
  const [emailErr, setEmailErr] = useState(false)

  const handleSubmit = (event, createUser) => {
    event.preventDefault()
    createUser()
  }

  const handleConfirmEmail = (event, confirmUser) => {
    event.preventDefault()
    confirmUser()
  }

  const handleValidateUsername = (event) => {
    setCheckUsername(true)
    setUsername(event.target.value)
  }

  const handleValidateEmail = (event) => {
    setConfirmEmail(false)
    let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (!event.target.value || re.test(event.target.value)){
      setEmail(event.target.value)
      setEmailErr(false)
      setEmailErrText("")
    }
    else{
      setEmailErr(true)
      setEmailErrText("This is not a valid email address")
    }
  }

  useEffect(()=>{
    if (email) {
      setCheckEmail(true)
    }
  }, [email])

  const handleValidatePassword = (event) => {

    if(event.target.id === "validatePassword"){
      setValidatePassword(event.target.value)
      if (event.target.value !== password && !passwordErr){
        setPasswordErr(true)
      }
      if (event.target.value === password || event.target.value === ""){
        setPasswordErr(false)
      }
    }
    else{ // password
      setPassword(event.target.value)
      if (validatePassword !== "" && event.target.value !== validatePassword && !passwordErr){
        setPasswordErr(true)
      }
      if (event.target.value === validatePassword){
        setPasswordErr(false)
      }
    }
  }
  
  const handleClickShowPassword = () =>{
    setShowPassWord(!showPassword)
  }
  const handleClickShowValidatePassword = () =>{
    setShowValidatePassword(!showValidatePassword)
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
      <Typography>
        Register
      </Typography>
      <Mutation 
        mutation = {REGISTER_MUTATION} 
        variables={{ username, nickname, password, email }} 
        onCompleted={data => {
          console.log({ data })
          setOpen(true)
        }}
      >
        {(createUser, { loading, error }) => {
          return(
            <form onSubmit={event => handleSubmit(event, createUser)} className = {classes.form}>
              <FormControl error={usernameExist} margin = "normal" required fullWidth>
                <InputLabel htmlFor = "username">
                  Username
                </InputLabel>
                <Input id = "username" onBlur = {event => handleValidateUsername(event)}/>
                {checkUsername && <Query query={USERNAME_QUERY} variables={{ username: username }}>
                  {({ data, loading, error }) => {
                      if (loading) return <div>Loading</div>
                      if (error) return <div>Error occurs when checking whether username exists</div>
                      setCheckUsername(false)
                      setUsernameExist(data.existUsername)
                      return (null)
                    }}
                  </Query>} 
                {usernameExist && <FormHelperText error>{"Username already exist"}</FormHelperText>}
              </FormControl>
              <FormControl error={emailErr} margin = "normal" required fullWidth>
                <InputLabel htmlFor = "email">
                  Email
                </InputLabel>
                <Input id = "email" onBlur = {event => handleValidateEmail(event)}/>
                {checkEmail && <Query query={EMAIL_EXIST_QUERY} variables={{ email: email }}>
                  {({ data, loading, error }) => {
                      if (loading) return <div>Loading</div>
                      if (error) return <div>Error occurs when checking whether email exists</div>
                      setCheckEmail(false)
                      setEmailErr(false)
                      setEmailErrText("")
                      setConfirmEmail(false)
                      setEmailExist(data.existEmail)
                      return (null)
                    }}
                  </Query>}
                {emailExist && <Query query={CONFIRM_QUERY} variables={{ email: email }}>
                  {({ data, loading, error }) => {
                      if (loading) return <div>Loading</div>
                      if (error) return <div>Error occurs when checking whether email is activated</div>
                      console.log(data)
                      setEmailExist(false)
                      setEmailErr(true)
                      if (data.confirm) {
                        setEmailErrText("Account exists, please click the login button.")
                      }
                      else{
                        setConfirmEmail(true)
                      }
                      return (null)
                    }}
                  </Query>}
                {emailErr && <FormHelperText error>{emailErrText}</FormHelperText>}
                {confirmEmail && <Mutation mutation = {SEND_EMAIL_MUTATION} variables={{email }} onError = {data => {
                  setEmailErrText("Sending email verification occurs error.")}}>
                {(confirmUser) => {return <Button onClick={(event) => handleConfirmEmail(event, confirmUser)} color = "secondary" variant = "outlined">Account already registered, Click here to send out activation email</Button>}}</Mutation>}
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
                <Input id = "password" type = {showPassword ? "text" : "password"} onBlur = {event => handleValidatePassword(event)} endAdornment = 
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
              <FormControl error={passwordErr} margin = "normal" required fullWidth>
                <InputLabel htmlFor = "validatePassword">
                  Confirm Password
                </InputLabel>
                <Input id = "validatePassword" type = {showValidatePassword ? "text" : "password"} onBlur = {event => handleValidatePassword(event)} endAdornment = 
              {
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowValidatePassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showValidatePassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }/>
                {passwordErr && <FormHelperText error>{"Password not the same"}</FormHelperText>}
              </FormControl>
              <Button
                type = "submit"
                fullWidth
                variant = "contained"
                color = "secondary"
                onClick = {() => {
                  nickname === "" && setNickname(GetRandomName)
                }}
                disabled={loading || !username.trim() || !password.trim() || (password !== validatePassword) || usernameExist || emailErr}
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
            Confirmation email sent to {email}, please check your mailbox and activate your accont!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
        <Mutation mutation = {SEND_EMAIL_MUTATION} variables={{email }}>
                {(confirmUser) => {return <Button onClick={(event) => handleConfirmEmail(event, confirmUser)} onError = {data => {
                  setOpen(false)}} color = "secondary" variant = "outlined">Send Again</Button>}}</Mutation>
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

const SEND_EMAIL_MUTATION = gql`
mutation ($email:String!){
  confirmUser(email:$email){
    success
  }
}
`

const USERNAME_QUERY = gql`
query ($username: String!){
  existUsername(username: $username)
}
`

const EMAIL_EXIST_QUERY = gql`
query ($email: String!){
  existEmail(email: $email)
}
`

const CONFIRM_QUERY = gql`
query ($email: String!){
  confirm(email: $email)
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