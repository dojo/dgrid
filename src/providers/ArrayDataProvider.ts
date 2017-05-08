import DataProviderBase, { DataProviderState, Options } from '../bases/DataProviderBase';
import { DataProperties, ItemProperties } from '../interfaces';

export interface ArrayDataProviderOptions<T> extends Options {
	idProperty?: string;
	data: T[];
}

function expand(items: any[], idProperty: string) {
	const array: ItemProperties<any>[] = [];
	for (const item of items) {
		const id = String(item[idProperty]);
		array.push({
			id,
			data: item
		});
	}
	return array;
}

class ArrayDataProvider<T> extends DataProviderBase<T, ArrayDataProviderOptions<T>> {
	buildData(state: DataProviderState<ArrayDataProviderOptions<T>>): DataProperties<T> {
		const {
			options: {
				idProperty = 'id',
				data
			},
			sort
		} = state;
		let items = data;
		if (sort && sort.length) {
			items = [ ...items].sort((a: any, b: any) => {
				for (let field of sort) {
					const aValue = a[field.columnId];
					const bValue = b[field.columnId];
					const ascending = (field.direction === 'asc');
					if (aValue !== bValue) {
						if (ascending) {
							return (aValue < bValue ? -1 : 1);
						}
						else {
							return (aValue > bValue ? -1 : 1);
						}
					}
				}
				return 0;
			});
		}
		const itemProperties = expand(items, idProperty);
		return {
			sort,
			items: itemProperties
		};
	}
}

export default ArrayDataProvider;
