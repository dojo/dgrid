import * as registerSuite from 'intern!object';

import harness, { Harness } from '@dojo/test-extras/harness';
import { registry, v, w } from '@dojo/widget-core/d';

import Header, { HeaderProperties } from '../../src/Header';
import { HeaderCellProperties } from '../../src/HeaderCell';
import * as css from '../../src/styles/header.m.css';
import * as tableCss from '../../src/styles/shared/table.m.css';

let widget: Harness<HeaderProperties, typeof Header>;

registerSuite({
	name: 'Header',

	beforeEach() {
		widget = harness(Header);
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
			classes: widget.classes(css.header, css.headerRow),
			role: 'row'
		}, [
			v('table', {
				role: 'presentation',
				classes: widget.classes(tableCss.table, css.headerTable)
			}, [
				v('tr', [
					w<HeaderCellProperties>('header-cell', {
						column: { id: 'foo' },
						key: 'foo',
						onSortRequest: widget.listener,
						sortDetail: undefined,
						registry,
						theme: undefined
					}),
					w<HeaderCellProperties>('header-cell', {
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
			classes: widget.classes(css.header, css.headerRow),
			role: 'row'
		}, [
			v('table', {
				role: 'presentation',
				classes: widget.classes(tableCss.table, css.headerTable)
			}, [
				v('tr', [
					w<HeaderCellProperties>('header-cell', {
						column: { id: 'foo' },
						key: 'foo',
						onSortRequest: widget.listener,
						sortDetail: {
							columnId: 'foo'
						},
						registry,
						theme: undefined
					}),
					w<HeaderCellProperties>('header-cell', {
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
