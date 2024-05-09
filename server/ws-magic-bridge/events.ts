export enum Events {
	deleteMemorySessionRequest = 'deleteMemorySessionRequest',
	deleteMemorySessionResponse = 'deleteMemorySessionResponse',

	deleteLogsRequest = 'deleteLogsRequest',
	deleteLogsResponse = 'deleteLogsResponse',

	signUpForBetaTestingRequest = 'signUpForBetaTestingRequest',
	signUpForBetaTestingResponse = 'signUpForBetaTestingResponse',

	getBetaTesterApplicationsRequest = 'getBetaTesterApplicationsRequest',
	getBetaTesterApplicationsResponse = 'getBetaTesterApplicationsResponse',

	approveBetaTesterRequest = 'approveBetaTesterRequest',
	approveBetaTesterResponse = 'approveBetaTesterResponse',

	registerBetaAccountRequest = 'registerBetaAccountRequest',
	registerBetaAccountResponse = 'registerBetaAccountResponse',

	getLogsWithFiltersRequest = 'getLogsWithFiltersRequest',
	getLogsResponse = 'getLogsResponse',

	authenticateAccountRequest = 'authenticateAccountRequest',
	authenticateAccountResponse = 'authenticateAccountResponse',
	authenticateAdminAccountRequest = 'authenticateAdminAccountRequest',
	authenticateAdminAccountResponse = 'authenticateAdminAccountResponse',

	logoutRequest = 'logoutRequest',
	logoutResponse = 'logoutResponse',

	deleteAccountRequest = 'deleteAccountRequest',
	deleteAccountResponse = 'deleteAccountResponse',
	deleteAdminAccountRequest = 'deleteAdminAccountRequest',
	deleteAdminAccountResponse = 'deleteAdminAccountResponse',

	changePasswordRequest = 'changePasswordRequest',
	changePasswordResponse = 'changePasswordResponse',
	changeAdminPasswordRequest = 'changeAdminPasswordRequest',
	changeAdminPasswordResponse = 'changeAdminPasswordResponse',

	changePasswordByUserRequest = 'changePasswordByUserRequest',
	changePasswordByUserResponse = 'changePasswordByUserResponse',
	sendPasswordRecoveryLinkByUserRequest = 'sendPasswordRecoveryLinkByUserRequest',
	sendPasswordRecoveryLinkByUserResponse = 'sendPasswordRecoveryLinkByUserResponse',

	registerAccountRequest = 'registerAccountRequest',
	registerAccountResponse = 'registerAccountResponse',
	registerAdminAccountRequest = 'registerAdminAccountRequest',
	registerAdminAccountResponse = 'registerAdminAccountResponse',

	keyStatusRequest = 'keyStatusRequest',
	keyStatusResponse = 'keyStatusResponse',

	//Memo Session
	startMemoSessionRequest = 'startMemoSessionRequest',
	startMemoSessionResponse = 'startMemoSessionResponse',

	//starting a memory session for deploy/capture
	startMemoSessionWithDropDeployRequest = 'startMemoSessionWithDropDeployRequest',
	startMemoSessionWithDropDeployResponse = 'startMemoSessionWithDropDeployResponse',

	startMemoSessionWithDropCaptureRequest = 'startMemoSessionWithDropCaptureRequest',
	startMemoSessionWithDropCaptureResponse = 'startMemoSessionWithDropCaptureResponse',
	//joining friends on a memory session for deploy/capture
	joinMemoSessionRequest = 'joinMemoSessionRequest',
	joinMemoSessionResponse = 'joinMemoSessionResponse',

	memoSessionUpdateRequest = 'memoSessionUpdateRequest',
	memoSessionUpdateResponse = 'memoSessionUpdateResponse',
	memoSessionUpdate = 'memoSessionUpdate',
	memoSessionClosed = 'memoSessionClosed',
	memoSessionSubmitted = 'memoSessionSubmitted',
	changeLocationNameRequest = 'changeLocationNameRequest',
	changeLocationNameResponse = 'changeLocationNameResponse',
	changeSecretKeywordRequest = 'changeSecretKeywordRequest',
	changeSecretKeywordResponse = 'changeSecretKeywordResponse',
	changeLocationDifficultyRatingRequest = 'changeLocationDifficultyRatingRequest',
	changeLocationDifficultyRatingResponse = 'changeLocationDifficultyRatingResponse',
	changeLocationOverallRatingRequest = 'changeLocationOverallRatingRequest',
	changeLocationOverallRatingResponse = 'changeLocationOverallRatingResponse',
	changeLocationCategoryRequest = 'changeLocationCategoryRequest', 
	changeLocationCategoryResponse = 'changeLocationCategoryResponse', 
	changeSubmitPercentageRequest = 'changeSubmitPercentageRequest',
	addRatingItemRequest = 'addRatingItemRequest',
	addRatingItemResponse = 'addRatingItemResponse',
	removeRatingItemRequest = 'removeRatingItemRequest',
	removeRatingItemResponse = 'removeRatingItemResponse',
	changeRatingItemRequest = 'changeRatingItemRequest',
	changeRatingItemResponse = 'changeRatingItemResponse',
	changeCommentRequest = 'changeCommentRequest',
	changeCommentResponse = 'changeCommentResponse',
	changeCoordinatesRequest = 'changeCoordinatesRequest',
	changeCoordinatesResponse = 'changeCoordinatesResponse',
	leaveMemoSessionRequest = 'leaveMemoSessionRequest',
	leaveMemoSessionResponse = 'leaveMemoSessionResponse',
	removeMemoSessionMediaDataRequest = 'removeMemoSessionMediaDataRequest',
	removeMemoSessionMediaDataResponse = 'removeMemoSessionMediaDataResponse',
	changeMediaDataCategoryRequest = 'changeMediaDataCategoryRequest',
	changeMediaDataCategoryResponse = 'changeMediaDataCategoryResponse',

	startEditMemoSessionRequest = 'startEditMemoSessionRequest',
	startEditMemoSessionResponse = 'startEditMemoSessionResponse',
	//Capture
	captureDropRequest = 'captureDropRequest',
	captureDropResponse = 'captureDropResponse',

	// Memories
	getMemoriesAwaitingReviewRequest = 'getMemoriesAwaitingReviewRequest',
	getMemoriesAwaitingReviewResponse = 'getMemoriesAwaitingReviewResponse',
	getDropMemoriesRequest = 'getDropMemoriesRequest',
	getDropMemoriesResponse = 'getDropMemoriesResponse',
	getUserMemoriesRequest = 'getUserMemoriesRequest',
	getUserMemoriesResponse = 'getUserMemoriesResponse',
	getMemoryByIdRequest = 'getMemoryByIdRequest',
	getMemoryByIdResponse = 'getMemoryByIdResponse',

	submitMemoryReviewRequest = 'submitMemoryReviewRequest',
	submitMemoryReviewResponse = 'submitMemoryReviewResponse',

	getMemoSessionsRequest = 'getMemoSessionsRequest',
	getMemoSessionsResponse = 'getMemoSessionsResponse',
	submitMemoSessionReviewRequest = 'submitMemoSessionReviewRequest',
	submitMemoSessionReviewResponse = 'submitMemoSessionReviewResponse',
	//Locations

	getMyLocationsRequest = 'getMyLocationsRequest',
	getMyLocationsResponse = 'getMyLocationsResponse',
	getLocationRequest = 'getLocationRequest',
	getLocationResponse = 'getLocationResponse',
	addLocationCommentRequest = 'addLocationCommentRequest',
	addLocationCommentResponse = 'addLocationCommentResponse',
	deleteLocationCommentRequest = 'deleteLocationCommentRequest',
	deleteLocationCommentResponse = 'deleteLocationCommentResponse',
	editLocationCommentRequest = 'editLocationCommentRequest',
	editLocationCommentResponse = 'editLocationCommentResponse',
	deleteLocationGalleryMediaRequest = 'deleteLocationGalleryMediaRequest',
	deleteLocationGalleryMediaResponse = 'deleteLocationGalleryMediaResponse',
	getAllLocationsRequest = 'getAllLocationsRequest',
	getAllLocationsResponse = 'getAllLocationsResponse',
	getLocationHighlightImagesRequest = 'getLocationHighlightImagesRequest',
	getLocationHighlightImagesResponse = 'getLocationHighlightImagesResponse',
	
	
	

	connected = 'connected',
	connectionStatusChange = 'connectionStatusChange',

	sendChatMessageRequest = 'sendChatMessageRequest',
	sendChatMessageResponse = 'sendChatMessageResponse',
	chatMessageReceived = 'chatMessageReceived',

	getUserProfileRequest = 'getUserProfileRequest',
	getUserProfileResponse = 'getUserProfileResponse',
	getLevelThresholdsRequest = 'getLevelThresholdsRequest',
	getLevelThresholdsResponse = 'getLevelThresholdsResponse',
	getUserNotificationsRequest = 'getUserNotificationsRequest',
	getUserNotificationsResponse = 'getUserNotificationsResponse',
	openNotificationRequest = 'openNotificationRequest',
	openNotificationResponse = 'openNotificationResponse',
	updateBioRequest = 'updateBioRequest',
	updateBioResponse = 'updateBioResponse',
	deleteProfileCoverPhotoRequest = 'deleteProfileCoverPhotoRequest',
	deleteProfileCoverPhotoResponse = 'deleteProfileCoverPhotoResponse',

	blockUserRequest = 'blockUserRequest',
	blockUserResponse = 'blockUserResponse',
	unblockUserRequest = 'unblockUserRequest',
	unblockUserResponse = 'unblockUserResponse',
	submitFeedbackMessageRequest = 'submitFeedbackMessageRequest',
	submitFeedbackMessageResponse = 'submitFeedbackMessageResponse',

	getAllBlockedUsersRequest = 'getAllBlockedUsersRequest',
	getAllBlockedUsersResponse = 'getAllBlockedUsersResponse',

	likeMediaRequest = 'likeMediaRequest',
	likeMediaResponse = 'likeMediaResponse',
	ping = 'ping',

	getLogsWithFiltersFromMultipleTablesRequest = 'getLogsWithFiltersFromMultipleTablesRequest',
	getLogsWithFiltersFromMultipleTablesResponse = 'getLogsWithFiltersFromMultipleTablesResponse',
	
	submitUnconfirmedLocationRequest = 'submitUnconfirmedLocationRequest',
	submitUnconfirmedLocationResponse = 'submitUnconfirmedLocationResponse',
	deleteUnconfirmedLocationSubmissionRequest = 'deleteUnconfirmedLocationSubmissionRequest',
	deleteUnconfirmedLocationSubmissionResponse = 'deleteUnconfirmedLocationSubmissionResponse',
	startUnconfirmedLocationSubmissionRequest = 'startUnconfirmedLocationSubmissionRequest',
	startUnconfirmedLocationSubmissionResponse = 'startUnconfirmedLocationSubmissionResponse',
	
	getUnconfirmedLocationsRequest = 'getUnconfirmedLocationsRequest',
  	getUnconfirmedLocationsResponse = 'getUnconfirmedLocationsResponse',

	submitUnconfirmedLocationReviewRequest = 'submitUnconfirmedLocationReviewRequest',
	submitUnconfirmedLocationReviewResponse = 'submitUnconfirmedLocationReviewResponse',

	adminPanelLoaded = 'adminPanelLoaded',
	adminChangesPasswordForUserRequest = 'adminChangesPasswordForUserRequest',
	adminChangesPasswordForUserResponse = 'adminChangesPasswordForUserResponse',

	getActiveUsersChartDataRequest = 'getActiveUsersChartDataRequest',
	getActiveUsersChartDataResponse = 'getActiveUsersChartDataResponse',

	uploadLocalLogDumpRequest = 'uploadLocalLogDumpRequest',
	uploadLocalLogDumpResponse = 'uploadLocalLogDumpResponse',

	getAllLocalDumpsRequest = 'getAllLocalDumpsRequest',
	getAllLocalDumpsResponse = 'getAllLocalDumpsResponse',

	reportDeviceInfoRequest = 'reportDeviceInfoRequest',
	reportDeviceInfoResponse = 'reportDeviceInfoResponse',

	//Testing
	startTransactionRequest = 'startTransactionRequest',
	startTransactionResponse = 'startTransactionResponse',
	rollbackTransactionRequest = 'rollbackTransactionRequest',
	rollbackTransactionResponse = 'rollbackTransactionResponse'
}

