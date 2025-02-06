import express from "express";
import {
  checkResetOtp,
  followUnfollow,
  getSuggestedUsers,
  getUserProflile,
  login,
  logout,
  register,
  resetPassword,
  searchUsers,
  sendResetOtp,
  sendVerifyOtp,
  updateUser,
  verifyEmail,
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

router.get("/sendverifyotp", verifyToken, sendVerifyOtp);
router.post("/verifyemail", verifyToken, verifyEmail);
router.get("/sendresetotp", sendResetOtp);
router.post("/checkresetotp", checkResetOtp);
router.post("/resetpassword", resetPassword);

export default router;
