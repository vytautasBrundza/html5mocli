import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserDataService } from '../services/userData.service';
import { EngineService } from '../services/engine.service';
import { DataTransferService } from '../services/dataTransfer.service';
import { SettingsService } from '../services/settings.service';
import { HelperService } from '../services/helper.service';
import { UIService } from '../services/ui.service';

@Component({
	selector: 'app-ui',
	templateUrl: './ui.component.html',
	styleUrls: ['./ui.component.css'],
	host: { '(window:keydown)': 'HandleKeyDown($event)','(window:keyup)': 'HandleKeyUp($event)'},
	encapsulation: ViewEncapsulation.None
})
export class UiComponent implements OnInit {

	constructor(private userDataService: UserDataService,
				private engineService: EngineService,
				private settingsService: SettingsService,
				private dataTransferService: DataTransferService,
				private h: HelperService,
				private ui: UIService) { }
	
	ngOnInit() {
		
	}
		
	HandleKeyDown(event) {
		this.ui.KeyDown(event.keyCode);
	}

	HandleKeyUp(event) {
		this.ui.KeyUp(event.keyCode);
		
	}

	
}
