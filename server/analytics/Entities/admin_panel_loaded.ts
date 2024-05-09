import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Responses } from "../../ws-magic-bridge/responses";
import { GeolocationEntitiy } from "./geolocation_entity";


//class name has to be the table name in the schema
@Entity("admin_panel_loaded")
export class adminPanelLoadedAnalytics extends GeolocationEntitiy {

    //@Column({type: 'datetime'})
    @CreateDateColumn()
    timestamp!: Date;

}