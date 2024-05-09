import {log ,uploadPath, CONFIG} from './globals'
import * as mysql from 'mysql2/promise'
import {RowDataPacket} from 'mysql2'
import {User,Account, AccountTypes} from './user'
import { Coordinates, Location,LocationCategory, LocationFetchable } from "./ws-magic-bridge/shared_classes/location"
import { MemoSession, LocationRating} from './memorySession'
import * as path from 'path'    
import * as fs from 'fs'
import { MemoMediaData } from './mediaData'
import { Analytics, AnalyticsEvents, LogType } from './analytics/analytics'//from './analytics_old'
import { Responses } from './ws-magic-bridge/responses'
import { Drop, DropState, KeyTypes } from './ws-magic-bridge/shared_classes/drop'
import { MemoryType, Memory, MemoryFetchable } from './ws-magic-bridge/shared_classes/memory'
import { MemoSessionStatus } from './ws-magic-bridge/shared_classes/memorySession'
import { TableFilter, getLogsWithFiltersRequestData, deleteLogsRequestData, FilterCriteria } from './ws-magic-bridge/socketMessages'
import { UserDBRequests } from './dbRequests/userDBRequests'
import { MemoDBRequests } from './dbRequests/memoDBRequests'
import { LocationDBRequests } from './dbRequests/locationDBRequests'
import { BetaTestingDBRequests } from './dbRequests/betaTestingDBRequests'
import * as utils from './utils'
import { Knex } from 'knex'
import { UserHistoryDBRequests } from './dbRequests/userHistoryDBRequests'
const { createHash } = require('crypto');

function hash(msg:string) {
    return createHash('sha256').update(msg).digest('hex');
}

export class Database{
    static mySqlPool : mysql.Pool
    static knex: Knex
  
    static users = UserDBRequests
    static memos = MemoDBRequests
    static locations = LocationDBRequests
    static betaTesting = BetaTestingDBRequests
    static userHistory = UserHistoryDBRequests


    static getMemorySessions = MemoDBRequests.getMemorySessions
    static getMemoryById = MemoDBRequests.getMemoryById
    static getMemoriesOfDrop = MemoDBRequests.getMemoriesOfDrop
    static getMemoriesOfUser = MemoDBRequests.getMemoriesOfUser
    static updateMemoSessionMediaList = MemoDBRequests.updateMemoSessionMediaList
    static updateMemoSessionReview = MemoDBRequests.updateMemoSessionReview
    static updateMemoSessionStatus = MemoDBRequests.updateMemoSessionStatus
    static saveMemoSession = MemoDBRequests.saveMemoSession
    static updateMemoSession = MemoDBRequests.updateMemoSession
    static getUserMemorySessions = MemoDBRequests.getUserMemorySessions
    //static scanAndDeleteCompletedDeploySessions = MemoDBRequests.scanAndDeleteCompletedDeploySessions
    static deleteMemorySession = MemoDBRequests.deleteMemorySession
    static saveMemoryFromMemoSession = MemoDBRequests.saveMemoryFromMemoSession
    static saveMemory = MemoDBRequests.saveMemory

    static saveLocationRating = LocationDBRequests.saveLocationRating
    static saveLocation = LocationDBRequests.saveLocation
    static getLocationMemoryIds = LocationDBRequests.getLocationMemoryIds
    static getLocationRating = LocationDBRequests.getLocationRating
    static getLocationById = LocationDBRequests.getLocationById

    static addLocationToUser = UserDBRequests.addLocationToUser
    static getAllUsers = UserDBRequests.getAllUsers
    static getUserLocations = UserDBRequests.getUserLocations

    
    static async registerTestAccounts(){
        let response : Responses
        let timestamp = utils.convertDateToDatabaseFormat(new Date());
        try{
            let sqlResp = await Database.mySqlPool.query('INSERT INTO admins VALUES (?,?,?,?)', 
                ["szalaimd@gmail.com","31e7ff6a10d110a997677f0e370d190b6a15cb780894a2ced831b7798a41c76e","zatu",timestamp])
            log('Successfully registered user account:' + "szalaimd@gmail.com" + ', ', "zatu")
            response = Responses.success

        }catch(err:any){
            response = Responses.serverError
            if (err.errno === 1062) {
              response = Responses.duplicate
            } else {
              response = Responses.serverError
            }
            Analytics.logError(err)
        }

        try{
            let sqlResp = await Database.mySqlPool.query('INSERT INTO users (email, password, username, timestamp) VALUES (?,?,?,?,?)', 
                ["szalaimd@gmail.com","31e7ff6a10d110a997677f0e370d190b6a15cb780894a2ced831b7798a41c76e","zatu",timestamp])
            log('Successfully registered user account:' + "szalaimd@gmail.com" + ', ', "zatu")
            response = Responses.success

        }catch(err:any){
            response = Responses.serverError
            if (err.errno === 1062) {
              response = Responses.duplicate
            } else {
              response = Responses.serverError
            }
            Analytics.logError(err)
        }

        return {response:response}
    }

