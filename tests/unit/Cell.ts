import * as registerSuite from 'intern/lib/interfaces/object';
import { assert } from 'chai';
import { VNode } from '@dojo/interfaces/vdom';
import Cell from '../../src/Cell';

registerSuite({
	name: 'Cell',
	render: {
		'data property used as cell text node'() {
			const cell = new Cell();
			cell.setProperties(<any> { value: 'Hello, World!' });

			const vnode = <VNode> cell.__render__();
			assert.strictEqual(vnode.vnodeSelector, 'td');
			assert.strictEqual(vnode.text, 'Hello, World!');
		},
		'null is returned when no data property'() {
			const cell = new Cell();

			const vnode = <VNode> cell.__render__();
			assert.strictEqual(vnode.vnodeSelector, 'td');
			assert.isUndefined(vnode.text);
		},
		'cell data is stringified'() {
			const cell = new Cell();
			cell.setProperties(<any> { value: <any> 1234 });

			const vnode = <VNode> cell.__render__();
			assert.strictEqual(vnode.vnodeSelector, 'td');
			assert.strictEqual(vnode.text, '1234');
		}
	}
});
