import * as registerSuite from 'intern/lib/interfaces/object';
import { assert } from 'chai';
import { VNode } from '@dojo/interfaces/vdom';
import HeaderCell from '../../src/HeaderCell';

registerSuite({
	name: 'HeaderCell',
	render: {
		'renders sortable header cell with descending direction'() {
			let clicked = false;
			const properties = {
				onSortRequest() { clicked = true; },
				column: {
					id: 'id',
					label: 'foo',
					sortable: true
				},
				sortDetail: {
					columnId: 'id',
					descending: true
				},
				key: 'id'
			};
			const headerCell = new HeaderCell();
			headerCell.setProperties(properties);

			const vnode = <VNode> headerCell.__render__();
			vnode.properties!.onclick!.call(headerCell);

			assert.strictEqual(vnode.vnodeSelector, 'th');
			assert.isFunction(vnode.properties!.onclick);
			assert.isTrue(clicked);
			assert.equal(vnode.properties!['role'], 'columnheader');
			assert.lengthOf(vnode.children, 2);
			assert.equal(vnode.children![0].vnodeSelector, 'span');
			assert.equal(vnode.children![0].text, 'foo');
			assert.equal(vnode.children![1].vnodeSelector, 'div');
			assert.equal(vnode.children![1].properties!['role'], 'presentation');
		},
		'renders sortable header cell with ascending direction'() {
			let clicked = false;
			const properties = {
				onSortRequest() { clicked = true; },
				column: {
					id: 'id',
					label: 'foo',
					sortable: true
				},
				sortDetail: {
					columnId: 'id',
					descending: false
				},
				key: 'id'
			};
			const headerCell = new HeaderCell();
			headerCell.setProperties(properties);

			const vnode = <VNode> headerCell.__render__();
			vnode.properties!.onclick!.call(headerCell);

			assert.strictEqual(vnode.vnodeSelector, 'th');
			assert.isFunction(vnode.properties!.onclick);
			assert.isTrue(clicked);
			assert.equal(vnode.properties!['role'], 'columnheader');
			assert.lengthOf(vnode.children, 2);
			assert.equal(vnode.children![0].vnodeSelector, 'span');
			assert.equal(vnode.children![0].text, 'foo');
			assert.equal(vnode.children![1].vnodeSelector, 'div');
			assert.equal(vnode.children![1].properties!['role'], 'presentation');
		}
	}
});
