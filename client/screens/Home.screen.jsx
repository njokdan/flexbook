import React from "react";
import { Link } from "react-router-dom";

export default () => {
  return (
    <div>
      <h1>Home</h1>
      <h2>Welcome.</h2>
      <Link to="/signin">
        <button>Sign In</button>
      </Link>
      <Link to="/signup">
        <button>Sign Up</button>
      </Link>
      <Link to="/users">
        <button>Users</button>
      </Link>
    </div>
  );
};
