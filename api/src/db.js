import { connect, set } from "mongoose";

const connectDB = () =>
  new Promise((resolve, reject) => {
    (async () => {
      try {
        if (process.env.NODE_ENV === "development") set("debug", true);
        await connect(process.env.DB_URL);
        console.log("Database Connected.");
        resolve();
      } catch (err) {
        console.error("Database error: ", err);
        throw new Error("Databse error");
      }
    })();
  });

export { connectDB };
