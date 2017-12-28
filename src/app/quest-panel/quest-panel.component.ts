import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserDataService } from '../services/userData.service';
import { UIService } from '../services/ui.service';
import { EngineService } from '../services/engine.service';
import { DataTransferService } from '../services/dataTransfer.service';

@Component({
	selector: 'app-quest-panel',
	templateUrl: './quest-panel.component.html',
	styleUrls: ['./quest-panel.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class QuestPanelComponent implements OnInit {

	constructor(private userDataService: UserDataService,
		private dataTransferService: DataTransferService,
		private ui: UIService,
		private engineService: EngineService) { }

	ngOnInit() {
	}

	openTab(tab) {
		this.ui.questPanel.tab = tab;
	}

}
