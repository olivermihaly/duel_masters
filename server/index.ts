import "reflect-metadata";
import express from "express";
import { dataSource } from "./dataSource";
import { User } from "./entity/user";
import { getAllUsers, getUserByName } from "./functions";
import { WebSocketServer, WebSocket } from "ws";

const app = express();
const PORT = process.env.PORT || 3000;

dataSource
  .initialize()
  .then(async () => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    const wss = new WebSocketServer({ port: 8080 });

    wss.on("connection", (ws: WebSocket) => {
      console.log("Client connected");

      ws.on("message", async (message: string | Buffer) => {
        try {
          const jsonString = message.toString();
          const { name, password } = JSON.parse(jsonString);
          const userRepository = dataSource.getRepository(User);
          const user = await userRepository.findOneBy({ name });

          console.log(name, password);

          if (user && user.password === password) {
            ws.send(
              JSON.stringify({ status: "success", message: "Login successful" })
            );
          } else {
            ws.send(
              JSON.stringify({
                status: "error",
                message: "Invalid credentials",
              })
            );
          }
        } catch (error) {
          console.error("Error handling message:", error);
          ws.send(
            JSON.stringify({ status: "error", message: "An error occurred" })
          );
        }
      });

      ws.on("close", () => {
        console.log("Client disconnected");
      });
    });
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });
