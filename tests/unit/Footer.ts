import { assert } from 'chai';
import { v } from '@dojo/widget-core/d';
import { VNode } from '@dojo/interfaces/vdom';
import * as registerSuite from 'intern/lib/interfaces/object';
import Footer, { FooterProperties } from '../../src/Footer';
import * as footerCss from '../../src/styles/footer.m.css';

registerSuite({
	name: 'Footer',

	render: {
		'empty footer'() {
			const footer = new Footer();
			const vnode = <VNode> footer.__render__();

			assert.strictEqual(vnode.vnodeSelector, 'div');
			assert.isTrue(vnode.properties!.classes![footerCss.footer]);
		},

		'footer with children'() {
			const footer = new Footer();
			footer.setProperties(<any> {
				children: [
					v('div', [
						'test child1'
					]),
					v('div', [
						'test child2'
					])
				]
			});
			const vnode = <VNode> footer.__render__();

			assert.strictEqual(vnode.children![0]!.vnodeSelector, 'div');
			assert.strictEqual(vnode.children![0]!.text, 'test child1');
			assert.strictEqual(vnode.children![1]!.vnodeSelector, 'div');
			assert.strictEqual(vnode.children![1]!.text, 'test child2');
		}
	}
});
