import {User as UserSC, Account as AccountSC, UserLevel} from './ws-magic-bridge/user'
class User extends UserSC{
    id:string
    socket:any
    ipAddress:string
    account? : Account
  
    constructor(socket:any, ipAddress:string){
        super()
        this.socket = socket
        this.id = this.socket.id
        this.ipAddress = ipAddress
    }
    public linkAccount(account:Account){
        this.account = account
    }
    public unlinkAccount(){
        this.account = undefined
    }
}
export enum AccountTypes {
	admin = 0,
	user = 1,
}
class Account extends AccountSC {
    accountType:AccountTypes

    constructor(email:string, username:string, accountType:AccountTypes){
        super(email, username)
        this.accountType = accountType
    }
    
}
export {User,Account}