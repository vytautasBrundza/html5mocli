import { Injectable, Injector } from '@angular/core';
import { UserDataService } from '../services/userData.service';
import { DataTransferService } from '../services/dataTransfer.service';
import { SettingsService } from '../services/settings.service';
import { HelperService } from '../services/helper.service';
import { UIService } from '../services/ui.service';

@Injectable()
export class EngineService {
    running = false;
    miniMapEnabled = false;
    connected = false;
    connectionLost = false;
    dataReceived = false;
    instance = 0;

    lastupdate = Date.now();
	dtime = 0;
    data: any;
    map: any;
    miniMap: any;
    app = {
        appName : '',
        appSubName: '',
        appVersion: ''
    };

    ui: UIService;

    constructor(private userDataService: UserDataService,
        private settingsService: SettingsService,
        private h: HelperService) {}
    
    Update() {
        if(this.running) {
            this.dtime = Date.now() - this.lastupdate;
            this.ui.ScrollMap(this.dtime);
            
            this.ui.mouse.over = [];

            if(this.data.obj) {
                for( var i = 0; i < this.data.obj.length; i++) {
                    if(this.data.obj[i]) {
                        if(	this.ui.mouse.pos.x<this.data.obj[i].pos.x+this.settingsService.offsetX+this.settingsService.cObjIconSize &&
                            this.ui.mouse.pos.x>this.data.obj[i].pos.x+this.settingsService.offsetX-this.settingsService.cObjIconSize &&
                            this.ui.mouse.pos.y<this.data.obj[i].pos.y+this.settingsService.offsetY+this.settingsService.cObjIconSize &&
                            this.ui.mouse.pos.y>this.data.obj[i].pos.y+this.settingsService.offsetY-this.settingsService.cObjIconSize){
                            this.ui.mouse.over.push(this.data.obj[i]);
                        }
                        switch(this.data.obj[i].type) {
                            case 'user':
                                var ch = this.data.obj[i];
                                var tmppos;
                                if(ch.path.length>1)
                                    tmppos = ch.ppos;
                                else
                                    tmppos = ch.tpos;
                                var ddlength, length;
                                if(tmppos.y != ch.pos.y || tmppos.x != ch.pos.x) {
                                    var vect = this.h.V2( tmppos.x - ch.pos.x, tmppos.y - ch.pos.y);
                                    length = Math.sqrt(vect.x * vect.x + vect.y * vect.y);
                                    if(length < 2) {
                                        ch.pos.x = tmppos.x;
                                        ch.pos.y = tmppos.y;
                                        ch.v.x = 0;
                                        ch.v.y = 0;
                                    } else {
                                        // normalize vector
                                        ch.v.x = vect.x/length*ch.stat.spd;
                                        ch.v.y = vect.y/length*ch.stat.spd;
                                        // update position
                                        ch.pos.x+=ch.v.x*this.dtime;
                                        ch.pos.y+=ch.v.y*this.dtime;
                                    }
                                }
                                // Here we create data specifically for drawing. It smooths out movement but is less accurate.
                                //We will mirror the same movement but from drawing position instead of real position
                                if(ch.drawData){
                                    if(tmppos.y != ch.drawData.pos.y || tmppos.x != ch.drawData.pos.x) {
                                        var vect = this.h.V2( tmppos.x - ch.drawData.pos.x, tmppos.y - ch.drawData.pos.y);
                                        ddlength = Math.sqrt(vect.x * vect.x + vect.y * vect.y);
                                        if(Math.abs(ddlength - length) > 30) {
                                            // if position difference is very big (may be cause by lag or smth) we reset draw position to real position
                                            ch.drawData.pos = ch.pos;
                                        } else {
                                            if(ddlength < 1) {
                                                ch.drawData.pos = tmppos;
                                                ch.drawData.v.x = 0;
                                                ch.drawData.v.y = 0;
                                                ch.status = 'idle';
                                            } else {
                                                var speed = (ddlength > 2)? ch.stat.spd : ch.stat.spd/4;
                                                // normalize vector
                                                ch.drawData.v.x = vect.x/ddlength*speed;
                                                ch.drawData.v.y = vect.y/ddlength*speed;
                                                // update position
                                                ch.drawData.pos.x+=ch.drawData.v.x*this.dtime;
                                                ch.drawData.pos.y+=ch.drawData.v.y*this.dtime;
                                            }
                                        }
                                    }
                                } else {
                                    ch.drawData = {pos: ch.pos, v: ch.v};
                                }
                            break;
                        }
                    }
                }
            }
            if(this.ui.mouse.over.length > 0) {
                var obj = this.h.objectFindByKey(this.data.obj, 'id', this.ui.mouse.over[this.ui.mouse.over.length-1].id);
                switch(obj.type) {
                    case 'user':
                        this.ui.mouse.setCursor(2);
                    break;
                    case 'mob':
                        this.ui.mouse.setCursor(3);
                    break;
                    case 'npc':
                    this.ui.mouse.setCursor(2);
                break;
                    default:
                        this.ui.mouse.setCursor(0);
                }
            } else {
                this.ui.mouse.coord = this.h.V2(this.ui.mouse.pos.x-this.settingsService.offsetX, this.ui.mouse.pos.y-this.settingsService.offsetY);
                if(this.ui.mouse.coord.x > 0 && this.ui.mouse.coord.x < this.map.bounds.x &&
                      this.ui.mouse.coord.y > 0 && this.ui.mouse.coord.y < this.map.bounds.y) {
                    if(this.TileByPos(this.ui.mouse.coord).walkable == 2) { // TODO add checking if tile is walkable
                        this.ui.mouse.setCursor(1);
                    } else {
                        this.ui.mouse.setCursor(0);
                    }
                } else {
                    this.ui.mouse.setCursor(0);
                }
            }

        }
        this.lastupdate = Date.now();
    }

    TileByPos(position: any) {
		return Object.assign(
			this.map[Math.floor(position.y/this.settingsService.cTileWidth)][Math.floor(position.x/this.settingsService.cTileWidth)],{}
		);
	}
}
