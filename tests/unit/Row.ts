import * as registerSuite from 'intern!object';

import harness, { Harness } from '@dojo/test-extras/harness';
import { registry, v, w } from '@dojo/widget-core/d';

import Cell from '../../src/Cell';
import { ItemProperties } from '../../src/interfaces';
import Row, { RowProperties } from '../../src/Row';
import * as css from '../../src/styles/row.m.css';
import * as tableCss from '../../src/styles/shared/table.m.css';

let widget: Harness<RowProperties, typeof Row>;

registerSuite({
	name: 'Row',

	beforeEach() {
		widget = harness(Row);
	},

	afterEach() {
		widget.destroy();
	},

	'Simple columns'() {
		const item: ItemProperties<any> = {
			id: '1',
			index: 0,
			data: {
				id: 1,
				foo: 'foo',
				bar: 'bar'
			}
		};
		widget.setProperties({
			key: '1',
			columns: [
				{ id: 'foo' },
				{ id: 'bar' }
			],
			item,
			registry
		});

		widget.expectRender(v('div', {
			classes: widget.classes(css.row),
			role: 'row'
		}, [
			v('table', {
				role: 'presentation',
				classes: widget.classes(tableCss.table, css.rowTable)
			}, [
				v('tr', [
					w<Cell>('cell', {
						column: { id: 'foo' },
						item,
						key: 'foo',
						registry,
						theme: undefined,
						value: 'foo'
					}),
					w<Cell>('cell', {
						column: { id: 'bar' },
						item,
						key: 'bar',
						registry,
						theme: undefined,
						value: 'bar'
					})
				])
			])
		]));
	}
});
