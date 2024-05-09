import { Data, WebSocket } from 'ws'
import * as uuid from 'uuid'
import * as readline from 'readline'
import * as fs from 'fs'
import * as crypto from 'crypto'
import * as mysql from 'mysql2/promise'
import * as mysql2 from 'mysql2'
import {promisify} from 'util'

import { User, Account, AccountTypes } from './user'
import {Database as db, MemoSessionFilter} from './database'
import * as sharp from 'sharp'
import * as blurhash from 'blurhash'
import * as express from 'express'
import * as mime from 'mime-types'
import * as convert from 'heic-convert'
import { EventDispatcher } from './eventDispatcher'
import {Analytics, Analytics as analytics, AnalyticsEvents, appDataSource, LogType} from './analytics/analytics'
import * as dotenv from "dotenv";
import { CONFIG, uploadPath } from './globals'
import { Events, Routes } from './ws-magic-bridge/events'
import { BasicResponses, Responses } from './ws-magic-bridge/responses'
import { User as UserSC, Account as AccountSC, FeedbackMessageType, UserLevel } from './ws-magic-bridge/user'
import { RegisterAccountRequestData, RegisterAccountResponseData, RegisterAdminAccountRequestData, RegisterAdminAccountResponseData, DeleteAdminAccountRequestData, DeleteAdminAccountResponseData, DeleteAccountRequestData, DeleteAccountResponseData, deleteMemorySessionRequestData, deleteMemorySessionResponseData, ChangeAdminPasswordRequestData, ChangeAdminPasswordResponseData, getLogsWithFiltersRequestData, GetLogsResponseData, deleteLogsRequestData, deleteLogsResponseData, ChangePasswordRequestData, ChangePasswordResponseData, AuthenticateAccountRequestData, AuthenticateAdminAccountRequestData, AuthenticateAdminAccountResponseData, KeyStatusRequestData, KeyStatusResponseData, StartMemoSessionWithDropCaptureRequestData, StartMemoSessionWithDropCaptureResponseData,  JoinMemoSessionRequestData, JoinMemoSessionResponseData, ChangeSecretKeywordRequestData, ChangeSecretKeywordResponseData, ChangeLocationDifficultyRatingRequestData, ChangeLocationDifficultyRatingResponseData, ChangeLocationOverallRatingRequestData, ChangeLocationOverallRatingResponseData, AddRatingItemRequestData, AddRatingItemResponseData, RemoveRatingItemRequestData, RemoveRatingItemResponseData, ChangeRatingItemRequestData, ChangeRatingItemResponseData, ChangeCommentRequestData, ChangeCommentResponseData, ChangeCoordinatesRequestData, ChangeCoordinatesResponseData, RemoveMemoSessionMediaDataRequest, RemoveMemoSessionMediaDataResponse, ChangeSubmitPercentageRequestData, MemoSessionUpdateRequestData, MemoSessionUpdateData, MemoSessionUpdateResponseData, SubmitMemoSessionReviewRequestData, GetMemoriesAwaitingReviewRequestData, GetMemoriesAwaitingReviewResponseData, SubmitMemoryReviewRequestData, SubmitMemoryReviewResponseData, GetDropMemoriesRequestData, GetDropMemoriesResponseData, GetUserMemoriesRequestData, CaptureDropRequestData, CaptureDropResponseData, SendChatMessageRequestData, SendChatMessageResponseData, StartEditMemoSessionRequestData, ChangeMediaDataCategoryRequestData, GetMemoryByIdRequest, GetMemoryByIdResponse, ChangeMediaDataCategoryResponseData, AuthenticateAccountResponseData, StartEditMemoSessionResponseData, GetUserMemoriesResponseData, StartMemoSessionRequest, StartMemoSessionResponse, GetLocationRequest, GetLocationResponse, LogoutRequest, LogoutResponse, StartMemoSessionWithDropDeployResponse, StartMemoSessionWithDropDeployRequest, AddLocationCommentRequest, AddLocationCommentResponse, GetMemoSessionsResponse, GetMemoSessionsRequest, SignUpForBetaTestingRequest, SignUpForBetaTestingResponse, ApproveBetaTesterRequest, ApproveBetaTesterResponse, RegisterBetaAccountRequest, GetBetaTesterApplicationsRequest, GetBetaTesterApplicationsResponse, TableFilter, BlockUserRequest, BlockUserResponse, UnblockUserResponse, UnblockUserRequest, GetAllBlockedUsersRequest, GetAllBlockedUsersResponse, SubmitFeedbackMessageRequest, SubmitFeedbackMessageResponse, DeleteLocationCommentRequest, DeleteLocationCommentResponse, RegisterBetaAccountResponse, getLogsWithFiltersFromMultipleTablesRequestData, getLogsWithFiltersFromMultipleTablesResponseData, SubmitUnconfirmedLocationRequest, SubmitUnconfirmedLocationResponse, adminChangesPasswordForUserRequestData, adminChangesPasswordForUserResponseData, adminPanelLoadedNotification, GetUnconfirmedLocationSubmissionsRequest, GetUnconfirmedLocationSubmissionsResponse, SubmitUnconfirmedLocationReviewResponse, SubmitUnconfirmedLocationReviewRequest, StartUnconfirmedLocationSubmissionRequest, StartUnconfirmedLocationSubmissionResponse, ChangeLocationCategoryRequest, ChangeLocationCategoryResponse, ChangeLocationNameRequestData, ChangeLocationNameResponseData, DeleteUnconfirmedLocationSubmissionRequest, DeleteUnconfirmedLocationSubmissionResponse, LeaveMemoSessionResponse, LeaveMemoSessionRequest, SendPasswordRecoveryLinkByUserRequestData, SendPasswordRecoveryLinkByUserResponseData, ChangePasswordByUserRequestData, SendPasswordRecoveryLinkByUserRequest, SendPasswordRecoveryLinkByUserResponse, ChangePasswordByUserResponse, ChangePasswordByUserRequest, LikeMediaRequest, LikeMediaResponse, DeleteLocationGalleryMediaRequest, DeleteLocationGalleryMediaResponse, GetAllLocationsResponse, GetAllLocationsRequest, GetLocationHighlightImagesRequest, GetLocationHighlightImagesResponse, EditLocationCommentRequest, EditLocationCommentResponse, GetUserNotificationsRequest, GetUserNotificationsResponse, OpenNotificationRequest, OpenNotificationResponse, GetActiveUsersChartDataRequest, UploadLocalLogDumpRequest, UploadLocalLogDumpResponse, GetAllLocalDumpsRequest, GetAllLocalDumpsResponse, GetActiveUsersChartDataResponse, GetLevelThresholdsRequest, GetLevelThresholdsResponse, GetUserProfileRequest, GetUserProfileResponse, UpdateBioResponse, UpdateBioRequest, DeleteProfileCoverPhotoRequest, DeleteProfileCoverPhotoResponse, ReportDeviceInfoRequest, ReportDeviceInfoResponse } from './ws-magic-bridge/socketMessages'
import * as utils from './utils'
import { NamingStrategyInterface, Table, getRepository } from 'typeorm'
import { BetaTesterApplicationStatus } from './ws-magic-bridge/user'
import { ConnectionsAnalytics } from './analytics/Entities/connections'
import { AdminLogInAnalytics } from './analytics/Entities/admin_log_in'
import { GeolocationEntitiy } from './analytics/Entities/geolocation_entity'
import { incomingCommunicationAnalytics } from './analytics/Entities/incoming_communication'
import { VERSION } from './ws-magic-bridge/config'
import { LocalLogDumpsAnalytics } from './analytics/Entities/crash_report'
import { IpGeolocationAnalytics } from './analytics/Entities/ipgeolocation'


