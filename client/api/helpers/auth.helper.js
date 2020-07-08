import { signout } from "../auth.api";

const auth = {
  /**
   * Checks if a user is already authenticated
   */
  isAuthenticated() {
    if (typeof window == "undefined") return false;

    if (sessionStorage.getItem("jwt"))
      return JSON.parse(sessionStorage.getItem("jwt"));
    else return false;
  },
  /**
   * Sets JWT in session storage and calls cb (callback function)
   * @param {JWT token returned after sign in} jwt
   * @param {Next function to do after setting JWT in session storage} cb
   */
  authenticate(jwt, cb) {
    if (typeof window !== "undefined")
      sessionStorage.setItem("jwt", JSON.stringify(jwt));
    cb();
  },
  /**
   * Removes existing authentication and signs the user out.
   * @param {callback function} cb
   */
  clearJWT(cb) {
    if (typeof window !== "undefined") sessionStorage.removeItem("jwt");
    signout()
      .then((data) => {
        document.cookie = "t=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        cb();
      })
      .catch((e) => {
        document.cookie = "t=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        cb();
      });
  },
};

export default auth;
