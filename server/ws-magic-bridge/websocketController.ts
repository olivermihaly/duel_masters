import { Events } from './events'
import { SharedClassName } from './sharedClass'
import { SharedClassConstructors } from './sharedClassConstructors'
import { EventDispatcher } from './shared_classes/eventDispatcher'
import { PingRequestData, SocketMessage } from './socketMessages'

export enum SocketStatus {
	connected = 'connected',
	disconnected = 'disconnected',
	errored = 'errored',
}

export class WebsocketController {
	static socket: WebSocket
	static isConnectedToServer: boolean = false
	static serverUrl: string
	static eventDispatcher = new EventDispatcher()
	static socketMessageIdCount = 0
	static sharedClassConstructors = SharedClassConstructors
	static pingTimeout: any = null
	
	static registerEvents() {
		for (const event in Events) {
			WebsocketController.eventDispatcher.registerEvent(event)
		}
	}
	send(message: SocketMessage){
		WebsocketController.send(message)
	}
	static send(message: SocketMessage) {
		if(WebsocketController.socket.readyState === WebSocket.OPEN){
			if (message.responseCallback != null) {
				message.socketMessageId = WebsocketController.getUniqueSocketMessageId()
				WebsocketController.eventDispatcher.registerEvent(message.socketMessageId.toString())
				WebsocketController.eventDispatcher.addEventListener(message.socketMessageId.toString(), message.responseCallback)
			}
			WebsocketController.socket.send(JSON.stringify(message))
		}
	}
	static connect(serverUrl: string) {
		WebsocketController.serverUrl = serverUrl
		WebsocketController.socket = new WebSocket(WebsocketController.serverUrl)
		WebsocketController.socket.onopen = WebsocketController.socketOnOpen.bind(WebsocketController)
		WebsocketController.socket.onerror = WebsocketController.socketOnError.bind(WebsocketController)
		WebsocketController.socket.onclose = WebsocketController.socketOnClose.bind(WebsocketController)
		WebsocketController.socket.onmessage = WebsocketController.socketOnMessage.bind(WebsocketController)
	}
	static parseObject(object:Object,parent:Object|null,objectKeyOnParent:string|null){

		let sharedClassCreatorFunction : Function|null = null
		let keys = Object.keys(object)
		for (let i = 0; i < keys.length;i++){
			let key = keys[i]
			type ObjectKey = keyof typeof object;
			let childObject = object[key as ObjectKey]

			if (childObject instanceof Object){
				WebsocketController.parseObject(childObject,object,key)
			}
			if (key === "_sharedClassName"){
				let o = object as any
				sharedClassCreatorFunction  = WebsocketController.sharedClassConstructors[o['_sharedClassName'] as SharedClassName]
			}
		}
		if (sharedClassCreatorFunction != null && objectKeyOnParent !=null && parent !=null){
			type ObjectKey = keyof typeof parent;
			let classInstance = sharedClassCreatorFunction(object)
			parent[objectKeyOnParent as ObjectKey] = classInstance
			if (classInstance.fetchRequest != undefined){
				classInstance.constructRequest(WebsocketController)
			}
		}
	}

	static socketOnMessage(e: any) {
		let data = JSON.parse(e.data) as SocketMessage
		WebsocketController.parseObject(data,null,null)
		for (const event in Events) {
			if (data.event === event) {
				WebsocketController.eventDispatcher.triggerEvent(event, data)
			}
		}
		if (data.socketMessageId != null) {
			WebsocketController.eventDispatcher.triggerEvent(data.socketMessageId.toString(), data)
			WebsocketController.eventDispatcher.unregisterEvent(data.socketMessageId.toString())
		}
	}
	static ping() {
        let requestData: PingRequestData = {
            event: Events.ping,
        }
        WebsocketController.send(requestData)
    }

	static socketOnOpen() {
		console.log('Connected to server!')
		WebsocketController.isConnectedToServer = true
		WebsocketController.eventDispatcher.triggerEvent(Events.connectionStatusChange, SocketStatus.connected)
		//set pinging
		if (!WebsocketController.pingTimeout) {
			WebsocketController.pingTimeout = setInterval(WebsocketController.ping, 25000)
		}
	}

	static socketOnClose(event: any) {
		WebsocketController.isConnectedToServer = false
		WebsocketController.eventDispatcher.triggerEvent(Events.connectionStatusChange, SocketStatus.disconnected)
		setTimeout(() => {
			WebsocketController.reconnect()
		}, 1000)
		//disable pinging
		clearInterval(WebsocketController.pingTimeout)
		WebsocketController.pingTimeout = null
		console.log('Connection closed')
	}

	static reconnect() {
		if (WebsocketController.isConnectedToServer === false) {
			console.log('Attempting to reconnect...')
			WebsocketController.connect(WebsocketController.serverUrl)
		}
	}

	static socketOnError(error: any) {
		WebsocketController.socket.close()
		WebsocketController.isConnectedToServer = false
		WebsocketController.eventDispatcher.triggerEvent(Events.connectionStatusChange, SocketStatus.errored)
		console.log('WebSocket error')
	}
	static getUniqueSocketMessageId() {
		return WebsocketController.socketMessageIdCount++
	}
}
WebsocketController.registerEvents()