const path = require('path')              // Used for manipulation with path
const fs_extra = require('fs-extra')             // Classic fs
const busboy = require('connect-busboy')  

const app = express(); // Initialize the express web server
var nodemailer = require('nodemailer'); 
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
dotenv.config({ path: path.resolve(__dirname, './process.env') })

analytics.serverStarted()
app.use(busboy({
    highWaterMark: 50 * 1024 * 1024, // Set 50 MiB buffer
})); // Insert the busboy middle-ware

/*process.on('uncaughtException', function (exception) {
	console.log(exception); // to see your exception details in the console
	// if you are on production, maybe you can send the exception details to your
	// email as well ?
  });*/

//const uploadPath = path.join(__dirname, 'uploads/'); // Register the upload path
async function compressImage(filepath:string,extension:string, callback:Function){
	try{
		//const inputBuffer = await promisify(fs_extra.readFile)(filepath+"."+extension);
		const convertedImageBuffer = await sharp(filepath+"."+extension)
		.resize(1920,1920,{fit:'inside', 'withoutEnlargement':true})
		.jpeg({ mozjpeg: true })
		.toBuffer()

		
  		await promisify(fs_extra.writeFile)(filepath+"_c.jpg", convertedImageBuffer);
		callback()

	}catch(error:any){
		Analytics.logError({message: "Error occured during image conversion", details: error})	
	}
}
export async function createThumbnailImage(filepath:string,extension:string, outputPath:string, callback:Function){
	try{
		//const inputBuffer = await promisify(fs_extra.readFile)(filepath+"."+extension);
		const convertedImageBuffer = await sharp(filepath+"."+extension)
		.resize(200,200,{fit:'inside', 'withoutEnlargement':true})
		.jpeg({ mozjpeg: true })
		.toBuffer()

		
  		await promisify(fs_extra.writeFile)(outputPath+"_thumbnail.jpg", convertedImageBuffer);
		callback()

	}catch(error:any){
		Analytics.logError({message: "Error occured during image conversion", details: error})
	}
}
export async function encodeImageToBlurhash(path:string){
		return new Promise((resolve, reject) => {
    sharp(path)
      .raw()
      .ensureAlpha()
      .resize(32, 32, { fit: "inside" })
      .toBuffer((err, buffer, { width, height }) => {
        if (err) return reject(err);
        resolve(blurhash.encode(new Uint8ClampedArray(buffer), width, height, 4, 4));
      });
  });
}

