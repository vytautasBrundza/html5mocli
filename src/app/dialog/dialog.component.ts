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
	
	buyQty = 1;
	sellQty = 1;

	ngOnInit() {
	}

	buy(item, from) {
		this.dataTransferService.sendData('ui',{type:'buy', data:{iid:item, qty:this.buyQty, npc:from}});
	}

	sell(item, to) {
		this.dataTransferService.sendData('ui',{type:'sell', data:{iid:item, qty:this.sellQty, npc:to}});
	}

	portal(p) {
		//console.log('Use portal to ' + this.engineService.data.instance[p].name);
		this.dataTransferService.sendData('ui',{type:'portal', data:{iid:p}});
	}

	openTab(tab) {
		this.ui.dialog.tab = tab;
		if(tab=='quest') {
			this.ui.dialog.quest = 0;
			this.ui.dialog.step = 0;
		}
	}

	quest(id, step) {
		this.ui.dialog.quest = id;
		this.ui.dialog.step = step;
	}

	questAccept(id) {
		this.dataTransferService.sendData('quest',{type:'accept', id:id});
	}

}
