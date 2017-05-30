import * as registerSuite from 'intern!object';

import harness, { Harness } from '@dojo/test-extras/harness';
import { registry, v } from '@dojo/widget-core/d';

import Cell, { CellProperties } from '../../src/Cell';
import { Column, ItemProperties } from '../../src/interfaces';
import * as cellCss from '../../src/styles/shared/cell.m.css';
import * as css from '../../src/styles/cell.m.css';

const column: Column<any> = {
	id: 'column'
};
const item: ItemProperties<any> = {
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

	'Cell value used for child node'() {
		widget.setProperties({
			column,
			key: column.id,
			item,
			registry,
			value: 'Hello, World!'
		});

		widget.expectRender(v('td', {
			role: 'gridcell',
			classes: widget.classes(cellCss.cell, css.rowCell)
		}, [
			'Hello, World!'
		]));
	},

	'Cell value missing'() {
		widget.setProperties(<any> {
			column,
			item,
			registry
		});

		widget.expectRender(v('td', {
			role: 'gridcell',
			classes: widget.classes(cellCss.cell, css.rowCell)
		}, [
			''
		]));
	},

	'Cell value is stringified'() {
		widget.setProperties({
			column,
			key: column.id,
			item,
			registry,
			value: <any> 1234
		});

		widget.expectRender(v('td', {
			role: 'gridcell',
			classes: widget.classes(cellCss.cell, css.rowCell)
		}, [
			'1234'
		]));
	}
});