//old function, sharp can take care of all conversion, so this is not used anymore, and kept here as a fallback solution in case something is wrong with sharp
async function heicToJpeg(filepath:string, extension :"heif"|"heic", callback:Function){
	try{
		const inputBuffer = await promisify(fs_extra.readFile)(filepath+"."+extension);
		const outputBuffer = await convert({
			buffer: inputBuffer, // the HEIC file buffer
			format: 'JPEG',      // output format
			quality: 0.9           // the jpeg compression quality, between 0 and 1
		});
  		await promisify(fs_extra.writeFile)(filepath+".jpg", outputBuffer);
		callback()

	}catch(error:any){
		log("error:",error)
		
		analytics.eventController.triggerEvent(AnalyticsEvents.saveServerLog,1, 1, "Failed to convert heic to Jpeg")
		Analytics.logError({message: "Failed to convert heic to Jpeg", details: error})
		
	}
}

 
const server = app.listen(CONFIG.UPLOAD_SERVER_PORT, function () {
    console.log(`Listening on port `,CONFIG.UPLOAD_SERVER_PORT);
});



// Function to serve all static files
// inside public directory.

app.use(express.static((CONFIG.NAME !== "TESTING_CONFIG_HTTPS" && CONFIG.NAME !== "TESTING_CONFIG_LOCAL") ? 'public' :  'testing_public')); 
//app.use('/images', express.static('images'));
 
// Server setup
app.listen(CONFIG.IMAGE_SERVER_PORT, () => {
  console.log(`Running static server on PORT ${CONFIG.IMAGE_SERVER_PORT}...`);
})



const wss = new WebSocket.Server({ port: CONFIG.WEBSOCKET_PORT })
let rl = readline.createInterface({ input: process.stdin, output: process.stdout })
let debug = true


var mySqlPool = mysql.createPool({
	connectionLimit: 100,
	host: '127.0.0.1',
	user: CONFIG.DB_USER,
	password: CONFIG.DB_PASSWORD,
	database: CONFIG.DATABASE,
	port: 3306,
	debug: false,
})

//only used for testing connection
const connection = mysql2.createConnection({
	host: '127.0.0.1',
	user: CONFIG.DB_USER,
	password: CONFIG.DB_PASSWORD,
	database: CONFIG.DATABASE,
	port: 3306,
	debug: false,
})
const knex = require('knex')({
  client: 'mysql',
  connection:{
		host: '127.0.0.1',
		user: CONFIG.DB_USER,
		password: CONFIG.DB_PASSWORD,
		database: CONFIG.DATABASE,
		port: 3306,
		debug: false,
	}
});


connection.connect((err: any) => {
	if (err) throw err
	log('Connected to MySQL Server!')
})

function log(message?: any, ...optionalParams: any[]) {
	if (debug) {
		if (optionalParams != null && optionalParams.length > 0) {
			console.log(message, (optionalParams = optionalParams))
		} else {
			console.log(message)
		}
	}
}

db.mySqlPool = mySqlPool
db.knex = knex

let users: User[] = []

