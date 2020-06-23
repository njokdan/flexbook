import React, { useState } from "react";
import auth from "../../../api/helpers/auth.helper";
import PropTypes from "prop-types";
import { comment, uncomment } from "../../../api/post.api";
import { Link } from "react-router-dom";

export default function Comments(props) {
  const [text, setText] = useState("");
  const jwt = auth.isAuthenticated();

  const handleChange = (event) => {
    setText(event.target.value);
  };

  const addComment = (event) => {
    if (event.keyCode == 13 && event.target.value) {
      event.preventDefault();
      comment(
        {
          userId: jwt.user._id,
        },
        {
          t: jwt.token,
        },
        props.postId,
        { text: text }
      ).then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          setText("");
          props.updateComments(data.comments);
        }
      });
    }
  };

  const deleteComment = (comment) => (event) => {
    uncomment(
      {
        userId: jwt.user._id,
      },
      {
        t: jwt.token,
      },
      props.postId,
      comment
    ).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        props.updateComments(data.comments);
      }
    });
  };

  const commentBody = (item) => {
    return (
      <p className={classes.commentText}>
        <Link to={"/user/" + item.postedBy._id}>{item.postedBy.name}</Link>
        <br />
        {item.text}
        <span className={classes.commentDate}>
          {new Date(item.created).toDateString()} |
          {auth.isAuthenticated().user._id === item.postedBy._id && (
            <button onClick={deleteComment(item)}>delete</button>
          )}
        </span>
      </p>
    );
  };

  return (
    <div>
      <img
        src={"/api/users/photo/" + auth.isAuthenticated().user._id}
        width="150"
      />
      <input
        onKeyDown={addComment}
        multiline
        value={text}
        onChange={handleChange}
        placeholder="Write something ..."
      />
      {props.comments.map((item, i) => {
        return (
          <div key={i}>
            <h2>{commentBody(item)}</h2>
            <img src={"/api/users/photo/" + item.postedBy._id} width="150" />
          </div>
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
