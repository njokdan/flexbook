import React, { useState, useEffect } from "react";
import { Redirect, Link } from "react-router-dom";
import auth from "../api/helpers/auth.helper";
import { read } from "../api/user.api";
import { listByUser } from "../api/post.api";

import DeleteUser from "../components/user/DeleteUser/DeleteUser.jsx";
import FollowProfileButton from "../components/user/FollowProfileButton/FollowProfileButton.jsx";
import ProfileTabs from "../components/user/ProfileTabs/ProfileTabs.jsx";

export default function Profile({ match }) {
  const [values, setValues] = useState({
    user: { following: [], followers: [] },
    redirectToSignin: false,
    following: false,
  });
  const [posts, setPosts] = useState([]);
  const jwt = auth.isAuthenticated();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    read(
      {
        userId: match.params.userId,
      },
      { t: jwt.token },
      signal
    ).then((data) => {
      if (data && data.error) {
        setValues({ ...values, redirectToSignin: true });
      } else {
        let following = checkFollow(data);
        setValues({ ...values, user: data, following: following });
        loadPosts(data._id);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, [match.params.userId]);

  const checkFollow = (user) => {
    const match = user.followers.some((follower) => {
      return follower._id == jwt.user._id;
    });
    return match;
  };
  const clickFollowButton = (callApi) => {
    callApi(
      {
        userId: jwt.user._id,
      },
      {
        t: jwt.token,
      },
      values.user._id
    ).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, user: data, following: !values.following });
      }
    });
  };
  const loadPosts = (user) => {
    listByUser(
      {
        userId: user,
      },
      {
        t: jwt.token,
      }
    ).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setPosts(data);
      }
    });
  };
  const removePost = (post) => {
    const updatedPosts = posts;
    const index = updatedPosts.indexOf(post);
    updatedPosts.splice(index, 1);
    setPosts(updatedPosts);
  };

  const photoUrl = values.user._id
    ? `/api/users/photo/${values.user._id}?${new Date().getTime()}`
    : "/api/users/defaultphoto";
  if (values.redirectToSignin) {
    return <Redirect to="/signin" />;
  }
  return (
    <div>
      <h1>Profile</h1>
      <img src={photoUrl} width="150" />
      <h2>{values.user.name}</h2>
      <h2>{values.user.email}</h2>
      {auth.isAuthenticated().user &&
      auth.isAuthenticated().user._id == values.user._id ? (
        <>
          <Link to={"/user/edit/" + values.user._id}>
            <button>edit profile</button>
          </Link>
          <DeleteUser userId={values.user._id} />
        </>
      ) : (
        <FollowProfileButton
          following={values.following}
          onButtonClick={clickFollowButton}
        />
      )}
      about: <h3>{values.user.about}</h3>
      <h3>{"Joined: " + new Date(values.user.created).toDateString()}</h3>
      <ProfileTabs
        user={values.user}
        posts={posts}
        removePostUpdate={removePost}
      />
    </div>
  );
}
