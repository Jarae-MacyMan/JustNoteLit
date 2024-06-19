import { useState } from "react";
import Context from "./context";
import * as React from "react";
import { User } from "../userProfile";

let arr = [];

const ContextProvider = ({ children }) => {
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });

  const [userNotes, setUserNotes] = useState([]);

  const [note, setNote] = useState(""); //constrolled state

  const [newNote, setNewNote] = useState({
    title: "",
    body: ""
  });

  const [value, setValue] = React.useState("");

  const [editNote, setEditNote] = useState({
    editTitle: "",
    editBody: ""
  });

  const [deleteNote, setDeleteNote] = useState(false);

  const [user, setUser] = useState("");



  const state = {
    inputs,
    setInputs,
    userNotes,
    setUserNotes,
    note,
    setNote,
    newNote,
    setNewNote,
    value,
    setValue,
    editNote,
    setEditNote,
    deleteNote,
    setDeleteNote,
    user,
    setUser
  };

  return <Context.Provider value={state}>{children}</Context.Provider>;
};

export default ContextProvider;
