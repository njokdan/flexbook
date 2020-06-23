import React from "react";
import PropTypes from "prop-types";
import { unfollow, follow } from "../../../api/user.api";

export default function FollowProfileButton(props) {
  const followClick = () => {
    props.onButtonClick(follow);
  };
  const unfollowClick = () => {
    props.onButtonClick(unfollow);
  };
  return (
    <div>
      {props.following ? (
        <button onClick={unfollowClick}>Unfollow</button>
      ) : (
        <button onClick={followClick}>Follow</button>
      )}
    </div>
  );
}
FollowProfileButton.propTypes = {
  following: PropTypes.bool.isRequired,
  onButtonClick: PropTypes.func.isRequired,
};
