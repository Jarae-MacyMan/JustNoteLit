import { React, useContext } from "react";
import Context from "../../context/context";
import { Link } from "react-router-dom";
import httpClient from "../../httpClient";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import { Toolbar } from "@mui/material";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const Login = (setAuth) => {
  const context = useContext(Context);
  const { username, password } = context.inputs;

  const onChange = (e) => {
    context.setInputs({ ...context.inputs, [e.target.name]: e.target.value });
  };

  const onSubmitForm = async (e) => { //logs user in
    console.log(username, password);
    e.preventDefault();
    try {
      const response = await httpClient.post("//localhost:8000/login", {

        username,
        password,

      });
      const parseRes = await response.data;
      console.log(parseRes);
      window.location.href = "/home"

      //localStorage.setItem("token", parseRes.token);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div>
      <div class="mx-auto">
        <Card sx={{ mt: 6, pt: 18, mx: 40, pb: 57 }}>
          <Grid>
            <Grid item xs={8}>
              <div>
                <label className="px-2">
                  <h3>User Name:</h3>
                </label>
                <input
                  onChange={(e) => onChange(e)}
                  value={username}
                  type="username"
                  name="username"
                  className="mb-4"
                  placeholder="Enter a username"
                />
              </div>
            </Grid>

            <Grid item xs={8}>
              <form onSubmit={onSubmitForm}>
                <label className="px-2">
                  <h3>Password: </h3>
                </label>
                <input
                  onChange={(e) => onChange(e)}
                  value={password}
                  className="p"
                  name="password"
                  placeholder="Enter password"
                />

                <div className="mt-2">
                  <Button variant="contained" type="submit">
                    {" "}
                    Login
                  </Button>
                </div>
              </form>
            </Grid>
          </Grid>

          <div className="mt-2">
                <small  >
                  Don't have an account?
                  <span> </span>
                  <Link to="/signup" >
                    Sign up
                  </Link>
                </small>
              </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
