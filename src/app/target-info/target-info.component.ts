import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserDataService } from '../services/userData.service';

@Component({
	selector: 'app-target-info',
	templateUrl: './target-info.component.html',
	styleUrls: ['./target-info.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class TargetInfoComponent implements OnInit {

	constructor(private userDataService: UserDataService) { }

	ngOnInit() {
	}

}