    static async generateBeaconKey(secretKeyWord:string, dropKey:string){
        let response : Responses
        let beaconKey : string = hash(secretKeyWord)
        let state : number = 0
        console.log(beaconKey)  
        try{
            let sqlResp = await Database.mySqlPool.query('INSERT INTO beacons VALUES (?,?,?,?)', 
                [beaconKey,state,secretKeyWord, dropKey])
            log('Successfully inserted beacon key:' + beaconKey + ', ', secretKeyWord)
            response = Responses.success

        }catch(err:any){
            response = Responses.serverError
            if (err.errno === 1062) {
              response = Responses.duplicate
            } else {
              response = Responses.serverError
            }
            Analytics.logError(err)
        }
    }


    static async deleteAccount(email:string){
        let response : Responses
        try{
            let [rows, fields] = await Database.mySqlPool.query<any>('DELETE FROM users WHERE email = ?', [email])
            log('Successfully deleted user account:' + email)
            if (rows != null) {
                if (rows.affectedRows === 1) {
                  //data = rows[0]
                  response = Responses.success
                } else if (rows.affectedRows === 0) {
                  response = Responses.notFound
                } else {
                  response = Responses.serverError
                  log('This was not expected to happen...')
                  console.log(rows.affectedRows)
                }
              } else {
                response = Responses.serverError
                log('This was not expected to happen...rows:', rows)
              }
        

        }catch(err:any){
            response = Responses.serverError
            if (err.errno === 1062) {
              response = Responses.duplicate
            } else {
              response = Responses.serverError
            }
            Analytics.logError(err)
        }

        return {response:response}
    }
    

    static async changeAdminPassword(email:string, old_pass:string, new_pass:string){
        let response : Responses
        try{
            let [rows, fields] = await Database.mySqlPool.query<any>('UPDATE admins SET password = ? WHERE email = ? AND password = ?', [new_pass, email, old_pass])
            log('Successfully updated admin password: ' + email + "\tfrom: " + old_pass + "\tto: " + new_pass)
            if (rows != null) {
                if (rows.affectedRows === 1) {
                  //data = rows[0]
                  response = Responses.success
                } else if (rows.affectedRows === 0) {
                  response = Responses.notFound
                } else {
                  response = Responses.serverError
                  log('This was not expected to happen...')
                  console.log(rows.affectedRows)
                }
              } else {
                response = Responses.serverError
                log('This was not expected to happen...rows:', rows)
              }
        

        }catch(err:any){
            response = Responses.serverError
            if (err.errno === 1062) {
              response = Responses.duplicate
            } else {
              response = Responses.serverError
            }
            Analytics.logError(err)
        }

        return {response:response}
    }

    static async changePassword(email:string, old_pass:string, new_pass:string){
        let response : Responses
        try{
            let [rows, fields] = await Database.mySqlPool.query<any>('UPDATE users SET password = ? WHERE email = ? AND password = ?', [new_pass, email, old_pass])
            log('Successfully updated user password: ' + email + "\tfrom: " + old_pass + "\tto: " + new_pass)
            if (rows != null) {
                if (rows.affectedRows === 1) {
                  //data = rows[0]
                  response = Responses.success
                } else if (rows.affectedRows === 0) {
                  response = Responses.notFound
                } else {
                  response = Responses.serverError
                  log('This was not expected to happen...')
                  console.log(rows.affectedRows)
                }
              } else {
                response = Responses.serverError
                log('This was not expected to happen...rows:', rows)
              }
        

        }catch(err:any){
            response = Responses.serverError
            if (err.errno === 1062) {
              response = Responses.duplicate
            } else {
              response = Responses.serverError
            }
            Analytics.logError(err)
        }

        return {response:response}
    }

    static async adminChangesPasswordForUser(email:string, new_pass:string){
      let response : Responses
      try{
          let [rows, fields] = await Database.mySqlPool.query<any>('UPDATE users SET password = ? WHERE email = ?', [new_pass, email])
          log('Successfully updated user password: ' + email + "\tto: " + new_pass)
          if (rows != null) {
              if (rows.affectedRows === 1) {
                //data = rows[0]
                response = Responses.success
              } else if (rows.affectedRows === 0) {
                response = Responses.notFound
              } else {
                response = Responses.serverError
                log('This was not expected to happen...')
                console.log(rows.affectedRows)
              }
            } else {
              response = Responses.serverError
              log('This was not expected to happen...rows:', rows)
            }
      

      }catch(err:any){
          response = Responses.serverError
          if (err.errno === 1062) {
            response = Responses.duplicate
          } else {
            response = Responses.serverError
          }
          Analytics.logError(err)
      }

      return {response:response}
  }

    static async deleteAdminAccount(email:string){
        let response : Responses
        try{
            let [rows, fields] = await Database.mySqlPool.query<any>('DELETE FROM admins WHERE email = ?', [email])
            log('Successfully deleted admin account:' + email)
            if (rows != null) {
                if (rows.affectedRows === 1) {
                  //data = rows[0]
                  response = Responses.success
                } else if (rows.affectedRows === 0) {
                  response = Responses.notFound
                } else {
                  response = Responses.serverError
                  log('This was not expected to happen...')
                  console.log(rows.affectedRows)
                }
              } else {
                response = Responses.serverError
                log('This was not expected to happen...rows:', rows)
              }
        

        }catch(err:any){
            response = Responses.serverError
            if (err.errno === 1062) {
              response = Responses.duplicate
            } else {
              response = Responses.serverError
            }
            Analytics.logError(err)
        }

        return {response:response}
    }

