import { createConnection, BaseEntity, getRepository, getConnection, getMetadataArgsStorage, DataSource, In } from "typeorm";
import * as dotenv from "dotenv"
import * as path from 'path'
import { EventDispatcher } from "../eventDispatcher"
import {CONFIG } from "../globals"
import fetch from "cross-fetch"
  
import { Responses } from "../ws-magic-bridge/responses";
import { AdminLogInAnalytics } from "./Entities/admin_log_in";
import { AdminRegistrationAnalytics } from "./Entities/admin_registration";
import { ConnectionsAnalytics } from "./Entities/connections";
import { KeyStatusRequestsAnalytics } from "./Entities/key_status_requests";
import { ServerAnalytics } from "./Entities/server";
import { UserLogInAnalytics } from "./Entities/user_log_in";
import { UserRegistrationAnalytics } from "./Entities/user_registration";
import { MemoDeployAnalytics } from "./Entities/memosession_deploy";
import { User } from "../user";
import { serverResponseAnalytics } from "./Entities/server_responses";
import { incomingCommunicationAnalytics } from "./Entities/incoming_communication";
import { outgoingCommunicationAnalytics } from "./Entities/outgoing_communication";
import { ServerLogsAnalytics } from "./Entities/server_logs";
import { AccountTypes, FeedbackMessageType } from "../ws-magic-bridge/user";
import { IpGeolocationAnalytics } from "./Entities/ipgeolocation";
import { GeolocationEntitiy } from "./Entities/geolocation_entity";

dotenv.config({ path: path.resolve(__dirname, '../process.env') })

if(CONFIG.DEBUG){
    process.on('unhandledRejection', (error) => {
        console.error(error);
        process.exit(1);
      });
}

let appDataSource:any
let typeormReady = false

if(CONFIG.ANALYTICS_ENABLED){
    try{
        
        appDataSource = new DataSource({
            type: "mysql",
            host:"127.0.0.1",
            database: CONFIG.ANALYTICS_DB_SCHEMA,
            username: CONFIG.DB_USER,
            password: CONFIG.DB_PASSWORD,
            logging: CONFIG.ANALYTICS_LOGGING,
            synchronize: true,
            entities: [AdminLogInAnalytics, AdminRegistrationAnalytics, ConnectionsAnalytics, ServerAnalytics,
                        KeyStatusRequestsAnalytics, MemoDeployAnalytics, UserLogInAnalytics, UserRegistrationAnalytics,
                        serverResponseAnalytics, incomingCommunicationAnalytics, outgoingCommunicationAnalytics,
                    ServerLogsAnalytics, IpGeolocationAnalytics, GeolocationEntitiy]
          });
         
         appDataSource.initialize().then(()=>{typeormReady=true});

    }
    catch(e){
        console.log(e)
    }
}
  
enum AnalyticsEvents{
    authenticateAccountRequest = 'authenticateAccountRequest',
    registerAccountRequest = 'registerAccountRequest',
    authenticateAdminAccountRequest = 'authenticateAdminAccountRequest',
    registerAdminAccountRequest = 'registerAdminAccountRequest',
    connectionsRequest = 'connectionsRequest',
    keyStatusRequest = 'keyStatusRequest',
    saveServerLog = 'saveServerLog',
    dropDeployLog = 'dropDeployLog'

}

export const analyticsEventController = new EventDispatcher()

export enum LogType{
    debug = 0,
    info = 1,
    warning=2,
    error=3,
    criticalError=4
}

