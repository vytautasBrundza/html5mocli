import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { EngineService } from '../services/engine.service';
import { UserDataService } from '../services/userData.service';

@Component({
	selector: 'app-server-info',
	templateUrl: './server-info.component.html',
	styleUrls: ['./server-info.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class ServerInfoComponent implements OnInit {

	constructor(private engineService: EngineService,
				private userDataService: UserDataService) { }

	ngOnInit() {
	}

}
