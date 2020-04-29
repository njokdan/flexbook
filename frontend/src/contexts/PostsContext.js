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

const createTextPost = (dispatch) => async (link, { text, headline }) => {
  if (!link) {
    dispatch({
      type: "ADD_ERROR",
      payload: "Invalid link",
    });
    return;
  }

  if (!text && !headline) {
    dispatch({
      type: "ADD_ERROR",
      payload: "Must be at least one change",
    });
    return;
  }

  let changes = {
    ...(text && { text }),
    ...(headline && { headline }),
  };

  try {
    await serverApi.post(`/${link}/postText`, changes);
    dispatch({
      type: "CLEAR_ERROR",
      payload: "",
    });
  } catch (err) {
    dispatch({
      type: "ADD_ERROR",
      payload: "Something went wrong with posting",
    });
  }
};

const updateTextPost = (dispatch) => async (link, post, { text, headline }) => {
  if (!link || !post) {
    dispatch({
      type: "ADD_ERROR",
      payload: "Invalid link",
    });
    return;
  }

  if (!text && !headline) {
    dispatch({
      type: "ADD_ERROR",
      payload: "Must be at least one change",
    });
    return;
  }

  let changes = {
    ...(text && { text }),
    ...(headline && { headline }),
  };

  try {
    await serverApi.put(`/updatePost/${link}/${post}`, changes);
    dispatch({
      type: "CLEAR_ERROR",
      payload: "",
    });
  } catch (err) {
    dispatch({
      type: "ADD_ERROR",
      payload: "Something went wrong with updating",
    });
  }
};

const deleteTextPost = (dispatch) => async ({ link, post }) => {
  if (!link || !post) {
    dispatch({
      type: "ADD_ERROR",
      payload: "Invalid link",
    });
    return;
  }

  try {
    await serverApi.delete(`/${link}/${post}`);
    dispatch({
      type: "CLEAR_ERROR",
      payload: "",
    });
  } catch (err) {
    dispatch({
      type: "ADD_ERROR",
      payload: "Something went wrong with deleting",
    });
  }
};

const getEntireWall = (dispatch) => async ({ wallLink }) => {
  if (!wallLink) {
    dispatch({
      type: "ADD_ERROR",
      payload: "Invalid link",
    });
    return;
  }

  try {
    const wallData = await serverApi.get(`/${wallLink}`);
    dispatch({
      type: "CLEAR_ERROR",
      payload: "",
    });
    return wallData;
  } catch (err) {
    dispatch({
      type: "ADD_ERROR",
      payload: "Something went wrong with deleting",
    });
  }
};

const getTextPost = (dispatch) => async ({ wallLink, post }) => {
  if (!wallLink || !post) {
    dispatch({
      type: "ADD_ERROR",
      payload: "Invalid link",
    });
    return;
  }

  try {
    const post = await serverApi.get(`/${wallLink}/${post}`);
    dispatch({
      type: "CLEAR_ERROR",
      payload: "",
    });
    return post;
  } catch (err) {
    dispatch({
      type: "ADD_ERROR",
      payload: "Something went wrong with deleting",
    });
  }
};

export const { Provider, Context } = createDataContext(
  postsReducer,
  {
    createTextPost,
    updateTextPost,
    deleteTextPost,
    getEntireWall,
    getTextPost,
  },
  { error: "" }
);
