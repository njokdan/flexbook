import React, { useState } from "react";
import { Link, withRouter } from "react-router-dom";
import auth from "../api/helpers/auth.helper";

import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import HomeIcon from "@material-ui/icons/Home";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

const useStyles = makeStyles((theme) => ({
  menuButton: {
    [theme.breakpoints.up("800")]: {
      display: "none",
    },
  },
  drawerPaper: {
    background: theme.palette.primary.main,
    color: "#ffffff",
    padding: "20px",
  },
  drawerHeaderSpacer: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "center",
  },
  drawerTextHeader: {
    textAlign: "center",
    marginTop: "10px",
  },
}));

const isActive = (history, path) => {
  if (history.location.pathname == path) return { color: "#FFBA08" };
  else return { color: "#ffffff" };
};

const MobileDrawer = withRouter(({ history }) => {
  const classes = useStyles();

  const [open, setOpen] = useState(false);

  return (
    <>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={() => setOpen(!open)}
        edge="start"
        className={classes.menuButton}
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        anchor={"left"}
        open={open}
        onClose={() => setOpen(!open)}
        classes={{ paper: classes.drawerPaper }}
      >
        <div className={classes.drawerHeader}>
          <Typography
            variant="h6"
            color="inherit"
            className={classes.drawerTextHeader}
          >
            FlexBook
          </Typography>
        </div>
        <Divider />

        {typeof window !== "undefined" && !auth.isAuthenticated() && (
          <List>
            <ListItem
              button
              key={"signup"}
              component={Link}
              to="/signup"
              onClick={() => setOpen(!open)}
            >
              <ListItemText
                primary="Signup"
                style={isActive(history, "/signup")}
              />
            </ListItem>
            <ListItem
              button
              key={"signin"}
              component={Link}
              to="/signin"
              onClick={() => setOpen(!open)}
            >
              <ListItemText
                primary="Signin"
                style={isActive(history, "/signin")}
              />
            </ListItem>
          </List>
        )}
        {typeof window !== "undefined" && auth.isAuthenticated() && (
          <List>
            <ListItem
              button
              key={"Profile"}
              component={Link}
              to={"/user/" + auth.isAuthenticated().user._id}
              onClick={() => setOpen(!open)}
            >
              <ListItemText
                primary="Profile"
                style={isActive(
                  history,
                  "/user/" + auth.isAuthenticated().user._id
                )}
              />
            </ListItem>
            <ListItem
              button
              key={"UsersList"}
              component={Link}
              to="/users"
              onClick={() => setOpen(!open)}
            >
              <ListItemText
                primary="Users List"
                style={isActive(history, "/users")}
              />
            </ListItem>
            <ListItem
              button
              key={"signout"}
              component={Link}
              to="/signout"
              onClick={() => {
                auth.clearJWT(() => {
                  history.push("/");
                  setOpen(!open);
                });
              }}
            >
              <ListItemText
                primary="Signout"
                style={isActive(history, "/signout")}
              />
            </ListItem>
          </List>
        )}
      </Drawer>
    </>
  );
});

export default MobileDrawer;
