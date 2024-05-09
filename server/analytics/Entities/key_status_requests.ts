import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Responses } from "../../ws-magic-bridge/responses";
import { GeolocationEntitiy } from "./geolocation_entity";


//class name has to be the table name in the schema
@Entity("key_status_requests")
export class KeyStatusRequestsAnalytics extends GeolocationEntitiy {

    @Column({type: 'tinyint', width:1, nullable:true, default:null})
    keytype!: number|null;

    @Column({type: 'varchar', length: 64})
    key!: string;

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