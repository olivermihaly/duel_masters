
import * as dotenv from "dotenv";
const path = require('path')
const fs_extra = require('fs-extra')    

dotenv.config({ path: path.resolve(__dirname, './process.env') })

const BASE_CONFIG = {
	DAILY_LOCATION_COUNT : 2
}
const LOCAL_CONFIG_LOCALHOST = {
	...BASE_CONFIG,
	NAME: "LOCAL_CONFIG_LOCALHOST",
	DEBUG:true,
	IMAGE_SERVER_URL : "http://localhost:9011/",
	WEBSOCKET_PORT: 8011,
	UPLOAD_SERVER_PORT: 3011,
	IMAGE_SERVER_PORT:9011,
	BETA_SIGNUP_URL: 'https://localhost:3000/',
	PASSWORD_RESET_URL:'https://localhost:3001/',
	DATABASE:process.env.STAGING_DB_SCHEMA,
	DB_USER:process.env.LOCAL_DB_USERNAME,
	DB_PASSWORD:process.env.LOCAL_DB_PASS,
	ENABLE_SERVER_SIDE_IMAGE_COMPRESSION:false,
	ANALYTICS_DB_SCHEMA:process.env.ANALYTICS_STAGING_SCHEMA,
	ANALYTICS_ENABLED:true,
	ANALYTICS_LOGGING:false,
	MEMO_SESSION_JOIN_DISTANCE_LIMIT_IN_KMS: 10000000, 
	LOCATION_GALLERY_IMAGE_UPLOAD_LIMIT: 9, 
	MAINTENANCE_MODE: process.env.MAINTENANCE_MODE, 
	MASTER_PASSWORD: process.env.MASTER_PASSWORD,
	SUPPORTED_VERSIONS: ['1.3.0']
}
const TESTING_CONFIG_LOCAL = { // (same endpoint as staging but pointing to different database)
	...BASE_CONFIG,
	NAME: "TESTING_CONFIG_LOCAL",
	DEBUG:true,
	IMAGE_SERVER_URL : "http://localhost:10012/",
	WEBSOCKET_PORT: 8012,
	UPLOAD_SERVER_PORT: 3012,
	IMAGE_SERVER_PORT:10012,
	BETA_SIGNUP_URL: 'https://localhost:3000/',
	PASSWORD_RESET_URL:'https://localhost:3001/',
	DATABASE:process.env.TESTING_DB_SCHEMA,
	DB_USER:process.env.LOCAL_DB_USERNAME,
	DB_PASSWORD:process.env.LOCAL_DB_PASS,
	ENABLE_SERVER_SIDE_IMAGE_COMPRESSION:false,
	ANALYTICS_DB_SCHEMA:process.env.ANALYTICS_TESTING_SCHEMA,
	ANALYTICS_ENABLED:true,
	ANALYTICS_LOGGING:false,
	TEST_DB_RESET_ENABLED:true, // WARNING: This setting, if set to true, exposes a reset function to clients. This is only for unit testing, and should never be enabled on the live server.
	MEMO_SESSION_JOIN_DISTANCE_LIMIT_IN_KMS: 10000000,
	LOCATION_GALLERY_IMAGE_UPLOAD_LIMIT: 9, 
	MAINTENANCE_MODE: process.env.MAINTENANCE_MODE,
	MASTER_PASSWORD: process.env.MASTER_PASSWORD,
	SUPPORTED_VERSIONS: ['1.3.0'],
	
}
const TESTING_CONFIG_HTTPS = { // (same endpoint as staging but pointing to different database)
	...BASE_CONFIG,
	NAME: "TESTING_CONFIG_HTTPS",
	DEBUG:true,
	IMAGE_SERVER_URL : "https://do.ecven.com:8123/",
	WEBSOCKET_PORT: 8012,
	UPLOAD_SERVER_PORT: 3012,
	IMAGE_SERVER_PORT:9012,
	BETA_SIGNUP_URL: 'https://ecven.com/staging_beta_signup/',
	PASSWORD_RESET_URL:'https://localhost:3001/',
	DATABASE:process.env.TESTING_DB_SCHEMA,
	DB_USER:process.env.LOCAL_DB_USERNAME,
	DB_PASSWORD:process.env.LOCAL_DB_PASS,
	ENABLE_SERVER_SIDE_IMAGE_COMPRESSION:false,
	ANALYTICS_DB_SCHEMA:process.env.ANALYTICS_TESTING_SCHEMA,
	ANALYTICS_ENABLED:true,
	ANALYTICS_LOGGING:true,
	TEST_DB_RESET_ENABLED:true,// WARNING: This setting, if set to true, exposes a reset function to clients. This is only for unit testing, and should never be enabled on the live server.
	MEMO_SESSION_JOIN_DISTANCE_LIMIT_IN_KMS: 1,
	LOCATION_GALLERY_IMAGE_UPLOAD_LIMIT: 9, 
	MAINTENANCE_MODE: process.env.MAINTENANCE_MODE,
	MASTER_PASSWORD: process.env.MASTER_PASSWORD,
	SUPPORTED_VERSIONS: ['1.3.0']
}