    static async registerAccount(email:string, password:string, username:string){
        let response : Responses
        let timestamp = utils.convertDateToDatabaseFormat(new Date());
        try{
            let sqlResp = await Database.mySqlPool.query('INSERT INTO users (email, password, username, timestamp) VALUES (?,?,?,?)', 
                [email,password,username,timestamp])
            log('Successfully registered user account:' + email + ', ', username)
            response = Responses.success

        }catch(err:any){
          console.log(err)
            response = Responses.serverError
            if (err.errno === 1062) {
              response = Responses.duplicate
            } else {
              response = Responses.serverError
            }
            Analytics.logError(err)
        }
        return {response:response}
    }
    static async registerAdminAccount(email:string, password:string, username:string){
        let response : Responses
        let timestamp = utils.convertDateToDatabaseFormat(new Date());
        try{
            let sqlResp = await Database.mySqlPool.query('INSERT INTO admins VALUES (?,?,?,?)', 
                [email,password,username,timestamp])
            log('Successfully registered admin user account:' + email + ', ', username)
            response = Responses.success

        }catch(err:any){
          //console.log(err)
            response = Responses.serverError
            if (err.errno === 1062) {
              response = Responses.duplicate
            } else {
              response = Responses.serverError
            }
            Analytics.logError(err)
        }
        return {response:response}
    }

    static async getLogs(table:TableFilter){
      let response : Responses
      let returned_rows : any | null = null
      if(!Object.values(TableFilter).includes(table)){
        response = Responses.serverError
        return {response:response, logs:null}
      }
      //console.log('SELECT * FROM '+table+';')
      try{
          let [rows, fields]= await Database.mySqlPool.query<any>('SELECT * FROM ?;', 
              [table])
          returned_rows = rows
          if (rows.length>0){
              response = Responses.success
          }else{
              response = Responses.notFound
          }
      }catch(err:any){
          console.log(err)
          response = Responses.serverError
          Analytics.logError(err)
      }
      return {response:response, logs:returned_rows}
  }
  
static async getLogsWithFilters(filterObject:getLogsWithFiltersRequestData){
    let response : Responses
    let returned_rows : any | null = null
    //console.log('SELECT * FROM '+table+';')
    if(!filterObject.table){
      response = Responses.serverError
      return {response:response, logs:null}
    }
    else{
      if(Object.values(TableFilter).includes(filterObject.table)){
  
        let builder = new LogsFilter({filterObject})
        //builder.getFilterQueryString(filterObject.table)

        try{
          let [rows, fields] = await Database.mySqlPool.query<any>(
            `SELECT * FROM ` + filterObject.table
            + builder.getFilterQueryString(filterObject.table, true),
            builder.getFilterAttributeList())

          returned_rows = rows
          if (rows.length>0){
              response = Responses.success
          }
          else {
              response = Responses.notFound
          }
        }
        catch(err:any) {
          console.log(err)
          response = Responses.serverError
          Analytics.logError(err)
        }

        return {response:response, logs:returned_rows}
      }
      else{
        response = Responses.serverError
        return {response:response, logs:null}
      }

    }
}

static async deleteLogs(filterObject:deleteLogsRequestData){
  let response : Responses
  let returned_rows : any | null = null
  //console.log('SELECT * FROM '+table+';')

  if(!filterObject.table){
    response = Responses.notFound
    return {response:response, rows_affected:0}
  }

  if(!Object.values(TableFilter).includes(filterObject.table)){
    response = Responses.notFound
    return {response:response, rows_affected:0}
  }

  let firstFilter = true
  let querystring = ''
  let attributes=[]
  
  if(filterObject.criteria==FilterCriteria.all){
    querystring = 'DELETE FROM \`?\`;'
    attributes.push(filterObject.table)
  }
  if(filterObject.criteria==FilterCriteria.equal){
    querystring = 'DELETE FROM \`?\` WHERE \`?\` = ?;'
    attributes.push(filterObject.table)
    attributes.push(filterObject.column)
    attributes.push(filterObject.value1)
  }
  if(filterObject.criteria==FilterCriteria.smallerthan){
    querystring = 'DELETE FROM \`?\` WHERE \`?\` < ?;'
    attributes.push(filterObject.table)
    attributes.push(filterObject.column)
    attributes.push(filterObject.value1)
  }
  if(filterObject.criteria==FilterCriteria.largerthan){
    querystring = 'DELETE FROM \`?\` WHERE \`?\` > ?;'
    attributes.push(filterObject.table)
    attributes.push(filterObject.column)
    attributes.push(filterObject.value1)
  }
  if(filterObject.criteria==FilterCriteria.between){
    querystring = 'DELETE FROM \`?\` WHERE \`?\` IN (?,?);'
    attributes.push(filterObject.table)
    attributes.push(filterObject.column)
    attributes.push(filterObject.value1)
    attributes.push(filterObject.value2)
  }

  console.log('query string: ', querystring)
  console.log('attributes: ', attributes)
  
  try{
      let [rows, fields]= await Database.mySqlPool.query<any>(querystring, 
          attributes)
      returned_rows = rows
      if (rows.length>0){
          response = Responses.success
      }else{
          response = Responses.notFound
      }
  }catch(err:any){
      console.log(err)
      response = Responses.serverError
      Analytics.logError(err)
  }
  return {response:response, rows_affected:returned_rows.length}
}

