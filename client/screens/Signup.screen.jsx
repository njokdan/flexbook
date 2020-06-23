import React, { useState } from "react";
import { create } from "../api/user.api";
import { Link } from "react-router-dom";

export default function Signup() {
  const [values, setValues] = useState({
    name: "",
    password: "",
    email: "",
    open: false,
    error: "",
  });

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const clickSubmit = () => {
    const user = {
      name: values.name || undefined,
      email: values.email || undefined,
      password: values.password || undefined,
    };
    create(user).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, error: "", open: true });
      }
    });
  };

  return (
    <div>
      <h1>Sign Up</h1>
      <input
        placeholder="Name"
        value={values.name}
        onChange={handleChange("name")}
      />
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
      {values.error && <p> {values.error}</p>}
      <button onClick={clickSubmit}>Submit</button>
      <Link to="/signin">
        <button>Sign In</button>
      </Link>
    </div>
  );
}
