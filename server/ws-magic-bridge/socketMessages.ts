import { Events, Routes } from './events'
import type { BasicResponses, DefaultResponses, Responses } from './responses'
import type { Beacon } from './shared_classes/beacon'
import type { Message } from './shared_classes/chatroom'
import type { Drop, KeyTypes } from './shared_classes/drop'
import type { Coordinates, LocationCategory, Location, LocationFetchable, LocationSubmission, DifficultyRating, LocationRating, OverallRating, UnconfirmedLocationSource } from './shared_classes/location'
import type { MediaCategory, MediaData, MemoMediaData, ProfileCoverPhoto } from './shared_classes/mediaData'
import type{ Memory, MemoSubmission } from './shared_classes/memory'
import type {MemoSessionCloseReason,MemoSessionStatus,} from './shared_classes/memorySession';
import { NotificationType, Notification } from './shared_classes/notifications'
import { RatingItem } from './shared_classes/ratingItems'
import type { Review, ReviewStatus } from './shared_classes/review'
import type { Account, BetaTesterApplicationStatus, FeedbackMessageType, User, UserLevel } from './shared_classes/user'

export interface SocketMessage {
	response?: Responses
	responseDetails?: string
	socketMessageId?: number
	responseCallback?: Function
	event: Events
}
export abstract class SocketRequest implements SocketMessage{
	event:Events
	socketMessageId: number|undefined
	responseCallback: Function|undefined
	constructor(event:Events,responseCallback:Function|undefined){
		this.event = event
		this.responseCallback = responseCallback
	}
}

export abstract class  SocketResponse implements SocketMessage {
	response: Responses
	responseDetails: string | undefined
	socketMessageId: number| undefined
	event: Events
	constructor(event:Events, response : Responses, responseDetails:string|undefined, socketMessageId:number|undefined){
		this.event = event
		this.response = response
		this.responseDetails = responseDetails
		this.socketMessageId = socketMessageId
	}
}

//export abstract class SocketMessage{
//    response?:Responses
//    responseDetails?:string
//    socketMessageId?:number
//    event:Events
//	constructor(event:Events){
//		this.event = event
//	}
//}
 //respond :Function(data:data: StartMemoSessionResponse) :void //could be useful later...but we need to call the constructor of the request class, which we don't do yet
//not sure yet whether the class or interface solution is better


export class DeleteProfileCoverPhotoRequest extends SocketRequest{
	constructor(responseCallback?:(data:DeleteProfileCoverPhotoResponse)=>void){
		super(Events.deleteProfileCoverPhotoRequest, responseCallback)
	}
}
export class DeleteProfileCoverPhotoResponse extends SocketResponse{
	constructor(response:Responses, responseDetails:string|undefined, socketMessageId:number|undefined){
		super(Events.deleteProfileCoverPhotoResponse, response, responseDetails, socketMessageId)
	}
}


export class UpdateBioRequest extends SocketRequest{
	bio:string|null
	constructor(bio:string|null, responseCallback?:(data:UpdateBioResponse)=>void){
		super(Events.updateBioRequest, responseCallback)
		this.bio = bio
	}
}
export class UpdateBioResponse extends SocketResponse{
	constructor(response:Responses, responseDetails:string|undefined, socketMessageId:number|undefined){
		super(Events.updateBioResponse, response, responseDetails, socketMessageId)
	}
}

export class GetLevelThresholdsRequest extends SocketRequest{
	constructor(responseCallback?:(data:GetLevelThresholdsResponse)=>void){
		super(Events.getLevelThresholdsRequest, responseCallback)
	}
}
export class GetLevelThresholdsResponse extends SocketResponse{
	levelThresholds : Record<UserLevel, number>
	constructor(response:Responses, responseDetails:string|undefined, levelThresholds:Record<UserLevel, number>,  socketMessageId:number|undefined){
		super(Events.getLevelThresholdsResponse, response, responseDetails, socketMessageId)
		this.levelThresholds = levelThresholds
	}
}
export class OpenNotificationRequest extends SocketRequest{
	notificationId:number
	constructor(notificationId:number, responseCallback?:(data:OpenNotificationResponse)=>void){
		super(Events.openNotificationRequest, responseCallback)
		this.notificationId = notificationId
	}
}
export class OpenNotificationResponse extends SocketResponse{
	currentUserContribution:number|null
	contributionReward:number
	newUserLocations : LocationFetchable[] | undefined
	currentUserLevel:UserLevel|undefined
	userLeveledUp : {fromLevel:UserLevel, toLevel:UserLevel} | undefined // if this variable is not undefined, it indicates that the user just leveled up from the contribution received from the opened reward
	constructor(currentUserContribution:number|null, contributionReward:number, newUserLocations : LocationFetchable[] | undefined,currentUserLevel:UserLevel|undefined, userLeveledUp : {fromLevel:UserLevel, toLevel:UserLevel} | undefined, response:Responses, responseDetails:string|undefined, socketMessageId:number|undefined){
		super(Events.openNotificationResponse, response, responseDetails, socketMessageId)
		this.currentUserContribution = currentUserContribution
		this.contributionReward = contributionReward
		this.newUserLocations = newUserLocations
		this.currentUserLevel = currentUserLevel
		this.currentUserContribution = currentUserContribution
	}
}
export class GetUserNotificationsRequest extends SocketRequest{
	filters:{id?:{equals:number}, type?:{in:NotificationType[]}, createdAt?:{before?:Date, after?:Date}, openedAt?: {before?:Date, after?:Date, isNull?:boolean}}
	includeDetails:boolean
	constructor(filters:{id?:{equals:number}, type?:{in:NotificationType[]}, createdAt?:{before?:Date, after?:Date}, openedAt?: {before?:Date, after?:Date, isNull?:boolean}}, includeDetails:boolean = false, responseCallback?:(data:GetUserNotificationsResponse)=>void){
		super(Routes.UserEvents.getUserNotificationsRequest, responseCallback)
		this.filters = filters
		this.includeDetails = includeDetails
	}
}
export class GetUserNotificationsResponse extends SocketResponse{
	notifications:Notification[]
	constructor(notifications:Notification[], response:DefaultResponses, responseDetails:string|undefined, socketMessageId:number|undefined){
		super(Events.getUserNotificationsResponse, response, responseDetails, socketMessageId)
		this.notifications = notifications
	}
}
export class GetLocationHighlightImagesRequest extends SocketRequest{
	locationId:string
	constructor(locationId:string, responseCallback?:(data: GetLocationHighlightImagesResponse) => void){
		super(Routes.LocationEvents.getLocationHighlightImagesRequest, responseCallback)
		this.locationId = locationId
	}
}
export class GetLocationHighlightImagesResponse extends SocketResponse{
	highlightImages: MediaData[]
	constructor(highlightImages: MediaData[],response:BasicResponses|Responses.notFound|Responses.unauthorized,responseDetails:string|undefined,socketMessageId:number|undefined){
		super(Events.getLocationHighlightImagesResponse,response,responseDetails,socketMessageId)
		this.highlightImages = highlightImages
	}
}


