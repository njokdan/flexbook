import React from "react";
import { Route, Switch } from "react-router-dom";
import styled from "styled-components";
import PrivateRoute from "./components/PrivateRoute";
import Signin from "./screens/Signin.screen.jsx";
import Signup from "./screens/Signup.screen.jsx";
import Home from "./screens/Home.screen.jsx";
import Users from "./screens/Users.screen.jsx";
import EditProfile from "./screens/EditProfile.screen.jsx";
import Profile from "./screens/Profile.screen.jsx";
import Navbar from "./components/NavBar/NavBar.jsx";

const MainDiv = styled.div`
  font-family: sans-serif;
  font-size: 1.5em;
  color: white;
  background: rgb(0, 48, 73);
  background: linear-gradient(
    90deg,
    rgba(0, 48, 73, 1) 22%,
    rgba(0, 40, 61, 1) 63%
  );
  border-radius: 7px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  text-align: center;
`;

const MainRouter = () => {
  return (
    <MainDiv>
      <Navbar />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/signup" component={Signup} />
        <Route path="/signin" component={Signin} />
        <Route path="/users" component={Users} />
        <Route exact path="/user/:userId" component={Profile} />
        <PrivateRoute exact path="/user/edit/:userId" component={EditProfile} />
      </Switch>
    </MainDiv>
  );
};

export default MainRouter;
