import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserDataService } from '../services/userData.service';
import { UIService } from '../services/ui.service';
import { EngineService } from '../services/engine.service';

@Component({
	selector: 'app-editor-window',
	templateUrl: './editor-window.component.html',
	styleUrls: ['./editor-window.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class EditorWindowComponent implements OnInit {

	constructor(private userDataService: UserDataService,
				private ui: UIService,
				private engineService: EngineService,) { }

	ngOnInit() {
	}

	Export() {
		console.log(this.engineService.data.mob);
		console.log(this.engineService.data.item);
	}

}
