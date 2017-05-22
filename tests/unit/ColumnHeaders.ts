import * as registerSuite from 'intern!object';

import harness, { Harness } from '@dojo/test-extras/harness';
import { registry, v, w } from '@dojo/widget-core/d';

import ColumnHeaderCell from '../../src/ColumnHeaderCell';
import ColumnHeaders, { ColumnHeadersProperties } from '../../src/ColumnHeaders';
import * as css from '../../src/styles/columnHeaders.m.css';
import * as tableCss from '../../src/styles/shared/table.m.css';

let widget: Harness<ColumnHeadersProperties, typeof ColumnHeaders>;

registerSuite({
	name: 'ColumnHeaders',

	beforeEach() {
		widget = harness(ColumnHeaders);
	},

	afterEach() {
		widget.destroy();
	},

	'Simple columns'() {
		widget.setProperties({
			columns: [
				{ id: 'foo' },
				{ id: 'bar' }
			],
			onSortRequest: widget.listener,
			registry,
			sortDetails: []
		});

		widget.expectRender(v('div', {
			classes: widget.classes(css.columnHeaders, css.columnHeadersRow),
			role: 'row'
		}, [
			v('table', {
				role: 'presentation',
				classes: widget.classes(tableCss.table, css.columnHeadersTable)
			}, [
				v('tr', [
					w<ColumnHeaderCell>('column-header-cell', {
						column: { id: 'foo' },
						key: 'foo',
						onSortRequest: widget.listener,
						sortDetail: undefined,
						registry,
						theme: undefined
					}),
					w<ColumnHeaderCell>('column-header-cell', {
						column: { id: 'bar' },
						key: 'bar',
						onSortRequest: widget.listener,
						sortDetail: undefined,
						registry,
						theme: undefined
					})
				])
			])
		]));
	},

	'Columns with single sort'() {
		widget.setProperties({
			columns: [
				{ id: 'foo' },
				{ id: 'bar' }
			],
			onSortRequest: widget.listener,
			registry,
			sortDetails: [{
				columnId: 'foo'
			}]
		});

		widget.expectRender(v('div', {
			classes: widget.classes(css.columnHeaders, css.columnHeadersRow),
			role: 'row'
		}, [
			v('table', {
				role: 'presentation',
				classes: widget.classes(tableCss.table, css.columnHeadersTable)
			}, [
				v('tr', [
					w<ColumnHeaderCell>('column-header-cell', {
						column: { id: 'foo' },
						key: 'foo',
						onSortRequest: widget.listener,
						sortDetail: {
							columnId: 'foo'
						},
						registry,
						theme: undefined
					}),
					w<ColumnHeaderCell>('column-header-cell', {
						column: { id: 'bar' },
						key: 'bar',
						onSortRequest: widget.listener,
						sortDetail: undefined,
						registry,
						theme: undefined
					})
				])
			])
		]));
	}
});
