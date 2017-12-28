import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'queststatus'
})

export class QuestFilterPipe implements PipeTransform {
	transform(items: any[], status: string): any[] {
		if(!items) return [];
		if(!status || status=='all') return items;
		return items.filter( it => {
			return it.status == status;
		});
	}
}
