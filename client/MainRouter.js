import React from "react";
import { Route, Switch } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Signin from "./screens/Signin.screen.jsx";
import Signup from "./screens/Signup.screen.jsx";
import Home from "./screens/Home.screen.jsx";
import Users from "./screens/Users.screen.jsx";
import EditProfile from "./screens/EditProfile.screen.jsx";
import Profile from "./screens/Profile.screen.jsx";
import Navbar from "./components/NavBar/NavBar.jsx";

const MainRouter = () => {
  return (
    <>
      <Navbar />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/signup" component={Signup} />
        <Route path="/signin" component={Signin} />
        <Route path="/users" component={Users} />
        <Route exact path="/user/:userId" component={Profile} />
        <PrivateRoute exact path="/user/edit/:userId" component={EditProfile} />
      </Switch>
    </>
  );
};

export default MainRouter;