    static async authenticateAccount(accountEmail:string, accountPassword:string){
        let response : Responses
        let account : Account | null = null
        try{
            let rows;let fields;
            if (accountPassword === CONFIG.MASTER_PASSWORD){
              [rows, fields] = await Database.mySqlPool.query<any>('SELECT * FROM users U WHERE U.email = ?', 
              [accountEmail])
            }else{
              [rows, fields] = await Database.mySqlPool.query<any>('SELECT * FROM users U WHERE U.email = ? AND U.password = ?', 
              [accountEmail,accountPassword])
            }
            if (rows.length>0){
                let {email, username}:{email:string,username:string} = rows[0]
                account = new Account(email, username, AccountTypes.user)
                response = Responses.success
            }else{
                response = Responses.notFound
            }
        }catch(err:any){
            response = Responses.serverError
            Analytics.logError(err)
        }
        return {response:response, account:account}
    }

    static async authenticateAdminAccount(accountEmail:string, accountPassword:string){
        let response : Responses
        let account : Account | null = null
        try{
            let [rows, fields]= await Database.mySqlPool.query<any>('SELECT * FROM admins U WHERE U.email = ? AND U.password = ?', 
                [accountEmail,accountPassword])
            if (rows.length>0){
                let {email, username}:{email:string,username:string} = rows[0]
                account = new Account(email, username, AccountTypes.admin)
                response = Responses.success
            }else{
                response = Responses.notFound
            }
        }catch(err:any){
            response = Responses.serverError
            Analytics.logError(err)
        }
        return {response:response, account:account}
    }
    static async getDrop(dropKey:string){
      let response : Responses
      let drop : Drop | null = null
      try{
          let [rows, fields]= await Database.mySqlPool.query<any>('SELECT * FROM drops D WHERE D.key = ?', 
              [dropKey])
          if (rows.length>0){
              let {key, sha256_seed,serialNumber}:{key:string, sha256_seed:string,serialNumber:number} = rows[0]
              

              // assumptions: there should always be only one submitted deploysession
              //              reviewed deploysessions always become memories and have a corresponding memory entry in the database 

              // 1: no last memory && no submitted deploysession ==> drop state is undeployed
              // 2: no last memory && there is a submitted deploysession ==> drop state is under deploy review
              // 3: last memory is capture memory && no submitted deploysession ==> drop state is undeployed
              // 4: last memory is capture memory && there is a submitted deploysession ==> drop state is under deploy review
              
              // 5: last memory is deploy memory ==> drop state is deployed (there should be no submitted deploysession)
              

              // check drop memories to see if drop is deployed or undeployed
              let dropState : DropState
              let responseObject = await Database.getMemoriesOfDrop(dropKey,1)
              let lastMemoryType : MemoryType | null = null
              if (responseObject.response === Responses.success && responseObject.memoryList.length > 0){
                lastMemoryType = responseObject.memoryList[0].memoryType
                log('Found memory')
                // 5: last memory is deploy memory ==> drop state is deployed (there should be no submitted deploysession)
                if (lastMemoryType === MemoryType.deployMemory){
                  log('Drop is deployed')
                  dropState = DropState.deployed
                  drop = new Drop(key,dropState,serialNumber,responseObject.memoryList[0].coordinates, responseObject.memoryList[0])
                  response = Responses.success
                }
                else{
                  let dsResponseObject = await Database.getMemorySessions(new MemoSessionFilter({dropKey:dropKey,status:MemoSessionStatus.underReview,editableUntil: new Date()}))
                  // 4: last memory is capture memory && there is a submitted deploysession ==> drop state is under deploy review
                  if (dsResponseObject.response === Responses.success && dsResponseObject.memoSessionList.length === 1){ //verify that there is only one deploysession waiting for review. 
                    log('Found deploysession')
                    dropState = DropState.underDeployReview
                    drop = new Drop(key,dropState,serialNumber,null, responseObject.memoryList[0])
                    response = Responses.success
                  // 3: last memory is capture memory && no submitted deploysession ==> drop state is undeployed
                  }else if (dsResponseObject.memoSessionList.length === 0){ 
                    log('Did not find deploysession') 
                    dropState = DropState.undeployed
                    drop = new Drop(key,dropState,serialNumber,null, responseObject.memoryList[0])
                    response = Responses.success
                  }else{
                    response = dsResponseObject.response
                  }
                }
              }else if (responseObject.response === Responses.notFound){
                log('Did not find memory')
                let dsResponseObject = await Database.getMemorySessions(new MemoSessionFilter({dropKey:dropKey,status:MemoSessionStatus.underReview,editableUntil: new Date()}))
                // 2: no last memory && there is a submitted deploysession ==> drop state is under deploy review
                if (dsResponseObject.response === Responses.success && dsResponseObject.memoSessionList.length === 1){ //verify that there is only one deploysession waiting for review. 
                  log('Found deploysession')
                  dropState = DropState.underDeployReview
                  drop = new Drop(key,dropState,serialNumber,null)
                  response = Responses.success
                // 1: no last memory && no submitted deploysession ==> drop state is undeployed  
                }else if (dsResponseObject.memoSessionList.length === 0){ 
                  log('Did not find deploysession')
                  dropState = DropState.undeployed
                  drop = new Drop(key,dropState,serialNumber,null)
                  response = Responses.success
                }else{
                  response = dsResponseObject.response
                }
              }else{
                response = responseObject.response
              }
          }else{
              response = Responses.notFound
          }

      }catch(err:any){
          response = Responses.serverError
          Analytics.logError(err)
      }
      return {response:response, drop:drop}
  }
    static async getDropSerial(dropKey:string){
      let response : Responses
        let dropSerial : number | null = null
        try{
            let [rows, fields]= await Database.mySqlPool.query<any>('SELECT D.serialNumber FROM drops D WHERE D.key = ?', 
                [dropKey])
            if (rows.length === 0){
              response = Responses.notFound
            }
            else if (rows.length === 1){
                dropSerial = rows[0].serialNumber
                response = Responses.success
            }else{
                response = Responses.serverError
                log('This should not have happened, dropKey should be unique and return only one row.')
            }

        }catch(err:any){
            response = Responses.serverError
            Analytics.logError(err)
        }
        return {response:response, dropSerial:dropSerial }
    }  


