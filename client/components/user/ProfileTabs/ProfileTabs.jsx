import React, { useState } from "react";
import PropTypes from "prop-types";
import FollowGrid from "../FollowGrid/FollowGrid.jsx";
import PostList from "../../post/PostList/PostList.jsx";

export default function ProfileTabs(props) {
  const [tab, setTab] = useState(0);

  const handleTabChange = (event, value) => {
    setTab(value);
  };

  return (
    <div>
      <ul value={tab} onChange={handleTabChange}>
        <li>Posts</li>
        <li>Following</li>
        <li>Followers</li>
      </ul>

      {tab === 0 && (
        <TabContainer>
          <PostList removeUpdate={props.removePostUpdate} posts={props.posts} />
        </TabContainer>
      )}
      {tab === 1 && (
        <TabContainer>
          <FollowGrid people={props.user.following} />
        </TabContainer>
      )}
      {tab === 2 && (
        <TabContainer>
          <FollowGrid people={props.user.followers} />
        </TabContainer>
      )}
    </div>
  );
}

ProfileTabs.propTypes = {
  user: PropTypes.object.isRequired,
  removePostUpdate: PropTypes.func.isRequired,
  posts: PropTypes.array.isRequired,
};

const TabContainer = (props) => {
  return <div>{props.children}</div>;
};

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};