export class LeaveMemoSessionRequest extends SocketRequest{
	memoSessionId:string
	constructor(memoSessionId:string, responseCallback?:(data:LeaveMemoSessionResponse)=>void){
		super(Events.leaveMemoSessionRequest, responseCallback)
		this.memoSessionId = memoSessionId
	}
}
export class LeaveMemoSessionResponse extends SocketResponse{
	constructor(response:Responses, responseDetails?:string, socketMessageId?:number){
		super(Events.leaveMemoSessionResponse, response, responseDetails, socketMessageId)
	}
}

export class ChangePasswordByUserRequest extends SocketRequest{
	identityConfirmation:string
	newPass: string
	
	constructor(identityConfirmation:string, newPass:string, responseCallback?:(data:ChangePasswordByUserResponse)=>void){
		super(Events.changePasswordByUserRequest,responseCallback)
		this.identityConfirmation = identityConfirmation
		this.newPass = newPass
	}
}
export class ChangePasswordByUserResponse extends SocketResponse{
	constructor(response:Responses, responseDetails?:string, socketMessageId?:number){
		super(Events.changePasswordByUserResponse, response,responseDetails,socketMessageId)
	}
}

export class UploadLocalLogDumpRequest extends SocketRequest{
	report: string
	
	constructor(report:string, responseCallback?:(data:UploadLocalLogDumpResponse)=>void){
		super(Events.uploadLocalLogDumpRequest,responseCallback)
		this.report = report
	}
}
export class UploadLocalLogDumpResponse extends SocketResponse{
	constructor(response:Responses, responseDetails?:string, socketMessageId?:number){
		super(Events.uploadLocalLogDumpResponse, response,responseDetails,socketMessageId)
	}
}

export class GetAllLocalDumpsRequest extends SocketRequest{
	constructor(responseCallback?:(data:GetAllLocalDumpsResponse)=>void){
		super(Events.getAllLocalDumpsRequest,responseCallback)
	}
}
export class GetAllLocalDumpsResponse extends SocketResponse{

	reports: any[] | null

	constructor(reports:any[] | null, response:Responses, responseDetails?:string, socketMessageId?:number){
		super(Events.getAllLocalDumpsResponse, response,responseDetails,socketMessageId)
		this.reports = reports
	}
}

export class GetActiveUsersChartDataRequest extends SocketRequest{
	
	constructor(responseCallback?:(data:GetActiveUsersChartDataResponse)=>void){
		super(Events.getActiveUsersChartDataRequest,responseCallback)
	}
}
export class GetActiveUsersChartDataResponse extends SocketResponse{
	activeUsers: {
		daily:{date:string, logins:number}[]|null,
		monthly:{date:string, logins:number}[],
		weekly:{date:string, logins:number}[]
	} | null
	constructor(activeUsers:{
					daily:{date:string, logins:number}[]|null,
					monthly:{date:string, logins:number}[],
					weekly:{date:string, logins:number}[]
				} | null = null,
				response:Responses, responseDetails?:string, socketMessageId?:number){
		super(Events.getActiveUsersChartDataResponse, response,responseDetails,socketMessageId)
		this.activeUsers = activeUsers
	}
}

export class ReportDeviceInfoRequest extends SocketRequest{

	modelname:string|null
	osName:string|null
	osVersion:string|null
	browserName:string|null
	broswerVersion:string|null
	brand:string|null
	manufacturer:string|null
	deviceType:string|null

	
	constructor(
		modelname:string|null,
		osName:string|null,
		osVersion:string|null,
		browserName:string|null,
		broswerVersion:string|null,
		brand:string|null,
		manufacturer:string|null,
		deviceType:string|null,
		responseCallback?:(data:ReportDeviceInfoResponse)=>void
	){
		super(Events.reportDeviceInfoRequest,responseCallback)
		this.modelname = modelname
		this.osName = osName
		this.osVersion = osVersion
		this.browserName = browserName
		this.broswerVersion = broswerVersion
		this.brand = brand
		this.manufacturer = manufacturer
		this.deviceType = deviceType
	}
}
export class ReportDeviceInfoResponse extends SocketResponse{
	constructor(response:Responses, responseDetails?:string, socketMessageId?:number){
		super(Events.reportDeviceInfoResponse, response,responseDetails,socketMessageId)
	}
}

export class SendPasswordRecoveryLinkByUserRequest extends SocketRequest{
	email: string
	
	constructor(email:string, responseCallback?:(data:SendPasswordRecoveryLinkByUserResponse)=>void){
		super(Events.sendPasswordRecoveryLinkByUserRequest,responseCallback)
		this.email = email
	}
}
export class SendPasswordRecoveryLinkByUserResponse extends SocketResponse{
	constructor(response:Responses, responseDetails?:string, socketMessageId?:number){
		super(Events.sendPasswordRecoveryLinkByUserResponse, response,responseDetails,socketMessageId)
	}
}

