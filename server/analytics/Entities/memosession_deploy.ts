import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


//class name has to be the table name in the schema
@Entity("memo_deploy")
export class MemoDeployAnalytics extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;
    
    @Column({type: 'varchar', length: 45})
    message!: string;

    @Column({type: 'varchar', length: 64, nullable:true})
    key?: string;

    @Column({type: 'varchar', length: 100, nullable:true})
    secretKeyWord?: string;

    @Column({type: 'varchar', length: 100, nullable:true})
    locationName?: string;

    @Column({type: 'char', length: 36, nullable:true})
    locationID?: string;

    @Column({type: 'char', length: 36, nullable:true})
    memoryID?: string;

    @Column({type: 'json', nullable:true})
    users?: JSON

    //@Column({type: 'datetime'})
    @CreateDateColumn()
    timestamp!: Date;

}