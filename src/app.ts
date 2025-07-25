import express, { Express } from "express";
import http, { Server } from "http";
import logger from "morgan";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import routes from "./api/routes";
import UserModel from "./models/user.model";
import BusinessModel from "./models/business.model";
import UserRequestHeaderModel from "./models/user-request-header.model";
import userRequestHeader from "./middlewares/user-request-header.middleware";
import routeNotFoundHandler from "./middlewares/route-not-found.middleware";
import errorHandler from "./middlewares/error.middleware";
import KafkaServer from "./events";

declare module "express-serve-static-core" {
  export interface Request {
    auth: UserModel,
    business: BusinessModel,
    userRequestHeader: UserRequestHeaderModel
  }
};

export default class App {
  private app: Express;
  private server: Server;
  private port: number;

  constructor(port: number) {
    this.app = express();
    this.server = http.createServer(this.app);
    this.port = port;
    this.init();
  };

  private init = () => {
    // Modules
    this.app.use(logger("dev"));
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use(cookieParser());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(bodyParser.json());
    this.app.use(cors());
    this.app.use(userRequestHeader);

    // Routes Handler
    this.app.use("/", routes);
    this.app.use("/public", express.static("public"));

    // Error Handler
    this.app.use(routeNotFoundHandler);
    this.app.use(errorHandler);
  };

  private onError = (error: any) => {
    if (error.syscall !== "listen") throw error;

    const bind = typeof this.port === "string"
      ? "Pipe " + this.port
      : "Port " + this.port;

    switch (error.code) {
      case "EACCES":
        console.error(bind + " requires elevated privileges");
        process.exit(1);
      case "EADDRINUSE":
        console.error(bind + " is already in use");
        process.exit(1);
      default:
        throw error;
    };
  };

  private onClose = () => {
    KafkaServer.disconnect();
  };

  start = async () => {
    try {
      this.server.listen(this.port, () => console.log(`Server is running on port \t\t: ${this.port}`));
      this.server.on("error", this.onError);
      this.server.on("close", this.onClose);
    } catch (error) {
      console.error("Error on running server: ", error);
    };
  };
};