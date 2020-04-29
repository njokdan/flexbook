import createDataContext from "../utils/createDataContext";
import serverApi from "../api/server";

const authReducer = (state, action) => {
  switch (action.type) {
    case "SET_ERROR":
      return { error: action.payload };
    case "CLEAR_ERROR":
      return { error: "" };
    default:
      return state;
  }
};

const signup = (dispatch) => async ({ email, password, name }) => {
  try {
    await serverApi.post("/signup", { email, password, name });
    dispatch({
      type: "CLEAR_ERROR",
      payload: "",
    });
  } catch (err) {
    dispatch({
      type: "ADD_ERROR",
      payload: "Something went wrong with sign up",
    });
  }
};

const tryLocalSignIn = (dispatch) => async () => {
  console.log("fired");

  try {
    await serverApi.get("/tokenBasedProfileCheck");
  } catch (e) {
    console.log("Can't sign in automatically.");
  }
};

const signin = (dispatch) => async ({ email, password }) => {
  try {
    await serverApi.post("/signin", { email, password });
    dispatch({
      type: "CLEAR_ERROR",
      payload: "",
    });
  } catch (err) {
    dispatch({
      type: "ADD_ERROR",
      payload: "Something went wrong with sign up",
    });
  }
};

const signout = (dispatch) => async () => {
  try {
    await serverApi.get("/signout");
    dispatch({
      type: "CLEAR_ERROR",
      payload: "",
    });
  } catch (err) {
    dispatch({
      type: "ADD_ERROR",
      payload: "Something went wrong with signing out",
    });
  }
};

export const { Provider, Context } = createDataContext(
  authReducer,
  {
    signup,
    signin,
    signout,
    tryLocalSignIn,
  },
  { error: "" }
);
