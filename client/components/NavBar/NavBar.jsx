import React from "react";
import auth from "../../api/helpers/auth.helper";
import { Link, withRouter } from "react-router-dom";

const isActive = (history, path) => {
  if (history.location.pathname == path) return { color: "#ffa726" };
  else return { color: "#000" };
};
const Navbar = withRouter(({ history }) => (
  <div>
    <h6>blackbook?</h6>
    <Link to="/">
      <button>home</button>
    </Link>
    {!auth.isAuthenticated() && (
      <span>
        <Link to="/signup">
          <button>Sign up</button>
        </Link>
        <Link to="/signin">
          <button>Sign In</button>
        </Link>
      </span>
    )}
    {auth.isAuthenticated() && (
      <span>
        <Link to={"/user/" + auth.isAuthenticated().user._id}>
          <button
            style={isActive(
              history,
              "/user/" + auth.isAuthenticated().user._id
            )}
          >
            My Profile
          </button>
        </Link>
        <button
          color="inherit"
          onClick={() => {
            auth.clearJWT(() => history.push("/"));
          }}
        >
          Sign out
        </button>
      </span>
    )}
  </div>
));

export default Navbar;
