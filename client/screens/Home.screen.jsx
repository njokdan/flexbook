import React, { useState, useEffect } from "react";

import dyinginside from "../assets/images/dyinginside.jpg";
import auth from "../api/helpers/auth.helper";

import FindPeople from "../components/user/FindPeople.jsx";
import NewsFeed from "../components/post/NewsFeed.jsx";

import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 600,
    margin: "auto",
    marginTop: theme.spacing(5),
  },
  title: {
    padding: `${theme.spacing(3)}px ${theme.spacing(2.5)}px
 ${theme.spacing(2)}px`,
    color: theme.palette.openTitle,
  },
  media: {
    minHeight: 400,
  },
  root: {
    flexGrow: 1,
    margin: 30,
  },
}));

export default ({ history }) => {
  const [defaultPage, setDefaultPage] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    setDefaultPage(auth.isAuthenticated());
    const unlisten = history.listen(() => {
      setDefaultPage(auth.isAuthenticated());
    });
    return () => {
      unlisten();
    };
  }, []);

  return (
    <div className={classes.root}>
      {!defaultPage && (
        <Grid container spacing={8}>
          <Grid item xs={12}>
            <Card className={classes.card}>
              <Typography variant="h6" className={classes.title}>
                Home Page
              </Typography>
              <CardMedia
                className={classes.media}
                image={dyinginside}
                title="Flex it"
              />
              <CardContent>
                <Typography variant="body2" component="p">
                  Welcome to FlexBook. <br></br>Where people flex for the
                  validation of other random people. <br></br>The more you Flex
                  - The Better you Feel.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
      {defaultPage && (
        <Grid container spacing={8}>
          <Grid item xs={8} sm={7}>
            <NewsFeed />
          </Grid>
          <Grid item xs={6} sm={4}>
            <FindPeople />
          </Grid>
        </Grid>
      )}
    </div>
  );
};
