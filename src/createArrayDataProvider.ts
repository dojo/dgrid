import createDataProviderBase from './bases/createDataProviderBase';
import { Options, ComposeFactory } from '@dojo/compose/compose';
import { DgridDataProviderGridState } from './bases/createDataProviderBase';
import { DgridDataProvider } from './bases/createDataProviderBase';
import { ItemProperties, DataProperties } from './interfaces';

export interface DgridArrayDataProviderOptions<T> extends Options {
	idProperty?: string;
	data: T[];
}

export type DgridArrayDataProviderFactory = ComposeFactory<DgridDataProvider, DgridArrayDataProviderOptions<any>>;

function expand(items: any[], idProperty: string, array = <ItemProperties<any>[]> []) {
	for (const item of items) {
		const id = item[idProperty];
		array.push({
			id,
			data: item
		});
	}
	return array;
}

const createArrayDataProvider: DgridArrayDataProviderFactory = createDataProviderBase.override({
	data(state: DgridDataProviderGridState<DgridArrayDataProviderOptions<any>>): DataProperties<any> {
		const {
			options: {
				idProperty = 'id',
				data = []
			},
			sorts = []
		} = state;
		let items = data;
		if (sorts.length) {
			items = items.sort((a: any, b: any) => {
				for (let field of sorts) {
					const aValue = a[field.columnId];
					const bValue = b[field.columnId];
					const descending = field.descending;
					if (aValue !== bValue) {
						if (descending) {
							return (aValue > bValue ? -1 : 1);
						}
						else {
							return (aValue < bValue ? -1 : 1);
						}
					}
				}
				return 0;
			});
		}
		const itemProperties = expand(items, idProperty);
		return {
			sortDetails: sorts,
			items: itemProperties
		};
	}
});

export default createArrayDataProvider;
