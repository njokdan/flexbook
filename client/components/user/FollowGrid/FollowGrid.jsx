import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export default function FollowGrid(props) {
  return (
    <div className={classes.root}>
      <div>
        {props.people.map((person, i) => {
          return (
            <div key={i}>
              <Link to={"/user/" + person._id}>
                <img src={"/api/users/photo/" + person._id} width="150" />
                <h3>{person.name}</h3>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

FollowGrid.propTypes = {
  people: PropTypes.array.isRequired,
};
