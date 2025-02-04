import userModel from "../models/userModel.js";
import appError from "../utils/appError.js";
import handleError from "../utils/handleError.js";

export let registerMiddlewares = [
  handleError(async (req, res, next) => {
    let { email, username } = req.body;
    let emailExt = await userModel.findOne({ email });
    if (emailExt) {
      return next(new appError("this email is already used", 400));
    }
    let usernameExt = await userModel.findOne({ username });
    if (usernameExt) {
      return next(new appError("this username is already used", 400));
    }
    next();
  }),
  handleError(async (req, res, next) => {
    let lastUser = await userModel
      .find({}, { id: 1 })
      .sort({ createdAt: -1 })
      .limit(1);
    if (lastUser.length > 0) {
      req.body.id = lastUser[0].id + 1;
    } else {
      req.body.id = 1;
    }
    next();
  }),
];
