import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Responses } from "../../ws-magic-bridge/responses";


//class name has to be the table name in the schema
@Entity("aprove_beta_tester_requests")
export class approveBetaTesterRequestAnalytics extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;
    
    @Column({type: 'varchar', length: 100, nullable:true, default:null})
    adminEmail!: string|null;
    
    @Column({type: 'varchar', length: 100})
    approvedEmail!: string;

    @Column({type: 'int'})
    response!: Responses;

    @Column({type: 'text', nullable:true, default:null})
    responseDetails?: string|null;

    //@Column({type: 'datetime'})
    @CreateDateColumn()
    timestamp!: Date;

}