class Analytics{
    static printErrors = true
    private static logCounter = 0
    static eventController = new EventDispatcher()
    static async serverStarted(){
        // create logs here

        
    }
    static async authenticateAccountRequest(user:User, email:string, response:Responses){
        //dont forget to log ip. ip geodata should only be fetched on admin panel to reduce # of calls maybe?
        if(!typeormReady){
            return
        }
        if(user.account?.accountType === AccountTypes.user){
            try{
                //const foundConnection = await ConnectionsAnalytics.findOne({where:{ip_address:user.ipAddress}})
                let count:string = /*foundConnection?foundConnection.country:*/"Unknown"
                let city:string = /*foundConnection?foundConnection.city:*/"Unknown"
                let regi:string = /*foundConnection?foundConnection.region:*/"Unknown"
                UserLogInAnalytics.insert({message:"", email:user.account.email, response:response, ip_address:user.ipAddress/*, city:city.slice(0,100), country:count.slice(0,100), region:regi.slice(0,100)*/})
            }
            catch(e:any){
                console.log(e)
            }
        }else{
            Analytics.logWarning(`Failed login attempt with email: ${email}`)
        }
    }
    static async authenticateAdminAccountRequest(user:User, email:string, response:Responses){
        //dont forget to log ip. ip geodata should only be fetched on admin panel to reduce # of calls maybe?
        if(!typeormReady){
            return
        }
        if(user.account?.accountType === AccountTypes.admin){
            try{
                const foundConnection = await ConnectionsAnalytics.findOne({where:{ip_address:user.ipAddress}})
                let count:string = /*foundConnection?foundConnection.country:*/"Unknown"
                let city:string = /*foundConnection?foundConnection.city:*/"Unknown"
                let regi:string = /*foundConnection?foundConnection.region:*/"Unknown"
                AdminLogInAnalytics.insert({message:"", email:user.account.email, response:response, ip_address:user.ipAddress/*, city:city.slice(0,100), country:count.slice(0,100), region:regi.slice(0,100)*/})
            }
            catch(e:any){
                console.log(e)
            }
        }else{
            Analytics.logWarning(`Failed admin login attempt with email: ${email}`)
        }
    }
    
  

    static async logDebug(details:string|Object){
        if(!typeormReady){
            return
        }
        if (Analytics.printErrors){
            console.log("Debug: ", details)
        }
        let detailsString = JSON.stringify(details)
        let logType = LogType.debug
        try{
            await ServerLogsAnalytics.insert({type: logType, details: detailsString.slice(0,250)})
        }
        catch(e){
            console.log(e)
        }
    }
    static async logInfo(details:string|Object){
        if(!typeormReady){
            return
        }
        if (Analytics.printErrors){
            console.log("Info: ", details)
        }
        let detailsString = JSON.stringify(details)
        let logType = LogType.info
        try{
            await ServerLogsAnalytics.insert({type: logType, details: detailsString.slice(0,250)})
        }
        catch(e){
            console.log(e)
        }
    }
    static async logWarning(details:string|Object){
        if(!typeormReady){
            return
        }
        if (Analytics.printErrors){
            console.log("Warning: ", details)
        }
        let detailsString = JSON.stringify(details)
        let logType = LogType.warning
        try{
            await ServerLogsAnalytics.insert({type: logType, details: detailsString.slice(0,250)})
        }
        catch(e){
            console.log(e)
        }
    }
    static async logError(details:string|Object){
        if(!typeormReady){
            return
        }
        if (Analytics.printErrors){
            console.log("Error:", details)
        }
        let detailsString = JSON.stringify(details)
        let logType = LogType.error
        try{
            await ServerLogsAnalytics.insert({type: logType, details: detailsString.slice(0,250)})
        }
        catch(e){
            console.log(e)
        }
    }
    static async logCriticalError(details:string|Object){
        if(!typeormReady){
            return
        }
        if (Analytics.printErrors){
            console.log("CRITICAL ERROR:", details)
        }
        let detailsString = JSON.stringify(details)
        let logType = LogType.criticalError

        try{
            await ServerLogsAnalytics.insert({type: logType, details: detailsString.slice(0,250)})
        }
        catch(e){
            console.log(e)
        }
        
    }
    static async incomingRequest(user:User, data:any/*data:SocketRequest*/){
        if(!typeormReady){
            return
        }
        try{
            await incomingCommunicationAnalytics.insert({socketEvent: data.event, userID:user.id, 
                userEmail:user.account?user.account.email:null,
                socketMessageID: data.socketMessageId!==undefined?data.socketMessageId:null})
        }
        catch(e){
            console.log(e)
        }
    }

