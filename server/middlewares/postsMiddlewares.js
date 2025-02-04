import postModel from "../models/postModel.js";
import handleError from "../utils/handleError.js";

export let createPostMiddleware = handleError(async (req, res, next) => {
  let lastPost = await postModel.find({}).sort({ createdAt: -1 }).limit(1);
  if (lastPost.length > 0) {
    req.body.id = lastPost[0].id + 1;
  } else {
    req.body.id = 1;
  }
  next();
});
