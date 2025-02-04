import appError from "../utils/appError.js";
import usersRoute from "./usersRoute.js";
import postsRoute from "./postsRoute.js";
import messagesRoute from "./messagesRoute.js";
export default function mountRoutes(app) {
  app.use("/api", usersRoute);
  app.use("/api/post", postsRoute);
  app.use("/api/message", messagesRoute);
}
