
import Context from "../../context/context";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import httpClient from "../../httpClient.js";
import Notes from "../notes/Notes.js";


import * as React from "react";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Modal from '@mui/material/Modal';

const style = { //modal style
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const Home = (props) => {
  const context = useContext(Context);
  const { title, body } = context.newNote;

  //new note modal
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);



  const getNotes = async (e) => { //dispaly notes
    try {
        const response = await httpClient.get("//localhost:8000/notes");
         
        const parseRes = await response.data;

        context.setUserNotes(parseRes.notes.reverse());

        console.log(context.userNotes);

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(
    () => {
      getNotes();
    },
    [context.userNotes] //context.userNotes
  );

  const onChange = (e) => { //for create note inpute
    context.setNewNote({ ...context.newNote, [e.target.name]: e.target.value });
  };

  const onSubmitForm = async (e) => { //new note 
    console.log(title, body);
    e.preventDefault();

    try {
        const response = await httpClient.post("//localhost:8000/notes/new", {
            title,
            body,
          });

      const parseRes = await response.data;
      console.log(parseRes);
      

    } catch (error) {
      console.error(error);
    }

    handleClose() //close modal after submit

    // context.setNewNote({
    //     title: "",
    //     body: ""
    //   }) //reset modal textfeild

  };



  const logoutUser = async () => { //logs user out
    await httpClient.post("//localhost:8000/logout");
    window.location.href = "/login";
  };


  useEffect(() => { //checks if user is logged 
    (async () => {
      try {
        const response = await httpClient.get("//localhost:8000/@me");

        const parseRes = await response.data;
        console.log(parseRes.username);
        context.setUser(parseRes.username)
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);





  return (
    <div>
        <Box display="flex" justifyContent="center" alignItems="center">
          <Typography variant="h2"  >Welcome {context.user} make a note!</Typography>
        </Box>



      <Button sx={{ml: 5, mt: -7}}onClick={handleOpen} type="button" variant="contained" className="btn btn-dark btn-sm">Create Note</Button>


            <Button sx={{ml:140, mb: 10}} variant="contained" onClick={logoutUser}> Logout </Button>


        <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
              
              
              <input
                  onChange={(e) => onChange(e)}
                  type="title"
                  name="title"
                  className="mb-4"
                  placeholder="Enter a title"
                />

                <form onSubmit={onSubmitForm}>
                <input
                  onChange={(e) => onChange(e)}
                 
                  className="p"
                  name="body"
                  placeholder="Enter body"
                />
               
                <Button variant="contained" type="submit"  > {" "} Create Note </Button>

              </form>
              </Box>
            </Modal>



          <Grid>
            <Notes/>
          </Grid>
        

        

    </div>
  );
};

export default Home;
