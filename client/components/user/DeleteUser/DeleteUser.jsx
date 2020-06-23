import React, { useState } from "react";
import PropTypes from "prop-types";
import auth from "../../../api/helpers/auth.helper";
import { remove } from "../../../api/user.api";
import { Redirect, Link } from "react-router-dom";

export default function DeleteUser(props) {
  const [open, setOpen] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const jwt = auth.isAuthenticated();
  const clickButton = () => {
    setOpen(true);
  };
  const deleteAccount = () => {
    remove(
      {
        userId: props.userId,
      },
      { t: jwt.token }
    ).then((data) => {
      if (data && data.error) {
        console.log(data.error);
      } else {
        auth.clearJWT(() => console.log("deleted"));
        setRedirect(true);
      }
    });
  };
  const handleRequestClose = () => {
    setOpen(false);
  };

  if (redirect) {
    return <Redirect to="/" />;
  }
  return (
    <div>
      <button onClick={clickButton}>Delete user</button>

      {open ? (
        <div>
          <h1>Confirm to delete your account.</h1>
          <button onClick={handleRequestClose}>Cancel</button>
          <button onClick={deleteAccount}>Confirm</button>
        </div>
      ) : null}
    </div>
  );
}
DeleteUser.propTypes = {
  userId: PropTypes.string.isRequired,
};
