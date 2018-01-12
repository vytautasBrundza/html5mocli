import { Component, ViewChild, OnInit, ViewEncapsulation, ElementRef, HostListener } from '@angular/core';
import { DataTransferService } from '../services/dataTransfer.service';
import { UserDataService } from '../services/userData.service';
import { SettingsService } from '../services/settings.service';
import { EngineService } from '../services/engine.service';
import { UIService } from '../services/ui.service';

@Component({
  selector: 'app-drawing',
  templateUrl: './drawing.component.html',
  styleUrls: ['./drawing.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class DrawingComponent implements OnInit {
	@ViewChild('mainCanvas') canvasRef: ElementRef;
	canvas: HTMLCanvasElement;
	context: CanvasRenderingContext2D;
	resizeTimeout = 100;
	imgListObj: Array<HTMLImageElement> = new Array();
	imgListMap: Array<HTMLImageElement> = new Array();
	contentLoaded = false;
	
	constructor(private settings: SettingsService, 
				private dataTransferService: DataTransferService,
				private userDataService: UserDataService,
				private engineService: EngineService,
				private ui: UIService) {}

	ngOnInit() {
		// load all the content required
		var imgListM = [
			'flag.png',
			'tiles/grass-sparse.jpg', 'tiles/water-plain.jpg', 'tiles/cobblestone-regular.jpg', 'tiles/wall.jpg', 'tiles/grass-sparse-wall-top-bot.jpg',
		];
		for(var i = 0; i < imgListM.length; i++) {
			this.imgListMap[imgListM[i]] = new Image();
			this.imgListMap[imgListM[i]].src = 'assets/img/'+imgListM[i];
		}
		var imgListO = [
			'char.png',
			'm_1.png', 'm_2.png', 'm_3.png', 'm_4.png', 'm_5.png',
			'n_1.png', 'n_2.png'
		];
		for(var i = 0; i < imgListO.length; i++) {
			this.imgListObj[imgListO[i]] = new Image();
			this.imgListObj[imgListO[i]].src = 'assets/img/obj/'+imgListO[i];
		}
	}

	@HostListener('window:resize')
	onWindowResize() {
		//debounce resize, wait for resize to finish before doing stuff
		if (this.resizeTimeout) {
				clearTimeout(this.resizeTimeout);
		}
		this.resizeTimeout = setTimeout((() => {
			this.canvas.width  = window.innerWidth;
			this.canvas.height = window.innerHeight-3;
		}).bind(this), 500);
	}

	@HostListener('mouseup', ['$event'])
	onMouseup(event: MouseEvent) {}
  
	@HostListener('mousemove', ['$event'])
	onMousemove(event: MouseEvent) { this.ui.MouseMove(this.canvas,event)}
  
	@HostListener('mousedown', ['$event'])
	mouseHandling(event) {this.ui.MouseLeftClick() }
	
	ngAfterViewInit() {
		this.canvas = this.canvasRef.nativeElement;
		this.context = this.canvas.getContext('2d');
		this.canvas.width  = window.innerWidth;
		this.canvas.height = window.innerHeight-3;
		this.DrawLoop();
	}

	Draw() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.context.fillStyle = this.settings.color_canvas_bg;
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);


		this.engineService.Update();
		
		if(this.engineService.miniMapEnabled) {
			this.engineService.miniMap.current = copyImageData(this.engineService.miniMap.base, this.context);
		} else {
			if(this.engineService.map) {
				this.engineService.miniMap = miniMap(this.engineService.map, this.context);
			}
		}

		if(this.engineService.map) {
			// calculate minimum and maximum indexes of visible tiles
			var imin, imax, jmin, jmax, i:number, j:number;

			jmin = Math.round(-this.settings.offsetY/this.settings.cTileWidth); //index of tile = the offset / tile height
			jmin = jmin<1 ? 0 : jmin-1; // start at 0 or draw 1 tile more around the edge of screen

			jmax = Math.round((-this.settings.offsetY+this.canvas.height)/this.settings.cTileWidth);
			jmax = jmax<this.engineService.map.length-1 ? jmax+1 : this.engineService.map.length;

			imin = Math.round(-this.settings.offsetX/this.settings.cTileWidth);
			imin = imin<1 ? 0 : imin-1;

			imax = Math.round((-this.settings.offsetX+this.canvas.width)/this.settings.cTileWidth);
			imax = imax<this.engineService.map[0].length-1 ? imax+1 : this.engineService.map[0].length;

			// only draw tiles visible on screen
			for(j = jmin; j<jmax; j++) {
				for (i = imin; i<imax; i++) {
					var tile = this.engineService.map[j][i];
					this.context.drawImage(this.imgListMap[tile.img], tile.pos.x+this.settings.offsetX, tile.pos.y+this.settings.offsetY, this.settings.cTileWidth, this.settings.cTileWidth);
				}
			}
		}

		if(this.engineService.data.obj) {
			for(i = 0; i < this.engineService.data.obj.length; i++) {
				var o = this.engineService.data.obj[i];
				if(o) {
					switch(o.type) {
					case 'user':
					case 'mob':
					case 'npc':
						var x = this.settings.offsetX;
						var y = this.settings.offsetY;
						if (o.type == 'user') {
							if(o.action == 'move' || o.action == 'follow'){
								if(o.path.length>1) {
									for(var j = 0;j<o.path.length;j++) { this.context.drawImage(this.imgListMap['flag.png'], o.path[j][0]*64+32+this.settings.offsetX-10, o.path[j][1]*64+32+this.settings.offsetY-20, 20,20); }
								} else {
									this.context.drawImage(this.imgListMap['flag.png'], o.tx+this.settings.offsetX-10, o.ty+this.settings.offsetY-20, 20,20);
								}
							}
						}
						if(o.drawData) {
							x += o.drawData.pos.x;
							y += o.drawData.pos.y;
						} else {
							x += o.pos.x;
							y += o.pos.y;
						}
							this.context.drawImage(this.imgListObj[o.img], x-this.settings.cHObjIconSize, y-this.settings.cHObjIconSize, this.settings.cObjIconSize, this.settings.cObjIconSize);
						if(this.engineService.miniMapEnabled) {
							var ox = Math.round((o.pos.x)/this.settings.cTileWidth*this.engineService.miniMap.scale),
								oy = Math.round((o.pos.y)/this.settings.cTileWidth*this.engineService.miniMap.scale);
							drawPoint(this.engineService.miniMap.current, ox, oy, 255, 128, 36, 255, 4);
						}
						break;
					default:
						console.log('data object type error! '+o.type);
					}
				} else {
					console.log('data object error: object undefined!');
					console.log(this.engineService.data.obj);
					console.log(i);
				}
			}
		}
	}

	/*if(this.engineService.miniMapEnabled) {
		this.context.outImageData(engineService.miniMap.current,10,10);
	}*/

  DrawLoop() { 
		this.engineService.Update();
		this.Draw();
		// Schedule next frame
		requestAnimationFrame(this.DrawLoop.bind(this));
	}
}

