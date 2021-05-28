export default class Logger {
	
	private readonly _prefix: string = "";
	
	constructor(prefix: string) {
		this._prefix = prefix;
	}
	
	public log(message: any) {
		console.log(`${this._prefix} ${message}`);
	}

	public warn(message: string) {
		console.log(`[!!WARNING!!] ${this._prefix} ${message}`);
	}
}