wss.on('connection', function connection(socket: any, request: any, client: any) {
	socket.id = uuid.v4()
	let remoteAddress = request.headers['x-forwarded-for'] !== null ? request.headers['x-forwarded-for']: request.socket.remoteAddress
	log('Socket ' + socket.id + ' connected from IP: ' + remoteAddress) 

	let ipadd:string
	if(remoteAddress){
		//let ipadd_arry = remoteAddress.split(':')
		//if(ipadd_arry[ipadd_arry.length-1].length>4){
		//	ipadd = ipadd_arry[ipadd_arry.length-1]
		//}
		//else{
		ipadd = remoteAddress
		//}
	} else{
		ipadd="192.168.0.0"
	}
	
	console.log(`the ipaddress is ${ipadd}`)
	
	analytics.eventController.triggerEvent(AnalyticsEvents.connectionsRequest, "Connected", socket.id, ipadd)
	
	let user = new User(socket, ipadd)
	users.push(user)
	socket.on('error', function e(error:any) {
		Analytics.logError({message:"Socket error", error})
	})
	socket.on('message', function d(dataString: string) {
		if (CONFIG.MAINTENANCE_MODE === "true"){console.warn('Server is in maintenance mode and is not processing messages at this time');return}
		messageReceived(dataString, user)
	})
	socket.onclose = function (){
		socketOnClose(user, ipadd)
	}.bind(this)
	
	socket.send(JSON.stringify({ event: 'connected', userID: socket.id, MAINTENANCE_MODE:CONFIG.MAINTENANCE_MODE==="true", VERSION: VERSION, SUPPORTED_VERSIONS: CONFIG.SUPPORTED_VERSIONS}))
})

const createTransporter = async () => {
	const oauth2Client = new OAuth2(
	  process.env.CLIENT_ID,
	  process.env.CLIENT_SECRET,
	  "https://developers.google.com/oauthplayground"
	);
  
	oauth2Client.setCredentials({
	  refresh_token: process.env.REFRESH_TOKEN
	});

	const accessToken = await new Promise((resolve, reject) => {
		oauth2Client.getAccessToken((err:any, token:any) => {
		  if (err) {
			//log()
			reject("Failed to create access token :(");
		  }
		  resolve(token);
		});
	  });

	const transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
		  type: "OAuth2",
		  user: "admin@ecven.com",
		  accessToken,
		  clientId: process.env.CLIENT_ID,
		  clientSecret: process.env.CLIENT_SECRET,
		  refreshToken: process.env.REFRESH_TOKEN
		}
	  });
	return transporter;
};

