import * as registerSuite from 'intern!object';

import { compareProperty } from '@dojo/test-extras/support/d';
import harness, { Harness } from '@dojo/test-extras/harness';
import { v, w } from '@dojo/widget-core/d';
import RegistryHandler from '@dojo/widget-core/RegistryHandler';
import WidgetRegistry from '@dojo/widget-core/WidgetRegistry';

import Body from '../../src/Body';
import Cell from '../../src/Cell';
import Grid, { GridProperties } from '../../src/Grid';
import Header from '../../src/Header';
import HeaderCell from '../../src/HeaderCell';
import { Column } from '../../src/interfaces';
import Row from '../../src/Row';
import ArrayDataProvider from '../../src/providers/ArrayDataProvider';
import * as css from '../../src/styles/grid.m.css';

let widget: Harness<GridProperties, typeof Grid>;

const compareRegistryProperty: WidgetRegistry = <any> compareProperty((value) => {
	if (value instanceof RegistryHandler) {
		return value.has('header') &&
			value.has('header-cell') &&
			value.has('body') &&
			value.has('row') &&
			value.has('cell');
	}
	return false;
});

const columns: Column<any>[] = [
	{ id: 'foo', label: 'foo' }
];

const registry = new WidgetRegistry();
registry.define('header', Header);
registry.define('header-cell', HeaderCell);
registry.define('body', Body);
registry.define('row', Row);
registry.define('cell', Cell);

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
				data: []
			}),
			columns
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
				columns,
				items: [],
				registry: compareRegistryProperty,
				theme: undefined
			})
		]));
	},
	'sort'() {
		const properties: GridProperties = {
			dataProvider: new ArrayDataProvider({
				data: []
			}),
			columns: [
				{ id: 'foo', label: 'foo' }
			]
		};

		properties.dataProvider.sort({
			columnId: 'foo',
			direction: 'desc'
		});

	},
	'reassign dataProvider'() {
		let properties: GridProperties = {
			dataProvider: new ArrayDataProvider({
				data: []
			}),
			columns: [
				{ id: 'foo', label: 'foo' }
			]
		};

		properties = {
			...properties,
			dataProvider: new ArrayDataProvider({
				data: []
			})
		};
	}
});
