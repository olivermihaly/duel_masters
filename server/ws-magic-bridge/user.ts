export class User {
	account?: Account
	constructor(account?:Account){
		this.account = account
	}

	static createFromJSONObject(jsonObject: any): User {
		return new User(Account.createFromJSONObject(jsonObject.account))
	}
}
export enum AccountTypes {
	admin,
	user,
}
export class Account {
	email: string
	username: string
	level : UserLevel 
	constructor(email: string, username: string, level:UserLevel = UserLevel.LostSoul) {
		this.email = email
		this.username = username
		this.level = level
	}
	static createFromJSONObject(jsonObject: Account): Account {
		return new Account(jsonObject.email, jsonObject.username, jsonObject.level)
	}
}

export enum BetaTesterApplicationStatus{
	applied,
	inviteSent,
	registered
}
export enum FeedbackMessageType{
	feedback,
	locationReport, 
	imageReport,
	commentReport,
}
export enum UserLevel{
	LostSoul = 0,
	Roamer = 1,
	Adventurer = 2,
	Pathfinder = 3,
	Trailblazer = 4,
	Maven = 5
}

