import { assert } from 'chai';
import { v } from '@dojo/widget-core/d';
import { VNode } from '@dojo/interfaces/vdom';
import * as registerSuite from 'intern/lib/interfaces/object';
import Pagination from '../../src/Pagination';
import * as paginationCss from '../../src/styles/pagination.m.css';

const items = (function () {
	const items = [];

	for (let i = 0; i < 10; i++) {
		items.push({
			id: String(i),
			data: String(i)
		});
	}

	return items;
})();

registerSuite({
	name: 'Pagination',

	render: {
		'single page'() {
			const widget = new Pagination();
			widget.setProperties({
				items,
				pagination: {
					itemsPerPage: items.length
				},
				size: {
					start: 0,
					totalLength: items.length
				}
			});

			const vnode = <VNode> widget.__render__();
			assert.strictEqual(vnode.vnodeSelector, 'div');
			assert.isTrue(vnode.properties!.classes![paginationCss.pagination]);
			assert.strictEqual(vnode.children!.length, 1, 'Only status node should be displayed');

			const statusNode = vnode.children![0];
			assert.strictEqual(statusNode.text, `1 - ${items.length} of ${items.length} results`);
			assert.isTrue(statusNode.properties!.classes![paginationCss.status]);
		},

		'multiple pages'() {
			const itemsPerPage = 5;
			const widget = new Pagination();
			widget.setProperties({
				items,
				pagination: {
					itemsPerPage
				},
				size: {
					start: 0,
					totalLength: items.length
				}
			});

			const vnode = <VNode> widget.__render__();
			const statusNode = vnode.children![0];
			assert.strictEqual(statusNode.text, `1 - ${itemsPerPage} of ${items.length} results`);

			const navigationNode = vnode.children![1];
			assert.isTrue(navigationNode.properties!.classes![paginationCss.navigation]);
			assert.strictEqual(navigationNode.children!.length, 3, 'navigation node should have 3 children');

			const previousLink = navigationNode.children![0];
			assert.isTrue(previousLink.properties!.classes![paginationCss.pageLink]);
			assert.isTrue(previousLink.properties!.classes![paginationCss.previous]);
			assert.strictEqual(previousLink.text, '‹');

			const pageLinks = navigationNode.children![1];
			assert.isTrue(pageLinks.properties!.classes![paginationCss.pageLinks]);
			assert.strictEqual(pageLinks.children!.length, 2, 'pageLinks node should have 2 children');

			const nextLink = navigationNode.children![2];
			assert.isTrue(nextLink.properties!.classes![paginationCss.pageLink]);
			assert.isTrue(nextLink.properties!.classes![paginationCss.next]);
			assert.strictEqual(nextLink.text, '›');
		},

		'middle page'() {
			const itemsPerPage = 1;
			const widget = new Pagination();
			widget.setProperties({
				items,
				pagination: {
					itemsPerPage
				},
				size: {
					start: 4,
					totalLength: items.length
				}
			});

			const vnode = <VNode> widget.__render__();
			console.dir(vnode);
			const pageLinks = vnode.children![1].children![1];
			assert.strictEqual(pageLinks.children!.length, 9, 'pageLinks node should have 9 children');

			assert.strictEqual(pageLinks.children![0].properties!.page, '1');
			assert.strictEqual(pageLinks.children![0].properties!.tabindex, '0');
			assert.strictEqual(pageLinks.children![0].text, '1');
			assert.isTrue(pageLinks.children![0].properties!.classes![paginationCss.pageLink]);
			assert.notOk(pageLinks.children![0].properties!.classes![paginationCss.disabled]);

			assert.strictEqual(pageLinks.children![1].text, '...');
			assert.notOk(pageLinks.children![1].properties!.classes![paginationCss.pageLink]);
			assert.isTrue(pageLinks.children![1].properties!.classes![paginationCss.pageSkip]);

			assert.strictEqual(pageLinks.children![2].properties!.tabindex, '0');
			assert.strictEqual(pageLinks.children![2].text, '3');
			assert.isTrue(pageLinks.children![2].properties!.classes![paginationCss.pageLink]);
			assert.notOk(pageLinks.children![2].properties!.classes![paginationCss.disabled]);

			assert.strictEqual(pageLinks.children![3].properties!.tabindex, '0');
			assert.strictEqual(pageLinks.children![3].text, '4');
			assert.isTrue(pageLinks.children![3].properties!.classes![paginationCss.pageLink]);
			assert.notOk(pageLinks.children![3].properties!.classes![paginationCss.disabled]);

			assert.strictEqual(pageLinks.children![4].properties!.tabindex, '-1');
			assert.strictEqual(pageLinks.children![4].text, '5');
			assert.isTrue(pageLinks.children![4].properties!.classes![paginationCss.pageLink]);
			assert.isTrue(pageLinks.children![4].properties!.classes![paginationCss.disabled]);

			assert.strictEqual(pageLinks.children![5].properties!.tabindex, '0');
			assert.strictEqual(pageLinks.children![5].text, '6');
			assert.isTrue(pageLinks.children![5].properties!.classes![paginationCss.pageLink]);
			assert.notOk(pageLinks.children![5].properties!.classes![paginationCss.disabled]);

			assert.strictEqual(pageLinks.children![6].properties!.tabindex, '0');
			assert.strictEqual(pageLinks.children![6].text, '7');
			assert.isTrue(pageLinks.children![6].properties!.classes![paginationCss.pageLink]);
			assert.notOk(pageLinks.children![6].properties!.classes![paginationCss.disabled]);

			assert.strictEqual(pageLinks.children![7].text, '...');
			assert.notOk(pageLinks.children![7].properties!.classes![paginationCss.pageLink]);
			assert.isTrue(pageLinks.children![7].properties!.classes![paginationCss.pageSkip]);

			assert.strictEqual(pageLinks.children![8].properties!.page, '10');
			assert.strictEqual(pageLinks.children![8].properties!.tabindex, '0');
			assert.strictEqual(pageLinks.children![8].text, '10');
			assert.isTrue(pageLinks.children![8].properties!.classes![paginationCss.pageLink]);
			assert.notOk(pageLinks.children![8].properties!.classes![paginationCss.disabled]);
		}
	}
});
