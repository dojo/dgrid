import * as registerSuite from 'intern/lib/interfaces/object';
import { assert } from 'chai';
import { DataProperties } from '../../../src/interfaces';
import createDataProviderBase from '../../../src/bases/createDataProviderBase';

registerSuite({
	name: 'createDataProviderBase',
	base() {
		const dataProvider = createDataProviderBase();
		let data: DataProperties<any> = { items: [] };
		const subscription = dataProvider.observe().subscribe((updated) => {
			data = updated;
		});
		assert.lengthOf(data.items, 0);
		subscription.unsubscribe();

		const sorts = [ { columnId: 'id' }];
		dataProvider.sorts = sorts;
		assert.deepEqual(dataProvider.sorts, sorts);
	}
});
