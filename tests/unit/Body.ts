import * as registerSuite from 'intern!object';

import harness, { Harness } from '@dojo/test-extras/harness';
import { registry, v, w } from '@dojo/widget-core/d';

import Body, { BodyProperties } from '../../src/Body';
import { ItemProperties, Column } from '../../src/interfaces';
import Row from '../../src/Row';
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
			index: 0,
			data: {
				id: 1,
				foo: 'foo',
				bar: 'bar'
			}
		};
		widget.setProperties({
			columns,
			items: [ item ],
			onSliceRequest: widget.listener,
			registry,
			size: {
				dataLength: 2,
				totalLength: 2
			}
		});

		widget.expectRender(v('div', {
			afterCreate: widget.listener,
			afterUpdate: widget.listener,
			classes: widget.classes(css.scroller),
			key: 'scroller',
			onscroll: widget.listener
		}, [
			v('div', {
				afterCreate: widget.listener,
				afterUpdate: widget.listener,
				key: '1'
			}, [
				w<Row>('row', {
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
