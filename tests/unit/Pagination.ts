import harness, { Harness } from '@dojo/test-extras/harness';
import { v, w } from '@dojo/widget-core/d';
import * as registerSuite from 'intern/lib/interfaces/object';
import PageLink from '../../src/pagination/PageLink';
import Pagination, { PaginationProperties } from '../../src/Pagination';
import * as css from '../../src/styles/pagination.m.css';

let widget: Harness<PaginationProperties, typeof Pagination>;

function noop() {}

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
			const childClasses = widget.classes(css.paginationStatus);
			const props = {
				page: 1,
				totalPageCount: 1,
				status: 'test message',
				onPageRequest: noop
			};

			widget.setProperties(props);

			widget.expectRender(v('div', {
				classes: widget.classes(css.pagination)
			}, [
				v('div', {
					classes: childClasses
				}, [ props.status ])
			]));
		},

		'multiple pages'() {
			// TODO: move `widget.classes` call inline when test-extras is fixed
			const statusClass = widget.classes(css.paginationStatus);
			const navigationClass = widget.classes(css.navigation);
			const pageLinksClass = widget.classes(css.pageLinks);
			const paginationClass = widget.classes(css.pagination);
			const props = {
				page: 1,
				totalPageCount: 2,
				status: 'test message',
				onPageRequest: noop
			};

			widget.setProperties(props);

			widget.expectRender(v('div', {
				classes: paginationClass
			}, [
				v('div', {
					classes: statusClass
				}, [ props.status ]),
				v('div', {
					classes: navigationClass
				}, [
					w<PageLink>('page-link', {
						key: 'previous',
						disabled: true,
						isArrow: true,
						label: '‹',
						page: 0,
						onPageRequest: widget.listener
					}),
					v('span', {
						classes: pageLinksClass
					}, [
						w<PageLink>('page-link', {
							key: '1',
							disabled: true,
							page: 1,
							onPageRequest: widget.listener
						}),
						w<PageLink>('page-link', {
							key: '2',
							disabled: false,
							page: 2,
							onPageRequest: widget.listener
						})
					]),
					w<PageLink>('page-link', {
						key: 'next',
						disabled: false,
						isArrow: true,
						label: '›',
						page: props.totalPageCount,
						onPageRequest: widget.listener
					})
				])
			]));
		},

		'middle page'() {
			// TODO: move `widget.classes` call inline when test-extras is fixed
			const statusClass = widget.classes(css.paginationStatus);
			const pageSkipClass = widget.classes(css.pageSkip);
			const navigationClass = widget.classes(css.navigation);
			const pageLinksClass = widget.classes(css.pageLinks);
			const paginationClass = widget.classes(css.pagination);
			const props = {
				page: 5,
				totalPageCount: 10,
				status: 'test message',
				onPageRequest: noop
			};

			widget.setProperties(props);

			widget.expectRender(v('div', {
				classes: paginationClass
			}, [
				v('div', {
					classes: statusClass
				}, [ props.status ]),
				v('div', {
					classes: navigationClass
				}, [
					w<PageLink>('page-link', {
						key: 'previous',
						disabled: false,
						isArrow: true,
						label: '‹',
						page: 4,
						onPageRequest: widget.listener
					}),
					v('span', {
						classes: pageLinksClass
					}, [
						w<PageLink>('page-link', {
							key: '1',
							disabled: false,
							page: 1,
							onPageRequest: widget.listener
						}),
						v('span', {
							afterCreate: widget.listener,
							afterUpdate: widget.listener,
							key: 'skip1',
							classes: pageSkipClass
						}, [ '...' ]),
						w<PageLink>('page-link', {
							key: '3',
							page: 3,
							onPageRequest: widget.listener
						}),
						w<PageLink>('page-link', {
							key: '4',
							page: 4,
							onPageRequest: widget.listener
						}),
						w<PageLink>('page-link', {
							key: '5',
							disabled: true,
							page: 5,
							onPageRequest: widget.listener
						}),
						w<PageLink>('page-link', {
							key: '6',
							page: 6,
							onPageRequest: widget.listener
						}),
						w<PageLink>('page-link', {
							key: '7',
							page: 7,
							onPageRequest: widget.listener
						}),
						v('span', {
							afterCreate: widget.listener,
							afterUpdate: widget.listener,
							key: 'skip2',
							classes: pageSkipClass
						}, [ '...' ]),
						w<PageLink>('page-link', {
							disabled: false,
							key: '10',
							page: 10,
							onPageRequest: widget.listener
						})
					]),
					w<PageLink>('page-link', {
						key: 'next',
						disabled: false,
						isArrow: true,
						label: '›',
						page: 6,
						onPageRequest: widget.listener
					})
				])
			]));
		}
	}
});
