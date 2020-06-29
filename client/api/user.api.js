// User backend actions API

/**
 * Creates a new user in the db with the provided data.
 * returns the response from the server as a promise.
 * @param {provided data} user
 * Returns the created user as an object.
 */
const createUser = async (user) => {
  try {
    let response = await fetch("/api/users/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

/**
 * Get all the users that exist in the database.
 * Returns an array containing the user objects that were retrieved from the database.
 * @param {Cancels request if uneeded} signal
 */
const getAllUsers = async (signal) => {
  try {
    let response = await fetch("/api/users", {
      method: "GET",
      signal: signal,
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

/**
 * Returns a specific user (object) profile. Requires authorization.
 * @param {contains User's ID} params
 * @param {contains a valid token (authorization)} credentials
 * @param {Cancels request if uneeded} signal
 */
const readUserProfile = async (params, credentials, signal) => {
  try {
    let response = await fetch("/api/users/" + params.userId, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials.t,
      },
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

/**
 * Takes changed user data, and updates the user in the db.
 * Requires authorization, the updated user as an object.
 * @param {Contains the user's ID} params
 * @param {contains a valid token (authorization)} credentials
 * @param {Object - user data to update with updates} user
 */
const updateUserProfile = async (params, credentials, user) => {
  try {
    let response = await fetch("/api/users/" + params.userId, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + credentials.t,
      },
      body: user,
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

/**
 * Removes a user from the database
 * @param {object with User's ID} params
 * @param {object with authorized token} credentials
 */
const deleteUser = async (params, credentials) => {
  try {
    let response = await fetch("/api/users/" + params.userId, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials.t,
      },
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

/**
 * Follow a given user
 * @param {Contains the user's ID} params
 * @param {contains a valid token (authorization)} credentials
 * @param {a given User's (to follow) ID} followId
 */
const followUser = async (params, credentials, followId) => {
  try {
    let response = await fetch("/api/users/follow/", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials.t,
      },
      body: JSON.stringify({ userId: params.userId, followId: followId }),
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

/**
 * Follow a given user
 * @param {Contains the user's ID} params
 * @param {contains a valid token (authorization)} credentials
 * @param {a given User's (to UN-follow) ID} unfollowId
 */ const unfollowUser = async (params, credentials, unfollowId) => {
  try {
    let response = await fetch("/api/users/unfollow/", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials.t,
      },
      body: JSON.stringify({ userId: params.userId, unfollowId: unfollowId }),
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

/**
 * Finds new people to follow
 * @param {object with User's ID} params
 * @param {object with authorized token} credentials
 * @param {cancel request if needed} signal
 */
const findNewPeople = async (params, credentials, signal) => {
  try {
    let response = await fetch("/api/users/findNewPeople/" + params.userId, {
      method: "GET",
      signal: signal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials.t,
      },
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

export {
  createUser,
  getAllUsers,
  readUserProfile,
  updateUserProfile,
  deleteUser,
  followUser,
  unfollowUser,
  findNewPeople,
};
