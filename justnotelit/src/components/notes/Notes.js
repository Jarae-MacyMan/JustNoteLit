import React from "react";
import { useContext } from "react";
import Context from "../../context/context";
import NotesFormat from "./NotesFormat.js";


const UserNotes = (props) => {
  const context = useContext(Context);
  const userNotes = context.userNotes.map((element) => {
        return (
            <NotesFormat
                key = {element.id}
                note_id = {element.note_id}
                title = {element.title}
                body = {element.body}
                createdAt = {element.createdAt}
                //UpdatedAt = {element.updated_at}
            />
        );
    });

    //console.log(id)

    return (
        <div> 
            {userNotes} 
        </div>
    )
};

export default UserNotes;