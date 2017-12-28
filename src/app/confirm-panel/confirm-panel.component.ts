import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UIService } from '../services/ui.service';

@Component({
	selector: 'app-confirm-panel',
	templateUrl: './confirm-panel.component.html',
	styleUrls: ['./confirm-panel.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class ConfirmPanelComponent implements OnInit {

	constructor(private ui: UIService) { }

	ngOnInit() {
	}

}
