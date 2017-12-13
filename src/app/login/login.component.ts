import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DataTransferService } from '../services/dataTransfer.service';
import { UserDataService } from '../services/userData.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css'],
	encapsulation: ViewEncapsulation.None
})

export class LoginComponent implements OnInit {
	userName = "sad";
	userPass = "123456";
	state = "login";
	userClass = ['user','editor','admin'];
	selectedGender = false; // 0- male, 1 -female
	selectedType = false; // 0- fighter, 1 -mage
	selectedClass = '';
	error = '';
	
	constructor(private dataTransferService: DataTransferService,
				private userDataService: UserDataService) { }

	Login() {
		if(this.userName && this.userPass) {
			this.dataTransferService.sendLogin(this.userName,this.userPass);
			this.userName = '';
			this.userPass = '';
		}
	}

	Register() {
		if(this.userName && this.userPass) {
			this.dataTransferService.sendRegister(this.userName,this.userPass);
			//this.userName = '';
			this.userPass = '';
		}
	}

	UserCreate() {
		//if(this.selectedClass!='') {
			this.dataTransferService.sendCreate({
				u:this.userName,
				c:this.selectedClass,
				g:this.selectedGender,
				t:this.selectedType});
			this.userName = '';
			this.userPass = '';
		//}
	}

	ToggleRegister(state) {
		this.state = state;
	}

	ngOnInit() {
	}
}
