import { Component, OnInit,OnDestroy } from '@angular/core';
import { DataTransferService } from '../services/dataTransfer.service';

@Component({
	selector: 'app-chat',
	templateUrl: './chat.component.html',
	styleUrls: ['./chat.component.css'],
	providers: []
})
export class ChatComponent implements OnInit, OnDestroy {
	messages = new Array<Message>();
	connection;
	message;
	
	constructor(private chatService:DataTransferService) {}

	sendMessage() {
		this.chatService.sendMessage(this.message);
		this.message = '';
	}

	getMessages(){};

	ngOnInit() {
		this.connection = this.chatService.getMessages().subscribe(message => {
			this.messages.push(new Message((<Message>message).user, (<Message>message).text));
			document.getElementById("messages").scrollTop = 10000;
		})
	}
	
	ngOnDestroy() {
		this.connection.unsubscribe();
	}
}

class Message {
	user : string;
	text : string;
	time : Date;
	constructor(name:string, text:string) {
		this.user = name;
		this.text = text;
		this.time = new Date();
    }
}
