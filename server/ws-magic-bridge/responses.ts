export enum Responses {
	failure = 0,
	success = 1,
	notFound = 2,
	serverError = 3,
	unauthorized = 4,
	empty = 5,
	loginRequired = 6,
	invalidAccountType = 7,
	invalidPassword = 8,
	//registerAccount
	duplicate = 9,
	overMaximum = 10,
	underMinimum = 11,
	invalidRequest = 12,
	missingField = 13, 
	notImplementedFeature = 14,
	temporarilyUnavailable = 15,

	//memory review system
	alreadyReviewed = 20,

	//deployScreen
	invalidMemoSessionId = 96,
	memoSessionMediaListAlreadyFull = 97,
	notAllowedFileFormat = 98,
	noFileAttached = 99,
	dropNotUndeployed = 100,
	userOutOfRange = 101,
	locationNameInvalid = 102,
	secretKeywordInvalid = 103,
	difficultyRatingInvalid = 104,
	overallRatingInvalid = 105,
	locationCategoryInvalid = 106,

	//drop capture
	invalidDropState = 200,

	
}

export interface Response {
	response: Responses
	responseDetails?: string
}
export type BasicResponses = Responses.success|Responses.loginRequired|Responses.serverError
export type DefaultResponses = Responses.success|Responses.unauthorized|Responses.loginRequired|Responses.serverError|Responses.notFound|Responses.duplicate