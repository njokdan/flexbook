import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import auth from "../../api/helpers/auth.helper";
import { createPost } from "../../api/post.api";

import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import Icon from "@material-ui/core/Icon";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles((theme) => ({
  paper: {
    maxWidth: 600,
    minWidth: 300,
    [theme.breakpoints.up("sm")]: {
      minWidth: 580,
    },
  },
  root: {
    padding: 1,
    backgroundColor: "#efefef",
  },
  card: {
    maxWidth: 600,
    margin: "auto",
    marginBottom: theme.spacing(3),
    backgroundColor: "rgba(65, 150, 136, 0.09)",
    boxShadow: "none",
  },
  cardContent: {
    backgroundColor: "white",
    paddingTop: 0,
    paddingBottom: 0,
  },
  cardHeader: {
    paddingTop: 8,
    fontWeight: 700,
    paddingBottom: 8,
  },
  photoButton: {
    height: 30,
    marginBottom: 5,
  },
  input: {
    display: "none",
  },
  textField: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    width: "90%",
  },
  submit: {
    margin: theme.spacing(2),
  },
  filename: {
    verticalAlign: "super",
  },
}));

export default function NewPost(props) {
  const classes = useStyles();
  const [disableButton, setDisableButton] = useState(false);
  const [values, setValues] = useState({
    text: "",
    photo: "",
    error: "",
    user: {},
  });

  const jwt = auth.isAuthenticated();
  useEffect(() => {
    setValues({ ...values, user: auth.isAuthenticated().user });
  }, []);

  const clickPost = () => {
    let postData = new FormData();
    postData.append("text", values.text);
    postData.append("photo", values.photo);
    createPost(
      {
        userId: jwt.user._id,
      },
      {
        t: jwt.token,
      },
      postData
    ).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
        setDisableButton(false);
      } else {
        setValues({ ...values, text: "", photo: "" });
        props.addUpdate(data);
        setDisableButton(false);
      }
    });
  };

  const handleChange = (name) => (event) => {
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    setValues({ ...values, [name]: value });
  };

  const photoURL = values.user._id
    ? "/api/users/photo/" + values.user._id
    : "/api/users/defaultphoto";

  return (
    <Paper className={classes.paper}>
      <Card className={classes.card}>
        <CardHeader
          avatar={<Avatar src={photoURL} />}
          title={values.user.name}
          className={classes.cardHeader}
        />
        <CardContent className={classes.cardContent}>
          <TextField
            placeholder="Time to flex?"
            multiline
            rows="3"
            value={values.text}
            onChange={handleChange("text")}
            className={classes.textField}
            margin="normal"
          />
          <input
            accept="image/*"
            onChange={handleChange("photo")}
            className={classes.input}
            id="icon-button-file"
            type="file"
          />
          <label htmlFor="icon-button-file">
            <IconButton
              color="secondary"
              className={classes.photoButton}
              component="span"
            >
              <PhotoCamera />
            </IconButton>
          </label>
          <span className={classes.filename}>
            {values.photo ? values.photo.name : ""}
          </span>
          {values.error && (
            <Typography component="p" color="error">
              <Icon color="error" className={classes.error}>
                error
              </Icon>
              {values.error}
            </Typography>
          )}
        </CardContent>
        <CardActions>
          <Button
            color="primary"
            variant="contained"
            disabled={values.text === "" || disableButton}
            onClick={() => {
              setDisableButton(true);
              clickPost();
            }}
            className={classes.submit}
          >
            POST
          </Button>
        </CardActions>
      </Card>
    </Paper>
  );
}

NewPost.propTypes = {
  addUpdate: PropTypes.func.isRequired,
};
