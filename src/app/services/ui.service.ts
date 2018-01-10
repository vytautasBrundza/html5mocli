import { Injectable } from '@angular/core';
import { UserDataService } from '../services/userData.service';
import { EngineService } from '../services/engine.service';
import { DataTransferService } from '../services/dataTransfer.service';
import { SettingsService } from '../services/settings.service';
import { HelperService } from '../services/helper.service';

@Injectable()
export class UIService {
    cOpen = false;
    eOpen = false;
    iOpen = false;
    tOpen = false;
    qOpen = false;
    dialog = new DialogO();
    overlay = new Overlay();
    questPanel = {tab:"started"};
    confirmPanel = new ConfirmO();


    kbKey = {
		esc : false,
		left : false,
		right : false,
		up : false,
		down : false,
        c : false,
        e : false,
		i : false,
        m : false,
        q : false,
        t : false,
        u : false
	}

    mouse;
    
    constructor(private userDataService: UserDataService,
                private engineService: EngineService,
                private settingsService: SettingsService,
                private dataTransferService: DataTransferService,
                private h: HelperService) {
                    engineService.ui = this;
                    	// Object to store mouse data
                    this.mouse = {
                        left: false,
                        right: false,
                        pos: { x: 0, y: 0 },
                        coord: { x: 0, y: 0 },
                        over: [],
                        cursor: 0,
                        setCursor: function (newCur) {
                            if(newCur != this.cursor) {
                                this.cursor = newCur;
                                document.getElementById('mainCanvas').style.cursor = "url('"+settingsService.cursorsDir+newCur+".ico'), default";
                            }
                        }
                    };
                }

        KeyDown(code) {
            switch(code) {
                case 27:
                    // run function once per key press (if key was already pressed, do nothing)
                    if(this.kbKey.esc == false) {
                        this.EscapeKey();
                        this.kbKey.esc = true;
                    }
                    break;
                case 37:
                    this.kbKey.left = true;
                    break;
                case 38:
                    this.kbKey.up = true;
                    break;
                case 39:
                    this.kbKey.right = true;
                    break;
                case 40:
                    this.kbKey.down = true;
                    break;
                case 67:
                    this.kbKey.c = true;
                    this.CKey();
                    break;
                case 69:
                    if(this.kbKey.e == false) {
                        this.EKey();
                        this.kbKey.e = true;
                    }
                    break;
                case 73:
                    if(this.kbKey.i == false) {
                        this.IKey();
                        this.kbKey.i = true;
                    }
                    break;
                case 77:
                    if(this.kbKey.m == false) {
                        this.MKey();
                        this.kbKey.m = true;
                    }
                    break;
                case 81:
                    this.kbKey.q = true;
                    this.QKey();
                    break;
                case 84:
                    this.kbKey.t = true;
                    this.TKey();
                    break;
                case 85:
                    this.kbKey.u = true;
                    this.UKey();
                    break;
            }
        }
    
        KeyUp(code) {
            switch(code) {
            case 27:
                this.kbKey.esc = false;
                break;
            case 37:
                this.kbKey.left = false;
                break;
            case 38:
                this.kbKey.up = false;
                break;
            case 39:
                this.kbKey.right = false;
                break;
            case 40:
                this.kbKey.down = false;
                break;
            case 67:
                this.kbKey.c = false;
                break;
            case 69:
                this.kbKey.e = false;
                break;
            case 73:
                this.kbKey.i = false;
                break;
            case 77:
                this.kbKey.m = false;
                break;
            case 81:
                this.kbKey.q = false;
                break;
            case 84:
                this.kbKey.t = false;
                break;
            case 85:
                this.kbKey.u = false;
                break;
            }
        }

        ScrollMap(dtime) {
            var dOffset = Math.round(this.settingsService.cScrollSpeed * dtime);
    
            if(this.kbKey.left) this.settingsService.offsetX+= dOffset;
            if(this.kbKey.right) this.settingsService.offsetX-= dOffset;
            if(this.kbKey.up) this.settingsService.offsetY+= dOffset;
            if(this.kbKey.down) this.settingsService.offsetY-= dOffset;
        }

        MouseMove(canvasRef, event) {
            this.mouse.pos = this.GetMousePos(canvasRef, event);
        }
    
        // A function that gets the mouse coordinates in canvas (from http://www.html5canvastutorials.com/advanced/html5-canvas-mouse-coordinates/)
        GetMousePos(canvas, evt) {
            var rect = canvas.getBoundingClientRect();
            return {
                x: Math.round((evt.clientX-rect.left)/(rect.right-rect.left)*canvas.width),
                y: Math.round((evt.clientY-rect.top)/(rect.bottom-rect.top)*canvas.height)
            };
        }
    
