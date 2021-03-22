import React, { useEffect, useRef, useState } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import { Mutation } from "react-apollo";
import { gql } from "apollo-boost";
import { Query } from 'react-apollo';

const RoomMember = ({ classes, roomid }) => {
  console.log(roomid)
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
    contextRef.current = context;
  },[])
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
  const send = () => {
    var dataImg = canvasRef.current.toDataURL('image/png');
    console.log(JSON.stringify(dataImg));
  }
  const restore = (data) => {
    if(!data.roomid.content){
      return;
    }
    var Img = new Image();
    var current = data.roomid.content;
    if (current.substr(0,1) === '"' && current.substr(-1) === '"'){
      current = current.substr(1);
      current = current.substr(0, current.length-1);
    }
    Img.src = current;
    contextRef.current.drawImage(Img,0,0,window.innerWidth/2,window.innerHeight/2);
  }

  return (
    <div>
      <canvas 
    onMouseDown={startDrawing}
    onMouseUp={finishDrawing}
    onMouseMove={draw}
    ref={canvasRef}
    />
    <Mutation
      mutation = {UPDATE_CONTENT_MUTATION}
      variables = {{ id: roomid, content: content}}
      onCompleted = {data => {
        console.log({ data });
      }}
      >
      {updateRoom => (
      <Button  color = "secondary"
      variant = "outlined" onClick={event =>{
        event.stopPropagation();
        updateRoom();
      }}>
        SAVE
      </Button>
    )}</Mutation>
    <Query query={ROOM_CONTENT_QUERY} variables={{ id: roomid }} pollInterval={1000} >
    {({ data, loading, error}) => {
        return <Button
          color = "secondary"
          variant = "outlined"
          onClick = {() => restore(data)}
          >Restore</Button>
    }}
  </Query>
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

const UPDATE_CONTENT_MUTATION = gql `
  mutation ($id: Int!, $content: String!){
    updateRoom(id: $id, content: $content) {
      room {
        id
      }
    }
  }
`

const ROOM_CONTENT_QUERY = gql`
query ($id: Int!){
  roomid(id: $id){
      id
      content
  }
}
`




