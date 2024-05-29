import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import "reflect-metadata";

@Entity("users")
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 64 })
  name!: string;

  @Column({ type: "varchar", length: 64 })
  password!: string;
}
