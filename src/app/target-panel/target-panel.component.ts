import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserDataService } from '../services/userData.service';
import { UIService } from '../services/ui.service';

@Component({
	selector: 'app-target-panel',
	templateUrl: './target-panel.component.html',
	styleUrls: ['./target-panel.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class TargetPanelComponent implements OnInit {

	constructor(private userDataService: UserDataService,
				private ui: UIService) { }

	ngOnInit() {
	}

}
