import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserDataService } from '../services/userData.service';
import { UIService } from '../services/ui.service';
import { EngineService } from '../services/engine.service';
import { DataTransferService } from '../services/dataTransfer.service';

@Component({
	selector: 'app-dialog',
	templateUrl: './dialog.component.html',
	styleUrls: ['./dialog.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class DialogComponent implements OnInit {
	
	constructor(private userDataService: UserDataService,
				private dataTransferService: DataTransferService,
				private ui: UIService,
				private engineService: EngineService) { }

	ngOnInit() {
	}

	buy(item, qty, from) {
		this.dataTransferService.sendData('ui',{type:'buy', data:{iid:item, qty:qty, npc:from}});
	}

	sell(item, qty, to) {
		this.dataTransferService.sendData('ui',{type:'sell', data:{iid:item, qty:qty, npc:to}});
	}

	openTab(tab) {
		this.ui.dialog.tab = tab;
	}

}
