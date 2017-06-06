import * as registerSuite from 'intern!object';

import harness, { Harness } from '@dojo/test-extras/harness';
import { registry, v } from '@dojo/widget-core/d';

import Cell, { CellProperties } from '../../src/Cell';
import { Column, ItemProperties } from '../../src/interfaces';
import * as cellCss from '../../src/styles/shared/cell.m.css';
import * as css from '../../src/styles/cell.m.css';

const column: Column = {
	id: 'column'
};
const item: ItemProperties = {
	id: 'item',
	index: 0,
	data: {}
};
let widget: Harness<CellProperties, typeof Cell>;

registerSuite({
	name: 'Cell',

	beforeEach() {
		widget = harness(Cell);
	},

	afterEach() {
		widget.destroy();
	},

	'Cell content used for child node'() {
		widget.setProperties({
			column,
			content: 'Hello, World!',
			key: column.id,
			item,
			registry,
			value: 'unexpected'
		});

		widget.expectRender(v('td', {
			role: 'gridcell',
			classes: widget.classes(cellCss.cell, css.rowCell)
		}, [
			'Hello, World!'
		]));
	}
});
