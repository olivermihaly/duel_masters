import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Responses } from "../../ws-magic-bridge/responses";
import { GeolocationEntitiy } from "./geolocation_entity";


//class name has to be the table name in the schema
@Entity("admin_log_in")
export class AdminLogInAnalytics extends GeolocationEntitiy {

    @Column({type: 'varchar', length: 45})
    message!: string;

    @Column({type: 'varchar', length: 45})
    email!: string;

    @Column({type: 'int'})
    response!: Responses;

    //@Column({type: 'datetime'})
    @CreateDateColumn()
    timestamp!: Date;

}