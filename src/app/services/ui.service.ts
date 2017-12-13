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
        t : false
	}

	// Object to store mouse data
	mouse = {
		left: false,
		right: false,
		pos: { x: 0, y: 0 },
		coord: { x: 0, y: 0 },
		over: [],
		cursor: 0,
		setCursor: function (newCur) {
			if(newCur != this.cursor) {
				this.cursor = newCur;
				//$('#mainCanvas').css({'cursor': 'url('+cursorsDir+newCur+'.ico), default'});
			}
		}
    };
    
    constructor(private userDataService: UserDataService,
                private engineService: EngineService,
                private settingsService: SettingsService,
                private dataTransferService: DataTransferService,
                private h: HelperService) {
                    engineService.ui = this;
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
            case 84:
                this.kbKey.t = true;
                this.TKey();
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
            case 84:
                this.kbKey.t = false;
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
                        this.dataTransferService.sendData('ui', {type:'mcl', data:coord});
                    }
            }
        }
    
        // Placeholder for actions to be done on mouse right click
        MouseRightClick() {
        }
    
        // Placeholder for actions to happen on Escape key press
        EscapeKey() {
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

        // Placeholder for actions to happen on C key press
        TKey() {
            this.tOpen = !this.tOpen;
        }
    
}