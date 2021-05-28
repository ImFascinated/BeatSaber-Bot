import BatClient from "../Client/BatClient";

export default class Manager {

	private _instance: BatClient;
	
	constructor(instance: BatClient) {
		this._instance = instance;
	}
	
	public log(message: string) {
		this._instance.logger.log(message);
	}


	get instance(): BatClient {
		return this._instance;
	}

	get logger() {
		return this._instance.logger;
	}
}