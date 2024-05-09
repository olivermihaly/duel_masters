import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";


//class name has to be the table name in the schema
@Entity("server")
export class ServerAnalytics extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type: 'tinyint', width: 1})
    type!: number;

    @Column({type: 'int'})
    level!: number;

    @Column({type: 'varchar', length: 45})
    message!: string;
    
    //@Column({type: 'datetime'})
    @CreateDateColumn()
    timestamp!: Date;

}