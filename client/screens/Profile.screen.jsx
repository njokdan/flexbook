import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Redirect } from "react-router-dom";
import auth from "../api/helpers/auth.helper";
import { read } from "../api/user.api";

import DeleteUser from "../components/user/DeleteUser/DeleteUser.jsx";

export default function Profile({ match }) {
  const jwt = auth.isAuthenticated();
  const [redirectToSignin, setRedirectToSignin] = useState(false);
  const [user, setUser] = useState({});

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    const jwt = auth.isAuthenticated();
    read(
      {
        userId: match.params.userId,
      },
      { t: jwt.token },
      signal
    ).then((data) => {
      if (data && data.error) {
        setRedirectToSignin(true);
      } else {
        setUser(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, [match.params.userId]);

  if (redirectToSignin) {
    return <Redirect to="/signin" />;
  }

  return (
    <div>
      <h1>Profile</h1>
      <h2>{user.name}</h2>
      <h2>{user.email}</h2>
      {auth.isAuthenticated().user &&
      auth.isAuthenticated().user._id == user._id ? (
        <>
          <Link to={"/user/edit/" + user._id}>
            <button>edit profile</button>
          </Link>
          <DeleteUser userId={user._id} />
        </>
      ) : null}
    </div>
  );
}
