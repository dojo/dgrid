import DataProviderBase, { DataProviderOptions } from '../bases/DataProviderBase';
import { ItemProperties } from '../interfaces';

export interface ArrayDataProviderOptions<T> extends DataProviderOptions {
	idProperty?: string;
	data: T[];
}

function expand(items: any[], idProperty: string) {
	const array: ItemProperties[] = [];
	let index = 0;
	for (const item of items) {
		const id = String(item[idProperty]);
		array.push({
			id,
			index: index++,
			data: item
		});
	}
	return array;
}

class ArrayDataProvider<T = object> extends DataProviderBase<T, ArrayDataProviderOptions<T>> {
	buildData(): void {
		const {
			options: {
				idProperty = 'id',
				data
			},
			state: {
				slice,
				sort
			}
		} = this;

		let items = [ ...data ];
		if (sort && sort.length) {
			items = items.sort((a: any, b: any) => {
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

		let itemProperties = expand(items, idProperty);
		if (slice) {
			itemProperties = itemProperties.slice(slice.start, (slice.start + slice.count));
		}

		this.data = {
			size: {
				dataLength: data.length,
				totalLength: data.length
			},
			slice,
			sort,
			items: itemProperties
		};
	}
}

export default ArrayDataProvider;
