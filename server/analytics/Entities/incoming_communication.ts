import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Events } from "../../ws-magic-bridge/events";


//class name has to be the table name in the schema
@Entity("incoming_communication_analytics")
export class incomingCommunicationAnalytics extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type: 'varchar', length: 100})
    socketEvent!: Events;

    @Column({type: 'varchar', length: 100, nullable:true, default:null})
    userID?: string;

    @Column({type: 'varchar', length: 100, nullable:true, default:null})
    userEmail?: string|null;

    @Column({type: 'int', nullable:true, default:null})
    socketMessageID?: number|null;

    //@Column({type: 'datetime'})
    @CreateDateColumn()
    timestamp!: Date;

}