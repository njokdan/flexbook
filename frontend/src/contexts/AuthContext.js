import createDataContext from "../utils/createDataContext";
import serverApi from "../api/server";

const authReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ERROR": {
      return { ...state, errorMessage: action.payload };
    }
    case "SIGNIN":
      return { errorMessage: "", token: action.payload };
    case "CLEAR_ERROR":
      return { ...state, errorMessage: "" };
    case "SIGNOUT":
      return { errorMessage: "", token: null };
    default:
      return state;
  }
};

const clearErrorMessage = (dispatch) => () => dispatch({ type: "CLEAR_ERROR" });

const tryLocalSignin = (dispatch) => async (req) => {
    
  if (token) {
    dispatch({ type: "SIGNIN", payload: token });
    navigate("Shop");
  } else {
    navigate("Welcome");
  }
};

const signup = (dispatch) => async ({ email, password }) => {
  try {
    const response = await shoppyApi.post("/signup", { email, password });
    // await AsyncStorage.setItem('token', response.data.token);
    dispatch({
      type: "SIGNUP",
      payload: response.data.token,
    });
    clearErrorMessage();
    navigate("Shop");
  } catch (err) {
    dispatch({
      type: "ADD_ERROR",
      payload: "Something went wrong with sign up",
    });
  }
};

const signout = (dispatch) => async () => {
  //   await AsyncStorage.removeItem('token');
  dispatch({ type: "SIGNOUT" });
  navigate("Welcome");
};

const signin = (dispatch) => async ({ email, password }) => {
  try {
    const response = await shoppyApi.post("/signin", { email, password });
    // await AsyncStorage.setItem('token', response.data.token);
    dispatch({ type: "SIGNIN", payload: response.data.token });
    clearErrorMessage();
    navigate("Shop");
  } catch (error) {
    dispatch({
      type: "ADD_ERROR",
      payload: "Something went wrong with sign in",
    });
  }
};

export const { Provider, Context } = createDataContext(
  authReducer,
  { signin, signout, signup, clearErrorMessage, tryLocalSignin },
  { token: null, errorMessage: "" }
);
