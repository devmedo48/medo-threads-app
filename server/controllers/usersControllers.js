import bcrypt from "bcryptjs";
import handleError from "../utils/handleError.js";
import userModel from "../models/userModel.js";
import postModel from "../models/postModel.js";
import jwtToken from "../utils/jwt.js";
import appError from "../utils/appError.js";
import { v2 as cloudinary } from "cloudinary";
import sendMail from "../config/nodemailer.js";
import {
  EMAIL_VERIFY_TEMPLATE as verify,
  PASSWORD_RESET_TEMPLATE as reset,
} from "../Templates/emailTemplates.js";

export let register = handleError(async (req, res, next) => {
  let { id, name, username, email, password } = req.body;
  if (password.length < 6)
    return next(
      new appError("Password must be greater than 6 or equal 6", 400)
    );
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  let { _doc } = await userModel.create({
    id,
    name,
    username,
    email,
    password: hashedPassword,
  });
  delete _doc.password;
  delete _doc._id;
  delete _doc.__v;
  delete _doc.createdAt;
  delete _doc.updatedAt;

  await jwtToken(id, res);

  let mailOptions = {
    email,
    subject: "Welcom to Medo Social App",
    text: `Welcom to Medo Social App, Your email has been created with email id: ${email}`,
  };

  await sendMail(mailOptions);

  res.status(201).json({
    message: "You have registered successfully",
    success: true,
    user: _doc,
  });
});

export let login = handleError(async (req, res, next) => {
  let { userEmail, password } = req.body;
  let user = await userModel.findOne({
    $or: [{ email: userEmail }, { username: userEmail }],
  });
  if (user) {
    let isPasswordCorrect = await bcrypt.compare(password, user.password);
    delete user._doc._id;
    delete user._doc.__v;
    delete user._doc.password;
    delete user._doc.createdAt;
    delete user._doc.updatedAt;
    if (isPasswordCorrect) {
      await jwtToken(user.id, res);
      let mailOptions = {
        email: req.body.email,
        subject: "welcom to Medo Social App",
        html: "<h1 style='color:blue;text-align:center'>welcome to Medo Social App</h1>",
      };

      await sendMail(mailOptions);
      res.json({
        message: "You have loggedin successfully",
        success: true,
        user,
      });
    } else {
      next(new appError("Wrong password", 400));
    }
  } else {
    next(new appError("User is not found", 404));
  }
});

export let logout = handleError(async (req, res, next) => {
  res.cookie("token", "", { maxAge: 1 });
  res.json({
    message: "You have loggedout successfully",
    success: true,
  });
});

export let updateUser = handleError(async (req, res, next) => {
  let { userId, name, username, email, profilePic, bio } = req.body;
  let user = await userModel.findOne({ id: userId }, { password: 0 });
  if (!user) return next(new appError("User is not found", 404));
  if (username) {
    let isUsername = await userModel.findOne({ username });
    if (isUsername && username !== user.username)
      return next(new appError("Username has already used", 400));
  }
  if (email) {
    let isEmail = await userModel.findOne({ email });
    if (isEmail && email !== user.email)
      return next(new appError("Email has already used", 400));
  }
  if (profilePic) {
    if (user.profilePic) {
      if (user.profilePic !== profilePic) {
        await cloudinary.uploader.destroy(
          user.profilePic.split("/").pop().split(".")[0]
        );
        const { secure_url } = await cloudinary.uploader.upload(profilePic);
        profilePic = secure_url;
      } else {
        profilePic = user.profilePic;
      }
    } else {
      const { secure_url } = await cloudinary.uploader.upload(profilePic);
      profilePic = secure_url;
    }
  } else {
    if (user.profilePic) {
      await cloudinary.uploader.destroy(
        user.profilePic.split("/").pop().split(".")[0]
      );
    }
  }

  user.name = name || user.name;
  user.username = username || user.username;
  user.email = email || user.email;
  user.profilePic = profilePic;
  user.bio = bio || user.bio;
  user = await user.save();
  await postModel.updateMany(
    { "replies.userId": userId },
    {
      $set: {
        "replies.$[reply].username": user.username,
        "replies.$[reply].name": user.name,
        "replies.$[reply].userProfilePic": user.profilePic,
      },
    },
    { arrayFilters: [{ "reply.userId": userId }] }
  );
  delete user._doc._id;
  delete user._doc.__v;
  delete user._doc.createdAt;
  delete user._doc.updatedAt;

  res.json({
    message: "You have updated successfully",
    success: true,
    user,
  });
});

export let getUserProflile = handleError(async (req, res, next) => {
  let { query } = req.params;
  let user;
  if (isNaN(query)) {
    user = await userModel.findOne(
      { username: query },
      { password: 0, __v: 0, _id: 0, updatedAt: 0 }
    );
  } else {
    user = await userModel.findOne(
      { id: query },
      { password: 0, __v: 0, _id: 0, updatedAt: 0 }
    );
  }
  if (!user) return next(new appError("User is not found", 404));
  res.json({
    success: true,
    user,
  });
});

export let searchUsers = handleError(async (req, res, next) => {
  let { query } = req.params;
  let regexp = new RegExp("^" + query);
  let users = await userModel.find(
    { $or: [{ name: regexp }, { username: regexp }] },
    { password: 0, __v: 0, _id: 0, updatedAt: 0 }
  );

  if (!users || users.length < 1)
    return next(new appError("User is not found", 404));
  res.json({
    success: true,
    users,
  });
});

