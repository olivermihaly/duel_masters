import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import "reflect-metadata";

@Entity("cards")
export class Card extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 64 })
  name!: string;

  @Column({ type: "int" })
  manaCost!: number;

  @Column({ type: "int" })
  attackPower!: number;

  @Column({ type: "varchar", length: 256 })
  description!: string;
}
