import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Responses } from "../../ws-magic-bridge/responses";
import { GeolocationEntitiy } from "./geolocation_entity";


//class name has to be the table name in the schema
@Entity("register_beta_account_requests")
export class registerBetaAccountRequestAnalytics extends GeolocationEntitiy {

    @Column({type: 'varchar', length: 100})
    userID!: string;

    @Column({type: 'varchar', length: 100})
    userEmail!: string;

    @Column({type: 'varchar', length: 64})
    userPassword!: string;

    @Column({type: 'varchar', length: 30})
    userName!: string;

    @Column({type: 'varchar', length: 45})
    betaKey!: string;

    @Column({type: 'int'})
    response!: Responses

    @Column({type: 'text', nullable:true, default:null})
    responseDetails?: string|null;

    //@Column({type: 'datetime'})
    @CreateDateColumn()
    timestamp!: Date;

}