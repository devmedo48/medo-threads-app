import { v2 as cloudinary } from "cloudinary";
import postModel from "../models/postModel.js";
import userModel from "../models/userModel.js";
import appError from "../utils/appError.js";
import handleError from "../utils/handleError.js";

export let createPost = handleError(async (req, res, next) => {
  let { userId, id, text, imgs } = req.body;
  const maxLength = 500;
  if (text.length > maxLength)
    return next(new appError(`Text must be less than ${maxLength} characters`));
  let images = [];
  if (imgs) {
    for (let img of imgs) {
      let { secure_url } = await cloudinary.uploader.upload(img);
      images.push(secure_url);
    }
  }
  let post = await postModel.create({
    id,
    text,
    imgs: images,
    postedBy: userId,
  });
  delete post._doc._id;
  delete post._doc.__v;
  delete post._doc.createdAt;
  delete post._doc.updatedAt;
  res.status(201).json({
    success: true,
    message: "post has been created successfully",
    post,
  });
});

export let getPost = handleError(async (req, res, next) => {
  let id = +req.params.id;
  let post = await postModel.findOne({ id }, { _id: 0, __v: 0, updatedAt: 0 });
  if (!post) return next(new appError("Post not found", 404));
  res.json({
    success: true,
    post,
  });
});

export let deletePost = handleError(async (req, res, next) => {
  let id = +req.params.id;
  let { userId } = req.body;
  let post = await postModel.findOne({ id }, { _id: 0, __v: 0, updatedAt: 0 });
  if (post.imgs) {
    for (let img of post.imgs) {
      await cloudinary.uploader.destroy(img.split("/").pop().split(".")[0]);
    }
  }
  if (!post) return next(new appError("Post not found", 404));
  if (post.postedBy !== userId)
    return next(new appError("Unauthorized to delete post", 401));
  await postModel.deleteOne({ id });
  res.json({
    success: true,
    message: "post has deleted successfully",
  });
});

export let likeUnlike = handleError(async (req, res, next) => {
  let { userId } = req.body;
  let id = +req.params.id;

  let postToModify = await postModel.findOne({ id });

  let foo = "liked";
  if (!postToModify) return next(new appError("Post is not found", 404));
  if (postToModify.likes.includes(userId)) {
    postToModify.likes.remove(userId);
    foo = "unliked";
  } else {
    postToModify.likes.push(userId);
  }
  await postToModify.save();
  res.json({
    message: `You have ${foo} post successfully`,
    success: true,
    post: postToModify,
  });
});

export let replyPost = handleError(async (req, res, next) => {
  let { userId, text } = req.body;
  let id = +req.params.id;

  let post = await postModel.findOne({ id });
  let user = await userModel.findOne({ id: userId });

  if (!post) return next(new appError("Post is not found", 404));
  let maxLength = 200;
  if (text.length > maxLength)
    return next(new appError(`Text must be less than ${maxLength} characters`));
  let reply = {
    userId,
    text,
    userProfilePic: user.profilePic,
    name: user.name,
    username: user.username,
    createdAt: Date.now(),
  };
  post.replies.push(reply);
  await post.save();
  res.json({
    message: `You have reply post successfully`,
    success: true,
    post,
  });
});

export let getFeedPost = handleError(async (req, res, next) => {
  let { userId } = req.body;
  let user = await userModel.findOne({ id: userId });
  if (user.following.length === 0)
    return next(new appError("you don't have any following", 404));
  let feedPosts = await postModel
    .find({ postedBy: { $in: user.following } })
    .sort({ createdAt: -1 });
  if (!feedPosts || feedPosts.length < 1)
    return next(new appError("No posts yet", 404));
  for (let feed in feedPosts) delete feedPosts[feed]._doc._id;
  res.json({
    success: true,
    feedPosts,
  });
});

export let getProfilePost = handleError(async (req, res, next) => {
  let { id } = req.params;
  let posts = await postModel.find({ postedBy: id }).sort({ createdAt: -1 });
  if (!posts || posts.length < 1)
    return next(new appError("No posts yet", 404));
  // for (let posts in posts) delete posts[post]._doc._id;
  res.json({
    success: true,
    posts,
  });
});
