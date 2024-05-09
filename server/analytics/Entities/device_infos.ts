import { Column, CreateDateColumn, Entity } from "typeorm";
import { GeolocationEntitiy } from "./geolocation_entity";


//class name has to be the table name in the schema
@Entity("device_info")
export class DeviceInfoAnalytics extends GeolocationEntitiy {

    @Column({type: 'varchar', length: 70})
    client_id!: string;

    @Column({type: 'varchar', length: 45, nullable:true})
    brand!: string|null;

    @Column({type: 'varchar', length: 45, nullable:true})
    manufacturer!: string|null;

    @Column({type: 'varchar', length: 45, nullable:true})
    deviceType!: string|null;

    @Column({type: 'varchar', length: 45, nullable:true})
    modelName!: string|null;

    @Column({type: 'varchar', length: 45, nullable:true})
    osName!: string|null;

    @Column({type: 'varchar', length: 45, nullable:true})
    osVersion!: string|null;

    @Column({type: 'varchar', length: 45, nullable:true})
    browserName!: string|null;

    @Column({type: 'varchar', length: 45, nullable:true})
    browserVersion!: string|null;

    @CreateDateColumn()
    timestamp!: Date;

}