import express from "express";
import userCtrl from "../controllers/user.controller";
import authCtrl from "../controllers/auth.controller";

const router = express.Router();

/*
Listing users with GET
Creating a new user with POST
*/
router.route("/api/users").get(userCtrl.list).post(userCtrl.create);

/**
 * following api routes
 */
router
  .route("/api/users/follow")
  .put(
    authCtrl.requireSignin,
    userCtrl.addUserFollowingList,
    userCtrl.addUserFollowedByList
  );

router
  .route("/api/users/unfollow")
  .put(
    authCtrl.requireSignin,
    userCtrl.removeUserFollowingList,
    userCtrl.removeUserFollowedByList
  );

// get default user photo. needs to be above fetch user (confused :userId)
router.route("/api/users/defaultphoto").get(userCtrl.defaultPhoto);
/* 
Fetching a user with GET
Updating a user with PUT
Deleting a user with DELETE
*/
router
  .route("/api/users/:userId")
  .get(authCtrl.requireSignin, userCtrl.read)
  .put(authCtrl.requireSignin, userCtrl.update)
  .delete(authCtrl.requireSignin, userCtrl.remove);

// Fetching photos routes - checks if there is a photo attached to profile, if not returns default photo
router
  .route("/api/users/photo/:userId")
  .get(userCtrl.photo, userCtrl.defaultPhoto);

/* 
When a route is called with the "userId" param,
express will run this function (loads the user) and then call next().
*/
router.param("userId", userCtrl.userByID);

export default router;
