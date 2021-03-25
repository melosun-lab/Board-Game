import React, { useEffect, useRef, useState, useContext } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import { Mutation } from "react-apollo";
import { gql } from "apollo-boost";
import List from "@material-ui/core/List";
import { UserContext} from "../../Root";
const RoomMember = ({ classes, roomdata }) => {
  console.log(roomdata)
  const currentUser = useContext(UserContext);
  console.log(currentUser.id)
  const [isDrawing, setIsDrawing] = useState(false)
  const [content, setContent] = useState("")
  const canvasRef = useRef(null)
  const contextRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = `${window.innerWidth/2}px`;
    canvas.style.height = `${window.innerHeight/2}px`;

    const context = canvas.getContext("2d")
    context.scale(2,2)
    context.lineCap = "round"
    context.strokeStyle = "black"
    context.lineWidth = 5

    context.fillStyle = "white"
    context.fillRect(0, 0, canvas.width, canvas.height)

    contextRef.current = context;
  },[])

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d")
    context.fillStyle = "white"
    context.fillRect(0, 0, canvas.width, canvas.height)
  }
  
  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };
  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
    setContent(JSON.stringify(canvasRef.current.toDataURL('image/png')));
  };
  const draw = ({ nativeEvent }) => {
    if (!isDrawing) {
      return;
    }
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };
  const restore = (drawing) => {
    if(!drawing){
      clearCanvas();
      return;
    }
    var Img = new Image();
    var current = drawing;
    if (current.substr(0,1) === '"' && current.substr(-1) === '"'){
      current = current.substr(1);
      current = current.substr(0, current.length-1);
    }
    Img.src = current;
    Img.onload = () =>{
      contextRef.current.drawImage(Img,0,0,window.innerWidth/2,window.innerHeight/2);
    }
    }

  return (
    <div>
      <div>
        <p>
          The current drawing target is: {roomdata.content}
        </p>
      </div>
      <div>
      <canvas 
    onMouseDown={startDrawing}
    onMouseUp={finishDrawing}
    onMouseMove={draw}
    ref={canvasRef}
    /></div>
      <List>
        {roomdata.members.map(member =>
          <Button key={member.id} color = "secondary" variant = "outlined"
          onClick={()=> restore(member.drawing)}
          >{member.username}</Button>
        )
        }
        <Button color = "secondary" variant = "outlined"
        onClick={()=> restore(roomdata.owner.drawing)}
        >{roomdata.owner.username}</Button>
      </List>
    <Mutation
      mutation = {UPDATE_DRAWING_MUTATION}
      variables = {{ username: currentUser.username, drawing: content}}
      onCompleted = {data => {
        console.log({ data });
      }}
      >
      {updateUser => (
      <Button  color = "secondary"
      variant = "outlined" onClick={event =>{
        event.stopPropagation();
        updateUser();
      }}>
        SAVE
      </Button>
    )}</Mutation>
    <Button color = "secondary"
      variant = "outlined" onClick={clearCanvas}>
        CLEAR
      </Button>
    </div>
  );
};

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

export default withStyles(styles)(RoomMember);

const UPDATE_DRAWING_MUTATION = gql `
  mutation ($username: String!, $drawing: String!){
    updateUser(username: $username, drawing: $drawing) {
      user {
        id
      }
    }
  }
`