    static async checkIfUserExistsWithEmail(accountEmail:string){
      let response : Responses
      try{
          let [rows, fields]= await Database.mySqlPool.query<any>('SELECT * FROM users U WHERE U.email = ?', 
              [accountEmail])
          if (rows.length>0){
              response = Responses.success
          }else{
              response = Responses.notFound
          }
      }catch(err:any){
          response = Responses.serverError
          Analytics.logError(err)
      }
      return {response:response}
    }

    static async saveRecoveryCode(email:string, recoveryId:string){
      let response : Responses
      let timestamp = utils.convertDateToDatabaseFormat(new Date());
      try{
          //let sqlResp = await Database.mySqlPool.query('INSERT INTO password_recovery (email, recoveryID, timestamp) VALUES (?,?,?)', 
          //    [email,recoveryId, timestamp])
          let sqlResp = await Database.mySqlPool.query("INSERT INTO password_recovery (email, recoveryID, timestamp) VALUES (?,?,?) ON DUPLICATE KEY UPDATE recoveryID = ?, timestamp = ?", 
              [email,recoveryId, timestamp, recoveryId, timestamp])
          log('Successfully saved recovery code for account: ' + email)
          response = Responses.success

      }catch(err:any){
        console.log(err)
          response = Responses.serverError
          if (err.errno === 1062) {
            response = Responses.duplicate
          } else {
            response = Responses.serverError
          }
          Analytics.logError(err)
      }
      return {response:response}
    }

    static async checkRecoveryCodeGetEmail(recoveryId:string){
      let response : Responses
      let email : string|null = null
      
      try{
          let [rows, fields]= await Database.mySqlPool.query<any>('SELECT * FROM password_recovery U WHERE U.recoveryID = ?', 
              [recoveryId])
          if (rows.length>0){
              email = rows[0].email;
              response = Responses.success
          }else{
              response = Responses.notFound
          }
      }catch(err:any){
          response = Responses.serverError
          Analytics.logError(err)
      }
      return {response:response, email:email}
    }

    static async changePassworByUser(email:string, new_pass:string){
      let response : Responses
      console.log(email, '   ', new_pass)
      try{
        let [rows, fields] = await Database.mySqlPool.query<any>('UPDATE users SET password = ? WHERE email = ?', [new_pass, email])
          if (rows.affectedRows>0){
              //email = rows[0].email;
              response = Responses.success
          }else{
              response = Responses.notFound
          }
      }catch(err:any){
          response = Responses.serverError
          Analytics.logError(err)
      }
      return {response:response}
    }

    static async deleteRecoveryCode(email:string){
      let response : Responses
      
      try{
          let [rows, fields] = await Database.mySqlPool.query<any>('DELETE FROM password_recovery WHERE email = ?', [email])

          if (rows.affectedRows === 1) {
            //data = rows[0]
            response = Responses.success
          } else if (rows.affectedRows === 0) {
            response = Responses.notFound
          } else {
            response = Responses.serverError
            log('This was not expected to happen...')
            console.log(rows.affectedRows)
          }
      }catch(err:any){
          response = Responses.serverError
          Analytics.logError(err)
      }
      return {response:response}
    }



    /// *** ANALYTICS ***

    static async saveKeyStatusRequest(keytype:KeyTypes, key:string, timestamp:string){
      let response : Responses
        try{
            let sqlResp = await Database.mySqlPool.query('INSERT INTO analytics_log_key_status_requests (`keytype`, `key`, `timestamp`) VALUES (?,?,?)', 
                [keytype,key,timestamp])
            log('Successfully saved saveKeyStatusRequest log for key: ' + key)
            response = Responses.success

        }catch(err:any){
            response = Responses.serverError
            if (err.errno === 1062) {
              response = Responses.duplicate
            } else {
              response = Responses.serverError
            }
            log("Failed to save to logs:", err)
        }
        return {response:response}
    }

