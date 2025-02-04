import mongoose from "mongoose";

export default function database() {
  try {
    mongoose
      .connect(process.env.DB_URL)
      .then(() => console.log("database is connected"));
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}
