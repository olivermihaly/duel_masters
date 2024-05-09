export function convertDateToDatabaseFormat(date:Date){
	//+'Z' means the timezone is UTC. However, MySql does not recognize this by default. 
	//Therefore, we convert to UTC, store it in mysql without +'Z', but when we receive it back we add it to the string to make sure timezone is loaded correctly
	return date.toISOString().slice(0, 19).replace('T', ' ')//+'Z';//date.toISOString().slice(0, 19).replace('T', ' ')
}
export function convertDateFromDatabaseFormat(dateString:string){
	return new Date(Date.parse(dateString+'Z'))
}
export function getRndInteger(min:number, max:number) {
	return Math.floor(Math.random() * (max - min)) + min
}