import Context from "../../context/context";
import { useContext, useState } from "react";
import * as React from 'react';
import { Link } from "react-router-dom";
import httpClient from "../../httpClient";




import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Grid from '@mui/material/Grid';
import Modal from '@mui/material/Modal';
import Button from "@mui/material/Button";



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


const NotesFormat = (props) => {
  const { body, note_id, username, title, date} = props;
  const context = useContext(Context);
  const { editTitle, editBody } = context.editNote;



  //edit note modal
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);



  
    //delete note
  const deletePost = async (e) => { 
    e.preventDefault();
    try {
        const response = await httpClient.delete(`//localhost:8000/note/delete/${note_id}`);
        const parseRes = await response.data;
        console.log(parseRes)
        
    } catch (error) {
      console.error(error);
    }
  };


    const onChange = (x) => { //for edit note inputs
        context.setEditNote({ ...context.editNote, [x.target.name]: x.target.value });
    };


    const onSubmitForm = async (e) => {   //edit note
        console.log(editTitle, editBody);
        e.preventDefault();
        let title = editTitle
        let body = editBody
        

        try {
            const response = await httpClient.patch(`//localhost:8000/note/edit/${note_id}`, {
                title,
                body,
            });

        const parseRes = await response.data;
        console.log(parseRes);
        

        } catch (error) {
        console.error(error);
        }

        handleClose() //close modal after submit

        // context.setEditNote({
        //     title: "",
        //     body: ""
        // }) //reset modal textfeild

    };





  return (
    <div className="m-2">
    
        <Card variant="outlined" sx={{ maxWidth: 400 }} className="mx-auto pb-2 "  >

        {/* <Grid container spacing={2} className="p-4"> */}



        {/* <Grid xs={9}> */}
          <Box className="ps-4 ms-5" >{title}</Box>
        {/* </Grid> */}

        {/* <Grid xs={9}> */}
          <Box className="ps-4 ms-5" >{body}</Box>
        {/* </Grid> */}

        {/* </Grid> */}

       

        <div >
          <button onClick={(e) => deletePost(e)} > delete</button>
        </div>

        <div >
          <button onClick={handleOpen} > update </button>
        </div>



        <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="Edit Note"
            >
              <Box sx={style}>
              
              
              <input
                  onChange={(x) => onChange(x)}
                  //value={title}
                  name="editTitle"
                  className="mb-4"
                  placeholder="Enter a new title"
                />

                <form onSubmit={onSubmitForm}>
                <input
                  onChange={(x) => onChange(x)}
                  //value={body}
                  name="editBody"
                  placeholder="Enter a new note"
                />
               
                <Button variant="contained" type="submit"  > {" "} Update Note </Button>

                <Button variant="contained" onClick={handleClose}  > {" "} Cancel </Button>

              </form>
              </Box>
            </Modal>

        </Card>
    </div>
    
  );
};

export default NotesFormat;
