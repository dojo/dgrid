import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';

import harness, { Harness } from '@dojo/test-extras/harness';
import { assignChildProperties, assignProperties } from '@dojo/test-extras/support/d';
import { registry, v } from '@dojo/widget-core/d';

import ColumnHeaderCell, { ColumnHeaderCellProperties } from '../../src/ColumnHeaderCell';
import { SortDetails } from '../../src/interfaces';
import * as cellCss from '../../src/styles/shared/cell.m.css';
import * as css from '../../src/styles/columnHeaderCell.m.css';

let widget: Harness<ColumnHeaderCellProperties, typeof ColumnHeaderCell>;

registerSuite({
	name: 'ColumnHeaderCell',

	beforeEach() {
		widget = harness(ColumnHeaderCell);
	},

	afterEach() {
		widget.destroy();
	},

	'Renders unsortable header cell'() {
		let sorted = false;
		widget.setProperties({
			column: {
				id: 'id',
				label: 'foo',
				sortable: false
			},
			key: 'id',
			onSortRequest: function() {
				sorted = true;
			},
			registry
		});

		const expected = v('th', {
			classes: widget.classes(cellCss.cell, css.columnHeaderCell),
			role: 'columnheader'
		}, [
			v('span', [
				'foo'
			]),
			null
		]);

		widget.expectRender(expected);
		widget.sendEvent('click');
		assert.isFalse(sorted);
	},

	'Renders sortable header cell when column.sortable not explicitly false and adds arrows when clicked'() {
		let sorted = false;
		const properties: ColumnHeaderCellProperties = {
			column: {
				id: 'foo'
			},
			key: 'foo',
			onSortRequest(updatedSortDetail: SortDetails) {
				sorted = true;
				properties.sortDetail = updatedSortDetail;
				assert.equal(updatedSortDetail.columnId, 'foo');
				assert.equal(updatedSortDetail.direction, 'asc');
			},
			registry
		};
		widget.setProperties(properties);

		const expected = v('th', {
			classes: widget.classes(cellCss.cell, css.columnHeaderCell, css.sortable),
			onclick: widget.listener,
			role: 'columnheader'
		}, [
			v('span', [
				'foo'
			]),
			null
		]);

		widget.expectRender(expected);

		widget.sendEvent('click');

		assert.isTrue(sorted);

		expected.children = [
			v('span', [
				'foo'
			]),
			v('div', {
				role: 'presentation',
				classes: widget.classes(css.sortArrow, css.sortArrowUp)
			})
		];
		assignProperties(expected, {
			classes: widget.classes(cellCss.cell, css.columnHeaderCell, css.sortable)
		});

		widget.expectRender(expected);
	},

	'Renders sortable header cell with default (undefined) ascending direction'() {
		let sorted = false;
		const sortDetail: SortDetails = {
			columnId: 'id'
		};
		const properties: ColumnHeaderCellProperties = {
			column: {
				id: 'id',
				label: 'foo',
				sortable: true
			},
			key: 'id',
			onSortRequest(updatedSortDetail: SortDetails) {
				sorted = true;
				properties.sortDetail = updatedSortDetail;
				assert.equal(updatedSortDetail.columnId, 'id');
				assert.equal(updatedSortDetail.direction, 'desc');
			},
			registry,
			sortDetail
		};
		widget.setProperties(properties);

		const expected = v('th', {
			classes: widget.classes(cellCss.cell, css.columnHeaderCell, css.sortable),
			onclick: widget.listener,
			role: 'columnheader'
		}, [
			v('span', [
				'foo'
			]),
			v('div', {
				role: 'presentation',
				classes: widget.classes(css.sortArrow, css.sortArrowUp)
			})
		]);

		widget.expectRender(expected);

		widget.sendEvent('click');

		assert.isTrue(sorted);

		assignChildProperties(expected, 1, {
			classes: widget.classes(css.sortArrow, css.sortArrowDown)
		});
		assignProperties(expected, {
			classes: widget.classes(cellCss.cell, css.columnHeaderCell, css.sortable)
		});

		widget.expectRender(expected);
	},

	'Renders sortable header cell with explicit ascending direction'() {
		let sorted = false;
		const sortDetail: SortDetails = {
			columnId: 'id',
			direction: 'asc'
		};
		const properties: ColumnHeaderCellProperties = {
			column: {
				id: 'id',
				label: 'foo',
				sortable: true
			},
			key: 'id',
			onSortRequest(updatedSortDetail: SortDetails) {
				sorted = true;
				assert.equal(updatedSortDetail.columnId, 'id');
				assert.equal(updatedSortDetail.direction, 'desc');
			},
			registry,
			sortDetail
		};
		widget.setProperties(properties);

		const expected = v('th', {
			classes: widget.classes(cellCss.cell, css.columnHeaderCell, css.sortable),
			onclick: widget.listener,
			role: 'columnheader'
		}, [
			v('span', [
				'foo'
			]),
			v('div', {
				role: 'presentation',
				classes: widget.classes(css.sortArrow, css.sortArrowUp)
			})
		]);

		widget.expectRender(expected);

		widget.sendEvent('click');

		assert.isTrue(sorted);

		assignChildProperties(expected, 1, {
			classes: widget.classes(css.sortArrow, css.sortArrowDown)
		});
		assignProperties(expected, {
			classes: widget.classes(cellCss.cell, css.columnHeaderCell, css.sortable)
		});

		properties.sortDetail = { ...properties.sortDetail, direction: 'desc' };
		widget.setProperties(properties);

		widget.expectRender(expected);
	},

	'Renders sortable header cell with descending direction'() {
		let clicked = false;
		const sortDetail: SortDetails = {
			columnId: 'id',
			direction: 'desc'
		};
		const properties = {
			column: {
				id: 'id',
				label: 'foo',
				sortable: true
			},
			key: 'id',
			onSortRequest(updatedSortDetail: SortDetails) {
				clicked = true;
				properties.sortDetail = updatedSortDetail;
				assert.equal(updatedSortDetail.columnId, 'id');
				assert.equal(updatedSortDetail.direction, 'asc');
			},
			registry,
			sortDetail
		};
		widget.setProperties(properties);

		const expected = v('th', {
			classes: widget.classes(cellCss.cell, css.columnHeaderCell, css.sortable),
			onclick: widget.listener,
			role: 'columnheader'
		}, [
			v('span', [
				'foo'
			]),
			v('div', {
				role: 'presentation',
				classes: widget.classes(css.sortArrow, css.sortArrowDown)
			})
		]);

		widget.expectRender(expected);

		widget.sendEvent('click');

		assert.isTrue(clicked);

		assignChildProperties(expected, 1, {
			classes: widget.classes(css.sortArrow, css.sortArrowUp)
		});
		assignProperties(expected, {
			classes: widget.classes(cellCss.cell, css.columnHeaderCell, css.sortable)
		});

		widget.expectRender(expected);
	}
});
