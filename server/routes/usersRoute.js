import express from "express";
import {
  followUnfollow,
  getSuggestedUsers,
  getUserProflile,
  login,
  logout,
  register,
  searchUsers,
  updateUser,
} from "../controllers/usersControllers.js";
import { registerMiddlewares } from "../middlewares/usersMiddlewares.js";
import verifyToken from "../middlewares/verifyToken.js";
let router = express.Router();

router.post("/register", registerMiddlewares, register);
router.post("/login", login);
router.post("/logout", logout);
router.put("/update", verifyToken, updateUser);
router.get("/suggested", verifyToken, getSuggestedUsers);
router.put("/follow/:id", verifyToken, followUnfollow);
router.get("/profile/:query", getUserProflile);
router.get("/search/:query", searchUsers);

export default router;
