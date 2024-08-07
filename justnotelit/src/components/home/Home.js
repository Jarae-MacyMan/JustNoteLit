
import Context from "../../context/context";
import { useContext, useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import httpClient from "../../httpClient.js";
import Notes from "../notes/Notes.js";
import { useLocation, useNavigate } from "react-router-dom";



import * as React from "react";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Modal from '@mui/material/Modal';


//dropdown
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';


const style = { //modal style
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    borderRadius: 4,
    boxShadow: 24,
    px: 15,
    pb: 5,
    pt: 10
};

//dropdown         0                   1
const options = ['Sort By: Oldest', 'Sort By: Newest'];


const Home = (props) => {
  const context = useContext(Context);
  const { title, body } = context.newNote;

  //const [word, setword] = ("")
  // const [searchedInput, setSearchedInput] = useState({
  //   search: ""
  // });

  //new note modal
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  //dropdown menu
  const [openDropdown, setOpenDropdown] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  console.log(context.sortOldest);

  //search
  //const { search } = context.setSearchedInput;

  

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    
    if (index == 0 && (context.userNotes[0].note_id > context.userNotes[1].note_id)) {
      context.setSortOldest(true)
    } else if (index == 1 && (context.userNotes[1].note_id > context.userNotes[0].note_id)) {
      context.setSortOldest(false)
    }
    
    setOpenDropdown(false);
    
  };

  const handleToggle = () => {
    setOpenDropdown((prevOpen) => !prevOpen);
  };

  const handleCloseD = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpenDropdown(false);
  };

  

  const getNotes = async (e) => { //dispaly notes
    try {
        const response = await httpClient.get("//localhost:8000/notes"); //fetch request URL
         
        const parseRes = await response.data; //get object from response

        if(context.sortOldest == true){ //sortOldest function determines how notes are displayed
          context.setUserNotes(parseRes.notes);
        } else {
          context.setUserNotes(parseRes.notes.reverse());
        }

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
      if (error.response.status == 400) {
        alert(error.response.data.error);
      }
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

  const onChangeSearch = (input) => { //for create note inpute
    context.setSearch(input.target.value);

  };


// //justify end/btw
console.log(context.search);

  let input = context.search


  const navigate = useNavigate();

  //search Func
  const onSearch = (e) => { //new note 
    e.preventDefault();
    //console.log(context.search);
    navigate("/search")
    //window.location.href = "/searchedNotePage"
   
  }



  return (
    <div>
        <Box display="flex" justifyContent="center" alignItems="center">
          <Typography variant="h2" sx={{ pt:3}} >Welcome {context.user} make a note!</Typography>
        </Box>



     

    <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          
          bgcolor: 'background.paper',
          borderRadius: 1,
          my:5
        }}
      > 
      <Button sx={{ ml:3, my:2}}  onClick={handleOpen} type="button" variant="contained" className="btn btn-dark btn-sm" >Create Note</Button>

        



        {/* dropdown code */}
      <Box sx={{ mt: 2}}>
            <React.Fragment>
      <ButtonGroup
        variant="contained"
        ref={anchorRef}
        aria-label="Button group with a nested menu"
      >
        <Button >{options[selectedIndex]}</Button>
        <Button
          size="small"
          aria-controls={openDropdown ? 'split-button-menu' : undefined}
          aria-expanded={openDropdown ? 'true' : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
          onClick={handleToggle}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper
        sx={{
          zIndex: 1,
        }}
        open={openDropdown}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  {options.map((option, index) => (
                    <MenuItem
                      key={option}
                      
                      selected={index === selectedIndex}
                      onClick={(event) => handleMenuItemClick(event, index)}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </React.Fragment>

    </Box>

        {/* search */}
    <form onSubmit={onSearch}>
      <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          bgcolor: 'background.paper',
          borderRadius: 1,
          bgcolor: 'background.paper',
          
        }}>

              <label className="px-2">
              </label>
              <TextField
                size="small"
                // value={input}
                onChange={(input) => onChangeSearch(input)}
                // className="p"
                 name="input"
                placeholder="Search Note Title"
                sx={{ mx:2, mt: 2}}
              />

              <div >
                <Button variant="contained" type="submit" sx={{ mt: 2, ml:1, py:1 }}>
                  {" "}
                  Search
                </Button>
              </div>
              </Box>
            </form>

        <Button  variant="contained" sx={{ my: 2, mr:3 }} onClick={logoutUser}> Logout </Button>


      </Box>

    





           

        <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
              
              <form onSubmit={onSubmitForm}>
              <TextField fullWidth
                  onChange={(e) => onChange(e)}
                  type="title"
                  name="title"
                  className="mb-4"
                  placeholder="Enter a title"
                />

               
                <TextField fullWidth sx={{pt: 3}}
                  onChange={(e) => onChange(e)}
                  className="p"
                  name="body"
                  placeholder="Enter your note"
                  multiline
                  rows={4}
                />

              <Box sx={{pt: 6}}>
                <Grid container  columnSpacing={2}  >
                  <Grid sx={{ml: 2 }}>
                  <Button  variant="contained" type="submit"  > {" "} Create Note </Button>
                  </Grid >
                
                  <Grid  sx={{ml: 30 }}  >
                  <Button  sx={{px: 4 }} variant="contained" onClick={handleClose} color="error" > {" "} Cancel </Button>
                  </Grid>
                </Grid>
                </Box>
               
                

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