export class DeleteUnconfirmedLocationSubmissionRequest extends SocketRequest{
	locationId:string
	constructor(locationId:string, responseCallback?:(data:DeleteUnconfirmedLocationSubmissionResponse)=>void){
		super(Routes.LocationEvents.deleteUnconfirmedLocationSubmissionRequest,responseCallback)
		this.locationId = locationId
	}
}
export class DeleteUnconfirmedLocationSubmissionResponse extends SocketResponse{
	constructor(response:DefaultResponses, responseDetails?:string, socketMessageId?:number){
		super(Events.deleteUnconfirmedLocationSubmissionResponse, response, responseDetails, socketMessageId)
	}
}
export class ChangeLocationCategoryRequest extends SocketRequest{
	memoSessionId: string
	locationCategory:LocationCategory
	constructor(memoSessionId:string, locationCategory:LocationCategory, responseCallback?:(data:ChangeLocationCategoryResponse)=>void){
		super(Events.changeLocationCategoryRequest,responseCallback)
		this.memoSessionId = memoSessionId
		this.locationCategory = locationCategory
	}
}
export class ChangeLocationCategoryResponse extends SocketResponse{
	constructor(response:DefaultResponses, responseDetails?:string, socketMessageId?:number){
		super(Events.changeLocationCategoryResponse, response, responseDetails, socketMessageId)
	}
}
export class DeleteLocationGalleryMediaRequest extends SocketRequest{
	mediaId:string
	constructor(mediaId:string, responseCallback?:(data:DeleteLocationGalleryMediaResponse)=>void){
		super(Events.deleteLocationGalleryMediaRequest,responseCallback )
		this.mediaId = mediaId
	}
}
export class DeleteLocationGalleryMediaResponse extends SocketResponse{
	constructor(response:Responses.success|Responses.serverError|Responses.loginRequired|Responses.notFound,responseDetails?:string, socketMessageId?:number){
		super(Events.deleteLocationGalleryMediaResponse, response, responseDetails, socketMessageId)
	}
}
export class LikeMediaRequest extends SocketRequest{
	mediaId:string
	like:boolean // sending true/false will set the like value accordingly
	constructor(mediaId:string, like:boolean, responseCallback?:(data:LikeMediaResponse)=>void){
		super(Events.likeMediaRequest,responseCallback)
		this.mediaId = mediaId
		this.like = like
	}
} 
export class LikeMediaResponse extends SocketResponse{
	constructor(response:BasicResponses|Responses.notFound, responseDetails?:string, socketMessageId?:number){
		super(Events.likeMediaResponse, response, responseDetails, socketMessageId)
	}
}
export class SubmitUnconfirmedLocationReviewRequest extends SocketRequest{
	unconfirmedLocationId:string
	mediaReviews: { mediaId: string; review: Review }[]
	locationReview:Review
	actionType:'approveAndSubmit'|'rejectAndGrantLocation'|'saveOnly' // Along with updating the review, the the front-end can choose from 3 options:
						//1) saveAndSubmit: it can approve and submit the unconfirmed location (thereby creating a new location that is publicly visible. this is irreversible for now)
						//2) rejectAndGrantLocation: rejects the unconfirmed location, because the location already exists in the database. This adds the existing location to the user's locations
						//3) saveOnly: it can save the review state only, without submission or granting location (for example for partial reviews/temporary rejections/permanent rejections)
	addLocationIdToSubmittor?:string //if this is a rejectAndGrantLocation, we need to add the existing location to the user. This field is mandatory for action type "rejectAndGrantLocation", and is disregarded for other action types
	constructor(unconfirmedLocationId:string, mediaReviews: { mediaId: string; review: Review }[], locationReview:Review, actionType:'approveAndSubmit'|'rejectAndGrantLocation'|'saveOnly', addLocationIdToSubmittor?:string, responseCallBack?:(data:SubmitUnconfirmedLocationReviewResponse)=>void){
		super(Routes.AdminEvents.submitUnconfirmedLocationReviewRequest,responseCallBack)
		this.unconfirmedLocationId = unconfirmedLocationId
		this.mediaReviews = mediaReviews
		this.locationReview = locationReview
		this.actionType = actionType
		this.addLocationIdToSubmittor = addLocationIdToSubmittor
	}
}
export class SubmitUnconfirmedLocationReviewResponse extends SocketResponse{
	constructor(response:Responses.success|Responses.alreadyReviewed|Responses.notFound|Responses.loginRequired|Responses.unauthorized|Responses.serverError|Responses.invalidRequest, responseDetails?:string, socketMessageId?:number){
		super(Events.submitUnconfirmedLocationReviewResponse, response, responseDetails, socketMessageId)
	}
}
export class GetUnconfirmedLocationSubmissionsRequest extends SocketRequest{
	reviewStatusFilter?:ReviewStatus
	submittorEmailFilter?:string
	idFilter?:string
	constructor({reviewStatusFilter, submittorEmailFilter, idFilter} : {reviewStatusFilter?:ReviewStatus, submittorEmailFilter?:string, idFilter?:string}, responseCallback?:(data:GetUnconfirmedLocationSubmissionsResponse)=>void){
		super(Routes.AdminEvents.getUnconfirmedLocationsRequest,responseCallback)
		this.reviewStatusFilter = reviewStatusFilter
		this.submittorEmailFilter = submittorEmailFilter
		this.idFilter = idFilter
	}
}
export class GetUnconfirmedLocationSubmissionsResponse extends SocketResponse{
	locationSubmissions:LocationSubmission[]
	constructor(locationSubmissions:LocationSubmission[], response:BasicResponses|Responses.unauthorized, responseDetails?:string, socketMessageId?:number){
		super(Events.getUnconfirmedLocationsResponse, response, responseDetails,socketMessageId)
		this.locationSubmissions= locationSubmissions
	}
}
export class StartUnconfirmedLocationSubmissionRequest extends SocketRequest{
	constructor(responseCallback?:(data:StartUnconfirmedLocationSubmissionResponse)=>void){
		super(Routes.LocationEvents.startUnconfirmedLocationSubmissionRequest,responseCallback)
	}
}
export class StartUnconfirmedLocationSubmissionResponse extends SocketResponse{
	locationId:string
	constructor(response:BasicResponses, locationId:string, responseDetails?:string, socketMessageId?:number){
		super(Events.startUnconfirmedLocationSubmissionResponse, response,responseDetails,socketMessageId)
		this.locationId = locationId
	}
}
export class SubmitUnconfirmedLocationRequest extends SocketRequest{
	locationId:string
	name:string
	coordinates: Coordinates
	category:LocationCategory
	difficultyRating:DifficultyRating
	overallRating:OverallRating
	levelRequired:UserLevel
	ratingItemList:RatingItem[]
	mediaList:MediaData[]
	unconfirmedLocationSource:UnconfirmedLocationSource
	comment?:string
	constructor(locationId:string, name:string, coordinates:Coordinates, category:LocationCategory,difficultyRating:DifficultyRating, overallRating:OverallRating, levelRequired:UserLevel, ratingItemList:RatingItem[], mediaList:MediaData[],unconfirmedLocationSource:UnconfirmedLocationSource, comment?:string, responseCallback?:(data:SubmitUnconfirmedLocationResponse)=>void){
		super(Routes.LocationEvents.submitUnconfirmedLocationRequest,responseCallback)
		this.locationId = locationId
		this.name = name
		this.coordinates = coordinates
		this.category = category
		this.difficultyRating = difficultyRating
		this.overallRating = overallRating
		this.levelRequired = levelRequired
		this.ratingItemList = ratingItemList
		this.mediaList = mediaList
		this.unconfirmedLocationSource = unconfirmedLocationSource
		this.comment = comment
	}
}
export class SubmitUnconfirmedLocationResponse extends SocketResponse{
	constructor(response:Responses, responseDetails?:string, socketMessageId?:number){
		super(Events.submitUnconfirmedLocationResponse, response,responseDetails,socketMessageId)
	}
}
export class SubmitFeedbackMessageRequest extends SocketRequest{
	message:string
	messageType:FeedbackMessageType
	metadata:any
	constructor(message:string, messageType:FeedbackMessageType,metadata:any, responseCallback?:(data:SubmitFeedbackMessageResponse)=>void){
		super(Routes.UserEvents.submitFeedbackMessageRequest,responseCallback)
		this.message = message
		this.messageType = messageType
		this.metadata = metadata
	}
}
export class SubmitFeedbackMessageResponse extends SocketResponse{
	constructor(response:BasicResponses,responseDetails?:string, socketMessageId?:number){
		super(Events.submitFeedbackMessageResponse,response,responseDetails,socketMessageId)
	}
}
export class GetAllBlockedUsersRequest extends SocketRequest{
	constructor(responseCallback?:(data:GetAllBlockedUsersResponse)=>void){
		super(Routes.UserEvents.getAllBlockedUsersRequest,responseCallback)
	}
}
export class GetAllBlockedUsersResponse extends SocketResponse{
	blockedUsers:Account[]
	constructor(blockedUsers:Account[], response:Responses.loginRequired|Responses.success|Responses.serverError,responseDetails?:string, socketMessageId?:number){
		super(Events.getAllBlockedUsersResponse,response,responseDetails,socketMessageId)
		this.blockedUsers = blockedUsers
	}
}
export class UnblockUserRequest extends SocketRequest{
	blockedUserEmail:string
	constructor(blockedUserEmail:string,responseCallback?:(data:UnblockUserResponse)=>void){
		super(Routes.UserEvents.unblockUserRequest,responseCallback)
		this.blockedUserEmail = blockedUserEmail
	}
}
export class UnblockUserResponse extends SocketResponse{
	constructor(response:DefaultResponses, responseDetails?:string, socketMessageId?:number){
		super(Events.unblockUserResponse,response,responseDetails,socketMessageId)
	}
}
export class BlockUserRequest extends SocketRequest{
	blockedUserEmail:string
	constructor(blockedUserEmail:string,responseCallback?:(data:BlockUserResponse)=>void){
		super(Routes.UserEvents.blockUserRequest,responseCallback)
		this.blockedUserEmail = blockedUserEmail
	}
}
export class BlockUserResponse extends SocketResponse{
	constructor(response:DefaultResponses|Responses.failure, responseDetails?:string, socketMessageId?:number){
		super(Events.blockUserResponse,response,responseDetails,socketMessageId)
	}
}
export class RegisterBetaAccountRequest extends SocketRequest{
	email:string
	password:string
	username:string
	betaKey:string
	constructor(email:string,password:string, username:string, betaKey:string, responseCallback?:(data:RegisterBetaAccountResponse)=>void){
		super(Routes.BetaTesting.registerBetaAccountRequest,responseCallback)
		this.email = email
		this.password = password
		this.username = username
		this.betaKey = betaKey
	}
}
export class GetBetaTesterApplicationsRequest extends SocketRequest{
	constructor(responseCallback:(data:GetBetaTesterApplicationsResponse)=>void){
		super(Routes.BetaTesting.getBetaTesterApplicationsRequest,responseCallback)
	}
}
export class GetBetaTesterApplicationsResponse extends SocketResponse{
	betaTesterApplications : {email:string, appliedDate:Date|null, status:BetaTesterApplicationStatus, betaKey:string|null,inviteDate:Date|null,registerDate:Date|null, registeredEmail:string|null, metadata:any}[]
	constructor(betaTesterApplications : {email:string, appliedDate:Date|null, status:BetaTesterApplicationStatus, betaKey:string|null,inviteDate:Date|null,registerDate:Date|null, registeredEmail:string|null, metadata:any}[], response:DefaultResponses,responseDetails?:string, socketMessageId?:number){
		super(Events.getBetaTesterApplicationsResponse, response,responseDetails,socketMessageId)
		this.betaTesterApplications = betaTesterApplications
	}
}
export class RegisterBetaAccountResponse extends SocketResponse{
	constructor(response:DefaultResponses,responseDetails?:string, socketMessageId?:number){
		super(Events.registerAccountResponse, response,responseDetails,socketMessageId)
	}
}
export class ApproveBetaTesterRequest extends SocketRequest{
	email:string
	constructor(email:string, responseCallback?:(data:ApproveBetaTesterResponse)=>void){
		super(Routes.BetaTesting.approveBetaTesterRequest,responseCallback)
		this.email = email
	}
}
export class ApproveBetaTesterResponse extends SocketResponse{
	constructor(response:DefaultResponses,responseDetails?:string, socketMessageId?:number){
		super(Events.approveBetaTesterResponse,response,responseDetails, socketMessageId)
	}
}
export class SignUpForBetaTestingRequest extends SocketRequest{
	email:string
	metadata:any
	constructor(email:string, metadata:any,responseCallback:(data:SignUpForBetaTestingResponse)=>void){
		super(Routes.BetaTesting.signUpForBetaTestingRequest,responseCallback)
		this.metadata = metadata
		this.email = email
	}
}
export class SignUpForBetaTestingResponse extends SocketResponse{
	constructor(response:DefaultResponses,responseDetails:string|undefined, socketMessageId:number|undefined){
		super(Events.signUpForBetaTestingResponse,response,responseDetails,socketMessageId)
	}
}
export class GetMemoSessionsRequest extends SocketRequest{
	userEmailFilter :string|null
	idFilter:string|null
	statusFilter:MemoSessionStatus|null
	dropKeyFilter:string|null
	constructor(userEmailFilter:string|null, idFilter:string|null, statusFilter:MemoSessionStatus|null, dropKeyFilter:string|null, responseCallback?:(data:GetMemoSessionsResponse)=>void){
		super(Routes.AdminEvents.getMemoSessionsRequest,responseCallback)
		this.userEmailFilter = userEmailFilter
		this.idFilter = idFilter
		this.statusFilter = statusFilter
		this.dropKeyFilter = dropKeyFilter
	}
}
export class GetMemoSessionsResponse extends SocketResponse{
	memoList:MemoSubmission[]
	constructor(memoList:MemoSubmission[], response:DefaultResponses,responseDetails:string|undefined, socketMessageId:number|undefined){
		super(Events.getMemoSessionsResponse,response,responseDetails,socketMessageId)
		this.memoList = memoList
	}
}
export class DeleteLocationCommentRequest extends SocketRequest{
	commentId:string
	constructor(commentId:string, responseCallback?:(data:DeleteLocationCommentResponse)=>void){
		super(Routes.LocationEvents.deleteLocationCommentRequest,responseCallback)
		this.commentId = commentId
	}
}
export class DeleteLocationCommentResponse extends SocketResponse{
	constructor(response:Responses.success|Responses.loginRequired|Responses.notFound|Responses.serverError, responseDetails?:string, socketMessageId?:number){
		super(Events.deleteLocationCommentResponse,response,responseDetails,socketMessageId)
	}
}
export class EditLocationCommentRequest extends SocketRequest{
	commentId:string
	comment:string
	constructor(commentId:string, comment:string,responseCallback?:(data:EditLocationCommentResponse)=>void){
		super(Routes.LocationEvents.editLocationCommentRequest,responseCallback)
		this.commentId = commentId
		this.comment = comment
	}
}
export class EditLocationCommentResponse extends SocketResponse{
	constructor(response:BasicResponses|Responses.notFound,responseDetails:string|undefined, socketMessageId:number|undefined){
		super(Events.editLocationCommentResponse,response,responseDetails,socketMessageId)
	}
}
export class AddLocationCommentRequest extends SocketRequest{
	locationId:string
	comment:string
	constructor(locationId:string, comment:string,responseCallback?:(data:AddLocationCommentResponse)=>void){
		super(Routes.LocationEvents.addLocationCommentRequest,responseCallback)
		this.locationId = locationId
		this.comment = comment
	}
}
export class AddLocationCommentResponse extends SocketResponse{
	constructor(response:DefaultResponses,responseDetails:string|undefined, socketMessageId:number|undefined){
		super(Events.addLocationCommentResponse,response,responseDetails,socketMessageId)
	}
}
export class GetUserProfileRequest extends SocketRequest{
	email:string
	constructor(email:string, responseCallback?:(data:GetUserProfileResponse)=>void){
		super(Routes.UserEvents.getUserProfileRequest,responseCallback)
		this.email = email
	}
}
export class GetUserProfileResponse extends SocketResponse{
	locationsUnlocked:number|null
	totalLocationsInApp:number|null
  locationsAdded:number|null
	locationsExplored:number|null
	memosCreated:number|null
	contribution:number|null
	dropsDeployed:number|null
	dropsCaptured:number|null

