import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Responses } from "../../ws-magic-bridge/responses";
import { GeolocationEntitiy } from "./geolocation_entity";


//class name has to be the table name in the schema
@Entity("signup_for_beta_testing_requests")
export class signupForBetaTestingRequestAnalytics extends GeolocationEntitiy {

    @Column({type: 'varchar', length: 100})
    userID!: string;
    
    @Column({type: 'varchar', length: 100})
    userEmail!: string;

    @Column({type: 'int'})
    response!: Responses;

    @Column({type: 'json', nullable:true, default:null})
    metadata?: JSON|null

    @Column({type: 'text', nullable:true, default:null})
    responseDetails?: string|null;

    //@Column({type: 'datetime'})
    @CreateDateColumn()
    timestamp!: Date;

}