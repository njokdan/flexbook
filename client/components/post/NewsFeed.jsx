import React, { useState, useEffect } from "react";
import auth from "../../api/helpers/auth.helper";
import { listNewsFeed } from "../../api/post.api";
import PostList from "./PostList.jsx";
import NewPost from "./NewPost.jsx";

import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";

const useStyles = makeStyles((theme) => ({
  card: {
    margin: "auto",
    paddingTop: 0,
    paddingBottom: theme.spacing(3),
  },
  title: {
    color: theme.palette.openTitle,
    fontSize: "2em",
    textAlign: "center",
    marginBottom: 15,
  },
  media: {
    minHeight: 330,
  },
}));

export default function Newsfeed() {
  const classes = useStyles();
  const [posts, setPosts] = useState([]);
  const jwt = auth.isAuthenticated();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    listNewsFeed(
      {
        userId: jwt.user._id,
      },
      {
        t: jwt.token,
      },
      signal
    ).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setPosts(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, []);

  const addPost = (post) => {
    const updatedPosts = [...posts];
    updatedPosts.unshift(post);
    setPosts(updatedPosts);
  };

  const removePost = (post) => {
    const updatedPosts = [...posts];
    const index = updatedPosts.indexOf(post);
    updatedPosts.splice(index, 1);
    setPosts(updatedPosts);
  };

  return (
    <Grid>
      <Typography type="title" className={classes.title}>
        Newsfeed
      </Typography>

      <Grid item xs={2} />
      <Grid
        container
        item
        direction="column"
        justify="center"
        alignItems="center"
      >
        <Grid item xs={12}>
          <NewPost addUpdate={addPost} />
        </Grid>
      </Grid>

      <Grid container item>
        <Grid item xs={3} />
        <Grid item xs={6}>
          <Divider />
        </Grid>
        <Grid item xs={3} />
      </Grid>
      <PostList removeUpdate={removePost} posts={posts} />
    </Grid>
  );
}
