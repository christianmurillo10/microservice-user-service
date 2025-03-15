import dotenv from "dotenv";
dotenv.config();

// Load application
import App from "./app";
import serverConfig from "./config/server.config";

const app = new App(Number(serverConfig.port));

app.start();