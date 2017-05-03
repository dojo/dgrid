import * as registerSuite from 'intern!object';

import { VNode } from '@dojo/interfaces/vdom';
import harness, { Harness } from '@dojo/test-extras/harness';
import assertRender from '@dojo/test-extras/support/assertRender';
import { v, w } from '@dojo/widget-core/d';
import WidgetRegistry from '@dojo/widget-core/WidgetRegistry';

import Body, { BodyProperties } from '../../src/Body';
import Cell from '../../src/Cell';
import Grid, { GridProperties } from '../../src/Grid';
import Header, { HeaderProperties } from '../../src/Header';
import HeaderCell from '../../src/HeaderCell';
import { Column } from '../../src/interfaces';
import Row from '../../src/Row';
import ArrayDataProvider from '../../src/providers/ArrayDataProvider';
import * as css from '../../src/styles/grid.m.css';

let widget: Harness<GridProperties, typeof Grid>;

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
	name: 'Body',

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

		const actual = <any> widget.getRender();
		actual!.children!.forEach((child: any) => {
			child.registry = registry;
		});
		assertRender(actual, v('div', {
			classes: widget.classes(css.grid),
			role: 'grid'
		}, [
			w<HeaderProperties>('header', {
				columns,
				registry,
				sortDetails: [],
				theme: undefined,
				onSortRequest: widget.listener
			}),
			w<BodyProperties>('body', {
				columns,
				items: [],
				registry,
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
