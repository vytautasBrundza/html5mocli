import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';
import { Injectable } from '@angular/core';
import { UserDataService } from '../services/userData.service';
import { EngineService } from '../services/engine.service';
import { SettingsService } from '../services/settings.service';
import { HelperService } from '../services/helper.service';

@Injectable()
export class DataTransferService {
	private url = 'http://localhost:5000';
	private socket;
	public sesManager;

	constructor(private userDataService: UserDataService,
				private engineService: EngineService,
				private settingsService: SettingsService,
				private h: HelperService) {}
		
	sendMessage(message) {
		if(message.length>0) {
			this.socket.emit('cli-message', message);
		}
	}

	sendData(call, data) {
		this.socket.emit(call, data);
	}

	sendLogin(u, p) {
		if(u.length>1 && p.length>3 ) {
			this.socket.emit('cli-login', {u:u,p:p});
		}
	}

	sendRegister(u, p) {
		if(u.length>1 && p.length>3 ) {
			this.socket.emit('cli-register', {u:u,p:p});
		}
	}

	sendCreate(c) {
		if(c) {
			this.socket.emit('cli-create', c);
		}
	}
	
	getMessages() {
		let observable = new Observable(observer => {
			this.socket = io(this.url);
			this.socket.on('message', (data) => {
				observer.next(data);
			});

			this.socket.on('login-confirm', (JSONdata) => {
				if(JSONdata.id>=0) {
					console.log('login success!');
					this.userDataService.authenticated = true;
					this.userDataService.userID = JSONdata.id;
					this.userDataService.sid = JSONdata.sid;
					this.userDataService.created = JSONdata.created;
					this.engineService.running = true;
					this.ConData(JSONdata);
				} else {
					console.log(JSONdata.data.error);
				}
				this.userDataService.lastError = JSONdata.data.error;
				
			});

			this.socket.on('register-confirm', (JSONdata) => {
				if(JSONdata.sid>=0) {
					console.log('register success!');
					this.userDataService.authenticated = true;
					this.userDataService.sid = JSONdata.sid;
				} else {
					console.log(JSONdata.error);
				}
				this.userDataService.lastError = JSONdata.error;
			});

			this.socket.on('create-confirm', (JSONdata) => {
				console.log('user created!');
				this.userDataService.created = true;
				this.engineService.running = true;
				this.userDataService.userID = JSONdata.id;

				this.ConData(JSONdata);
			});

			this.socket.on('update-data',(data) => {
				this.UpdateData(data);
			});
			
			this.socket.on('update_inv', (data) => {
				this.UpdateInv(data);
			});

			return () => {
				this.socket.disconnect();
			};
		})
		return observable;
	}

	private ConData(JSONdata: any) {
		//console.log(JSONdata);
		var data = JSONdata.data;
		this.engineService.data = {};
		this.engineService.data.obj = {};
		this.ObjData(JSON.parse(data.objdata));
		this.MapData(JSON.parse(data.mapdata));
		this.ItemData(JSON.parse(data.itemdata));
		this.MobData(JSON.parse(data.mobdata));
	}

	// read obj data
	private ObjData(data) {
		this.engineService.data.obj = data;
	}

	// read map data
	private MapData(data) {
		this.engineService.map = data;
		this.engineService.map.bounds = this.h.V2(this.engineService.map[0].length*this.settingsService.cTileWidth,this.engineService.map.length*this.settingsService.cTileWidth);
		this.engineService.miniMapEnabled = false;
	}

	// read item data
	private ItemData(data) {
		this.engineService.data.item = data;
		this.engineService.data.item = data;
	}

	// read item data
	private MobData(data) {
		this.engineService.data.mob = data;
	}

	// read update data
	private UpdateData(JSONdata) {
		//console.log(this.engineService.data);
		var newdata = JSON.parse(JSONdata.data);
		var objn = [];
		
		if(!this.engineService.data) this.engineService.data = {};
		if(!this.engineService.data.obj) this.engineService.data.obj = {};

		for(var i = 0; i < newdata.length; i++) {
			var oldObj = this.h.objectFindByKey(this.engineService.data.obj, 'id', newdata[i].id);
			if(newdata[i].status == 1) {
				if(oldObj != null) objn.push(oldObj);
			} else if(newdata[i].status == 2) {
				var newObj = newdata[i].data;
				if(oldObj && oldObj.drawData) newObj.drawData = oldObj.drawData;
				if(newdata[i].data != null) objn.push(newObj);
			}
		}
		this.engineService.data.obj = objn;

		this.userDataService.obj = this.h.objectFindByKey(this.engineService.data.obj, 'id', this.userDataService.userID);
		if(this.userDataService.targetID>0)
			this.userDataService.tobj = this.h.objectFindByKey(this.engineService.data.obj, 'id', this.userDataService.targetID);
	}

	UpdateInv(JSONdata) {	
		var newdata = JSON.parse(JSONdata);
		this.userDataService.obj.loadout = newdata.l;
		this.userDataService.obj.inv = newdata.i;
	}
	
	UpdateInventory(user) {}
	
} 