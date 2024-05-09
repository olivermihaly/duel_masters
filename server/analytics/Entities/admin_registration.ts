import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { GeolocationEntitiy } from "./geolocation_entity";


//class name has to be the table name in the schema
@Entity("admin_registration")
export class AdminRegistrationAnalytics extends GeolocationEntitiy {

    @Column({type: 'varchar', length: 45})
    message!: string;

    @Column({type: 'varchar', length: 45})
    email!: string;

    //@Column({type: 'datetime'})
    @CreateDateColumn()
    timestamp!: Date;

}