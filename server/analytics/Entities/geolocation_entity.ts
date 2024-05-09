import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { IpGeolocationAnalytics } from "./ipgeolocation";


//class name has to be the table name in the schema
@Entity("geolocation_entity")
export abstract class GeolocationEntitiy extends BaseEntity {

    
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type: 'varchar', length: 45})
    ip_address!: string;

    @ManyToOne(() => IpGeolocationAnalytics, geoLocation => geoLocation.connections)
    @JoinColumn({ name: 'ip_address', referencedColumnName: 'ipaddress' })
    geoLocation!: IpGeolocationAnalytics;

}