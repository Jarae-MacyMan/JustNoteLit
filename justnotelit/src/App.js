import { React, useState, useEffect, useContext } from "react";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./components/home/Home";
import Login from "./components/login/Login";
import Signup from "./components/signup/Signup";
// import Notes from "./components/notes/Note";


function App() {
  
  
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            exact
            path="/login"
            element={
                <Login/>
            }
           
          />

          <Route
            exact
            path="/signup"
            element={
              <Signup/>
            }
            
          />

          <Route
            exact
            path="/home"
            element={
              <Home/>
            }
            
          />
          
          <Route
            exact
            path="/:username"
            
          /> 
        </Routes>
      </Router>
    </div>
  );
}

export default App;
