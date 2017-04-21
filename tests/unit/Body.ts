import * as registerSuite from 'intern!object';

import harness, { Harness } from '@dojo/test-extras/harness';
import { registry, v, w } from '@dojo/widget-core/d';

import Body, { BodyProperties } from '../../src/Body';
import { ItemProperties, Column } from '../../src/interfaces';
import { RowProperties } from '../../src/Row';
import * as css from '../../src/styles/body.m.css';

let widget: Harness<BodyProperties, typeof Body>;

registerSuite({
	name: 'Body',

	beforeEach() {
		widget = harness(Body);
	},

	afterEach() {
		widget.destroy();
	},

	'Simple item'() {
		const columns: Column<any>[] = [
			{ id: 'foo' },
			{ id: 'bar' }
		];
		const item: ItemProperties<any> = {
			id: '1',
			data: {
				id: 1,
				foo: 'foo',
				bar: 'bar'
			}
		};
		widget.setProperties({
			columns,
			items: [ item ],
			registry
		});

		widget.expectRender(v('div', {
			classes: widget.classes(css.scroller)
		}, [
			v('div', {
				classes: widget.classes(css.content)
			}, [
				w<RowProperties>('row', {
					columns,
					item,
					key: item.id,
					registry,
					theme: undefined
				})
			])
		]));
	}
});
