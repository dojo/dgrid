import { assert } from 'chai';
import harness, { assignProperties, assignChildProperties, Harness, replaceChild } from '@dojo/test-extras/harness';
import { v, w } from '@dojo/widget-core/d';
import { VNode } from '@dojo/interfaces/vdom';
import * as registerSuite from 'intern/lib/interfaces/object';
import PageLink from '../../src/pagination/PageLink';
import Pagination, { PaginationProperties } from '../../src/Pagination';
import * as css from '../../src/styles/pagination.m.css';

let widget: Harness<PaginationProperties, typeof Pagination>;

registerSuite({
	name: 'Pagination',

	beforeEach() {
		widget = harness(Pagination);
	},

	afterEach() {
		widget.destroy();
	},

	render: {
		'single page'() {
			// TODO: move `widget.classes` call inline when test-extras is fixed
			const childClasses = widget.classes(css.status);
			const props = {
				page: 1,
				pages: 1,
				statusMessage: 'test message'
			};

			widget.setProperties(props);

			widget.expectRender(v('div', {
				classes: widget.classes(css.pagination)
			}, [
				v('div', {
					classes: childClasses
				}, [ props.statusMessage ])
			]));
		},

		'multiple pages'() {
			// TODO: move `widget.classes` call inline when test-extras is fixed
			const statusClass = widget.classes(css.status);
			const navigationClass = widget.classes(css.navigation);
			const pageLinksClass = widget.classes(css.pageLinks);
			const paginationClass = widget.classes(css.pagination);
			const props = {
				page: 1,
				pages: 2,
				statusMessage: 'test message'
			};

			widget.setProperties(props);

			widget.expectRender(v('div', {
				classes: paginationClass
			}, [
				v('div', {
					classes: statusClass
				}, [ props.statusMessage ]),
				v('div', {
					classes: navigationClass
				}, [
					w(PageLink, {
						key: 'previous',
						disabled: true,
						isArrow: true,
						label: '‹',
						page: 0
					}),
					v('span', {
						classes: pageLinksClass
					}, [
						w(PageLink, {
							key: '1',
							disabled: true,
							page: 1
						}),
						w(PageLink, {
							key: '2',
							disabled: false,
							page: 2
						})
					]),
					w(PageLink, {
						key: 'next',
						disabled: false,
						isArrow: true,
						label: '›',
						page: props.pages
					})
				])
			]));
		}/*,

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
		}*/
	}
});
