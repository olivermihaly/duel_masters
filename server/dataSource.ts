import { DataSource } from "typeorm";
import { Card } from "./entity/card";
import { User } from "./entity/user";

export const dataSource = new DataSource({
  type: "mariadb",
  host: "192.168.0.65",
  username: "duel_masters_db",
  password: "Duel_Masters123@",
  database: "duel_masters",
  synchronize: true,
  entities: [Card, User],
});
