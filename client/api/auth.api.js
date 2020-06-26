// Authentication API

/**
 * Verify a user and sign in.
 * If sign in was succesful, returns JWT.
 * @param {User sign-in data} user
 */
const signin = async (user) => {
  try {
    let response = await fetch("/auth/signin/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(user),
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

/**
 * Signs the signed in user out.
 */
const signout = async () => {
  try {
    let response = await fetch("/auth/signout/", { method: "GET" });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

export { signin, signout };