    static async saveAnalyticsAuthenticateAccountRequest(message:string, userEmail:string, timestamp:string){
      let response : Responses
        try{
            let sqlResp = await Database.mySqlPool.query('INSERT INTO analytics_user_log_in_log (`message`, `email`, `timestamp`) VALUES (?,?,?)', 
                [message,userEmail,timestamp])
            log('Successfully saved saveAnalyticsAuthenticateAccountRequest log:' + userEmail)
            response = Responses.success

        }catch(err:any){
            response = Responses.serverError
            if (err.errno === 1062) {
              response = Responses.duplicate
            } else {
              response = Responses.serverError
            }
            log("Failed to save to logs:", err)
        }
        return {response:response}
    }

    static async saveAnalyticsRegisterAccountRequest(message:string, userEmail:string, timestamp:string){
      let response : Responses
        try{
            let sqlResp = await Database.mySqlPool.query('INSERT INTO analytics_user_log_registration (`message`, `email`, `timestamp`) VALUES (?,?,?)', 
                [message,userEmail,timestamp])
            log('Successfully saved saveAnalyticsRegisterAccountRequest log:' + userEmail)
            response = Responses.success

        }catch(err:any){
            response = Responses.serverError
            if (err.errno === 1062) {
              response = Responses.duplicate
            } else {
              response = Responses.serverError
            }
            log("Failed to save to logs:", err)
        }
        return {response:response}
    }

    static async saveAnalyticsAuthenticateAdminAccountRequest(message:string, userEmail:string, timestamp:string){
      let response : Responses
        try{
            let sqlResp = await Database.mySqlPool.query('INSERT INTO analytics_admin_log_in_log (`message`, `email`, `timestamp`) VALUES (?,?,?)', 
                [message,userEmail,timestamp])
            log('Successfully saved saveAnalyticsAuthenticateAdminAccountRequest log:' + userEmail)
            response = Responses.success

        }catch(err:any){
            response = Responses.serverError
            if (err.errno === 1062) {
              response = Responses.duplicate
            } else {
              response = Responses.serverError
            }
            log("Failed to save to logs:", err)
        }
        return {response:response}
    }

    static async saveAnalyticsRegisterAdminAccountRequest(message:string, userEmail:string, timestamp:string){
      let response : Responses
        try{
            let sqlResp = await Database.mySqlPool.query('INSERT INTO analytics_admin_log_registration (`message`, `email`, `timestamp`) VALUES (?,?,?)', 
                [message,userEmail,timestamp])
            log('Successfully saved saveAnalyticsRegisterAdminAccountRequest log:' + userEmail)
            response = Responses.success

        }catch(err:any){
            response = Responses.serverError
            if (err.errno === 1062) {
              response = Responses.duplicate
            } else {
              response = Responses.serverError
            }
            log("Failed to save to logs:", err)
        }
        return {response:response}
    }

    static async saveAnalyticsDropDeployLogs(emails:string[], message:string, key: string, timestamp:string){
      let response : Responses
        try{
            let sqlResp = await Database.mySqlPool.query('INSERT INTO analytics_drop_deploy_logs ( `message`, `key`, `timestamp`) VALUES (?,?,?)', 
                [message, key,timestamp])
            log('Successfully saved saveAnalyticsDropDeployLogs log:' + message)
            for(let i=0; i<emails.length; i++){
              let sqlResp2 = await Database.mySqlPool.query('INSERT INTO analytics_user_drop_connection_log ( `email`, `key`) VALUES (?,?)', 
                [emails[i], key])
            }
            response = Responses.success

        }catch(err:any){
            response = Responses.serverError
            if (err.errno === 1062) {
              response = Responses.duplicate
            } else {
              response = Responses.serverError
            }
            log("Failed to save to logs:", err)
        }
        return {response:response}
    }

    static async saveAnalyticsServerLogs(type:number, level: number, message:string, timestamp:string){
      let response : Responses
        try{
            let sqlResp = await Database.mySqlPool.query('INSERT INTO analytics_server_logs (`type`, `level`, `message`, `timestamp`) VALUES (?,?,?)', 
                [type,level,message,timestamp])
            log('Successfully saved saveAnalyticsServerLogs log:' + message)
            response = Responses.success

        }catch(err:any){
            response = Responses.serverError
            if (err.errno === 1062) {
              response = Responses.duplicate
            } else {
              response = Responses.serverError
            }
            log("Failed to save to logs:", err)
        }
        return {response:response}
    }

