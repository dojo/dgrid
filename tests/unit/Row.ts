import * as registerSuite from 'intern!object';

import harness, { Harness } from '@dojo/test-extras/harness';
import { registry, v, w } from '@dojo/widget-core/d';

import Cell from '../../src/Cell';
import { Column, ColumnRenderOptions, ItemProperties } from '../../src/interfaces';
import Row, { RowProperties } from '../../src/Row';
import * as css from '../../src/styles/row.m.css';
import * as tableCss from '../../src/styles/shared/table.m.css';

let widget: Harness<RowProperties, typeof Row>;

const item: ItemProperties = {
	id: '1',
	index: 0,
	data: {
		id: 1,
		number: 1234,
		foo: 'fooValue',
		bar: 'barValue',
		baz: 'bazValue',
		html: '<b>HTML</b>'
	}
};

registerSuite({
	name: 'Row',

	beforeEach() {
		widget = harness(Row);
	},

	afterEach() {
		widget.destroy();
	},

	'Row'() {
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
						content: 'fooValue',
						item,
						key: 'foo',
						registry,
						theme: undefined,
						value: 'fooValue'
					}),
					w<Cell>('cell', {
						column: { id: 'bar' },
						content: 'barValue',
						item,
						key: 'bar',
						registry,
						theme: undefined,
						value: 'barValue'
					})
				])
			])
		]));
	},

	'content is cast to string'() {
		widget.setProperties({
			key: '1',
			columns: [
				{ id: 'number' },
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
						column: { id: 'number' },
						content: '1234',
						item,
						key: 'number',
						registry,
						theme: undefined,
						value: <any> 1234
					}),
					w<Cell>('cell', {
						column: { id: 'bar' },
						content: 'barValue',
						item,
						key: 'bar',
						registry,
						theme: undefined,
						value: 'barValue'
					})
				])
			])
		]));
	},

	'get'() {
		const columns: Column[] = [
			{
				id: 'foo',
				get() {
					return 'fooGet';
				}
			},
			{ id: 'bar' }
		];

		widget.setProperties({
			key: '1',
			columns: columns,
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
						column: columns[0],
						content: 'fooGet',
						item,
						key: 'foo',
						registry,
						theme: undefined,
						value: 'fooGet'
					}),
					w<Cell>('cell', {
						column: columns[1],
						content: 'barValue',
						item,
						key: 'bar',
						registry,
						theme: undefined,
						value: 'barValue'
					})
				])
			])
		]));
	},

	'render'() {
		const columns: Column[] = [
			{
				id: 'foo',
				get: '',
				render({ column, item }: ColumnRenderOptions) {
					return v('span.render', [
						item.data[column.id]
					]);
				}
			},
			{ id: 'bar' }
		];

		widget.setProperties({
			key: '1',
			columns: columns,
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
						column: columns[0],
						content: v('span.render', [
							'fooValue'
						]),
						item,
						key: 'foo',
						registry,
						theme: undefined,
						value: ''
					}),
					w<Cell>('cell', {
						column: columns[1],
						content: 'barValue',
						item,
						key: 'bar',
						registry,
						theme: undefined,
						value: 'barValue'
					})
				])
			])
		]));
	},

	'content is left as raw HTML'() {
		widget.setProperties({
			key: '1',
			columns: [
				{ id: 'html' },
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
						column: { id: 'html' },
						content: '<b>HTML</b>',
						item,
						key: 'html',
						registry,
						theme: undefined,
						value: '<b>HTML</b>'
					}),
					w<Cell>('cell', {
						column: { id: 'bar' },
						content: 'barValue',
						item,
						key: 'bar',
						registry,
						theme: undefined,
						value: 'barValue'
					})
				])
			])
		]));
	},

	'content is converted to HTML'() {
		const htmlColumn: Column = {
			id: 'html',
			render({ value }: ColumnRenderOptions) {
				return v('div', {
					innerHTML: value
				});
			}
		};
		const columns: Column[] = [
			htmlColumn,
			{ id: 'bar' }
		];

		widget.setProperties({
			key: '1',
			columns: columns,
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
						column: columns[0],
						content: v('div', {
							innerHTML: '<b>HTML</b>'
						}),
						item,
						key: 'html',
						registry,
						theme: undefined,
						value: '<b>HTML</b>'
					}),
					w<Cell>('cell', {
						column: columns[1],
						content: 'barValue',
						item,
						key: 'bar',
						registry,
						theme: undefined,
						value: 'barValue'
					})
				])
			])
		]));
	},

	'renderValue'() {
		const fooColumn: Column<any, number> = {
			id: 'foo',
			get: 1234,
			render({ value, item, column }: ColumnRenderOptions<any, number>) {
				return v('span.renderValue', [
					item.data[column.id] + value
				]);
			}
		};
		const columns: Column<any, string | number>[] = [
			fooColumn,
			{ id: 'bar' }
		];

		widget.setProperties({
			key: '1',
			columns: columns,
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
						column: columns[0],
						content: v('span.renderValue', [
							'fooValue1234'
						]),
						item,
						key: 'foo',
						registry,
						theme: undefined,
						value: <any> 1234
					}),
					w<Cell>('cell', {
						column: columns[1],
						content: 'barValue',
						item,
						key: 'bar',
						registry,
						theme: undefined,
						value: 'barValue'
					})
				])
			])
		]));
	}
});