	userLevel:UserLevel|undefined
	bio:string|undefined
	coverPhoto:ProfileCoverPhoto|undefined
	constructor(locationsUnlocked:number|null, locationsExplored:number|null, memosCreated:number|null,dropsDeployed:number|null, dropsCaptured:number|null, contribution:number|null, totalLocationsInApp:number|null, locationsAdded:number|null, userLevel:UserLevel|undefined, bio:string|undefined,coverPhoto:ProfileCoverPhoto|undefined, response:DefaultResponses, responseDetails:string|undefined, socketMessageId:number|undefined){
		super(Events.getUserProfileResponse, response,responseDetails,socketMessageId)
		this.locationsUnlocked = locationsUnlocked
		this.totalLocationsInApp = totalLocationsInApp
		this.locationsAdded = locationsAdded
		this.locationsExplored = locationsExplored
		this.memosCreated = memosCreated
		this.contribution = contribution
		this.dropsCaptured = dropsCaptured
		this.dropsDeployed = dropsDeployed

		this.userLevel = userLevel
		this.bio = bio
		this.coverPhoto = coverPhoto
	}
}
export class LogoutRequest extends SocketRequest{
	constructor(responseCallback?:(data:LogoutResponse)=>void){
		super(Routes.UserEvents.logoutRequest,responseCallback)
	}
}
export class LogoutResponse extends SocketResponse{
	constructor(response:Responses.success|Responses.loginRequired,responseDetails:string|undefined,socketMessageId:number|undefined){
		super(Events.logoutResponse,response,responseDetails,socketMessageId)
	}
}
export class GetAllLocationsRequest extends SocketRequest{
	constructor(responseCallback?:(data:GetAllLocationsResponse) =>void){
		super(Routes.LocationEvents.getAllLocationsRequest,responseCallback)
	}
}
export class GetAllLocationsResponse extends SocketResponse{
	locations:LocationFetchable[]
	constructor(locations:LocationFetchable[],response:Responses,responseDetails?:string, socketMessageId?:number){
		super(Events.getAllLocationsResponse,response,responseDetails, socketMessageId)
		this.locations = locations
	}
}
export class GetMyLocationsRequest extends SocketRequest{
	constructor(responseCallback?:(data:GetMyLocationsResponse) =>void){
		super(Routes.LocationEvents.getMyLocationsRequest,responseCallback)
	}
}
export class GetMyLocationsResponse extends SocketResponse{
	locations:LocationFetchable[]
	locationSubmissions:LocationSubmission[]
	constructor(locations:LocationFetchable[],locationSubmissions:(LocationSubmission)[],response:Responses,responseDetails?:string, socketMessageId?:number){
		super(Events.getMyLocationsResponse,response,responseDetails, socketMessageId)
		this.locations = locations
		this.locationSubmissions = locationSubmissions
	}
}
export class GetLocationRequest extends SocketRequest{
	locationId:string
	constructor(locationId:string, responseCallback?:(data: GetLocationResponse) => void){
		super(Routes.LocationEvents.getLocationRequest, responseCallback)
		this.locationId = locationId
	}
}
export class GetLocationResponse extends SocketResponse{
	location:Location|null
	constructor(location:Location|null,response:DefaultResponses,responseDetails:string|undefined,socketMessageId:number|undefined){
		super(Events.getLocationResponse,response,responseDetails,socketMessageId)
		this.location = location
	}
}
export class StartMemoSessionRequest extends SocketRequest{
	coordinates: Coordinates
	locationId?: string
	constructor(coordinates:Coordinates,locationId?:string, responseCallback?: (data: StartMemoSessionResponse) => void){
		super(Routes.MemoEvents.startMemoSessionRequest,responseCallback)
		this.coordinates = coordinates
		this.locationId = locationId
		this.responseCallback = responseCallback
	}	
}
export class StartMemoSessionResponse extends SocketResponse{
	memoSessionId:string|null
	constructor(memoSessionId:string|null,response:DefaultResponses|Responses.userOutOfRange|Responses.duplicate|Responses.missingField, responseDetails:string|undefined,socketMessageId:number|undefined){
		super(Events.startMemoSessionResponse,response,responseDetails,socketMessageId)
		this.memoSessionId = memoSessionId
	}
}
export class StartMemoSessionWithDropDeployRequest extends SocketRequest{
	dropKey:string
	coordinates:Coordinates
	constructor(dropKey:string,coordinates:Coordinates, responseCallback?:(data:StartMemoSessionWithDropDeployResponse)=>void){
		super(Routes.MemoEvents.startMemoSessionWithDropDeployRequest,responseCallback)
		this.dropKey = dropKey
		this.coordinates = coordinates
	}
}
export class StartMemoSessionWithDropDeployResponse extends SocketResponse{
	deploySessionId: string | null
	constructor(deploySessionId:string|null, response:Responses, responseDetails:string|undefined, socketMessageId:number|undefined){
		super(Events.startMemoSessionWithDropDeployResponse,response,responseDetails,socketMessageId)
		this.deploySessionId = deploySessionId
	}
}
export class GetMemoryByIdRequest extends SocketRequest {
	event = Routes.MemoEvents.getMemoryByIdRequest
	memoryId: string
	constructor(memoryId: string, responseCallback?: (data: GetMemoryByIdResponse) => void) {
		super(Routes.MemoEvents.getMemoryByIdRequest,responseCallback)
		this.memoryId = memoryId
	}
}
export class GetMemoryByIdResponse extends SocketResponse {
	memory: Memory| undefined
	memoSubmission : MemoSubmission|undefined
	constructor(
		memory: Memory|undefined,
		memoSubmission:MemoSubmission|undefined,
		response:| Responses.success| Responses.loginRequired| Responses.unauthorized| Responses.notFound| Responses.serverError,
		responseDetails?: string,
		socketMessageId?: number) 
	{
		super(Events.getMemoryByIdResponse, response,responseDetails,socketMessageId)
		this.memory = memory
		this.memoSubmission = memoSubmission
	}
}
export enum FilterCriteria {
	between = 'between',
	smallerthan = 'smallerthan',
	largerthan = 'largerthan',
	equal = 'equal',
	all = 'all',
}

