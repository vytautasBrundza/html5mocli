import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserDataService } from '../services/userData.service';

@Component({
	selector: 'app-overlay',
	templateUrl: './overlay.component.html',
	styleUrls: ['./overlay.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class OverlayComponent implements OnInit {

	constructor(private userDataService: UserDataService) { }

	ngOnInit() {
	}

}
