import { assert } from 'chai';
import * as registerSuite from 'intern/lib/interfaces/object';
import { DataProperties } from '../../src/interfaces';
import ArrayDataProvider from '../../src/providers/ArrayDataProvider';

registerSuite({
	name: 'ArrayDataProvider',

	'default ascending'() {
		const dataProvider = new ArrayDataProvider({
			idProperty: 'id',
			data: [
				{ id: 1 },
				{ id: 3 },
				{ id: 5 },
				{ id: '2' },
				{ id: '4' }
			]
		});
		let data: DataProperties<any> = <any> {};
		const subscription = dataProvider.observe().subscribe((updated) => {
			data = updated;
		});
		dataProvider.sort({ columnId: 'id' });
		dataProvider.slice({ start: 0, count: 4});

		assert.deepEqual(data, {
			size: {
				dataLength: 5,
				totalLength: 5
			},
			slice: { start: 0, count: 4},
			sort: [ { columnId: 'id', direction: 'asc' } ],
			items: [
				{ id: '1', index: 0, data: { id: 1 } },
				{ id: '2', index: 1, data: { id: '2' } },
				{ id: '3', index: 2, data: { id: 3 } },
				{ id: '4', index: 3, data: { id: '4' } }
			]
		});

		subscription.unsubscribe();
	},

	'configure default ascending'() {
		const dataProvider = new ArrayDataProvider({
			data: [
				{ id: 1 },
				{ id: 3 },
				{ id: 5 },
				{ id: 2 },
				{ id: 4 }
			]
		});
		let data: DataProperties<any> = <any> {};
		const subscription = dataProvider.observe().subscribe((updated) => {
			data = updated;
		});
		dataProvider.configure({ slice: { start: 1, count: 4 }, sort: { columnId: 'id', direction: 'asc' } });

		assert.deepEqual(data, {
			size: {
				dataLength: 5,
				totalLength: 5
			},
			slice: { start: 1, count: 4},
			sort: [ { columnId: 'id', direction: 'asc' } ],
			items: [
				{ id: '2', index: 1, data: { id: 2 } },
				{ id: '3', index: 2, data: { id: 3 } },
				{ id: '4', index: 3, data: { id: 4 } },
				{ id: '5', index: 4, data: { id: 5 } }
			]
		});

		subscription.unsubscribe();
	},

	'ascending'() {
		const dataProvider = new ArrayDataProvider({
			data: [
				{ id: 1 },
				{ id: 3 },
				{ id: 5 },
				{ id: 2 },
				{ id: 4 }
			]
		});
		let data: DataProperties<any> = <any> {};
		const subscription = dataProvider.observe().subscribe((updated) => {
			data = updated;
		});
		dataProvider.sort({ columnId: 'id', direction: 'asc' });

		assert.deepEqual(data, {
			size: {
				dataLength: 5,
				totalLength: 5
			},
			slice: undefined,
			sort: [ { columnId: 'id', direction: 'asc' } ],
			items: [
				{ id: '1', index: 0, data: { id: 1 } },
				{ id: '2', index: 1, data: { id: 2 } },
				{ id: '3', index: 2, data: { id: 3 } },
				{ id: '4', index: 3, data: { id: 4 } },
				{ id: '5', index: 4, data: { id: 5 } }
			]
		});

		subscription.unsubscribe();
	},

	'constructor configure ascending'() {
		const dataProvider = new ArrayDataProvider({
			data: [
				{ id: 1 },
				{ id: 3 },
				{ id: 5 },
				{ id: 2 },
				{ id: 4 }
			]
		}, {
			sort: { columnId: 'id', direction: 'asc' }
		});
		let data: DataProperties<any> = <any> {};
		const subscription = dataProvider.observe().subscribe((updated) => {
			data = updated;
		});
		dataProvider.notify();
		assert.deepEqual(data, {
			size: {
				dataLength: 5,
				totalLength: 5
			},
			slice: undefined,
			sort: [ { columnId: 'id', direction: 'asc' } ],
			items: [
				{ id: '1', index: 0, data: { id: 1 } },
				{ id: '2', index: 1, data: { id: 2 } },
				{ id: '3', index: 2, data: { id: 3 } },
				{ id: '4', index: 3, data: { id: 4 } },
				{ id: '5', index: 4, data: { id: 5 } }
			]
		});

		subscription.unsubscribe();
	},

	'descending'() {
		const dataProvider = new ArrayDataProvider({
			data: [
				{ id: 1, letter: 'a' },
				{ id: 4, letter: 'b' },
				{ id: 5, letter: 'c' },
				{ id: 3, letter: 'b' },
				{ id: 2, letter: 'a' }
			]
		});
		let data: DataProperties<any> = <any> {};
		const subscription = dataProvider.observe().subscribe((updated) => {
			data = updated;
		});
		dataProvider.sort([ { columnId: 'letter', direction: 'desc' } ]);

		// remove items to allow for equality check
		// but provides no guarantee of id ordering
		for (const item of data.items) {
			delete item.id;
			delete item.data.id;
		}

		assert.deepEqual(data, {
			size: {
				dataLength: 5,
				totalLength: 5
			},
			slice: undefined,
			sort: [ { columnId: 'letter', direction: 'desc' } ],
			items: [
				{ index: 0, data: { letter: 'c' } },
				{ index: 1, data: { letter: 'b' } },
				{ index: 2, data: { letter: 'b' } },
				{ index: 3, data: { letter: 'a' } },
				{ index: 4, data: { letter: 'a' } }
			]
		});

		subscription.unsubscribe();
	},

	'multi column'() {
		const dataProvider = new ArrayDataProvider({
			data: [
				{ id: 1, letter: 'a' },
				{ id: 4, letter: 'b' },
				{ id: 5, letter: 'c' },
				{ id: 3, letter: 'b' },
				{ id: 2, letter: 'a' }
			]
		});
		let data: DataProperties<any> = <any> {};
		const subscription = dataProvider.observe().subscribe((updated) => {
			data = updated;
		});
		dataProvider.sort([ { columnId: 'letter', direction: 'desc' }, { columnId: 'id', direction: 'asc' } ]);

		assert.deepEqual(data, {
			size: {
				dataLength: 5,
				totalLength: 5
			},
			slice: undefined,
			sort: [ { columnId: 'letter', direction: 'desc' }, { columnId: 'id', direction: 'asc' } ],
			items: [
				{ id: '5', index: 0, data: { id: 5, letter: 'c' } },
				{ id: '3', index: 1, data: { id: 3, letter: 'b' } },
				{ id: '4', index: 2, data: { id: 4, letter: 'b' } },
				{ id: '1', index: 3, data: { id: 1, letter: 'a' } },
				{ id: '2', index: 4, data: { id: 2, letter: 'a' } }
			]
		});

		subscription.unsubscribe();
	},

	'configure multi column'() {
		const dataProvider = new ArrayDataProvider({
			data: [
				{ id: 1, letter: 'a' },
				{ id: 4, letter: 'b' },
				{ id: 5, letter: 'c' },
				{ id: 3, letter: 'b' },
				{ id: 2, letter: 'a' }
			]
		});
		dataProvider.configure({
			sort: [ { columnId: 'letter', direction: 'desc' }, { columnId: 'id', direction: 'asc' } ]
		});
		let data: DataProperties<any> = <any> {};
		const subscription = dataProvider.observe().subscribe((updated) => {
			data = updated;
		});

		assert.deepEqual(data, {
			size: {
				dataLength: 5,
				totalLength: 5
			},
			slice: undefined,
			sort: [ { columnId: 'letter', direction: 'desc' }, { columnId: 'id', direction: 'asc' } ],
			items: [
				{ id: '5', index: 0, data: { id: 5, letter: 'c' } },
				{ id: '3', index: 1, data: { id: 3, letter: 'b' } },
				{ id: '4', index: 2, data: { id: 4, letter: 'b' } },
				{ id: '1', index: 3, data: { id: 1, letter: 'a' } },
				{ id: '2', index: 4, data: { id: 2, letter: 'a' } }
			]
		});

		subscription.unsubscribe();
	},

	'constructor configure multi column'() {
		const dataProvider = new ArrayDataProvider({
			data: [
				{ id: 1, letter: 'a' },
				{ id: 4, letter: 'b' },
				{ id: 5, letter: 'c' },
				{ id: 3, letter: 'b' },
				{ id: 2, letter: 'a' }
			]
		}, {
			sort: [ { columnId: 'letter', direction: 'desc' }, { columnId: 'id', direction: 'asc' } ]
		});
		dataProvider.notify(); // build data before adding an observer
		let data: DataProperties<any> = <any> {};
		const subscription = dataProvider.observe().subscribe((updated) => {
			data = updated;
		});

		assert.deepEqual(data, {
			size: {
				dataLength: 5,
				totalLength: 5
			},
			slice: undefined,
			sort: [ { columnId: 'letter', direction: 'desc' }, { columnId: 'id', direction: 'asc' } ],
			items: [
				{ id: '5', index: 0, data: { id: 5, letter: 'c' } },
				{ id: '3', index: 1, data: { id: 3, letter: 'b' } },
				{ id: '4', index: 2, data: { id: 4, letter: 'b' } },
				{ id: '1', index: 3, data: { id: 1, letter: 'a' } },
				{ id: '2', index: 4, data: { id: 2, letter: 'a' } }
			]
		});

		subscription.unsubscribe();
	}
});