export declare interface deleteMemorySessionRequestData {
	event: Events.deleteMemorySessionRequest
	memorySessionId: string
}

export declare interface deleteMemorySessionResponseData {
	event: Events.deleteMemorySessionResponse
	response: Responses
	message: string | null
}


export declare interface deleteLogsRequestData {
	event: Events.deleteLogsRequest
	table: TableFilter | null
	column: string | null
	criteria: FilterCriteria
	value1: any
	value2: any | null
}
export declare interface deleteLogsResponseData {
	event: Events.deleteLogsResponse
	response: Responses
	rows_affected: number
}

export declare interface RegisterAccountRequestData {
	event: Events.registerAccountRequest
	email: string
	password: string
	username: string
	message: string
}

export declare interface RegisterAccountResponseData {
	event: Events.registerAccountResponse
	response: Responses
	email: string
	username: string
}

export declare interface RegisterAdminAccountRequestData {
	event: Events.registerAdminAccountRequest
	email: string
	password: string
	username: string
}

export declare interface RegisterAdminAccountResponseData {
	event: Events.registerAdminAccountResponse
	response: Responses
	email: string
	username: string
}

export declare interface ChangePasswordRequestData {
	event: Events.changePasswordRequest
	old_pass: string
	new_pass: string
}

export declare interface ChangePasswordResponseData {
	event: Events.changePasswordResponse
	response: Responses
}

