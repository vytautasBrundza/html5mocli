import { Component } from '@angular/core';
import { UserDataService } from './services/userData.service';

@Component({
	selector: 'client-app',
	templateUrl: './client.component.html'
})
export class ClientAppComponent {
  	constructor(private userDataService:UserDataService) { }
}
