import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import dyinginside from "../assets/images/dyinginside.jpg";

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
}));

export default () => {
  const classes = useStyles();
  return (
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
          Welcome to FlexBook. <br></br>Where people flex for the validation of
          other random people. <br></br>The more you Flex - The Better you Feel.
        </Typography>
      </CardContent>
    </Card>
  );
};
