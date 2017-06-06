import * as registerSuite from 'intern!object';

import harness, { Harness } from '@dojo/test-extras/harness';
import { assignChildProperties, assignProperties, compareProperty } from '@dojo/test-extras/support/d';
import { v, w } from '@dojo/widget-core/d';

import Body from '../../src/Body';
import ColumnHeaders from '../../src/ColumnHeaders';
import Grid, { GridProperties } from '../../src/Grid';
import GridRegistry, { gridRegistry } from '../../src/GridRegistry';
import { Column, ItemProperties, SortDetails } from '../../src/interfaces';
import ArrayDataProvider from '../../src/providers/ArrayDataProvider';
import * as css from '../../src/styles/grid.m.css';
import DataProviderBase from '../../src/bases/DataProviderBase';
import Footer from '../../src/Footer';
import Header, { HeaderType } from '../../src/Header';

const registry: GridRegistry = <any> compareProperty((value) => {
	if (value instanceof GridRegistry) {
		return value.has('body') &&
			value.has('cell') &&
			value.has('column-header-cell') &&
			value.has('column-headers') &&
			value.has('footer') &&
			value.has('header') &&
			value.has('row');
	}
	return false;
});

const columns: Column[] = [
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

const itemProperties: ItemProperties[] = [
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
		index: 0,
		name: 'Three'
	},
	{
		id: 4,
		index: 1,
		name: 'Four'
	}
];

const itemProperties2: ItemProperties[] = [
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
		widget.setProperties({
			dataProvider: new ArrayDataProvider({
				data: items
			}),
			columns
		});

		widget.expectRender(v('div', {
			classes: widget.classes(css.grid),
			role: 'grid'
		}, [
			w<Header>('header', {
				registry,
				theme: undefined
			}, [
				w<ColumnHeaders>('column-headers', {
					columns,
					registry,
					sortDetails: [],
					theme: undefined,
					onSortRequest: widget.listener
				})
			]),
			w<Body>('body', {
				columns,
				items: itemProperties,
				registry,
				theme: undefined
			}),
			w<Footer>('footer', {
				registry,
				theme: undefined
			})
		]));
	},

	'dgrid with column headers in footer'() {
		widget.setProperties({
			columns,
			dataProvider: new ArrayDataProvider({
				data: items
			}),
			footers: [ HeaderType.COLUMN_HEADERS ],
			headers: []
		});

		widget.expectRender(v('div', {
			classes: widget.classes(css.grid),
			role: 'grid'
		}, [
			w<Header>('header', {
				registry,
				theme: undefined
			}),
			w<Body>('body', {
				columns,
				items: itemProperties,
				registry,
				theme: undefined
			}),
			w<Footer>('footer', {
				registry,
				theme: undefined
			}, [
				w<ColumnHeaders>('column-headers', {
					columns,
					registry,
					sortDetails: [],
					theme: undefined,
					onSortRequest: widget.listener
				})
			])
		]));
	},

	'dgrid with custom header/footer'() {
		widget.setProperties({
			columns,
			dataProvider: new ArrayDataProvider({
				data: items
			}),
			footers: [ v('div.footer-child') ],
			headers: [ v('div.header-child') ]
		});

		widget.expectRender(v('div', {
			classes: widget.classes(css.grid),
			role: 'grid'
		}, [
			w<Header>('header', {
				registry,
				theme: undefined
			}, [
				v('div.header-child')
			]),
			w<Body>('body', {
				columns,
				items: itemProperties,
				registry,
				theme: undefined
			}),
			w<Footer>('footer', {
				registry,
				theme: undefined
			}, [
				v('div.footer-child')
			])
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
				registry,
				theme: undefined
			}, [
				w<ColumnHeaders>('column-headers', {
					columns,
					registry,
					sortDetails: [],
					theme: undefined,
					onSortRequest: widget.listener
				})
			]),
			w<Body>('body', {
				columns,
				items: [],
				registry,
				theme: undefined
			}),
			w<Footer>('footer', {
				registry,
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

		widget.setProperties(properties);

		const expectedHeaders = w<ColumnHeaders>('column-headers', {
			columns,
			registry,
			sortDetails: [],
			theme: undefined,
			onSortRequest: widget.listener
		});
		const expected = v('div', {
			classes: widget.classes(css.grid),
			role: 'grid'
		}, [
			w<Header>('header', {
				registry,
				theme: undefined
			}, [
				expectedHeaders
			]),
			w<Body>('body', {
				columns,
				items: itemProperties,
				registry,
				theme: undefined
			}),
			w<Footer>('footer', {
				registry,
				theme: undefined
			})
		]);

		widget.expectRender(expected);

		const sortDetails: SortDetails = {
			columnId: 'name',
			direction: 'desc'
		};

		properties.dataProvider.sort(sortDetails);

		assignProperties(expectedHeaders, {
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

		widget.setProperties(properties);

		const expected = v('div', {
			classes: widget.classes(css.grid),
			role: 'grid'
		}, [
			w<Header>('header', {
				registry,
				theme: undefined
			}, [
				w<ColumnHeaders>('column-headers', {
					columns,
					registry,
					sortDetails: [],
					theme: undefined,
					onSortRequest: widget.listener
				})
			]),
			w<Body>('body', {
				columns,
				items: itemProperties,
				registry,
				theme: undefined
			}),
			w<Footer>('footer', {
				registry,
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

		assignChildProperties(expected, 1, {
			items: itemProperties2
		});

		widget.setProperties(properties);

		widget.expectRender(expected);
	}
});
