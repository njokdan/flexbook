import React, { useState } from "react";
import PropTypes from "prop-types";
import { unfollowUser, followUser } from "../../api/user.api";

import Button from "@material-ui/core/Button";

export default function FollowProfileButton(props) {
  const [disableButton, setDisableButton] = useState(false);

  const followClick = () => {
    if (!disableButton) {
      setDisableButton(true);
      props.onButtonClick(followUser).finally(() => {
        setDisableButton(false);
      });
    }
  };

  const unfollowClick = () => {
    if (!disableButton) {
      setDisableButton(true);
      props.onButtonClick(unfollowUser).finally(() => {
        setDisableButton(false);
      });
    }
  };

  return (
    <div>
      {props.following ? (
        <Button
          variant="contained"
          color="secondary"
          onClick={unfollowClick}
          disabled={disableButton}
        >
          Unfollow
        </Button>
      ) : (
        <Button
          variant="contained"
          color="primary"
          onClick={followClick}
          disabled={disableButton}
        >
          Follow
        </Button>
      )}
    </div>
  );
}
FollowProfileButton.propTypes = {
  following: PropTypes.bool.isRequired,
  onButtonClick: PropTypes.func.isRequired,
};
