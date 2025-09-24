import http from "http";
import dotenv from "dotenv";
dotenv.config();

import serverConfig from "./config/server.config";
import KafkaServer from "./events";
import app from "./app";

const server = http.createServer(app);

const onError = (error: NodeJS.ErrnoException) => {
  if (error.syscall !== "listen") throw error;

  const bind = typeof serverConfig.port === "string"
    ? "Pipe " + serverConfig.port
    : "Port " + serverConfig.port;

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

const onClose = () => {
  KafkaServer.disconnect();
  process.exit(0);
};

const start = async () => {
  try {
    // Kafka server
    await KafkaServer.listen();

    // Express server
    server.listen(serverConfig.port, () => console.log(`Server is running on port \t\t: ${serverConfig.port}`));
    server.on("error", onError);
    server.on("close", onClose);
  } catch (error) {
    console.error("Error on running server: ", error);
  };
};

start();