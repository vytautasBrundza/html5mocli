import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserDataService } from '../services/userData.service';

@Component({
	selector: 'app-main',
	templateUrl: './main.component.html',
	styleUrls: ['./main.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class MainComponent implements OnInit {

	constructor(private userDataService:UserDataService) { }
	
	ngOnInit() {}

}
