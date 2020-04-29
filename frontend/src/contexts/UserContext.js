import createDataContext from "../utils/createDataContext";
import serverApi from "../api/server";

const postsReducer = (state, action) => {
  switch (action.type) {
    case "SET_ERROR":
      return { error: action.payload };
    case "CLEAR_ERROR":
      return { error: "" };
    default:
      return state;
  }
};

const updateProfile = (dispatch) => async (profileId, { name }) => {
  if (!profileId) {
    dispatch({
      type: "ADD_ERROR",
      payload: "Invalid link",
    });
    return;
  }

  if (!name) {
    dispatch({
      type: "ADD_ERROR",
      payload: "Must be at least one change",
    });
    return;
  }

  let changes = {
    ...(name && { name }),
  };

  try {
    await serverApi.put(`/userprofileupdate/${profileId}`, changes);
    dispatch({
      type: "CLEAR_ERROR",
      payload: "",
    });
  } catch (err) {
    dispatch({
      type: "ADD_ERROR",
      payload: "Something went wrong with updating your profile",
    });
  }
};

const getProfileByLink = (dispatch) => async ({ profileId }) => {
  if (!profileId) {
    dispatch({
      type: "ADD_ERROR",
      payload: "Invalid link",
    });
    return;
  }

  try {
    const profile = await serverApi.get(`/${profileId}`);
    dispatch({
      type: "CLEAR_ERROR",
      payload: "",
    });
    return profile;
  } catch (err) {
    dispatch({
      type: "ADD_ERROR",
      payload: "Something went wrong with getting the profile",
    });
  }
};

export const { Provider, Context } = createDataContext(
  postsReducer,
  {
    getProfileByLink,
    updateProfile,
  },
  { error: "" }
);
