// User backend actions API

/*  
Creates a new user in the db with the provided data.
returns the response from the server as a promise.
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

/*
Get all the users that exist in the database.
Returns an array containing the user objects that were retrieved from the database.
*/
const getAllUsers = async (signal) => {
  try {
    let response = await fetch("/api/users/", {
      method: "GET",
      signal: signal,
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

/*
Returns a specific user profile. Requires authorization.
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

/*
Takes changed user data, and updates the user in the db.
Requires authorization, returns a promise.
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

/*
Removes a user from the database, returns a promise.
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

export {
  createUser,
  getAllUsers,
  readUserProfile,
  updateUserProfile,
  deleteUser,
};
