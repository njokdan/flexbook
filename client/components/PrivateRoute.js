import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import auth from "../api/helpers/auth.helper";

/* 
Components to be rendered using PrivateRoute will only load when the user is authenticated, 
which is determined by a call to the isAuthenticated method from 'auth'.
Otherwise, the user will be redirected to the Signin component. 
*/
const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      auth.isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/signin",
            state: { from: props.location },
          }}
        />
      )
    }
  />
);
export default PrivateRoute;