export declare interface ChangeAdminPasswordRequestData {
	event: Events.changeAdminPasswordRequest
	old_pass: string
	new_pass: string
}

export declare interface ChangeAdminPasswordResponseData {
	event: Events.changeAdminPasswordResponse
	response: Responses
}

export declare interface SendPasswordRecoveryLinkByUserRequestData {
	event: Events.sendPasswordRecoveryLinkByUserRequest
	email: string
}

export declare interface SendPasswordRecoveryLinkByUserResponseData {
	event: Events.sendPasswordRecoveryLinkByUserResponse
	response: Responses
}

export declare interface ChangePasswordByUserRequestData {
	event: Events.changePasswordByUserRequest
	identityConfirmation:string
	newPass: string
}

export declare interface ChangePasswordByUserResponseData {
	event: Events.changePasswordByUserResponse
	response: Responses
}

export declare interface DeleteAccountRequestData {
	event: Events.deleteAccountRequest
	email: string
}

export declare interface DeleteAccountResponseData {
	event: Events.deleteAccountResponse
	email: string
	response: Responses
}

export declare interface DeleteAdminAccountRequestData {
	event: Events.deleteAdminAccountRequest
	email: string
}

export declare interface DeleteAdminAccountResponseData {
	event: Events.deleteAdminAccountResponse
	email: string
	response: Responses
}

export declare interface AuthenticateAccountRequestData {
	event: Events.authenticateAccountRequest
	email: string
	password: string,
	pushNotificationToken : string
}

