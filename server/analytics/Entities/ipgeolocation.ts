import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { ConnectionsAnalytics } from "./connections";
import { GeolocationEntitiy } from "./geolocation_entity";


//class name has to be the table name in the schema
@Entity("ip_geolocation")
export class IpGeolocationAnalytics extends BaseEntity {

    @PrimaryColumn({type:'varchar', length:45})
    ipaddress!: string;

    @Column({type: 'varchar', length: 100, charset:'utf8mb4', collation:'utf8mb4_unicode_ci'})
    country!: string;

    @Column({type: 'varchar', length: 100, charset:'utf8mb4', collation:'utf8mb4_unicode_ci'})
    city!: string;

    @Column({type: 'varchar', length: 100, charset:'utf8mb4', collation:'utf8mb4_unicode_ci'})
    region!: string;

    @OneToMany(() => GeolocationEntitiy, connection => connection.geoLocation)
    connections!: GeolocationEntitiy[];

    @CreateDateColumn()
    timestamp!: Date;

}