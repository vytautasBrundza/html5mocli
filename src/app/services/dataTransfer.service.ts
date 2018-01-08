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
	private url = 'http://192.168.146.105:5000';
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
			
			this.socket.on('disconnect', () => {
				this.engineService.connected = false;
				this.engineService.connectionLost = true;
				this.userDataService.authenticated = false;
			});

			this.socket.on('server-handshake', (JSONdata) => {
				if(JSONdata.appVersion!='') {
					this.engineService.connected = true;
					this.engineService.app.appName = JSONdata.appName;
					this.engineService.app.appSubName = JSONdata.appSubName;
					this.engineService.app.appVersion = JSONdata.appVersion;
				} else {
					console.log(JSONdata.error);
				}
				this.userDataService.lastError = JSONdata.error;	
			});

			this.socket.on('login-confirm', (JSONdata) => {
				if(JSONdata.id>=0) {
					console.log('login success!');
					this.userDataService.authenticated = true;
					this.userDataService.userID = JSONdata.id;
					this.userDataService.sid = JSONdata.sid;
					this.userDataService.created = JSONdata.created;
					this.engineService.running = true;
					this.engineService.instance = JSONdata.instance;
					this.ConData(JSONdata);
				} else {
					console.log(JSONdata.data.error);
				}
				this.userDataService.lastError = JSONdata.data.error;
			});

			this.socket.on('instance-data', (JSONdata) => {
				if(JSONdata.id>=0) {
					console.log('instance-data received!');
					console.log(JSONdata);
					this.userDataService.userID = JSONdata.id;
					this.engineService.instance = JSONdata.instance;
					this.InstanceData(JSONdata);
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
				this.engineService.instance = JSONdata.instance;

				this.ConData(JSONdata);
			});

			this.socket.on('update-data',(data) => {
				this.UpdateData(data);
			});
			
			this.socket.on('update_inv', (data) => {
				this.UpdateInv(data);
			});

			this.socket.on('npc_dlg', (data) => {
				this.engineService.ui.OpenDialog(data);
			});
			
			return () => {
				this.socket.disconnect();
			};
		})
		return observable;
	}

	private ConData(JSONdata: any) {
		console.log(JSONdata);
		var data = JSONdata.data;
		this.engineService.data = {};
		this.engineService.data.obj = {};
		this.ObjData(JSON.parse(data.objdata));
		this.MapData(JSON.parse(data.mapdata));
		this.InstancesData(JSON.parse(data.instancedata));
		this.ItemData(JSON.parse(data.itemdata));
		this.MobData(JSON.parse(data.mobdata));
		this.npcData(JSON.parse(data.npcdata));
		this.questData(JSON.parse(data.questdata));
		this.engineService.dataReceived = true;
	}

	private InstanceData(JSONdata: any) {
		var data = JSONdata.data;
		this.ObjData(JSON.parse(data.objdata));
		this.MapData(JSON.parse(data.mapdata));
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

	// read instance list data
	private InstancesData(data) {
		this.engineService.data.instance = data;
	}

	// read item data
	private ItemData(data) {
		this.engineService.data.item = data;
	}

	// read mob data
	private MobData(data) {
		this.engineService.data.mob = data;
	}

	// read npc data
	private npcData(data) {
		this.engineService.data.npc = data;
	}

	// read quest data
	private questData(data) {
		this.engineService.data.quest = data;
	}

	// read update data
	private UpdateData(JSONdata) {
		if(this.engineService.dataReceived == false || JSONdata.instance != this.engineService.instance)
			return;

		//console.log(this.engineService.data);
		var newdata = JSON.parse(JSONdata.data);
		this.engineService.data.RTinstance = JSONdata.instData;
		var objn = [];
		
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

		if(this.userDataService.userID) {
			this.userDataService.obj = this.h.objectFindByKey(this.engineService.data.obj, 'id', this.userDataService.userID);
			if(this.userDataService.targetID>0)
				this.userDataService.tobj = this.h.objectFindByKey(this.engineService.data.obj, 'id', this.userDataService.targetID);
			if(this.userDataService.obj.action=='dead' && !this.engineService.ui.confirmPanel.open) {
				var a = this.engineService.ui.confirmPanel.ReadAnswer();
				if (a==0) {
					this.engineService.ui.confirmPanel.Request("Respawn?", false, false);
				} else if (a==3) {
					this.sendData('ui',{type:'respawn'});
				}
				
			}
		}
	}

	UpdateInv(JSONdata) {
		var newdata = JSON.parse(JSONdata);
		this.userDataService.obj.loadout = newdata.l;
		this.userDataService.obj.inv = newdata.i;
	}
	
	UpdateInventory(user) {}
	
} 
