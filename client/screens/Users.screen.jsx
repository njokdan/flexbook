import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { list } from "../api/user.api";

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    list(signal).then((data) => {
      if (data && data.error) {
        console.log(data.error);
      } else {
        setUsers(data);
      }
    });

    return function cleanup() {
      abortController.abort();
    };
  }, []);

  return (
    <div>
      <h1>All Users</h1>
      {users.map((item, i) => {
        return (
          <Link to={"/user/" + item._id} key={i}>
            <button>{item.name}</button>
          </Link>
        );
      })}
    </div>
  );
}
