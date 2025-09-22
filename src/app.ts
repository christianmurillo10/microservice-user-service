import express from "express";
import logger from "morgan";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import routes from "./api/routes";
import UserEntity from "./entities/user.entity";
import UserRequestHeaderEntity from "./entities/user-request-header.entity";
import userRequestHeader from "./middlewares/user-request-header.middleware";
import routeNotFoundHandler from "./middlewares/route-not-found.middleware";
import errorHandler from "./middlewares/error.middleware";

const app = express();

declare module "express-serve-static-core" {
  export interface Request {
    auth: UserEntity,
    userRequestHeader: UserRequestHeaderEntity
  }
};

// Modules
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(userRequestHeader);

// Routes Handler
app.use("/", routes);
app.use("/public", express.static("public"));

// Error Handler
app.use(routeNotFoundHandler);
app.use(errorHandler);

export default app;