const LOCAL_CONFIG_WIFI= {
	...BASE_CONFIG,
	NAME: "LOCAL_CONFIG_WIFI",
	DEBUG:true,
	IMAGE_SERVER_URL : "http://174.74.148.98:9011/",
	WEBSOCKET_PORT: 8011,
	UPLOAD_SERVER_PORT: 3011,
	IMAGE_SERVER_PORT:9011,
	BETA_SIGNUP_URL: 'https://174.74.148.98:3000/',
	PASSWORD_RESET_URL:'https://localhost:3001/',
	DATABASE:process.env.STAGING_DB_SCHEMA,
	DB_USER:process.env.LOCAL_DB_USERNAME,
	DB_PASSWORD:process.env.LOCAL_DB_PASS,
	ENABLE_SERVER_SIDE_IMAGE_COMPRESSION:false,
	ANALYTICS_DB_SCHEMA:process.env.ANALYTICS_STAGING_SCHEMA,
	ANALYTICS_ENABLED:true,
	ANALYTICS_LOGGING:false,
	MEMO_SESSION_JOIN_DISTANCE_LIMIT_IN_KMS: 10000000,
	LOCATION_GALLERY_IMAGE_UPLOAD_LIMIT: 9, 
	MAINTENANCE_MODE: process.env.MAINTENANCE_MODE,
	MASTER_PASSWORD: process.env.MASTER_PASSWORD,
	SUPPORTED_VERSIONS: ['1.3.0']
}
const STAGING_CONFIG = {
	...BASE_CONFIG,
	NAME: "STAGING_CONFIG",
	DEBUG:true,
	IMAGE_SERVER_URL : "http://do.ecven.com:8023/",
	WEBSOCKET_PORT: 8012,
	UPLOAD_SERVER_PORT: 3012,
	IMAGE_SERVER_PORT:9012,
	BETA_SIGNUP_URL: 'http://ecven.com/staging_beta_signup/',
	PASSWORD_RESET_URL:'https://localhost:3001/',
	DATABASE:process.env.STAGING_DB_SCHEMA,
	DB_USER:process.env.DB_USER,
	DB_PASSWORD:process.env.DB_PASS,
	ENABLE_SERVER_SIDE_IMAGE_COMPRESSION:false,
	ANALYTICS_DB_SCHEMA:process.env.ANALYTICS_STAGING_SCHEMA,
	ANALYTICS_ENABLED:true,
	ANALYTICS_LOGGING:false,
	MEMO_SESSION_JOIN_DISTANCE_LIMIT_IN_KMS: 10000000,
	LOCATION_GALLERY_IMAGE_UPLOAD_LIMIT: 9, 
	MAINTENANCE_MODE: process.env.MAINTENANCE_MODE,
	MASTER_PASSWORD: process.env.MASTER_PASSWORD,
	SUPPORTED_VERSIONS: ['1.3.0']
}
const LIVE_CONFIG = {
	...BASE_CONFIG,
	NAME: "LIVE_CONFIG",
	DEBUG:false,
	IMAGE_SERVER_URL : "http://do.ecven.com:8021/",
	WEBSOCKET_PORT: 8011,
	UPLOAD_SERVER_PORT: 3011,
	IMAGE_SERVER_PORT:9011,
	BETA_SIGNUP_URL: 'http://ecven.com/beta_signup/',
	PASSWORD_RESET_URL:'https://localhost:3001/',
	DATABASE:process.env.LIVE_DB_SCHEMA,
	DB_USER:process.env.DB_USER,
	DB_PASSWORD:process.env.DB_PASS,
	ENABLE_SERVER_SIDE_IMAGE_COMPRESSION:false,
	ANALYTICS_DB_SCHEMA:process.env.ANALYTICS_LIVE_SCHEMA,
	ANALYTICS_ENABLED:true,
	ANALYTICS_LOGGING:false,
	MEMO_SESSION_JOIN_DISTANCE_LIMIT_IN_KMS: 1,
	LOCATION_GALLERY_IMAGE_UPLOAD_LIMIT: 50, 
	MAINTENANCE_MODE: process.env.MAINTENANCE_MODE,
	MASTER_PASSWORD: process.env.MASTER_PASSWORD,
	SUPPORTED_VERSIONS: ['1.3.0']
}
const STAGING_CONFIG_HTTPS = {
	...BASE_CONFIG,
	NAME: "STAGING_CONFIG_HTTPS",
	DEBUG:true,
	IMAGE_SERVER_URL : "https://do.ecven.com:8123/",
	WEBSOCKET_PORT: 8012,
	UPLOAD_SERVER_PORT: 3012,
	IMAGE_SERVER_PORT:9012,
	BETA_SIGNUP_URL: 'https://ecven.com/staging_beta_signup/',
	PASSWORD_RESET_URL:'https://ecven.com/staging_password_reset/',
	DATABASE:process.env.STAGING_DB_SCHEMA,
	DB_USER:process.env.DB_USER,
	DB_PASSWORD:process.env.DB_PASS,
	ENABLE_SERVER_SIDE_IMAGE_COMPRESSION:false,
	ANALYTICS_DB_SCHEMA:process.env.ANALYTICS_STAGING_SCHEMA,
	ANALYTICS_ENABLED:true,
	ANALYTICS_LOGGING:false,
	MEMO_SESSION_JOIN_DISTANCE_LIMIT_IN_KMS: 10000000,
	LOCATION_GALLERY_IMAGE_UPLOAD_LIMIT: 9, 
	MAINTENANCE_MODE: process.env.MAINTENANCE_MODE,
	MASTER_PASSWORD: process.env.MASTER_PASSWORD,
	SUPPORTED_VERSIONS: ['1.3.0']
}
const LIVE_CONFIG_HTTPS = {
	...BASE_CONFIG,
	NAME: "LIVE_CONFIG_HTTPS",
	DEBUG:true,
	IMAGE_SERVER_URL : "https://do.ecven.com:8121/",
	WEBSOCKET_PORT: 8011,
	UPLOAD_SERVER_PORT: 3011,
	IMAGE_SERVER_PORT:9011,
	BETA_SIGNUP_URL: 'https://ecven.com/beta_signup/',
	PASSWORD_RESET_URL:'https://ecven.com/password_reset/',
	DATABASE:process.env.LIVE_DB_SCHEMA,
	DB_USER:process.env.DB_USER,
	DB_PASSWORD:process.env.DB_PASS,
	ENABLE_SERVER_SIDE_IMAGE_COMPRESSION:false,
	ANALYTICS_DB_SCHEMA:process.env.ANALYTICS_LIVE_SCHEMA,
	ANALYTICS_ENABLED:true,
	ANALYTICS_LOGGING:false,
	MEMO_SESSION_JOIN_DISTANCE_LIMIT_IN_KMS: 1,
	LOCATION_GALLERY_IMAGE_UPLOAD_LIMIT: 50, 
	MAINTENANCE_MODE: process.env.MAINTENANCE_MODE,
	MASTER_PASSWORD: process.env.MASTER_PASSWORD,
	SUPPORTED_VERSIONS: ['1.3.0']
}

