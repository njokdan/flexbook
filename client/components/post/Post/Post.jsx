import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import auth from "../../../api/helpers/auth.helper";
import { remove, like, unlike } from "../../../api/post.api";
import Comments from "../Comments/Comments.jsx";

export default function Post(props) {
  const jwt = auth.isAuthenticated();
  const checkLike = (likes) => {
    let match = likes.indexOf(jwt.user._id) !== -1;
    return match;
  };
  const [values, setValues] = useState({
    like: checkLike(props.post.likes),
    likes: props.post.likes.length,
    comments: props.post.comments,
  });

  // useEffect(() => {
  //   setValues({...values, like:checkLike(props.post.likes), likes: props.post.likes.length, comments: props.post.comments})
  // }, [])

  const clickLike = () => {
    let callApi = values.like ? unlike : like;
    callApi(
      {
        userId: jwt.user._id,
      },
      {
        t: jwt.token,
      },
      props.post._id
    ).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setValues({ ...values, like: !values.like, likes: data.likes.length });
      }
    });
  };

  const updateComments = (comments) => {
    setValues({ ...values, comments: comments });
  };

  const deletePost = () => {
    remove(
      {
        postId: props.post._id,
      },
      {
        t: jwt.token,
      }
    ).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        props.onRemove(props.post);
      }
    });
  };

  return (
    <div>
      <img src={"/api/users/photo/" + props.post.postedBy._id} width="150" />
      {props.post.postedBy._id === auth.isAuthenticated().user._id && (
        <button onClick={deletePost}>delete post</button>
      )}
      <Link to={"/user/" + props.post.postedBy._id}>
        {props.post.postedBy.name}
      </Link>
      <h3>{new Date(props.post.created).toDateString()}</h3>

      <p>{props.post.text}</p>
      {props.post.photo && (
        <div className={classes.photo}>
          <img
            className={classes.media}
            src={"/api/posts/photo/" + props.post._id}
          />
        </div>
      )}
      {values.like ? (
        <button onClick={clickLike}>Like </button>
      ) : (
        <button onClick={clickLike}>Unlike </button>
      )}
      <span>{values.likes}</span>
      <span>{values.comments.length}</span>

      <Comments
        postId={props.post._id}
        comments={values.comments}
        updateComments={updateComments}
      />
    </div>
  );
}

Post.propTypes = {
  post: PropTypes.object.isRequired,
  onRemove: PropTypes.func.isRequired,
};