// create minimap / hud
function miniMap(data, ctx) {
	var scale = 10;
	var imageData = ctx.createImageData(data[0].length*scale,data.length*scale)
	for(var i = 0; i < data.length; i++) {
		for(var j = 0; j < data[i].length; j++) {
			for(var k = 0; k < scale; k++) {
				for(var l = 0; l < scale; l++) {
					if (data[i][j].walkable==1) {
						setPixel(imageData, j*scale+k, i*scale+l, 150, 150, 255, 255);
					} else if (data[i][j].walkable==2) {
						setPixel(imageData, j*scale+k, i*scale+l, 100, 225, 100, 255);
					} else {
						setPixel(imageData, j*scale+k, i*scale+l, 150, 100, 100, 255);

					}
				}
			}
		}
	}
	return {
		base: imageData,
		current: imageData,
		scale: scale
	}
}

function setPixel(imageData, x, y, r, g, b, a) {
	var index = (x + y * imageData.width) * 4;
	imageData.data[index+0] = r;
	imageData.data[index+1] = g;
	imageData.data[index+2] = b;
	imageData.data[index+3] = a;
}

function copyImageData(src, ctx)
{
	var dst = ctx.createImageData(src.width, src.height);
	dst.data.set(src.data);
	return dst;
}

function drawPoint(imageData, x, y, r, g, b, a, radius) {
	setPixel(imageData, x, y, r, g, b, a);
	if (radius>1){
		setPixel(imageData, x+1, y  , r, g, b, a);
		setPixel(imageData, x-1, y  , r, g, b, a);
		setPixel(imageData, x,   y+1, r, g, b, a);
		setPixel(imageData, x,   y-1, r, g, b, a);
		if (radius>2){
			setPixel(imageData, x+1, y+1, r, g, b, a);
			setPixel(imageData, x-1, y  , r, g, b, a);
			setPixel(imageData, x-1, y-1, r, g, b, a);
			setPixel(imageData, x,   y-1, r, g, b, a);
			setPixel(imageData, x-1, y+1, r, g, b, a);
			setPixel(imageData, x+1, y-1, r, g, b, a);
			if (radius>3){
				setPixel(imageData, x-2, y,   r, g, b, a);
				setPixel(imageData, x+2, y,   r, g, b, a);
				setPixel(imageData, x,   y-2, r, g, b, a);
				setPixel(imageData, x,   y+2, r, g, b, a);
			}
		}
	}
}

function drawSquare(imageData, x, y, r, g, b, a, radius) {
	setPixel(imageData, x, y, r, g, b, a);
	if (radius>1){
		setPixel(imageData, x+1, y  , r, g, b, a);
		setPixel(imageData, x+1, y+1, r, g, b, a);
		setPixel(imageData, x,   y+1, r, g, b, a);
		if (radius>2){
			setPixel(imageData, x-1, y  , r, g, b, a);
			setPixel(imageData, x-1, y-1, r, g, b, a);
			setPixel(imageData, x,   y-1, r, g, b, a);
			setPixel(imageData, x-1, y+1, r, g, b, a);
			setPixel(imageData, x+1, y-1, r, g, b, a);
		}
	}
}

