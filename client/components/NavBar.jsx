import React from "react";
import { Link, withRouter } from "react-router-dom";
import auth from "../api/helpers/auth.helper";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import HomeIcon from "@material-ui/icons/Home";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

import MobileDrawer from "./MobileDrawer.jsx";

const useStyles = makeStyles((theme) => ({
  MuiButton: {
    [theme.breakpoints.down("800")]: {
      display: "none",
    },
  },
}));

const isActive = (history, path) => {
  if (history.location.pathname == path) return { color: "#FFBA08" };
  else return { color: "#ffffff" };
};

const Menu = withRouter(({ history }) => {
  const classes = useStyles();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" color="inherit">
          FlexBook
        </Typography>
        <Link to="/">
          <IconButton aria-label="Home" style={isActive(history, "/")}>
            <HomeIcon />
          </IconButton>
        </Link>
        <Button
          component={Link}
          to="/users"
          style={isActive(history, "/users")}
          className={classes.MuiButton}
        >
          Users list
        </Button>
        {typeof window !== "undefined" && !auth.isAuthenticated() && (
          <span>
            <Button
              component={Link}
              to="/signup"
              style={isActive(history, "/signup")}
              className={classes.MuiButton}
            >
              Sign up
            </Button>
            <Button
              component={Link}
              to="/signin"
              style={isActive(history, "/signin")}
              className={classes.MuiButton}
            >
              Sign In
            </Button>
          </span>
        )}
        {typeof window !== "undefined" && auth.isAuthenticated() && (
          <span>
            <Button
              className={classes.MuiButton}
              component={Link}
              to={"/user/" + auth.isAuthenticated().user._id}
              style={isActive(
                history,
                "/user/" + auth.isAuthenticated().user._id
              )}
            >
              My Profile
            </Button>
            <Button
              className={classes.MuiButton}
              color="inherit"
              onClick={() => {
                auth.clearJWT(() => history.push("/"));
              }}
            >
              Sign out
            </Button>
          </span>
        )}
        <MobileDrawer />
      </Toolbar>
    </AppBar>
  );
});

export default Menu;
