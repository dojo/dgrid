import { assert } from 'chai';
import { v } from '@dojo/widget-core/d';
import { VNode } from '@dojo/interfaces/vdom';
import * as registerSuite from 'intern/lib/interfaces/object';
import Pagination from '../../src/Pagination';
import * as paginationCss from '../../src/styles/pagination.m.css';

const items = [
	{
		id: '0',
		data: '0'
	},
	{
		id: '1',
		data: '1'
	}
];

registerSuite({
	name: 'Pagination',

	render: {
		'single page'() {
			const widget = new Pagination();
			widget.setProperties({
				items,
				pagination: {
					itemsPerPage: 10
				},
				size: {
					start: 0,
					totalLength: 2
				}
			});
			const vnode = <VNode> widget.__render__();

			assert.strictEqual(vnode.vnodeSelector, 'div');
			assert.isTrue(vnode.properties!.classes![paginationCss.pagination]);
			assert.strictEqual(vnode.children!.length, 1);

			const statusNode = vnode.children![0];
			assert.strictEqual(statusNode.text, '1 - 2 of 2 results');
			assert.isTrue(statusNode.properties!.classes![paginationCss.status]);
		},

		'multiple pages'() {
			const widget = new Pagination();
			widget.setProperties({
				items,
				pagination: {
					itemsPerPage: 1
				},
				size: {
					start: 0,
					totalLength: 2
				}
			});
			const vnode = <VNode> widget.__render__();

			const statusNode = vnode.children![0];
			assert.strictEqual(statusNode.text, '1 - 1 of 2 results');

			const navigationNode = vnode.children![1];
			assert.isTrue(navigationNode.properties!.classes![paginationCss.navigation]);
			assert.strictEqual(navigationNode.children!.length, 3);

			const previousLink = navigationNode.children![0];
			assert.isTrue(previousLink.properties!.classes![paginationCss.pageLink]);
			assert.isTrue(previousLink.properties!.classes![paginationCss.previous]);
			assert.strictEqual(previousLink.text, '‹');

			const pageLinks = navigationNode.children![1];
			assert.isTrue(pageLinks.properties!.classes![paginationCss.pageLinks]);
			assert.strictEqual(pageLinks.children!.length, 3);

			const nextLink = navigationNode.children![2];
			assert.isTrue(nextLink.properties!.classes![paginationCss.pageLink]);
			assert.isTrue(nextLink.properties!.classes![paginationCss.next]);
			assert.strictEqual(nextLink.text, '›');
		}
	}
});
