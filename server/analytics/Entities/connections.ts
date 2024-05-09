import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { IpGeolocationAnalytics } from "./ipgeolocation";
import { GeolocationEntitiy } from "./geolocation_entity";


//class name has to be the table name in the schema
@Entity("connections")
export class ConnectionsAnalytics extends GeolocationEntitiy {

    @Column({type: 'varchar', length: 45})
    message!: string;

    @Column({type: 'varchar', length: 70})
    client_id!: string;

    /*@Column({type: 'varchar', length: 45})
    ip_address!: string;

    @ManyToOne(() => IpGeolocationAnalytics, geoLocation => geoLocation.connections)
    @JoinColumn({ name: 'ip_address', referencedColumnName: 'ipaddress' },)
    geoLocation!: IpGeolocationAnalytics;*/

    /*@Column({type: 'varchar', length: 100, charset:'utf8mb4', collation:'utf8mb4_unicode_ci'})
    country!: string;

    @Column({type: 'varchar', length: 100, charset:'utf8mb4', collation:'utf8mb4_unicode_ci'})
    city!: string;

    @Column({type: 'varchar', length: 100, charset:'utf8mb4', collation:'utf8mb4_unicode_ci'})
    region!: string;*/

    //@Column({type: 'datetime'})
    @CreateDateColumn()
    timestamp!: Date;

}