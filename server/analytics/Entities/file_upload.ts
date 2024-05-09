import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Responses } from "../../ws-magic-bridge/responses";
import { GeolocationEntitiy } from "./geolocation_entity";


//class name has to be the table name in the schema
@Entity("file_upload")
export class FileUploadAnalytics extends GeolocationEntitiy {

    @Column({type: 'varchar', length: 36})
    mediaID!: string;

    @Column({type: 'varchar', length: 25})
    uploadRequestType!: string;

    @Column({type: 'varchar', nullable:true, default:null, length: 36})
    memoSessionID?: string|null;

    @Column({type: 'varchar', nullable:true, default:null, length: 36})
    locationID?: string|null;

    @Column({type: 'varchar', length:45})
    email!:string

    //@Column({type: 'datetime'})
    @CreateDateColumn()
    timestamp!: Date;

}