export declare interface getLogsWithFiltersRequestData {
	event: Events.getLogsWithFiltersRequest
	table: TableFilter | null
	id: number | null
	message: string | null
	email: string | null
	timestamp: string | null
	key: string | null
	client_id: string | null
	keytype: number | null
	level: number | null
	type: number | null
	city: string | null
	country: string | null
	region: string | null
	ipaddress: string | null
}

export declare interface getLogsWithFiltersFromMultipleTablesRequestData {
	event: Events.getLogsWithFiltersFromMultipleTablesRequest
	table: TableFilter[] | null
	id: number | null
	message: string | null
	email: string | null
	timestamp: string | null
	key: string | null
	client_id: string | null
	keytype: number | null
	level: number | null
	type: number[] | null
	city: string | null
	country: string | null
	region: string | null
	ip_address: string | null
	details: string | null
	response: Responses[]|null
	metadata: string | null
	responseDetails: string | null
	socketmessageID: number | null
	loggedEvent: Events | null
	secretKeyWord: string | null
	locationName: string | null
	locationID: string | null
	memoryID: string | null
	password: string |null
	username: string | null
	betaKey: string | null
	adminEmail: string | null
	partialStringMatch:boolean
	startDate: Date | null
	endDate: Date | null
	[key:string]:any
	brand:string|null
	deviceType:string|null
	modelName:string|null
	osName:string|null
	osVersion:string|null
	browserName:string|null
	manufacturer:string|null
	browserVersion:string|null
}

export declare interface GetLogsResponseData {
	event: Events.getLogsResponse
	response: Responses
	logs: any
}

export declare interface getLogsWithFiltersFromMultipleTablesResponseData {
	event: Events.getLogsWithFiltersFromMultipleTablesResponse
	response: Responses
	logs: any[] | null
	uniques: TableFilter[] | null
}

export declare interface AuthenticateAccountResponseData {
	event: Events.authenticateAccountResponse
	response: Responses
	email: string
	username: string | null
	authToken: string
}

export declare interface AuthenticateAdminAccountRequestData {
	event: Events.authenticateAdminAccountRequest
	email: string
	password: string
}

export declare interface AuthenticateAdminAccountResponseData {
	event: Events.authenticateAdminAccountResponse
	response: Responses
	email: string
	username: string | null
	authToken: string
}

export declare interface KeyStatusRequestData {
	event: Events.keyStatusRequest
	key: string
	metadata?: string
}

export declare interface KeyStatusResponseData {
	event: Events.keyStatusResponse
	response: Responses
	keyType: KeyTypes | null
	drop: Drop | null
	beacon: Beacon | null
	key: string
}

export declare interface StartMemoSessionWithDropCaptureRequestData {
	event: Events.startMemoSessionWithDropCaptureRequest
	dropKey: string
}

export declare interface StartMemoSessionWithDropCaptureResponseData {
	event: Events.startMemoSessionWithDropCaptureResponse
	deploySessionId: string | null
	response: Responses
}

export declare interface StartEditMemoSessionRequestData {
	event: Events.startEditMemoSessionRequest
	deploySessionId: string
}
export declare interface StartEditMemoSessionResponseData {
	event: Events.startEditMemoSessionResponse
	deploySessionId: string
	response: Responses
}

export declare interface JoinMemoSessionRequestData {
	event: Events.joinMemoSessionRequest
	deploySessionId: string
	coordinates: Coordinates
}

export declare interface JoinMemoSessionResponseData {
	event: Events.joinMemoSessionResponse
	response: Responses
	responseDetails: string|undefined
}

export declare interface MemoSessionUpdateData {
	event: Events.memoSessionUpdate
	id: string
	status: MemoSessionStatus | null
	coordinates: Coordinates | null
	locationName: string | null
	secretKeyword: string | null
	mediaList: MemoMediaData[] | null
	locationRating: LocationRating | null
	usersData: { username: string; email: string; submitPercentage: number }[]
	msSubmittable: boolean | null
}
export declare interface MemoSessionClosedData {
	event: Events.memoSessionClosed
	id: string
	reason: MemoSessionCloseReason
}

export declare interface ChangeLocationNameRequestData {
	event: Events.changeLocationNameRequest
	memoSessionId: string
	locationName: string
}

export declare interface ChangeLocationNameResponseData {
	event: Events.changeLocationNameResponse
	response: Responses
}

export declare interface ChangeSecretKeywordRequestData {
	event: Events.changeSecretKeywordRequest
	deploySessionId: string
	secretKeyword: string
}

export declare interface ChangeSecretKeywordResponseData {
	event: Events.changeSecretKeywordResponse
	response: Responses
}

export declare interface ChangeLocationDifficultyRatingRequestData {
	event: Events.changeLocationDifficultyRatingRequest
	deploySessionId: string
	difficultyRating: DifficultyRating
}

export declare interface ChangeLocationDifficultyRatingResponseData {
	event: Events.changeLocationDifficultyRatingResponse
	response: Responses
}

export declare interface ChangeLocationOverallRatingRequestData {
	event: Events.changeLocationOverallRatingRequest
	deploySessionId: string
	overallRating: OverallRating
}

export declare interface ChangeLocationOverallRatingResponseData {
	event: Events.changeLocationOverallRatingResponse
	response: Responses
}
export declare interface ChangeSubmitPercentageRequestData {
	event: Events.changeSubmitPercentageRequest
	deploySessionId: string
	submitPercentage: number
}

export declare interface AddRatingItemRequestData {
	event: Events.addRatingItemRequest
	deploySessionId: string
	ratingItem: RatingItem
}
export declare interface AddRatingItemResponseData {
	event: Events.addRatingItemResponse
	response: Responses
}
export declare interface RemoveRatingItemRequestData {
	event: Events.removeRatingItemRequest
	deploySessionId: string
	ratingItemId: number
}
export declare interface RemoveRatingItemResponseData {
	event: Events.removeRatingItemResponse
	response: Responses
}
export declare interface ChangeRatingItemRequestData {
	event: Events.changeRatingItemRequest
	deploySessionId: string
	ratingItemId: number
	newComments: string[]
}
export declare interface ChangeRatingItemResponseData {
	event: Events.changeRatingItemResponse
	response: Responses
}

export declare interface ChangeCommentRequestData {
	event: Events.changeCommentRequest
	deploySessionId: string
	comment: string
}
export declare interface ChangeCommentResponseData {
	event: Events.changeCommentResponse
	response: Responses
}

