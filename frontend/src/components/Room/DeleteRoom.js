import React, { useContext } from "react";
import { Mutation } from "react-apollo";
import { gql } from "apollo-boost";
import IconButton from "@material-ui/core/IconButton";
import TrashIcon from "@material-ui/icons/DeleteForeverOutlined";
import { UserContext } from "../../Root";
import {GET_ROOMS_QUERY} from "../../pages/App";
const DeleteRoom = ({ room }) => {
  const currentUser = useContext(UserContext)
  const isCurrentUser = currentUser.id === room.owner.id

  return isCurrentUser && (
    <Mutation 
      mutation={DELETE_ROOM_MUTATION} 
      variables={{ id: room.id }}
      refetchQueries={() => [{query: GET_ROOMS_QUERY}]}
    >
      {deleteRoom => (
        <IconButton  onClick={deleteRoom}>
          <TrashIcon/>
        </IconButton>
      )}
    </Mutation>
  )
};

const DELETE_ROOM_MUTATION = gql`
  mutation($id: Int!) {
    deleteRoom(id: $id) {
      id
    }
  }
`

export default DeleteRoom;