async function messageReceived(dataString: string, user: User) {
	let data = null
	try {
		data = JSON.parse(dataString)
	} catch (e) {
		log('Data parsing failed!')
		
		analytics.eventController.triggerEvent(AnalyticsEvents.saveServerLog,1, 1, "Failed to parse data")
		Analytics.logError({message: 'Failed to parse data', details: e})
		
		return
	}
	if (data.event === Events.registerAccountRequest) {
		log('registerAccountRequest received')
		data = data as RegisterAccountRequestData
		analytics.incomingRequest(user,data)
		let email: string = data.email.toLowerCase()
		let password: string = data.password
		let username: string = data.username
		let msg:string = data.message

		let response: Responses

		
		analytics.eventController.triggerEvent(AnalyticsEvents.registerAccountRequest,email,user.ipAddress, msg)
		

		let promiseResponse = await db.registerAccount(email, password, username)
		response = promiseResponse.response

		if(response===Responses.success){
			//await emailFactory.sendRegisterSuccessEmail(email, data.username)
		}

		let responseData : RegisterAccountResponseData = {
			event:Events.registerAccountResponse,
			response:response,
			email:email,
			username:username,
		}
		analytics.outgoingResponse(user, responseData)
		user.socket.send(JSON.stringify(responseData))
	} else if (data.event === Events.registerAdminAccountRequest) {
		log('registerAdminAccountRequest received')
		data = data as RegisterAdminAccountRequestData
		analytics.incomingRequest(user,data)

		let email: string = data.email.toLowerCase()
		let password: string = data.password
		let username: string = data.username

		let response: Responses

		if (user.account !=null){
			if(user.account.accountType === AccountTypes.admin){
				let promiseResponse = await db.registerAdminAccount(email, password, username)
				
				analytics.eventController.triggerEvent(AnalyticsEvents.registerAdminAccountRequest,email, user.ipAddress)
				
				response = promiseResponse.response
			}else{
				response = Responses.unauthorized
			}
		}else{
			response = Responses.loginRequired
		}
		if(response===Responses.success){
			//await emailFactory.sendRegisterSuccessEmail(email, username)
		}
		let responseData : RegisterAdminAccountResponseData = {
			event:Events.registerAdminAccountResponse,
			response:response,
			email:email,
			username:username,
		}
		analytics.outgoingResponse(user, responseData)
		user.socket.send(JSON.stringify(responseData))
	} else if (data.event === Events.deleteAdminAccountRequest) {
		log('deleteAdminAccountRequest received')
		data = data as DeleteAdminAccountRequestData
		analytics.incomingRequest(user,data)

		let email: string = data.email.toLowerCase()

		let response: Responses

		if (user.account !=null){
			if(user.account.accountType === AccountTypes.admin){
				let promiseResponse = await db.deleteAdminAccount(email)
				response = promiseResponse.response
			}else{
				response = Responses.unauthorized
			}
		}else{
			response = Responses.loginRequired
		}
		let responseData : DeleteAdminAccountResponseData = {
			event:Events.deleteAdminAccountResponse,
			response:response,
			email:email,
		}
		analytics.outgoingResponse(user, responseData)
		user.socket.send(JSON.stringify(responseData))
	} else if (data.event === Events.deleteAccountRequest) {
		log('deleteAccountRequest received')
		data = data as DeleteAccountRequestData
		analytics.incomingRequest(user,data)

		let email: string = data.email.toLowerCase()

		let response: Responses

		if (user.account !=null){
			if(user.account.accountType === AccountTypes.admin){
				let promiseResponse = await db.deleteAccount(email)
				response = promiseResponse.response
			}else{
				response = Responses.unauthorized
			}
		}else{
			response = Responses.loginRequired
		}
		let responseData : DeleteAccountResponseData = {
			event:Events.deleteAccountResponse,
			response:response,
			email:email,
		}
		analytics.outgoingResponse(user, responseData)
		user.socket.send(JSON.stringify(responseData))
	} else if (data.event === Events.deleteMemorySessionRequest) {
		log('deleteMemorySessionRequest received')
		data = data as deleteMemorySessionRequestData
		analytics.incomingRequest(user,data)

		let memorySessionId: string = data.memorySessionId

		let response: Responses
		let message: string | null = null

		if (user.account !=null){
			if(user.account.accountType === AccountTypes.admin){
				let promiseResponse = await db.deleteMemorySession(memorySessionId)
				response = promiseResponse.response
				message = promiseResponse.message
			}else{
				response = Responses.unauthorized
			}
		}else{
			response = Responses.loginRequired
		}
		let responseData : deleteMemorySessionResponseData = {
			event:Events.deleteMemorySessionResponse,
			response:response,
			message: message
		}
		analytics.outgoingResponse(user, responseData)
		user.socket.send(JSON.stringify(responseData))
	} else if (data.event === Events.changeAdminPasswordRequest) {
		log('changeAdminPasswordRequest received')
		data = data as ChangeAdminPasswordRequestData
		analytics.incomingRequest(user,data)

		let response: Responses

		let old_pass: string = data.old_pass

		let new_pass: string = data.new_pass

		if (user.account !=null){

			let email: string = user.account.email.toLowerCase()

			if(user.account.accountType === AccountTypes.admin){
				let promiseResponse = await db.changeAdminPassword(email, old_pass, new_pass)
				response = promiseResponse.response
			}else{
				response = Responses.unauthorized
			}
		}else{
			response = Responses.loginRequired
		}
		let responseData : ChangeAdminPasswordResponseData = {
			event:Events.changeAdminPasswordResponse,
			response:response,
		}
		analytics.outgoingResponse(user, responseData)
		user.socket.send(JSON.stringify(responseData))
	} else if (data.event === Events.changePasswordRequest) {
		log('changePasswordRequest received')
		data = data as ChangePasswordRequestData
		analytics.incomingRequest(user,data)

		let response: Responses

		let old_pass: string = data.old_pass

		let new_pass: string = data.new_pass

		if (user.account != null) {
			let email: string = user.account.email.toLowerCase()

			let promiseResponse = await db.changePassword(email, old_pass, new_pass)
			response = promiseResponse.response
		} else {
			response = Responses.loginRequired
		}
		let responseData: ChangePasswordResponseData = {
			event: Events.changePasswordResponse,
			response: response,
		}
		analytics.outgoingResponse(user, responseData)
		user.socket.send(JSON.stringify(responseData))
	} else if (data.event === Events.adminChangesPasswordForUserRequest) {
		log('adminChangesPasswordForUserRequest received')
		data = data as adminChangesPasswordForUserRequestData
		analytics.incomingRequest(user,data)

		let response: Responses

		let pass: string = data.password
		let targetEmail: string = data.email

		if (user.account != null) {

			let email: string = user.account.email.toLowerCase()

			if(user.account.accountType === AccountTypes.admin){
				let promiseResponse = await db.adminChangesPasswordForUser(email, pass)
				response = promiseResponse.response
			}else{
				response = Responses.unauthorized
			}

		} else {
			response = Responses.loginRequired
		}
		let responseData: adminChangesPasswordForUserResponseData = {
			event: Events.adminChangesPasswordForUserResponse,
			response: response,
		}
		analytics.outgoingResponse(user, responseData)
		user.socket.send(JSON.stringify(responseData))
	}else if (data.event === Events.getActiveUsersChartDataRequest) {
		log('getChartDataRequest received')
		data = data as GetActiveUsersChartDataRequest
		analytics.incomingRequest(user,data)

		
		let response:Responses
		let result_data: {
			daily:{date:string, logins:number}[]|null,
			monthly:{date:string, logins:number}[],
			weekly:{date:string, logins:number}[]
		} | null = null

		if (user.account != null) {

			if(user.account.accountType === AccountTypes.admin){
				let result = await Analytics.getActiveUsersChartData()
				response = result.response
				result_data = result.data
			}else{
				response = Responses.unauthorized
			}

		} else {
			response = Responses.loginRequired
		}


		let responseData2 = new GetActiveUsersChartDataResponse(result_data, response, undefined, data.socketMessageId)
		analytics.outgoingResponse(user, responseData2)
		user.socket.send(JSON.stringify(responseData2))

	} else if (data.event === Events.authenticateAccountRequest) {
		log('authenticateAccountRequest received')
		data = data as AuthenticateAccountRequestData
		analytics.incomingRequest(user,data)

		let responseData = await authenticateAccountRequest(user,data.email,data.password, data.pushNotificationToken)
		analytics.outgoingResponse(user, responseData)
		user.socket.send(JSON.stringify(responseData))
		analytics.authenticateAccountRequest(user,data.email,responseData.response)
	} else if (data.event === Events.authenticateAdminAccountRequest) {
		log('authenticateAdminAccountRequest received')
		data = data as AuthenticateAdminAccountRequestData
		analytics.incomingRequest(user,data)

		let responseData = await authenticateAdminAccountRequest(user,data.email,data.password)
		
		analytics.outgoingResponse(user, responseData)
		user.socket.send(JSON.stringify(responseData))
		analytics.authenticateAdminAccountRequest(user,data.email,responseData.response)
	} else if (data.event === Events.rollbackTransactionRequest) {
		//@ts-ignore
		if("TEST_DB_RESET_ENABLED" in CONFIG  && CONFIG.TEST_DB_RESET_ENABLED === true){
			try{
				let res = await mySqlPool.query('CALL reset_database()')
				fs.rmSync(path.join(__dirname, 'testing_public'), { recursive: true })
				//recreate dir
				await fs_extra.ensureDir(uploadPath)
				//let res1 = await mySqlPool.query('SET autocommit=1')
				user.socket.send(JSON.stringify({event: Events.rollbackTransactionResponse, response: Responses.success}))
			}
			catch(e:any){
				Analytics.logError(e)
				user.socket.send(JSON.stringify({event: Events.rollbackTransactionResponse, response: Responses.serverError}))
			}
		}
		else{
			return //no response if we are not in testing mode
		}
	}
}

