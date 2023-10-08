import Express from "express";
import Cors from "cors";
import morgan from "morgan";

import router from "./routes/app.routes.js";

const app = Express();

app.use(Cors());
app.use(Express.json());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.get("/", (req, res) => {
  res.send({ message: "Server runing." });
});

app.use(router);

export default app;