    static async outgoingResponse(user:User, data:any/*data:SocketResponse*/){
        if(!typeormReady){
            return
        }
        try{
            await outgoingCommunicationAnalytics.insert({socketEvent: data.event, response:data.response, userID:user.id,
                responseDetails:data.responseDetails?data.responseDetails:null, 
                userEmail:user.account?user.account.email:null,
                socketMessageID: data.socketMessageId!==undefined?data.socketMessageId:null})
        }
        catch(e){
            console.log(e)
        }
    }

    static async authenticateAccountRequestHandler(email:string){
        //let timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
        //db.saveAnalyticsAuthenticateAccountRequest("Danny bunny very good",email,timestamp) //<3
        if(!typeormReady){
            return
        }
        try{
            await UserLogInAnalytics.insert({message:"Danny bunny very good",email:email});
        }
        catch(e){
            console.log(e)
        }
    } 


    static async registerAccountRequestHandler(email:string, ip_address:string, msg:string="Danny bunny very good"){
        //let timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
        //db.saveAnalyticsRegisterAccountRequest("Danny bunny very good",email,timestamp) //<3
        if(!typeormReady){
            return
        }
        try{
            await UserRegistrationAnalytics.insert({message:msg,email:email, ip_address:ip_address});
        }
        catch(e){
            console.log(e)
        }
    }

    static async getActiveUsersChartData(){
        
        const currentDate = new Date()
        const past365DaysDate = new Date();
        past365DaysDate.setDate(currentDate.getDate() - 365);

        let response: Responses
        let result: {date:string, logins:number}[] | null = null

        //////////Daily////////////

        try{
            const repository = await appDataSource.getRepository(UserLogInAnalytics)
            
            const entitiesWithin365Days = await repository
                .createQueryBuilder('entity')
                .where('entity.timestamp >= :startDate', { startDate: past365DaysDate })
                .andWhere('entity.timestamp <= :endDate', { endDate: currentDate })
                .orderBy('entity.timestamp', 'DESC')
                .getMany();
            response = Responses.success

            const countsByDay: { [date: string]: Set<string> } = {};

            //init
            for (let index = 0; index < 365; index++) {
                const dateInit = new Date()
                dateInit.setDate(currentDate.getDate() - index)
                
                if (!countsByDay[dateInit.toISOString().split('T')[0]]) {
                    countsByDay[dateInit.toISOString().split('T')[0]] = new Set();
                }
            }



            // Iterate over the retrieved entities
            entitiesWithin365Days.forEach((entity:UserLogInAnalytics) => {
                // Extract the date part of the timestamp
                const dateKey = entity.timestamp.toISOString().split('T')[0];
        
                // Ensure uniqueness of entities per day
                if (!countsByDay[dateKey]) {
                    countsByDay[dateKey] = new Set();
                }
                countsByDay[dateKey].add(entity.email);
            });

            result = []
            /*Object.values(countsByDay).forEach((set:Set<string>)=>{
                result!.push(set.size)
            })*/

            Object.keys(countsByDay).forEach((date:string)=>{
                result!.push({date:date, logins:countsByDay[date].size})
            })
        }
        catch(e){
            Analytics.logError(`Failed to get daily active users chart data: ${e}`)
            response = Responses.serverError
        }


        /////////////Weekly///////////////
        let weekly = []
        try{

            const repository = await appDataSource.getRepository(UserLogInAnalytics)

            
            for (let index = 0; index < 52; index++) {
                
                let pastNWeekDateStart = new Date();
                pastNWeekDateStart.setDate(currentDate.getDate() - 7*(index+1));

                let pastNWeekDateEnd = new Date();
                pastNWeekDateEnd.setDate(currentDate.getDate() - 7*index);

                const entitiesInTheWeek = await repository
                    .createQueryBuilder('entity')
                    .where('entity.timestamp >= :startDate', { startDate: pastNWeekDateStart })
                    .andWhere('entity.timestamp <= :endDate', { endDate: pastNWeekDateEnd })
                    .orderBy('entity.timestamp', 'DESC')
                    .getMany();
                
                const countsByWeek: { [date: string]: Set<string> } = {};

                const dateKey = pastNWeekDateStart.toISOString().split('T')[0];
                countsByWeek[dateKey] = new Set()

                // Iterate over the retrieved entities
                entitiesInTheWeek.forEach((entity:UserLogInAnalytics) => {
                    countsByWeek[dateKey].add(entity.email);
                });

                weekly.push({date: dateKey, logins:countsByWeek[dateKey].size})
            }
        }
        catch(e){
            Analytics.logError(`Failed to get weekly active users chart data: ${e}`)
            response = Responses.serverError
        }


        /////////////Monthly//////////////
        let monthly = []
        try{

            const repository = await appDataSource.getRepository(UserLogInAnalytics)

            
            for (let index = 0; index < 12; index++) {
                
                let pastNWeekDateStart = new Date();
                pastNWeekDateStart.setDate(currentDate.getDate() - 30*(index+1));

                let pastNWeekDateEnd = new Date();
                pastNWeekDateEnd.setDate(currentDate.getDate() - 30*index);

                const entitiesInTheWeek = await repository
                    .createQueryBuilder('entity')
                    .where('entity.timestamp >= :startDate', { startDate: pastNWeekDateStart })
                    .andWhere('entity.timestamp <= :endDate', { endDate: pastNWeekDateEnd })
                    .orderBy('entity.timestamp', 'DESC')
                    .getMany();
                
                const countsByWeek: { [date: string]: Set<string> } = {};

                const dateKey = pastNWeekDateStart.toISOString().split('T')[0];
                countsByWeek[dateKey] = new Set()

                // Iterate over the retrieved entities
                entitiesInTheWeek.forEach((entity:UserLogInAnalytics) => {
                    countsByWeek[dateKey].add(entity.email);
                });

                monthly.push({date: dateKey, logins:countsByWeek[dateKey].size})
            }
        }
        catch(e){
            Analytics.logError(`Failed to get monthly active users chart data: ${e}`)
            response = Responses.serverError
        }

        if(response === Responses.serverError){
            return {response:Responses.serverError, data:null}
        }

        return {response:Responses.success, data:{daily: result, monthly: monthly, weekly: weekly}}
    }