async function authenticateAdminAccountRequest(user:User, email:string, password:string){
	email = email.toLowerCase()

	let username: string | null = null
	let response: Responses

	
	//analytics.eventController.triggerEvent(AnalyticsEvents.authenticateAdminAccountRequest, email)
	

	let promiseResponse = await db.authenticateAdminAccount(email, password)
	response = promiseResponse.response
	if (response === Responses.success && promiseResponse.account != null) {
		user.linkAccount(promiseResponse.account)
		username = promiseResponse.account.username
	}else{
		analytics.logWarning(`Failed admin login attempt with email: ${email}, socket id: ${user.id}, ip: ${user.ipAddress} `)
	}
	let responseData: AuthenticateAdminAccountResponseData = {
		event: Events.authenticateAdminAccountResponse,
		response: response,
		email: email,
		username: username,

		authToken: user.socket.id,
	}
	return responseData
}
async function authenticateAccountRequest(user:User, email:string, password:string, pushNotificationToken?:string){
		let response: Responses

		email = email.toLowerCase()
		let username: string | null = null

		let promiseResponse = await db.authenticateAccount(email, password)
		response = promiseResponse.response
		if (response === Responses.success && promiseResponse.account != null) {
			user.linkAccount(promiseResponse.account)
			username = promiseResponse.account.username
			if (pushNotificationToken != undefined){
				// it's not a perfect solution to update this here, with auto login the client connects before they have the token. However, it's really an edge case that can be solved later. A separate event, or perhaps a general update setting event would be preferable later
				db.userHistory.updateUserPushNotificationToken(email, pushNotificationToken)
			}
		}
		
		let responseData: AuthenticateAccountResponseData = {
			event: Events.authenticateAccountResponse,
			response: response,
			email: email,
			username: username,

			authToken: user.socket.id,
		}
		return responseData
}

