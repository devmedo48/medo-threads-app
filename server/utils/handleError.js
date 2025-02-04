import appError from "./appError.js";

export default function handleError(asyncFunction) {
  return (req, res, next) => {
    asyncFunction(req, res, next).catch((error) => {
      next(new appError(error.message, 400));
    });
  };
}
