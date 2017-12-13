import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserDataService } from '../services/userData.service';
import { UIService } from '../services/ui.service';

@Component({
	selector: 'app-character-panel',
	templateUrl: './character-panel.component.html',
	styleUrls: ['./character-panel.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class CharacterPanelComponent implements OnInit {

	constructor(private userDataService: UserDataService,
				private ui: UIService) { }

	ngOnInit() {
	}

}
