import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { LogType } from "../analytics";


//class name has to be the table name in the schema
@Entity("server_logs")
export class ServerLogsAnalytics extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type: 'tinyint', width: 1}) //here width is the display width
    type!: LogType;

    @Column({type: 'varchar', length:250})
    details!: string;
    
    //@Column({type: 'datetime'})
    @CreateDateColumn()
    timestamp!: Date;

}