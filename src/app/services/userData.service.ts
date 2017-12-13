export class UserDataService {
	authenticated: boolean;
	created: boolean;
	sid : string;
	lastError: string;
	userID : number;
	obj: any; // = {inv:{}, loadout:[]};
	targetID : number;
	tobj = null;

	constructor() {
		this.authenticated = false;
		this.created = false;
    }
    SetData(obj) {
    	this.obj = obj;
	}
	Logout() {
		this.authenticated = false;
		this.created = false;
		this.sid = null;
		this.userID = null;
		this.obj = null;
	}
}
