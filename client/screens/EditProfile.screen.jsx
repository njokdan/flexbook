import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import auth from "../api/helpers/auth.helper";
import { read, update } from "../api/user.api";

export default function EditProfile({ match }) {
  const [values, setValues] = useState({
    name: "",
    about: "",
    photo: "",
    email: "",
    password: "",
    redirectToProfile: false,
    error: "",
    id: "",
  });
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
      if (data & data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          id: data._id,
          name: data.name,
          email: data.email,
          about: data.about,
        });
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, [match.params.userId]);

  const clickSubmit = () => {
    let userData = new FormData();
    values.name && userData.append("name", values.name);
    values.email && userData.append("email", values.email);
    values.passoword && userData.append("passoword", values.passoword);
    values.about && userData.append("about", values.about);
    values.photo && userData.append("photo", values.photo);
    update(
      {
        userId: match.params.userId,
      },
      {
        t: jwt.token,
      },
      userData
    ).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, redirectToProfile: true });
      }
    });
  };
  const handleChange = (name) => (event) => {
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    setValues({ ...values, [name]: value });
  };
  const photoUrl = values.id
    ? `/api/users/photo/${values.id}?${new Date().getTime()}`
    : "/api/users/defaultphoto";
  if (values.redirectToProfile) {
    return <Redirect to={"/user/" + values.id} />;
  }
  return (
    <div>
      <h1>Edit Profile</h1>
      <img src={photoUrl} width="150" />
      <br />
      <input accept="image/*" onChange={handleChange("photo")} type="file" />
      <label htmlFor="icon-button-file">
        <button>Upload</button>
      </label>
      <span>{values.photo ? values.photo.name : ""}</span>
      <br />
      <input
        placeholder="Name"
        value={values.name}
        onChange={handleChange("name")}
      />
      <br />
      <input
        placeholder="About"
        value={values.about}
        onChange={handleChange("about")}
      />
      <br />
      <input
        placeholder="email"
        value={values.email}
        onChange={handleChange("email")}
      />
      <br />
      <TextField
        id="password"
        type="password"
        label="Password"
        className={classes.textField}
        value={values.password}
        onChange={handleChange("password")}
        margin="normal"
      />
      <br />{" "}
      {values.error && (
        <h1>
          <p>error</p>
          {values.error}
        </h1>
      )}
      <button onClick={clickSubmit}>Submit</button>
    </div>
  );
}
