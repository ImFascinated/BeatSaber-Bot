import BSBotClient from "../Client/BSBotClient";

export default class Manager {

	private readonly _instance: BSBotClient;
	
	constructor(instance: BSBotClient) {
		this._instance = instance;
	}
	
	public log(message: string) {
		this._instance.logger.log(message);
	}

	get instance(): BSBotClient {
		return this._instance;
	}

	get logger() {
		return this._instance.logger;
	}
}