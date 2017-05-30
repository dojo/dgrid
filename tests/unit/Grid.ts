import * as registerSuite from 'intern!object';

import harness, { Harness } from '@dojo/test-extras/harness';
import { assignChildProperties, compareProperty } from '@dojo/test-extras/support/d';
import { v, w } from '@dojo/widget-core/d';

import Body from '../../src/Body';
import Grid, { GridProperties } from '../../src/Grid';
import GridRegistry, { gridRegistry } from '../../src/GridRegistry';
import Header from '../../src/Header';
import { Column, ItemProperties, SortDetails } from '../../src/interfaces';
import ArrayDataProvider from '../../src/providers/ArrayDataProvider';
import * as css from '../../src/styles/grid.m.css';
import DataProviderBase from '../../src/bases/DataProviderBase';

const compareRegistryProperty: GridRegistry = <any> compareProperty((value) => {
	if (value instanceof GridRegistry) {
		return value.has('body') &&
			value.has('cell') &&
			value.has('footer') &&
			value.has('header') &&
			value.has('header-cell') &&
			value.has('row');
	}
	return false;
});

const columns: Column<any>[] = [
	{ id: 'name', label: 'Name' }
];

const items = [
	{
		id: 1,
		index: 0,
		name: 'One'
	},
	{
		id: 2,
		index: 1,
		name: 'Two'
	}
];

const itemProperties: ItemProperties<any>[] = [
	{
		id: '1',
		index: 0,
		data: items[0]
	},
	{
		id: '2',
		index: 1,
		data: items[1]
	}
];

const items2 = [
	{
		id: 3,
		name: 'Three'
	},
	{
		id: 4,
		name: 'Four'
	}
];

const itemProperties2: ItemProperties<any>[] = [
	{
		id: '3',
		index: 0,
		data: items2[0]
	},
	{
		id: '4',
		index: 1,
		data: items2[1]
	}
];

let widget: Harness<GridProperties, typeof Grid>;

registerSuite({
	name: 'Grid',

	beforeEach() {
		widget = harness(Grid);
	},

	afterEach() {
		widget.destroy();
	},

	'dgrid'() {
		const properties: GridProperties = {
			columns,
			dataProvider: new ArrayDataProvider({
				data: items
			}),
			scrollTo: {
				index: 0,
				position: 'top'
			}
		};
		properties.dataProvider.notify();
		widget.setProperties(properties);

		widget.expectRender(v('div', {
			classes: widget.classes(css.grid),
			role: 'grid'
		}, [
			w<Header>('header', {
				columns,
				registry: compareRegistryProperty,
				sortDetails: [],
				theme: undefined,
				onSortRequest: widget.listener
			}),
			w<Body>('body', {
				bufferRows: undefined,
				columns,
				items: itemProperties,
				onScrollToComplete: widget.listener,
				onScrollToRequest: widget.listener,
				onSliceRequest: widget.listener,
				registry: compareRegistryProperty,
				rowDrift: undefined,
				scrollTo: {
					index: 0,
					position: 'top'
				},
				size: {
					dataLength: 2,
					totalLength: 2
				},
				slice: undefined,
				theme: undefined
			})
		]));
	},

	'dgrid no dataProvider'() {
		widget.setProperties({
			dataProvider: new (class extends DataProviderBase {})({}),
			columns,
			registry: gridRegistry
		});

		widget.expectRender(v('div', {
			classes: widget.classes(css.grid),
			role: 'grid'
		}, [
			w<Header>('header', {
				columns,
				registry: compareRegistryProperty,
				sortDetails: [],
				theme: undefined,
				onSortRequest: widget.listener
			}),
			w<Body>('body', {
				bufferRows: undefined,
				columns,
				items: [],
				onScrollToComplete: widget.listener,
				onScrollToRequest: widget.listener,
				onSliceRequest: widget.listener,
				registry: compareRegistryProperty,
				rowDrift: undefined,
				scrollTo: undefined,
				size: {
					dataLength: 0,
					totalLength: 0
				},
				slice: undefined,
				theme: undefined
			})
		]));
	},

	'sort'() {
		const properties: GridProperties = {
			dataProvider: new ArrayDataProvider({
				data: items
			}),
			columns
		};
		properties.dataProvider.notify();

		widget.setProperties(properties);

		const expected = v('div', {
			classes: widget.classes(css.grid),
			role: 'grid'
		}, [
			w<Header>('header', {
				columns,
				registry: compareRegistryProperty,
				sortDetails: [],
				theme: undefined,
				onSortRequest: widget.listener
			}),
			w<Body>('body', {
				bufferRows: undefined,
				columns,
				items: itemProperties,
				onScrollToComplete: widget.listener,
				onScrollToRequest: widget.listener,
				onSliceRequest: widget.listener,
				registry: compareRegistryProperty,
				rowDrift: undefined,
				scrollTo: undefined,
				size: {
					dataLength: 2,
					totalLength: 2
				},
				slice: undefined,
				theme: undefined
			})
		]);

		widget.expectRender(expected);

		const sortDetails: SortDetails = {
			columnId: 'name',
			direction: 'desc'
		};

		properties.dataProvider.sort(sortDetails);

		assignChildProperties(expected, 0, {
			sortDetails: [ sortDetails ]
		});

		assignChildProperties(expected, 1, {
			items: [ { ...itemProperties[1], index: 0 }, { ...itemProperties[0], index: 1 } ]
		});

		widget.expectRender(expected);
	},

	'reassign dataProvider'() {
		let properties: GridProperties = {
			dataProvider: new ArrayDataProvider({
				data: items
			}),
			columns
		};
		properties.dataProvider.notify();

		widget.setProperties(properties);

		const expected = v('div', {
			classes: widget.classes(css.grid),
			role: 'grid'
		}, [
			w<Header>('header', {
				columns,
				registry: compareRegistryProperty,
				sortDetails: [],
				theme: undefined,
				onSortRequest: widget.listener
			}),
			w<Body>('body', {
				bufferRows: undefined,
				columns,
				items: itemProperties,
				onScrollToComplete: widget.listener,
				onScrollToRequest: widget.listener,
				onSliceRequest: widget.listener,
				registry: compareRegistryProperty,
				rowDrift: undefined,
				scrollTo: undefined,
				size: {
					dataLength: 2,
					totalLength: 2
				},
				slice: undefined,
				theme: undefined
			})
		]);

		widget.expectRender(expected);

		properties = {
			...properties,
			dataProvider: new ArrayDataProvider({
				data: items2
			})
		};
		properties.dataProvider.notify();

		assignChildProperties(expected, 1, {
			items: itemProperties2
		});

		widget.setProperties(properties);

		widget.expectRender(expected);
	}
});
