export class SettingsService {
    // Canvas background color
    color_canvas_bg = "#70CC5A";
    
    // object icon and half object icon sizes
    cObjIconSize = 30;
    cHObjIconSize = this.cObjIconSize/2;
    
    // Tile size
    cTileWidth = 64;
    
    // drawing offset for moving on the map
    offsetX = 0;
    offsetY = 0;

    cScrollSpeed = 0.1;
    cursorsDir: string;
    

	constructor() {
        if(window.innerWidth > 800) {
            this.cursorsDir = 'assets/img/cursors32/';
        } else {
            this.cursorsDir = 'assets/img/cursors16/';
        }
    }
}