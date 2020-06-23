import React, { useState } from "react";
import auth from "../api/helpers/auth.helper";
import { Redirect } from "react-router-dom";
import { signin } from "../api/auth.api";

export default (props) => {
  const [values, setValues] = useState({
    email: "",
    password: "",
    error: "",
    redirectToReferrer: false,
  });

  const clickSubmit = () => {
    const user = {
      email: values.email || undefined,
      password: values.password || undefined,
    };

    signin(user).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        auth.authenticate(data, () => {
          setValues({ ...values, error: "", redirectToReferrer: true });
        });
      }
    });
  };

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const { from } = props.location.state || {
    from: {
      pathname: "/",
    },
  };
  const { redirectToReferrer } = values;
  if (redirectToReferrer) {
    return <Redirect to={from} />;
  }

  return (
    <div>
      <h1>Sign In</h1>
      <input
        type="email"
        placeholder="Email"
        value={values.email}
        onChange={handleChange("email")}
      />
      <input
        type="password"
        placeholder="Password"
        value={values.password}
        onChange={handleChange("password")}
      />
      {values.error && <p>{values.error}</p>}
      <button onClick={clickSubmit}>Submit</button>
    </div>
  );
};
