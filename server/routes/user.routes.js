import express from "express";
import userCtrl from "../controllers/user.controller";
import authCtrl from "../controllers/auth.controller";

const router = express.Router();

/*
Listing users with GET
Creating a new user with POST
*/
router.route("/api/users").get(userCtrl.list).post(userCtrl.create);

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

/* 
When a route is called with the "userId" param,
express will run this function (loads the user) and then call next().
*/
router.param("userId", userCtrl.userByID);

export default router;
