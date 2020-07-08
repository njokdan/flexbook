import React, { useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import auth from "../../api/helpers/auth.helper";
import { commentOnPost, removeCommentFromPost } from "../../api/post.api";

import { makeStyles } from "@material-ui/core/styles";
import CardHeader from "@material-ui/core/CardHeader";
import TextField from "@material-ui/core/TextField";
import Avatar from "@material-ui/core/Avatar";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles((theme) => ({
  cardHeader: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  smallAvatar: {
    width: 25,
    height: 25,
  },
  commentField: {
    width: "96%",
  },
  commentText: {
    backgroundColor: "white",
    padding: theme.spacing(1),
    margin: `2px ${theme.spacing(2)}px 2px 2px`,
  },
  commentDate: {
    display: "block",
    color: "gray",
    fontSize: "0.8em",
  },
  commentDelete: {
    fontSize: "1.6em",
    verticalAlign: "middle",
    cursor: "pointer",
    padding: 0,
  },
  linkText: {
    textDecoration: "none",
    color: "#000",
    fontWeight: 700,
  },
  deleteIconComment: {
    width: 20,
  },
}));

export default function Comments(props) {
  const classes = useStyles();
  const [disableCommenting, setDisableCommenting] = useState(false);
  const [disableDeleteButton, setDisableDeleteButton] = useState(false);
  const [text, setText] = useState("");
  const jwt = auth.isAuthenticated();

  const handleChange = (event) => {
    setText(event.target.value);
  };

  const addComment = (event) => {
    if (event.keyCode == 13 && event.target.value) {
      setDisableCommenting(true);
      event.preventDefault();
      commentOnPost(
        {
          userId: jwt.user._id,
        },
        {
          t: jwt.token,
        },
        props.postId,
        { text: text }
      )
        .then((data) => {
          if (data.error) {
            console.log(data.error);
          } else {
            setText("");
            props.updateComments(data.comments);
          }
        })
        .finally(() => {
          setDisableCommenting(false);
        });
    }
  };

  const deleteComment = (comment) => (event) => {
    removeCommentFromPost(
      {
        userId: jwt.user._id,
      },
      {
        t: jwt.token,
      },
      props.postId,
      comment
    )
      .then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          props.updateComments(data.comments);
        }
      })
      .finally(() => {
        setDisableDeleteButton(false);
      });
  };

  const commentBody = (item) => {
    return (
      <p className={classes.commentText}>
        <Link className={classes.linkText} to={"/user/" + item.postedBy._id}>
          {item.postedBy.name}
        </Link>
        <br />
        <span>{item.text}</span>
        <span className={classes.commentDate}>
          {new Date(item.created).toDateString()} |
          {auth.isAuthenticated().user._id === item.postedBy._id && (
            <IconButton
              disabled={disableDeleteButton}
              onClick={(e) => {
                setDisableDeleteButton(true);
                deleteComment(item)(e);
              }}
              className={classes.commentDelete}
            >
              <DeleteIcon className={classes.deleteIconComment} />
            </IconButton>
          )}
        </span>
      </p>
    );
  };

  return (
    <div>
      <CardHeader
        avatar={
          <Avatar
            className={classes.smallAvatar}
            src={"/api/users/photo/" + auth.isAuthenticated().user._id}
          />
        }
        title={
          <TextField
            onKeyDown={
              disableCommenting
                ? null
                : (e) => {
                    addComment(e);
                  }
            }
            value={text}
            onChange={handleChange}
            placeholder="Write something (press Enter to post)"
            className={classes.commentField}
            margin="normal"
          />
        }
        className={classes.cardHeader}
      />
      {props.comments.map((item, i) => {
        return (
          <CardHeader
            avatar={
              <Avatar
                className={classes.smallAvatar}
                src={"/api/users/photo/" + item.postedBy._id}
              />
            }
            title={commentBody(item)}
            className={classes.cardHeader}
            key={i}
          />
        );
      })}
    </div>
  );
}

Comments.propTypes = {
  postId: PropTypes.string.isRequired,
  comments: PropTypes.array.isRequired,
  updateComments: PropTypes.func.isRequired,
};
