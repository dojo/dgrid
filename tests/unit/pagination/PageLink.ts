import { assert } from 'chai';
import harness, { Harness } from '@dojo/test-extras/harness';
import { v } from '@dojo/widget-core/d';
import * as registerSuite from 'intern/lib/interfaces/object';
import PageLink, { PageLinkProperties } from '../../../src/pagination/PageLink';
import * as css from '../../../src/styles/pagination.m.css';

let widget: Harness<PageLinkProperties, typeof PageLink>;

function noop () {}

registerSuite({
	name: 'PageLink',

	beforeEach() {
		widget = harness(PageLink);
	},

	afterEach() {
		widget.destroy();
	},

	render: {
		simple() {
			widget.setProperties({
				onPageRequest: noop,
				page: 1
			});

			widget.expectRender(v('span', {
				classes: widget.classes(css.pageLink),
				onclick: widget.listener,
				tabindex: '0'
			}, [ '1' ]));
		},

		disabled() {
			widget.setProperties({
				disabled: true,
				onPageRequest: noop,
				page: 1
			});

			widget.expectRender(v('span', {
				classes: widget.classes(css.pageLink, css.disabled),
				onclick: widget.listener,
				tabindex: '-1'
			}, [ '1' ]));
		},

		arrow() {
			widget.setProperties({
				isArrow: true,
				onPageRequest: noop,
				page: 1
			});

			widget.expectRender(v('span', {
				classes: widget.classes(css.pageLink, css.paginationArrow),
				onclick: widget.listener,
				tabindex: '0'
			}, [ '1' ]));
		},

		label() {
			widget.setProperties({
				label: 'a',
				onPageRequest: noop,
				page: 1
			});

			widget.expectRender(v('span', {
				classes: widget.classes(css.pageLink),
				onclick: widget.listener,
				tabindex: '0'
			}, [ 'a' ]));
		},

		'onclick: enabled'() {
			const page = 5;
			let pageRequested = 0;

			widget.setProperties({
				page,
				onPageRequest: function (page: number) {
					pageRequested = page;
				}
			});
			widget.sendEvent('click');

			assert.strictEqual(pageRequested, page, 'Click event should call handler with page number');
		},

		'onclick: disabled'() {
			let pageRequested = 0;

			widget.setProperties({
				disabled: true,
				page: 5,
				onPageRequest: function (page: number) {
					pageRequested = page;
				}
			});
			widget.sendEvent('click');

			assert.strictEqual(pageRequested, 0, 'Click event should not call handler');
		}
	}
});