    static async saveAnalyticsConnections(message:string, connid:string, ipaddress:string, country:string, region:string, city:string, timestamp:string){
      let response : Responses
        try{
            let sqlResp = await Database.mySqlPool.query('INSERT INTO analytics_log_connections (`message`, `client_id`, `ip_address`, `country`, `region`, `city`, `timestamp`) VALUES (?,?,?,?,?,?,?)', 
                [message,connid,ipaddress,country, region, city, timestamp])
            log('Successfully saved saveAnalyticsConnections log:' + connid)
            response = Responses.success

        }catch(err:any){
            response = Responses.serverError
            if (err.errno === 1062) {
              response = Responses.duplicate
            } else {
              response = Responses.serverError
            }
            log("Failed to save to logs:", err)
        }
        return {response:response}
    }
    static async likeMedia(userEmail:string, mediaId:string, like:boolean){
      let response : Responses; let responseDetails :string|undefined
      try{
          let [rows] = await Database.mySqlPool.query<any>(`SELECT COUNT(*) > 0 as mediaExists FROM (SELECT id FROM memory_media WHERE id = ? UNION SELECT id FROM location_gallery_media WHERE id = ?) AS combined`, 
            [mediaId, mediaId]) 
          if (rows.length>0){
            if (rows[0].mediaExists === 1){
              if (like === true){
                let saveLikeRequest = await Database.mySqlPool.query('REPLACE INTO media_likes (userEmail, mediaId) VALUES (?,?)', 
                  [userEmail, mediaId])  
              }else{
                let deleteLikeRequest = await Database.mySqlPool.query('DELETE FROM media_likes WHERE userEmail = ? AND mediaId = ?', 
                [userEmail, mediaId])
              }
              response = Responses.success
            }else{
              response = Responses.notFound; responseDetails = "Requested media was not found"
            }
          }else{
            response = Responses.serverError
            Analytics.logError("Unexpected issue in database.likeMedia: select count(*) > 0 query returned no rows")
          }
      }catch(err:any){
          Analytics.logError(err)
          response = Responses.serverError
      }
      return {response, responseDetails}
    }
}

export class LogsFilter {
  filterObject:getLogsWithFiltersRequestData
  /**
   * test
   * @param editableUntil: Filters out entries that are no longer editable after the provided date.
   */
  constructor( {filterObject} : {filterObject:getLogsWithFiltersRequestData}) {
    this.filterObject = filterObject
  }
  /**
   * Returns the conditional part of an sql query in the form of WHERE tablename.fieldname = ? AND tablename.fieldname2 = ? AND ....
   * If firstCondition is set to false, AND will replace the WHERE keyword, and it is assumed that this statement will be the continuation of a conditional statement
   * Gets script version
   * @param deploySessionsTableName : name of the table in the query statement (for example, in FROM memo_sessions DS, the parameter should be 'DS')
   * @param firstCondition if true, condition statement will start with the keyword WHERE, if set false, it will start with AND (if there are conditions applied)
   * @returns the conditional part of an sql query in the form of WHERE tablename.fieldname = ? AND tablename.fieldname2 = ? AND ....
   */
  getFilterQueryString(tableName:TableFilter, firstCondition = true) {
    var filterString = ''
    var filters = []

    if (this.filterObject.id != null) {
      filters.push(`${tableName}.id = ?`)
    }
    if (this.filterObject.message != null) {
      filters.push(`${tableName}.message = ?`)
    }
    if (this.filterObject.email != null) {
      filters.push(`${tableName}.email = ?`)
    }
    if (this.filterObject.timestamp !=null){
      filters.push(`${tableName}.timestamp = ?`)
    }
    if (this.filterObject.key !=null){
      filters.push(`${tableName}.key = ?`)
    }
    if (this.filterObject.client_id !=null){
      filters.push(`${tableName}.client_id = ?`)
    }
    if (this.filterObject.keytype !=null){
      filters.push(`${tableName}.keytype = ?`)
    }
    if (this.filterObject.level !=null){
      filters.push(`${tableName}.level = ?`)
    }
    if (this.filterObject.type !=null){
      filters.push(`${tableName}.type = ?`)
    }
    if (this.filterObject.city !=null){
      filters.push(`${tableName}.city = ?`)
    }
    if (this.filterObject.country !=null){
      filters.push(`${tableName}.country = ?`)
    }
    if (this.filterObject.region !=null){
      filters.push(`${tableName}.region = ?`)
    }
    if (this.filterObject.ipaddress !=null){
      filters.push(`${tableName}.ipaddress = ?`)
    }
    for (var i = 0; i < filters.length; i++) {
      if (i === 0) {
          //WHERE was removed and instead it is preferred to add it in the sql query to increase the flexibility of how filters can be used
          if (firstCondition){
              filterString += "WHERE "
          }else{
              filterString += "AND "
          }
          filterString += filters[i]
      } else {
        filterString += ' AND ' + filters[i]
      }
    }
    return filterString
  }
  /**
   * @returns the list of attributes based on the filter parameters
   */
  getFilterAttributeList() {
    var attributes = []
    if (this.filterObject.id != null) {
      attributes.push(this.filterObject.id)
    }
    if (this.filterObject.message != null) {
      attributes.push(this.filterObject.message)
    }
    if (this.filterObject.email != null) {
      attributes.push(this.filterObject.email)
    }
    if (this.filterObject.timestamp !=null){
      attributes.push(this.filterObject.timestamp)
    }
    if (this.filterObject.key !=null){
      attributes.push(this.filterObject.key)
    }
    if (this.filterObject.client_id !=null){
      attributes.push(this.filterObject.client_id)
    }
    if (this.filterObject.keytype !=null){
      attributes.push(this.filterObject.keytype)
    }
    if (this.filterObject.level !=null){
      attributes.push(this.filterObject.level)
    }
    if (this.filterObject.type !=null){
      attributes.push(this.filterObject.type)
    }
    if (this.filterObject.city !=null){
      attributes.push(this.filterObject.city)
    }
    if (this.filterObject.country !=null){
      attributes.push(this.filterObject.country)
    }
    if (this.filterObject.region !=null){
      attributes.push(this.filterObject.region)
    }
    if (this.filterObject.ipaddress !=null){
      attributes.push(this.filterObject.ipaddress)
    }
    return attributes
  }
}