export let getSuggestedUsers = handleError(async (req, res, next) => {
  let { userId } = req.body;
  let userFollowedByYou = await userModel
    .find({ id: userId })
    .select("following");
  let users = await userModel.aggregate([
    {
      $match: {
        id: { $ne: userId },
      },
    },
    {
      $sample: { size: 10 },
    },
  ]);
  let filteredUsers = users.filter(
    (user) => !userFollowedByYou[0].following.includes(user.id)
  );
  let suggestedUsers = filteredUsers.slice(0, 4);
  res.json({
    success: true,
    users: suggestedUsers,
  });
});

export let followUnfollow = handleError(async (req, res, next) => {
  let { userId } = req.body;
  let id = +req.params.id;
  if (id === userId)
    return next(new appError("You cannot follow/unfollow yourself", 403));
  let currentUser = await userModel.findOne({ id: userId }, { password: 0 });
  let userToModify = await userModel.findOne({ id }, { password: 0 });
  let foo = "follow";
  if (!currentUser && !userToFollow)
    return next(new appError("User is not found", 404));
  if (currentUser.following.includes(id)) {
    currentUser.following.remove(id);
    userToModify.followers.remove(userId);
    foo = "unfollow";
  } else {
    currentUser.following.push(id);
    userToModify.followers.push(userId);
  }
  await currentUser.save();
  await userToModify.save();
  delete currentUser._doc._id;
  delete currentUser._doc.__v;
  res.json({
    message: `You have ${foo} ${userToModify.name} successfully`,
    success: true,
    user: currentUser,
  });
});

export let sendVerifyOtp = handleError(async (req, res, next) => {
  let id = req.body.userId;

  let user = await userModel.findOne({ id }, { password: 0 });

  if (user) {
    if (user.isVerifyed) {
      return next(new appError("This account has been already verifyed", 400));
    } else {
      let otp = String(Math.floor(100000 + Math.random() * 900000));
      user.verifyOtp = otp;
      user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
      await user.save();
      let html = verify
        .replace("{{otp}}", otp)
        .replace("{{email}}", user.email);
      let mailOptions = {
        email: user.email,
        subject: "Account Verificaion OTP",
        html,
      };
      await sendMail(mailOptions);

      res.json({
        success: true,
        message: "verification OTP is sent to your email",
      });
    }
  } else {
    return next(new appError("User is not found. Please register frist", 404));
  }
});

export let verifyEmail = handleError(async (req, res, next) => {
  let id = req.body.userId;
  let otp = req.body.otp;
  let user = await userModel.findOne({ id }, { password: 0 });
  if (!otp) {
    return next(new appError("Missing Detailes", 400));
  }
  if (!user) {
    return next(new appError("User is not found. Please register frist", 404));
  }
  if (user.verifyOtpExpireAt < Date.now()) {
    return next(new appError("OTP is expired. please generate a new OTP", 400));
  }
  if (otp === user.verifyOtp) {
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;
    user.isVerifyed = true;
    await user.save();
    res.json({
      success: true,
      message: "your email has been verifyed successfully",
    });
  } else {
    return next(new appError("Wrong OTP", 400));
  }
});

export let sendResetOtp = handleError(async (req, res, next) => {
  let email = req.query.email;
  if (!email) {
    return next(new appError("Email is required", 400));
  }

  let user = await userModel.findOne({ email }, { password: 0 });

  if (user) {
    let otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;
    await user.save();

    let html = reset.replace("{{otp}}", otp).replace("{{email}}", email);
    let mailOptions = {
      email,
      subject: "Reset password OTP",
      html,
    };
    await sendMail(mailOptions);

    res.json({
      success: true,
      message: "reset password OTP is sent to your email",
    });
  } else {
    return next(new appError("User is not found", 404));
  }
});

export let checkResetOtp = handleError(async (req, res, next) => {
  let { otp, email } = req.body;
  let user = await userModel.findOne(
    { email },
    {
      __v: 0,
      _id: 0,
      password: 0,
    }
  );
  if (user) {
    if (otp !== user.resetOtp) {
      return next(new appError("Wrong OTP", 404));
    }
    if (user.resetOtpExpireAt < Date.now) {
      return next(new appError("OTP is expired. genrate new OTP", 404));
    }
    res.json({
      success: true,
      message: "correct otp",
    });
  } else {
    return next(new appError("User is not found", 404));
  }
});

export let resetPassword = handleError(async (req, res, next) => {
  let { email, otp, password } = req.body;
  if (password.length < 6)
    return next(
      new appError("Password length must be greater than 6 chars", 400)
    );
  let user = await userModel.findOne({ email });

  if (user) {
    if (user.resetOtpExpireAt < Date.now()) {
      return next(
        new appError("OTP is expired. please generate a new OTP", 400)
      );
    }
    if (otp === user.resetOtp) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.resetOtp = "";
      user.resetOtpExpireAt = 0;
      user.password = hashedPassword;
      await user.save();
      res.json({
        success: true,
        message: "your password has been reset successfully",
      });
    } else {
      return next(new appError("Wrong OTP", 400));
    }
  } else {
    return next(new appError("User is not found", 404));
  }
});
