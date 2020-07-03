import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import ArrowForward from "@material-ui/icons/ArrowForward";
import Person from "@material-ui/icons/Person";
import { Link } from "react-router-dom";
import { getAllUsers } from "../api/user.api";
import FollowPeople from "../components/user/FindPeople.jsx";

const useStyles = makeStyles((theme) => ({
  root: theme.mixins.gutters({
    padding: theme.spacing(1),
    margin: theme.spacing(5),
  }),
  title: {
    margin: `${theme.spacing(4)}px 0 ${theme.spacing(2)}px`,
    textAlign: "center",
  },
}));

export default () => {
  const classes = useStyles();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    getAllUsers(signal).then((data) => {
      if (data && data.error) {
        console.log(data.error);
      } else {
        setUsers(data);
      }
    });

    return () => {
      abortController.abort();
    };
  }, []);

  return (
    <Grid container justify="center" alignItems="center" direction="column">
      <Grid item>
        <Typography variant="h6" className={classes.title}>
          All Flexers
        </Typography>
      </Grid>

      <Grid item>
        <FollowPeople />
      </Grid>
    </Grid>
  );
};

/**
 * <List dense>
        {users.map((item, i) => {
          return (
            <Link
              to={"/user/" + item._id}
              key={`${i}flex`}
              style={{ textDecoration: "none" }}
            >
              <ListItem button>
                <ListItemAvatar>
                  <Avatar src={`/api/users/photo/${item._id}`} />
                </ListItemAvatar>
                <ListItemText primary={item.name} />
                <ListItemSecondaryAction>
                  <IconButton>
                    <ArrowForward />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </Link>
          );
        })}
      </List>
 */
