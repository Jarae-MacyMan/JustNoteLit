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

const Login = () => {
  const context = useContext(Context);
  const { username, password } = context.inputs;

  const onChange = (e) => {
    context.setInputs({ ...context.inputs, [e.target.name]: e.target.value });
  };

  const onSubmitForm = async (e) => {
    //logs user in
    console.log(username, password);
    e.preventDefault();
    try {
      const response = await httpClient.post("//localhost:8000/login", {
        username,
        password,
      });
      const parseRes = await response.data;
      console.log(parseRes);
      window.location.href = "/home";

      //localStorage.setItem("token", parseRes.token);
    } catch (error) {
      console.error(error.message);
    }
  };
  //sx={{ mt: 6, pt: 5, mx: 40, pb: 20, px:20 }}

  return (
    <div >
      <Card sx={{ mt: 20, pt: 5, mx: 60, pb: 15, px: 5 }}>
        <Grid>
          <Grid display="flex" justifyContent="center" alignItems="center">
              <Typography variant="h2" sx={{ pl: 5, ml:-6 }} >Just Note Lit</Typography>
            </Grid>
          <Grid xs display="flex" justifyContent="center" alignItems="center">
            <div>
              <label className="px-2">
                <h3>Username:</h3>
              </label>
              <TextField
                onChange={(e) => onChange(e)}
                value={username}
                type="username"
                name="username"
                className="mb-4"
                placeholder="Enter a username"
              />
            </div>
          </Grid>

          <Grid item xs={8} display="flex" justifyContent="center" alignItems="center">
            <form onSubmit={onSubmitForm}>
              <label className="px-2">
                <h3>Password: </h3>
              </label>
              <TextField
                onChange={(e) => onChange(e)}
                value={password}
                className="p"
                name="password"
                placeholder="Enter password"
              />

              <div >
                <Button variant="contained" type="submit" sx={{ my: 2, ml:7}}>
                  {" "}
                  Login
                </Button>
              </div>
            </form>
          </Grid>

          <Grid item xs={8} display="flex" justifyContent="center" alignItems="center">
            <div className="mt-2">
              <small>
                Don't have an account?
                <span> </span>
                <Link to="/signup">Sign up</Link>
              </small>
            </div>
          </Grid>
        </Grid>
      </Card>
    </div>
  );
};

export default Login;
