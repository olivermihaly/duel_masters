import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Responses } from "../../ws-magic-bridge/responses";


//class name has to be the table name in the schema
@Entity("server_response")
export class serverResponseAnalytics extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type: 'varchar', length: 100})
    userID!: string;

    @Column({type: 'varchar', length: 100, nullable:true, default:null})
    userEmail?: string|null;

    @Column({type: 'int'})
    response!: Responses;

    @Column({type: 'text', nullable:true, default:null})
    responseDetails?: string|null;

    @Column({type: 'int', nullable:true, default:null})
    socketMessageID?: number|null;

    //@Column({type: 'datetime'})
    @CreateDateColumn()
    timestamp!: Date;

}