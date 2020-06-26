import React from "react";
import { Route, Switch } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Signin from "./screens/Signin.screen.jsx";
import Signup from "./screens/Signup.screen.jsx";
import Users from "./screens/Users.screen.jsx";
import EditProfile from "./components/user/EditProfile.jsx";
import Profile from "./screens/Profile.screen.jsx";
import Navbar from "./components/NavBar.jsx";
import Home from "./screens/Home.screen.jsx";

const MainRouter = () => {
  return (
    <>
      <Navbar />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/signin" component={Signin} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/users" component={Users} />
        <PrivateRoute path="/user/edit/:userId" component={EditProfile} />
        <Route path="/user/:userId" component={Profile} />
      </Switch>
    </>
  );
};

export default MainRouter;
