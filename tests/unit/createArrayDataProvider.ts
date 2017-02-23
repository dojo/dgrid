import * as registerSuite from 'intern/lib/interfaces/object';
import { assert } from 'chai';
import createArrayDataProvider from '../../src/createArrayDataProvider';
import { DataProperties } from '../../src/interfaces';

registerSuite({
	name: 'createArrayDataProvider',
	'default ascending'() {
		const dataProvider = createArrayDataProvider({
			data: [
				{ id: 1 },
				{ id: 3 },
				{ id: 5 },
				{ id: 2 },
				{ id: 4 },
				{ id: 1 }
			]
		});
		let data: DataProperties<any> = { items: [] };
		const subscription = dataProvider.observe().subscribe((updated) => {
			data = updated;
		});
		dataProvider.onSortRequest({ columnId: 'id' });

		assert.deepEqual(data, {
			sortDetails: [ { columnId: 'id', descending: false } ],
			items: [
				{ id: 1, data: { id: 1 } },
				{ id: 1, data: { id: 1 } },
				{ id: 2, data: { id: 2 } },
				{ id: 3, data: { id: 3 } },
				{ id: 4, data: { id: 4 } },
				{ id: 5, data: { id: 5 } }
			]
		});

		subscription.unsubscribe();
	},
	'ascending'() {
		const dataProvider = createArrayDataProvider({
			data: [
				{ id: 1 },
				{ id: 1 },
				{ id: 3 },
				{ id: 5 },
				{ id: 2 },
				{ id: 4 }
			]
		});
		let data: DataProperties<any> = { items: [] };
		const subscription = dataProvider.observe().subscribe((updated) => {
			data = updated;
		});
		dataProvider.onSortRequest({ columnId: 'id', descending: false });

		assert.deepEqual(data, {
			sortDetails: [ { columnId: 'id', descending: false } ],
			items: [
				{ id: 1, data: { id: 1 } },
				{ id: 1, data: { id: 1 } },
				{ id: 2, data: { id: 2 } },
				{ id: 3, data: { id: 3 } },
				{ id: 4, data: { id: 4 } },
				{ id: 5, data: { id: 5 } }
			]
		});

		subscription.unsubscribe();
	},
	'descending'() {
		const dataProvider = createArrayDataProvider({
			data: [
				{ id: 1 },
				{ id: 1 },
				{ id: 3 },
				{ id: 5 },
				{ id: 2 },
				{ id: 4 }
			]
		});
		let data: DataProperties<any> = { items: [] };
		const subscription = dataProvider.observe().subscribe((updated) => {
			data = updated;
		});
		dataProvider.onSortRequest({ columnId: 'id', descending: true });

		assert.deepEqual(data, {
			sortDetails: [ { columnId: 'id', descending: true } ],
			items: [
				{ id: 5, data: { id: 5 } },
				{ id: 4, data: { id: 4 } },
				{ id: 3, data: { id: 3 } },
				{ id: 2, data: { id: 2 } },
				{ id: 1, data: { id: 1 } },
				{ id: 1, data: { id: 1 } }
			]
		});

		subscription.unsubscribe();
	}
});
