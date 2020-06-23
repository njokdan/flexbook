import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import auth from "../api/helpers/auth.helper";
import { read, update } from "../api/user.api";

export default function EditProfile({ match }) {
  const [values, setValues] = useState({
    name: "",
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
        });
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, [match.params.userId]);

  const clickSubmit = () => {
    const jwt = auth.isAuthenticated();
    const user = {
      name: values.name || undefined,
      email: values.email || undefined,
      password: values.password || undefined,
    };
    update(
      {
        userId: match.params.userId,
      },
      {
        t: jwt.token,
      },
      user
    ).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, userId: data._id, redirectToProfile: true });
      }
    });
  };

  const handleChange = (name) => (event) => {
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    setValues({ ...values, [name]: value });
  };

  if (values.redirectToProfile) {
    return <Redirect to={"/user/" + values.id} />;
  }

  return (
    <div>
      <h1>Edit Profile</h1>
      <input
        placeholder="Name"
        value={values.name}
        onChange={handleChange("name")}
      />
      <input
        placeholder="email"
        value={values.email}
        onChange={handleChange("email")}
      />
      <br />
      <input
        placeholder="password"
        type="password"
        value={values.password}
        onChange={handleChange("password")}
      />
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
