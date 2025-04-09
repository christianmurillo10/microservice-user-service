import dotenv from "dotenv";
dotenv.config();

// Load application
import App from "./app";
import serverConfig from "./config/server.config";
import KafkaServer from "./events";

(async () => {
  // Express server
  const app = new App(Number(serverConfig.port));
  await app.start();

  // Kafka server
  KafkaServer.run();
})();