    static async authenticateAdminAccountRequestHandler(email:string){
        //let timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
        //db.saveAnalyticsAuthenticateAdminAccountRequest("Danny bunny very good",email,timestamp) //<3
        if(!typeormReady){
            return
        }
        try{
            await AdminLogInAnalytics.insert({message:"Danny bunny very good",email:email});
        }
        catch(e){
            console.log(e)
        }
    }   
    

    static async registerAdminAccountRequestHandler(email:string, ip_address:string, msg:string=""){
        //let timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
        //db.saveAnalyticsRegisterAdminAccountRequest("Danny bunny very good",email,timestamp) //<3
        if(!typeormReady){
            return
        }
        try{
            await AdminRegistrationAnalytics.insert({message:msg,email:email,ip_address:ip_address});
        }
        catch(e){
            console.log(e)
        }
    }

    static async getGeoData(ipaddress:string){
        
        let jsondata:any = null
        let geoResult = {region:'Unknown', city:'Unknown', country:'Unknown'}
        try{
            const res = await fetch("https://ipinfo.io/"+ipaddress+"/json?token="+process.env.IP_GEOLOCATION_TOKEN);
                
            if (res.status >= 400) {
                throw new Error("Bad response from server");
            }
            
            jsondata = await res.json();
        }
        catch(e){
            console.log(e)
        }
        //jsondata = JSON.parse(jsondata)
        //console.log(typeof(jsondata))
        if(jsondata){
            if(jsondata['bogon']){
                //fake/private/not valid ip address
            }
            else{
                if(jsondata['region']){
                    geoResult.region = jsondata['region']
                }
                if(jsondata['city']){
                    geoResult.city = jsondata['city']
                }
                if(jsondata['country']){
                    geoResult.country = jsondata['country']
                }
            }
        }
        
        return geoResult
    }

