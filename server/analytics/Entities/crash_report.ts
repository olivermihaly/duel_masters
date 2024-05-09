import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Responses } from "../../ws-magic-bridge/responses";
import { GeolocationEntitiy } from "./geolocation_entity";


//class name has to be the table name in the schema
@Entity("local_log_dumps")
export class LocalLogDumpsAnalytics extends GeolocationEntitiy {

    @Column({type: 'json', nullable:false})
    report!: string[];

    @Column({type: 'varchar', length: 45})
    email!: string;

    //@Column({type: 'datetime'})
    @CreateDateColumn()
    timestamp!: Date;
}