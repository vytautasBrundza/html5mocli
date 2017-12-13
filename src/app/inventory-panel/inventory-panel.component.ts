import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserDataService } from '../services/userData.service';
import { UIService } from '../services/ui.service';
import { EngineService } from '../services/engine.service';
import { DragulaModule, DragulaService } from 'ng2-dragula';
import { DataTransferService } from '../services/dataTransfer.service';

@Component({
	selector: 'app-inventory-panel',
	templateUrl: './inventory-panel.component.html',
	styleUrls: ['./inventory-panel.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class InventoryPanelComponent implements OnInit {

	constructor(private userDataService: UserDataService,
				private dataTransferService: DataTransferService,
				private ui: UIService,
				private engineService: EngineService,
				private dragulaService: DragulaService) {

			dragulaService.setOptions('cinv', {
				isContainer: function (el) {
					return false; // only elements in drake.containers will be taken into account
				},
				moves: function (el, source, handle, sibling) {
					return true; // elements are always draggable by default
				},
				accepts: function (el, target, source, sibling) {
					var ttype = target.getAttribute('data-loadout-type');
					var iadded = target.getAttribute('data-iid');
					if(iadded != '0') return false;
					//TODO: test if item is added
					if(ttype == '0') {
						return true;
					}
					var itype = el.getAttribute('data-itype');
					var islot = el.getAttribute('data-islot');
					if(itype == '2') {
						if(islot == ttype) return true;
						//else console.log('this item goes to different slot');
					} //else console.log('this item is not equipable');

					return false;
				},
				invalid: function (el, handle) {
					return false; // don't prevent any drags from initiating by default
				},
				revertOnSpill: true
			});

			dragulaService.drag.subscribe((value:any) => {
				// console.log(`drag: ${value[0]}`); // value[0] will always be bag name
				this.onDrag(value.slice(1));
			});
			dragulaService.drop.subscribe((value:any) => {
				var sourceID = value[3].id.substring(2,10);	
				var targetID = value[2].id.substring(2,10);
				if(sourceID!=targetID) {
					var data = {from:sourceID, to:targetID};
					this.dataTransferService.sendData('ui', {type:'drop', data:data});
					value[1].id = targetID;
				}
				this.onDrop(value.slice(1));
			});
			dragulaService.over.subscribe((value:any) => {
				// console.log(`over: ${value[0]}`);
				this.onOver(value.slice(1));
			});
			dragulaService.out.subscribe((value:any) => {
				// console.log(`out: ${value[0]}`);
				this.onOut(value.slice(1));
			});

		}

	ngOnInit() {
	}

	private hasClass(el:any, name:string):any {
		return new RegExp('(?:^|\\s+)' + name + '(?:\\s+|$)').test(el.className);
	}

	private addClass(el:any, name:string):void {
		if (!this.hasClass(el, name)) {
			el.className = el.className ? [el.className, name].join(' ') : name;
		}
	}

	private removeClass(el:any, name:string):void {
		if (this.hasClass(el, name)) {
			el.className = el.className.replace(new RegExp('(?:^|\\s+)' + name + '(?:\\s+|$)', 'g'), '');
		}
	}

	private onDrag(args:any):void {
		let [e] = args;
		this.removeClass(e, 'ex-moved');
	}

	private onDrop(args:any):void {
		let [e] = args;
		this.addClass(e, 'ex-moved');
	}

	private onOver(args:any):void {
		let [el] = args;
		this.addClass(el, 'ex-over');
	}

	private onOut(args:any):void {
		let [el] = args;
		this.removeClass(el, 'ex-over');
	}

}
