import "./App.css";

import React, { useState, useContext } from "react";

import { Context as AuthContext } from "../src/contexts/AuthContext";

function App() {
  const [cred, setCred] = useState({ email: "", password: "", name: "" });
  const { signup, signin, signout, tryLocalSignIn } = useContext(AuthContext);

  return (
    <div>
      <form>
        <h1>sign up</h1>
        <input
          value={cred.email}
          onChange={(e) => setCred({ ...cred, email: e.target.value })}
          placeholder="email"
        ></input>
        <input
          value={cred.password}
          onChange={(e) => setCred({ ...cred, password: e.target.value })}
          placeholder="password"
        ></input>
        <input
          value={cred.name}
          onChange={(e) => setCred({ ...cred, name: e.target.value })}
          placeholder="name"
        ></input>

        <button
          onClick={(e) => {
            e.preventDefault();
            console.log(cred);
            signup(cred);
          }}
        >
          sign up
        </button>
      </form>

      <form>
        <h1>sign in</h1>
        <input
          value={cred.email}
          onChange={(e) => setCred({ ...cred, email: e.target.value })}
          placeholder="email"
        ></input>
        <input
          value={cred.password}
          onChange={(e) => setCred({ ...cred, password: e.target.value })}
          placeholder="password"
        ></input>
        <button
          onClick={(e) => {
            e.preventDefault();
            console.log(cred);
            signin(cred);
          }}
        >
          sign in
        </button>
        <br></br> <br></br>
        <button
          onClick={(e) => {
            e.preventDefault();
            tryLocalSignIn();
          }}
        >
          try local sign in with cookie
        </button>
        <br></br> <br></br>
        <button
          onClick={(e) => {
            e.preventDefault();
            signout();
          }}
        >
          signout
        </button>
      </form>
    </div>
  );
}

export default App;
