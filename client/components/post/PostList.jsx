import React from "react";
import PropTypes from "prop-types";
import Post from "./Post.jsx";
import { v4 as uuidv4 } from "uuid";

export default function PostList(props) {
  return (
    <div style={{ marginTop: "24px" }}>
      {props.posts.map((item, i) => {
        return (
          <Post post={item} key={uuidv4()} onRemove={props.removeUpdate} />
        );
      })}
    </div>
  );
}

PostList.propTypes = {
  posts: PropTypes.array.isRequired,
  removeUpdate: PropTypes.func.isRequired,
};