    static async connectionsRequestHandler(message: string, clientid:string, ipaddress: string){

        if(!typeormReady){
            return
        }
        //let timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
        
        let city : string = 'local_network'
        let country : string = 'local_network'
        let region : string = 'local_network'
        let privateip : boolean = false
        //console.log(ipaddress)
        if(ipaddress.split('.')[0]==='192'){
            if(ipaddress.split('.')[1]==='168'){
                privateip = true
                city= 'privat'
                country='privat'
                region='privat'
            }
        }
        //console.log('a2')
        if(ipaddress.split('.')[0]==='127'){
            privateip = true
            city= 'loopback'
            country='loopback'
            region='loopback'
        }
        //console.log('a3')
        if(!privateip){ 
            let foundconnection: IpGeolocationAnalytics|null = null

            try {
                foundconnection = await IpGeolocationAnalytics.findOne({where:{ipaddress:ipaddress}})
            } catch (err) {
                console.error(err);
            }


            if(foundconnection){
                //match in database
                const ts = foundconnection.timestamp
                const difftime = Date.now()-ts.getTime()
                if(difftime>7*24*60*60*1000){
                    //fetch new data and update existing entity
                    const geoResult = await Analytics.getGeoData(ipaddress)
                    foundconnection.city = geoResult.city
                    foundconnection.region = geoResult.region
                    foundconnection.country = geoResult.country
                    try{
                        await foundconnection.save()
                    }
                    catch(e){
                        console.log(e)
                    }
                    region = geoResult.region
                    city = geoResult.city
                    country = geoResult.country
                }
                else{
                    //use found information
                    region = foundconnection.region
                    city = foundconnection.city
                    country = foundconnection.country

                }
            }
            else{

                //no match
                const geoResult = await Analytics.getGeoData(ipaddress)
                try{
                    IpGeolocationAnalytics.save({ipaddress:ipaddress, region: geoResult.region, city: geoResult.city, country: geoResult.country})
                }
                catch(e){
                    console.log(e)
                }
            }
        }
        
        //db.saveAnalyticsConnections(message,clientid,ipaddress,country, region, city, timestamp) //<3
        try{
            await ConnectionsAnalytics.insert({message:message, client_id: clientid, ip_address:ipaddress/*, country:country, region:region, city:city*/ })
        }
        catch(e){
            console.log(e)
        }

    }   

    
    //deprecated, see analytics.serverLog
    static async saveServerLogRequestHandler(type:number, level: number, message:string){
        if(!typeormReady){
            return
        }
        //let timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
        //db.saveAnalyticsServerLogs(type, level, message, timestamp) //<3
        try{
            await ServerAnalytics.insert({type, level, message})
        }
        catch(e){
            console.log(e)
        }
    }

}

//Analytics.eventController.registerEvent(AnalyticsEvents.authenticateAccountRequest)
Analytics.eventController.registerEvent(AnalyticsEvents.registerAccountRequest)
//Analytics.eventController.registerEvent(AnalyticsEvents.authenticateAdminAccountRequest)
Analytics.eventController.registerEvent(AnalyticsEvents.registerAdminAccountRequest)
Analytics.eventController.registerEvent(AnalyticsEvents.connectionsRequest)
Analytics.eventController.registerEvent(AnalyticsEvents.saveServerLog)
Analytics.eventController.registerEvent(AnalyticsEvents.dropDeployLog)

if(CONFIG.ANALYTICS_ENABLED){
    //Analytics.eventController.addEventListener(AnalyticsEvents.authenticateAccountRequest,Analytics.authenticateAccountRequestHandler)
    Analytics.eventController.addEventListener(AnalyticsEvents.registerAccountRequest,Analytics.registerAccountRequestHandler)
    //Analytics.eventController.addEventListener(AnalyticsEvents.authenticateAdminAccountRequest,Analytics.authenticateAdminAccountRequestHandler)
    Analytics.eventController.addEventListener(AnalyticsEvents.registerAdminAccountRequest,Analytics.registerAdminAccountRequestHandler)
    Analytics.eventController.addEventListener(AnalyticsEvents.connectionsRequest,Analytics.connectionsRequestHandler)
    Analytics.eventController.addEventListener(AnalyticsEvents.saveServerLog,Analytics.saveServerLogRequestHandler)
}


export {Analytics, AnalyticsEvents, appDataSource}