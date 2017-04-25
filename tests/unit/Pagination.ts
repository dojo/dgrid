import { assert } from 'chai';
import harness, { assignProperties, assignChildProperties, Harness, replaceChild } from '@dojo/test-extras/harness';
import { v } from '@dojo/widget-core/d';
import { VNode } from '@dojo/interfaces/vdom';
import * as registerSuite from 'intern/lib/interfaces/object';
import Pagination, { PaginationProperties } from '../../src/Pagination';
import * as css from '../../src/styles/pagination.m.css';

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

let widget: Harness<PaginationProperties, typeof Pagination>;

registerSuite({
	name: 'Pagination',

	beforEach() {
		widget = harness(Pagination);
	},

	afterEach() {
		widget.destroy();
	},

	render: {
		'single page'() {
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

			widget.expectRender(v('div', {
				classes: widget.classes(css.pagination)
			}, [
				v('span', {
					classes: widget.classes(css.status)
				}, [ `1 - ${items.length} of ${items.length} results` ])
			]));
		},

		'multiple pages'() {
			const itemsPerPage = 5;

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

			widget.expectRender(v('div', {
				classes: widget.classes(css.pagination)
			}, [
				v('span', {
					classes: widget.classes(css.status)
				}, [ `1 - ${itemsPerPage} of ${items.length} results` ]),
				v('span', {
					classes: widget.classes(css.navigation)
				}, [
					v('span', {
						classes: widget.classes(css.pageLink, css.arrow)
					}, [ '‹' ]),
					v('span', {
						classes: widget.classes(css.pageLinks)
					}), // TODO: children
					v('span', {
						classes: widget.classes(css.pageLink, css.arrow)
					}, [ '›' ])
				])
			]));

			// assert.strictEqual(pageLinks.children!.length, 2, 'pageLinks node should have 2 children');
		},

		'middle page'() {
			const itemsPerPage = 1;

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

			widget.expectRender(v('div', {
				classes: widget.classes(css.pagination)
			}, [
				v('span', {
					classes: widget.classes(css.status)
				}, [ `1 - ${itemsPerPage} of ${items.length} results` ]),
				v('span', {
					classes: widget.classes(css.navigation)
				}, [
					v('span', {
						classes: widget.classes(css.pageLink, css.arrow)
					}, [ '‹' ]),
					v('span', {
						classes: widget.classes(css.pageLinks)
					}, [
						v('span', {
							classes: widget.classes(css.pageLink),
							tabIndex: 0
						}, [ '1' ]),
						v('span', {
							classes: widget.classes(css.pageSkip)
						}, [ '...' ]),
						v('span', {
							classes: widget.classes(css.pageLink),
							tabIndex: 0
						}, [ '3' ]),
						v('span', {
							classes: widget.classes(css.pageLink),
							tabIndex: 0
						}, [ '4' ]),
						v('span', {
							classes: widget.classes(css.pageLink),
							tabIndex: -1
						}, [ '5' ]),
						v('span', {
							classes: widget.classes(css.pageLink),
							tabIndex: 0
						}, [ '6' ]),
						v('span', {
							classes: widget.classes(css.pageLink),
							tabIndex: 0
						}, [ '7' ]),
						v('span', {
							classes: widget.classes(css.pageSkip)
						}, [ '...' ]),
						v('span', {
							classes: widget.classes(css.pageLink),
							tabIndex: 0
						}, [ '10' ])
					]),
					v('span', {
						classes: widget.classes(css.pageLink, css.arrow)
					}, [ '›' ])
				])
			]));
		}
	}
});