function socketOnClose(user: User, ipadd:string) {
	log('User ' + user.id + ' disconnected at ',Date.now())
	
	analytics.eventController.triggerEvent(AnalyticsEvents.connectionsRequest, "Disconnected", user.id, ipadd)
	
	for (let i = 0; i < users.length; i++) {
		if (users[i].id === user.id) {
			users.splice(i, 1)
			break
		}
	}
}

function getUserById(id: string) {
	for (let i = 0; i < users.length; i++) {
		if (users[i].id === id) {
			return users[i]
		}
	}
	return null
}


let recursiveAsyncReadLine = function () {

	rl.question('Enter a server command at any time: \n ', async function (answer: string) {
		if (answer === 'exit') {
			process.exit()
		} else if(answer==='addtests') {
			console.log("Adding tests...")
			db.registerTestAccounts()
		}else if(answer ==="sendmail"){
			//await emailFactory.sendApprovedBetaTesterEmail('ecventester@gmail.com', 'kutyu')
		}else if(answer ==="testAnal"){
			console.log('testFull')
			
			console.log("beforetry")
			try{
				let dummySocket = {id:uuid.v4(), send:(data:any)=>{console.log('user received:', JSON.parse(data))}}
				let user = new User(dummySocket,"dummyIP")
				user.id='testid'
				let testdata = new RegisterBetaAccountResponse(Responses.success, undefined, undefined)
			//	await Analytics.registerBetaAccountResponse(user,testdata)
			}
			catch(e){
				console.log(e)
			}
		}else if(answer ==="testAnalRequest"){
			console.log('testFull')
			try{
				let dummySocket = {id:uuid.v4(), send:(data:any)=>{console.log('user received:', JSON.parse(data))}}
				let user = new User(dummySocket,"dummyIP")
				user.id='testid'
				let testdata = new RegisterBetaAccountRequest("test@test.test", "hashpass", "mammamia", "kutyus")
				//await Analytics.registerBetaAccountRequest_old(user,testdata)
			}
			catch(e){
				console.log(e)
			}
		}else if(answer ==="testAproveAnal"){
			console.log('testFull')
			try{
				let dummySocket = {id:uuid.v4(), send:(data:any)=>{console.log('user received:', JSON.parse(data))}}
				let user = new User(dummySocket,"dummyIP")
				user.id='testid'
				let testdata = new ApproveBetaTesterRequest("alma@alma.alma", ()=>{})
				//await Analytics.approveBetaTesterRequest_old(user,testdata)
			}
			catch(e){
				console.log(e)
			}
		}else if(answer ==="testTypeormCatch"){
			console.log('testTypeormCatch')
			try{
				let dummySocket = {id:uuid.v4(), send:(data:any)=>{console.log('user received:', JSON.parse(data))}}
				let user = new User(dummySocket,"dummyIP")
				user.id='testid'
				
				//await Analytics.approveBetaTesterRequest_old(user,testdata)
				analytics.outgoingResponse(user, {a:1,b:2})
			}
			catch(e){
				console.log(e)
			}
		}else if(answer ==="testEmailCrash"){
			/*let {html, errors}=emailFactory.createRegisterSuccessEmail({}, 'I_<3-Svicid3 _XD')
			let res =""
			try{
				res = emailFactory.minifyHtml(html)
			}
			catch(e){
				console.log(e)
			}
			console.log(res)*/

		}else if(answer ==="testChart"){
			console.log('testChart')
			try{
				let result = await Analytics.getActiveUsersChartData()
				console.log(result)
				console.log(result.data?.daily)
				console.log(result.data?.weekly)
				console.log(result.data?.monthly)
			}
			catch(e){
				console.log(e)
			}
		}else if(answer ==="testIP"){
			let foundconnection: IpGeolocationAnalytics|null = null
			let ipaddress = '69.69.69.70'
			//let ipaddress = '69.69.69.69'
			let city : string = 'test'
			let country : string = 'test'
			let region : string = 'test'
            try {
                foundconnection = await IpGeolocationAnalytics.findOne({where:{ipaddress:ipaddress}})
            } catch (err) {
                console.error(err);
            }


            if(foundconnection){
				console.log('connectionfound')
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

            }else{
				console.log('connection not found')
                //no match
                const geoResult = await Analytics.getGeoData(ipaddress)
                try{
                    //IpGeolocationAnalytics.insert({ipaddress:ipaddress, region: geoResult.region, city: geoResult.city, country: geoResult.country})
                    IpGeolocationAnalytics.save({ipaddress:ipaddress, region: geoResult.region, city: geoResult.city, country: geoResult.country})
                }
                catch(e){
                    console.log(e)
                }
            }
		}else if(answer ==="testJoin"){
			console.log('testjoin')
			try{

				let que = appDataSource.getRepository(AdminLogInAnalytics)
				que = que.createQueryBuilder("entry")
				que = que.leftJoinAndSelect("entry.geoLocation", "ipgeolocation")
				que = que.where('ipgeolocation.country = :country', { country: 'private' })
				que = que.andWhere('email = :cl')
				que = que.setParameters({ cl:'alma@alma.alma' })
				que = que.take(1000)
				que = que.getMany();

				const values = await que;

				console.log(values)
			}
			catch(e){
				console.log(e)
			}
		}else if(answer ==="testCol"){
			console.log('testCol')
			try{
				const values = await appDataSource.getRepository(ConnectionsAnalytics).metadata.columns.map((col:any)=>col.propertyName)
				
				console.log(values)
			}
			catch(e){
				console.log(e)
			}
		}
		else if(answer === 'convertfolder'){
			rl.question('Enter the path to the folder you would like to convert: \n ', async function (providedPath: string) {
				fs.readdir('./'+providedPath, (err, files) => {
					files.forEach(file => {
						let filepath = 	'./'+providedPath+'/' +path.parse(file).name
						let extension = path.extname(file).replace('.','')
						compressImage(filepath,extension,()=>{})
					});
					recursiveAsyncReadLine()
				});
			})
		}
		else if(answer === 'createthumbnails'){
			rl.question('Enter the path to the folder you would like to create thumbnails for: \n ', async function (providedPath: string) {
				
				fs.readdir('./'+providedPath, { withFileTypes: true },async (err, files) => {
					let thumbnailPath = './'+providedPath+'/thumbnails/'
					await fs_extra.ensureDir(thumbnailPath)
					if (files != null && files.length != null && files.length >0){//had some cases where files was undefined, just being absolutely cautious here
						files.forEach(file => {
							if (file.isFile()){//skip directories
								let inputPath = 	'./'+providedPath +'/'+path.parse(file.name).name
								let extension = path.extname(file.name).replace('.','')
								let outputPath = thumbnailPath +path.parse(file.name).name
								createThumbnailImage(inputPath,extension,outputPath,()=>{})
							}
						});
					}
					recursiveAsyncReadLine()
				});
			})	
		}
		else {
			log('Command not found')
		}
		recursiveAsyncReadLine() //Calling this function again to prompt for new command
	})
}
recursiveAsyncReadLine() //start command line interface


async function test(){
	if (CONFIG.NAME === "LIVE_CONFIG_HTTPS" || CONFIG.NAME === "LIVE_CONFIG"){return} // safety to make sure test function is not called on live server accidentally
	
	let dummySocket = {id:uuid.v4(), send:(data:any)=>{console.log('user received:', JSON.parse(data))}}
	let testUser = new User(dummySocket,"dummyIP")
	
	let authResponse = await authenticateAdminAccountRequest(testUser, "497.psi.497@gmail.com", "4b0b409261a91730a3993f9d91324661a509ba094708f28c855720404c45dcea")
	let resp = await db.users.getUserProfileInfo('test1@ecven.com')
	console.log('resp:', resp)
}