export const Routes = {
	DropEvents:{
		captureDropRequest : Events.captureDropRequest,
		getDropMemoriesRequest : Events.getDropMemoriesRequest,
		startMemoSessionWithDropDeployRequest: Events.startMemoSessionWithDropDeployRequest,
		startMemoSessionWithDropCaptureRequest : Events.startMemoSessionWithDropCaptureRequest,
		keyStatusRequest: Events.keyStatusRequest
	},
	UserEvents:{
		authenticateAccountRequest:Events.authenticateAccountRequest,
		getUserProfileRequest: Events.getUserProfileRequest,
		getUserNotificationsRequest: Events.getUserNotificationsRequest,
		logoutRequest : Events.logoutRequest,

		blockUserRequest:Events.blockUserRequest,
		unblockUserRequest:Events.unblockUserRequest,
		getAllBlockedUsersRequest: Events.getAllBlockedUsersRequest,
		submitFeedbackMessageRequest : Events.submitFeedbackMessageRequest,
		likeMediaRequest:Events.likeMediaRequest,
	},
	MemoEvents: {
		startMemoSessionRequest: Events.startMemoSessionRequest,
		startMemoSessionWithDropDeployRequest: Events.startMemoSessionWithDropDeployRequest,
		startMemoSessionWithDropCaptureRequest : Events.startMemoSessionWithDropCaptureRequest,
		joinMemoSessionRequest : Events.joinMemoSessionRequest,
		startEditMemoSessionRequest: Events.startEditMemoSessionRequest,

		//getting memories
		getMemoryByIdRequest: Events.getMemoryByIdRequest, //returns both memos or memo sessions
		getUserMemoriesRequest:Events.getUserMemoriesRequest,
		getDropMemoriesRequest:Events.getUserMemoriesRequest,

		getMemoSessionsRequest:Events.getMemoSessionsRequest //returns only memo sessions
	},
	LocationEvents:{
		getLocationRequest:Events.getLocationRequest,
		getMyLocationsRequest:Events.getMyLocationsRequest,
		addLocationCommentRequest:Events.addLocationCommentRequest,
		deleteLocationCommentRequest:Events.deleteLocationCommentRequest,
		editLocationCommentRequest:Events.editLocationCommentRequest,
		startUnconfirmedLocationSubmissionRequest: Events.startUnconfirmedLocationSubmissionRequest,
		submitUnconfirmedLocationRequest:Events.submitUnconfirmedLocationRequest,
		deleteUnconfirmedLocationSubmissionRequest:Events.deleteUnconfirmedLocationSubmissionRequest,
		deleteLocationGalleryMediaRequest:Events.deleteLocationGalleryMediaRequest,
		getAllLocationsRequest:Events.getAllLocationsRequest,
		getLocationHighlightImagesRequest: Events.getLocationHighlightImagesRequest
	},
	LoginEvents: {},
	AdminEvents: {
		getMemoriesAwaitingReviewRequest:Events.getMemoriesAwaitingReviewRequest,
		getMemoSessionsRequest:Events.getMemoSessionsRequest, //returns only memo sessions
		getUnconfirmedLocationsRequest:Events.getUnconfirmedLocationsRequest,
		submitMemoryReviewRequest: Events.submitMemoryReviewRequest,
		submitUnconfirmedLocationReviewRequest: Events.submitUnconfirmedLocationReviewRequest,

		getBetaTesterApplicationsRequest:Events.getBetaTesterApplicationsRequest,
		approveBetaTesterRequest:Events.approveBetaTesterRequest,
	},
	BetaTesting:{
		getBetaTesterApplicationsRequest:Events.getBetaTesterApplicationsRequest,

		signUpForBetaTestingRequest:Events.signUpForBetaTestingRequest,
		approveBetaTesterRequest:Events.approveBetaTesterRequest,
		registerBetaAccountRequest:Events.registerBetaAccountRequest,
	}
}
