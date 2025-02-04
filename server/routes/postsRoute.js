import express from "express";
import {
  createPost,
  deletePost,
  getFeedPost,
  getPost,
  getProfilePost,
  likeUnlike,
  replyPost,
} from "../controllers/postsControllers.js";
import verifyToken from "../middlewares/verifyToken.js";
import { createPostMiddleware } from "../middlewares/postsMiddlewares.js";

let router = express.Router();
router.get("/feed", verifyToken, getFeedPost);
router.route("/:id").get(getPost).delete(verifyToken, deletePost);
router.post("/create", verifyToken, createPostMiddleware, createPost);
router.put("/like/:id", verifyToken, likeUnlike);
router.get("/profile/:id", getProfilePost);
router.put("/reply/:id", verifyToken, replyPost);
export default router;