function chooseConfig(){
	const args = process.argv.slice(2)
	//console.log("Arguments: ", args)
	if(args.includes('live')){
		console.log('Configuration: \t \x1b[42m%s\x1b[0m', 'LIVE_CONFIG_HTTPS')
		return LIVE_CONFIG_HTTPS
	} else if(args.includes('staging')){
		console.log('Configuration: \t \x1b[42m%s\x1b[0m', 'STAGING_CONFIG_HTTPS')
		return STAGING_CONFIG_HTTPS
	} else if(args.includes('localhost')){
		console.log('Configuration: \t \x1b[42m%s\x1b[0m', 'LOCAL_CONFIG_LOCALHOST')
		return LOCAL_CONFIG_LOCALHOST
	} else if(args.includes('wifi')){
		console.log('Configuration: \t \x1b[42m%s\x1b[0m', 'LOCAL_CONFIG_WIFI')
		return LOCAL_CONFIG_WIFI
	}else if(args.includes('testing')){
		console.log('Configuration: \t \x1b[42m%s\x1b[0m', 'LOCAL_CONFIG_TESTING')
		return TESTING_CONFIG_LOCAL
	}else if(args.includes('testing-https')){
		console.log('Configuration: \t \x1b[42m%s\x1b[0m', 'TESTING_CONFIG_HTTPS')
		return TESTING_CONFIG_HTTPS
	} else {
		console.log('Using default configuration: \t \x1b[42m%s\x1b[0m', 'LOCAL_CONFIG_LOCALHOST')
		return LOCAL_CONFIG_LOCALHOST
	}
}

const CONFIG = chooseConfig()//LOCAL_CONFIG_WIFI
//const config :any= staging_config


const uploadPath = (CONFIG !== TESTING_CONFIG_HTTPS && CONFIG !== TESTING_CONFIG_LOCAL) ? path.join(__dirname, 'public') : path.join(__dirname, 'testing_public'); // Register the upload path
fs_extra.ensureDir(uploadPath); // Make sure that he upload path exits

function log(message?: any, ...optionalParams: any[]) {
	if (CONFIG.DEBUG) {
		if (optionalParams != null && optionalParams.length > 0) {
			console.log(message, (optionalParams = optionalParams))
		} else {
			console.log(message)
		}
	}
}



export {CONFIG, log, uploadPath}