export declare interface ChangeCoordinatesRequestData {
	event: Events.changeCoordinatesRequest
	deploySessionId: string
	coordinates: Coordinates
}
export declare interface ChangeCoordinatesResponseData {
	event: Events.changeCoordinatesResponse
	response: Responses
}

export declare interface RemoveMemoSessionMediaDataRequest {
	event: Events.removeMemoSessionMediaDataRequest
	deploySessionId: string
	mediaDataId: string
}
export declare interface RemoveMemoSessionMediaDataResponse {
	event: Events.removeMemoSessionMediaDataResponse
	response: Responses
}
export declare interface MemoSessionUpdateRequestData {
	event: Events.memoSessionUpdateRequest
	deploySessionId: string
}
export declare interface MemoSessionUpdateResponseData {
	event: Events.memoSessionUpdateResponse
	deploySessionId: string
	response: Responses
}


export declare interface MemoSessionSubmittedData {
	event: Events.memoSessionSubmitted
	deploySessionId: string
	response: Responses
}

export declare interface SubmitMemoSessionReviewRequestData {
	event: Events.submitMemoSessionReviewRequest
	review: ReviewStatus
	reviewComment: string
}
export declare interface SubmitMemoSessionReviewResponseData {
	event: Events.submitMemoSessionReviewResponse
	response: Responses
}

export declare interface adminPanelLoadedNotification {
	event: Events.adminPanelLoaded
}

export declare interface GetMemoriesAwaitingReviewRequestData {
	event: Events.getMemoriesAwaitingReviewRequest
}

export declare interface GetMemoriesAwaitingReviewResponseData {
	event: Events.getMemoriesAwaitingReviewResponse
	response:
		| Responses.success
		| Responses.loginRequired
		| Responses.unauthorized
		| Responses.serverError
		| Responses.notFound
	memories: MemoSubmission[]
}

export declare interface SubmitMemoryReviewRequestData {
	event: Events.submitMemoryReviewRequest
	memoryId: string
	mediaReviews: { mediaId: string; review: Review }[]
	memoryReview: Review
}

export declare interface SubmitMemoryReviewResponseData {
	event: Events.submitMemoryReviewResponse,
	memoSubmitted:boolean
	responseDetails:string
	response:
		| Responses.success
		| Responses.alreadyReviewed
		| Responses.notFound
		| Responses.loginRequired
		| Responses.unauthorized
		| Responses.serverError
		| Responses.temporarilyUnavailable
}

export declare interface GetDropMemoriesRequestData {
	event: Events.getDropMemoriesRequest
	dropKey: string
	maxCount: number | null //maximum number of memories to retrieve. For example, if the client only needs the most recent memory, this value should be 1 (memories are ordered in most recent first)
}
export declare interface GetDropMemoriesResponseData {
	event: Events.getDropMemoriesResponse
	response: Responses.success | Responses.notFound | Responses.serverError
	memoryList: Memory[] //maximum number of memories to retrieve. For example, if the client only needs the most recent memory, this value should be 1 (memories are ordered in most recent first)
}

export declare interface GetUserMemoriesRequestData {
	event: Events.getUserMemoriesRequest
	userEmail: string
	maxCount: number | null //maximum number of memories to retrieve. For example, if the client only needs the most recent memory, this value should be 1 (memories are ordered in most recent first)
}
export declare interface GetUserMemoriesResponseData {
	event: Events.getUserMemoriesResponse
	response: Responses.success | Responses.notFound | Responses.serverError
	memories: Memory[] //maximum number of memories to retrieve. For example, if the client only needs the most recent memory, this value should be 1 (memories are ordered in most recent first)
	memoSubmissions : MemoSubmission[]
}

export declare interface CaptureDropRequestData {
	event: Events.captureDropRequest
	dropKey: string
	metadata?: string
}

export declare interface CaptureDropResponseData {
	event: Events.captureDropResponse
	response: Responses.success | Responses.notFound | Responses.serverError | Responses.invalidDropState
}

export declare interface SendChatMessageRequestData {
	event: Events.sendChatMessageRequest
	messageText: string
	roomId: string
}

export declare interface SendChatMessageResponseData {
	event: Events.sendChatMessageResponse
	roomId: string
	messageText: string
	response:
		| Responses.success
		| Responses.notFound
		| Responses.unauthorized
		| Responses.loginRequired
		| Responses.serverError
}
export declare interface ChatMessageReceivedData {
	event: Events.chatMessageReceived
	roomId: string
	message: Message
}
export declare interface ChangeMediaDataCategoryRequestData {
	event: Events.changeMediaDataCategoryRequest
	memorySessionId: string
	mediaDataId: string
	mediaCategory: MediaCategory
}
export declare interface ChangeMediaDataCategoryResponseData {
	event: Events.changeMediaDataCategoryResponse
	memorySessionId: string
	mediaDataId: string
	mediaCategory: MediaCategory
	response:
		| Responses.success
		| Responses.overMaximum
		| Responses.notFound
		| Responses.loginRequired
		| Responses.unauthorized
		| Responses.invalidRequest
}

export enum TableFilter {
	adminLogIn = 'adminLogIn',
	adminRegistration = 'adminRegistration',
	connection = 'connection',
	keyStatus = 'keyStatus',
	userLogIn = 'userLogIn',
	userRegistration = 'userRegistration',
	//userDropConnection = 'userDropConnection',
	dropDeploy = 'dropDeploy',
	serverLog = 'serverLog',
	incomingCommunication = 'incomingCommunication',
	outgoingCommunication = 'outgoingCommunication',
	memosessionDeploy = 'memosessionDeploy',
	registerBetaAccRequests = 'registerBetaAccRequests',
	approveBetaTesterRequests = 'approveBetaTesterRequests',
	signupForBetaTestingRequests = 'signupForBetaTestingRequests',
	adminPanelLoaded = 'adminPanelLoaded',
	passwordReset = 'passwordReset',
	deviceInfo = 'deviceInfo'
}

export declare interface PingRequestData {
	event: Events.ping
}

export declare interface adminChangesPasswordForUserRequestData {
	event: Events.adminChangesPasswordForUserRequest,
	email: string,
	password: string
}

export declare interface adminChangesPasswordForUserResponseData {
	event: Events.adminChangesPasswordForUserResponse,
	response: Responses
}