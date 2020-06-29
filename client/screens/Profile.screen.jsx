import React, { useState, useEffect } from "react";
import { Redirect, Link } from "react-router-dom";

import auth from "../api/helpers/auth.helper";
import { readUserProfile } from "../api/user.api";
import { listPostsByUser } from "../api/post.api";

import DeleteProfile from "../components/user/DeleteProfile.jsx";
import FollowProfileButton from "../components/user/FollowProfileButton.jsx";
import ProfileTabs from "../components/user/ProfileTabs.jsx";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Edit from "@material-ui/icons/Edit";
import Divider from "@material-ui/core/Divider";

const useStyles = makeStyles((theme) => ({
  root: theme.mixins.gutters({
    maxWidth: 600,
    margin: "auto",
    padding: theme.spacing(3),
    marginTop: theme.spacing(5),
  }),
  title: {
    margin: `${theme.spacing(2)}px ${theme.spacing(1)}px 0`,
    fontSize: "1em",
  },
  bigAvatar: {
    width: 60,
    height: 60,
    margin: 10,
  },
}));

export default function Profile({ match }) {
  const classes = useStyles();
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [following, setFollowing] = useState(false);
  const [redirectToSignin, setRedirectToSignin] = useState(false);

  const jwt = auth.isAuthenticated();

  const checkFollow = (user) => {
    const match = user.followers.some((follower) => {
      return follower._id == jwt.user._id;
    });
    return match;
  };

  const clickFollowButton = (callApi) => {
    callApi(
      {
        userId: jwt.user._id,
      },
      {
        t: jwt.token,
      },
      user._id
    ).then((data) => {
      if (data.error) {
        setUser({ ...user, error: data.error });
      } else {
        setFollowing(!following);
      }
    });
  };

  let photoUrl = user._id
    ? `/api/users/photo/${user._id}`
    : "/api/users/defaultphoto";

  const loadPosts = (user) => {
    listPostsByUser(
      {
        userId: user,
      },
      {
        t: jwt.token,
      }
    ).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setPosts(data);
      }
    });
  };

  const removePost = (post) => {
    const updatedPosts = posts;
    const index = updatedPosts.indexOf(post);
    updatedPosts.splice(index, 1);
    setPosts(updatedPosts);
  };

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    readUserProfile(
      {
        userId: match.params.userId,
      },
      { t: jwt.token },
      signal
    ).then((data) => {
      if (data && data.error) {
        setRedirectToSignin(true);
      } else {
        setUser(data);
        setFollowing(checkFollow(data));
        loadPosts(data._id);
      }
    });

    return function cleanup() {
      abortController.abort();
    };
  }, [match.params.userId]);

  if (redirectToSignin) {
    return <Redirect to="/signin" />;
  }

  return (
    <Paper className={classes.root} elevation={4}>
      <Typography variant="h6" className={classes.title}>
        Profile
      </Typography>
      <List dense>
        <ListItem>
          <ListItemAvatar>
            <Avatar src={photoUrl} />
          </ListItemAvatar>
          <ListItemText primary={user.name} secondary={user.email} />
        </ListItem>
        <ListItem>
          <ListItemText primary={user.about} />
        </ListItem>
        <ListItem>
          <ListItemText
            primary={"Joined: " + new Date(user.created).toDateString()}
          />
          {auth.isAuthenticated().user &&
          auth.isAuthenticated().user._id == user._id ? (
            <ListItemSecondaryAction>
              <Link to={"/user/edit/" + user._id}>
                <IconButton aria-label="Edit" color="primary">
                  <Edit />
                </IconButton>
              </Link>
              <DeleteProfile userId={user._id} />
            </ListItemSecondaryAction>
          ) : (
            <FollowProfileButton
              following={following}
              onButtonClick={clickFollowButton}
            />
          )}
        </ListItem>
        <Divider />
      </List>
      <ProfileTabs user={user} posts={posts} removePostUpdate={removePost} />
    </Paper>
  );
}
