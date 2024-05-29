import "reflect-metadata";
import express from "express";
import { dataSource } from "./dataSource";
import { User } from "./entity/user";

const app = express();
const PORT = process.env.PORT || 3000;

dataSource.initialize().then(() => {
  /*User.insert({ name: "zaturalma2", password: "Asd123" });
  User.insert({ name: "Candreey", password: "Asd123" });
  User.insert({ name: "Shaaw", password: "Asd123" });
  User.insert({ name: "Puffinjam", password: "Asd123" });*/
});