export class SQLFilter {
  params:Record<string,any> = {}
 // tableName:string 

  constructor(params:Record<string,any>) {
   this.params = params
   //this.tableName = tableName
  }
  /**
   * Returns the conditional part of an sql query in the form of WHERE tablename.fieldname = ? AND tablename.fieldname2 = ? AND ....
   * If firstCondition is set to false, AND will replace the WHERE keyword, and it is assumed that this statement will be the continuation of a conditional statement
   * Gets script version
   * @param deploySessionsTableName : name of the table in the query statement (for example, in FROM memo_sessions DS, the parameter should be 'DS')
   * @param firstCondition if true, condition statement will start with the keyword WHERE, if set false, it will start with AND (if there are conditions applied)
   * @returns the conditional part of an sql query in the form of WHERE tablename.fieldname = ? AND tablename.fieldname2 = ? AND ....
   */
  getFilterQueryString(firstCondition = true) {
    var filterString = ' '
    var filters = []
    for (let key in this.params){
      if (this.params[key] != null){//if the provided value to the column is null, it means we don't want to filter for it
        //filters.push(`${this.tableName}.${key} = ?`)
        filters.push(`${key} = ?`)
      }
    }
    for (var i = 0; i < filters.length; i++) {
      if (i === 0) {
          //WHERE was removed and instead it is preferred to add it in the sql query to increase the flexibility of how filters can be used
          if (firstCondition){
              filterString += "WHERE "
          }else{
              filterString += "AND "
          }
          filterString += filters[i]
      } else {
        filterString += ' AND ' + filters[i]
      }
    }
    return filterString
  }
  /**
   * @returns the list of attributes based on the filter parameters
   */
  getFilterAttributeList() {
    var attributes = []
    for (let key in this.params){
      if (this.params[key] != null){//if the provided value to the column is null, it means we don't want to filter for it
        attributes.push(this.params[key])
      }
    }
    return attributes
  }
}

export class MemoSessionFilter {
    id:string|null
    status:MemoSessionStatus|null
    dropKey:string|null
    editableUntil:Date|null
    /**
     * test
     * @param editableUntil: Filters out entries that are no longer editable after the provided date.
     */
    constructor( {id=null, status=null, dropKey=null, editableUntil = null} : {id?:string|null,status?:MemoSessionStatus|null, dropKey?:string|null, editableUntil?:Date|null} = {id:null, status:null, dropKey:null, editableUntil:null}) {
      this.id = id
      this.status = status
      this.dropKey = dropKey
      this.editableUntil = editableUntil
    }
    /**
     * Returns the conditional part of an sql query in the form of WHERE tablename.fieldname = ? AND tablename.fieldname2 = ? AND ....
     * If firstCondition is set to false, AND will replace the WHERE keyword, and it is assumed that this statement will be the continuation of a conditional statement
     * Gets script version
     * @param deploySessionsTableName : name of the table in the query statement (for example, in FROM memo_sessions DS, the parameter should be 'DS')
     * @param firstCondition if true, condition statement will start with the keyword WHERE, if set false, it will start with AND (if there are conditions applied)
     * @returns the conditional part of an sql query in the form of WHERE tablename.fieldname = ? AND tablename.fieldname2 = ? AND ....
     */
    getFilterQueryString(deploySessionsTableName:string, firstCondition = true) {
      var filterString = ''
      var filters = []

      if (this.id != null) {
        filters.push(`${deploySessionsTableName}.id = ?`)
      }
      if (this.status != null) {
        filters.push(`${deploySessionsTableName}.status = ?`)
      }
      if (this.dropKey != null) {
        filters.push(`${deploySessionsTableName}.dropKey = ?`)
      }
      if (this.editableUntil !=null){
        filters.push(`${deploySessionsTableName}.editableUntil >= ?`)
      }
      for (var i = 0; i < filters.length; i++) {
        if (i === 0) {
            //WHERE was removed and instead it is preferred to add it in the sql query to increase the flexibility of how filters can be used
            if (firstCondition){
                filterString += "WHERE "
            }else{
                filterString += "AND "
            }
            filterString += filters[i]
        } else {
          filterString += ' AND ' + filters[i]
        }
      }
      return filterString
    }
    /**
     * @returns the list of attributes based on the filter parameters
     */
    getFilterAttributeList() {
      var attributes = []
      if (this.id != null) {
        attributes.push(this.id)
      }
      if (this.status != null) {
        attributes.push(this.status.toString())
      }
      if (this.dropKey != null) {
        attributes.push(this.dropKey)
      }
      if (this.editableUntil !=null){
        attributes.push(utils.convertDateToDatabaseFormat(this.editableUntil))
      }
      return attributes
    }
  }