        // On mouse left click we get the coordinates of click and send this data to server
        MouseLeftClick() {
            this.dialog.open = false;
            if(this.mouse.cursor!=0) {
                    var coord = {
                        x: this.mouse.pos.x - this.settingsService.offsetX,
                        y: this.mouse.pos.y - this.settingsService.offsetY
                    };
                    if(this.mouse.over.length > 0) {
                        // We send ui (user interface) data which contains the more precise type mcl (mouse click left) and the object clicked
                        if(this.mouse.over[0].id == this.userDataService.userID) {
                            this.userDataService.tobj = this.h.objectFindByKey(this.engineService.data.obj, 'id', this.userDataService.userID);
                            this.userDataService.targetID = this.userDataService.userID;
                        } else {
                            if(this.userDataService.targetID == this.mouse.over[0].id)
                            {
                                if(this.userDataService.obj.action != "dead")
                                    this.dataTransferService.sendData('ui', {type:'mclo', data:this.mouse.over[0].id});
                            } else {
                                this.userDataService.tobj = this.h.objectFindByKey(this.engineService.data.obj, 'id', this.mouse.over[0].id);
                                this.userDataService.targetID = this.mouse.over[0].id;
                            }
                        }
                    } else {
                        this.userDataService.targetID = null;
                        this.userDataService.tobj = null;
                        // We send ui (user interface) data which contains the more precise type mcl (mouse click left) and the coordinates
                        if(this.userDataService.obj.action != "dead")
                            this.dataTransferService.sendData('ui', {type:'mcl', data:coord});
                    }
            }
        }
    
        // Placeholder for actions to be done on mouse right click
        MouseRightClick() {
        }
    
        // Placeholder for actions to happen on Escape key press
        EscapeKey() {
            if(this.dialog.open) {
                this.dialog.Close();
            }
        }

        // Placeholder for actions to happen on C key press
        CKey() {
            this.cOpen = !this.cOpen;
        }
        // Placeholder for actions to happen on C key press
        EKey() {
            this.eOpen = !this.eOpen;
        }
        // Placeholder for actions to happen on I key press
        IKey() {
            this.iOpen = !this.iOpen;
        }
    
        // Placeholder for actions to happen on M key press
        MKey() {
            if (this.engineService.miniMapEnabled)
                this.engineService.miniMapEnabled = false;
            else if(this.engineService.miniMap)
                if(this.engineService.miniMap.base) {
                    this.engineService.miniMapEnabled = true;
                }
        }

        // Placeholder for actions to happen on Q key press
        QKey() {
            this.qOpen = !this.qOpen;
        }

        // Placeholder for actions to happen on T key press
        TKey() {
            this.tOpen = !this.tOpen;
        }

        // Placeholder for actions to happen on U key press
        UKey() {
        }

        OpenDialog(data) {
            //console.log(data);
            //console.log(this.engineService.data);
            var o = this.h.objectFindByKey(this.engineService.data.npc, 'id', data.typeID);
            this.dialog.Start(o, data.action);
        }
}

class DialogO {
    open = false;
    text = '';
    tab = 'default';
    quest = 0;
    step = 0;
    Start = function(o, action) {
        this.open = true;
        switch(action) {
            case 'trader':
                this.dOpen = true;
                this.text = o.textGreet[0];
                this.tab = 'trade';
                this.trade = o.sell;
                break;
            case 'portal':
                this.dOpen = true;
                this.text = o.textGreet[0];
                this.tab = 'portal';
                break;
            case 'greet':
                this.dOpen = true;
                this.text = o.textGreet[0];
                this.tab = 'default';
                break;
        }
    }
    Close = function() {
        this.open = false;
    }
}

class ConfirmO {
    open = false;
    text = '';
    answer = 0;
    decline = false;
    cancel = false;
    Request = function(text, decline, cancel) {
        this.open = true;
        this.text = text;
        this.decline = decline;
        this.cancel = cancel;
    }
    Accept = function() {
        this.open = false;
        this.answer = 3;
    }
    Decline = function() {
        this.open = false;
        this.answer = 2;
    }
    Cancel = function() {
        this.open = false;
        this.answer = 1;
    }
    ReadAnswer = function() {
        var a = this.answer;
        if(this.answer != 0) {
            this.text = '';
            this.answer = 0;
        }
        return a;
    }
  
}

class Overlay {
    overlayText = '';
    On(text) {
        this.overlayText = text;
        document.getElementById('overlay').style.opacity = '1';
    }
    Off() {
        document.getElementById('overlay').style.opacity = '0';
    }
}