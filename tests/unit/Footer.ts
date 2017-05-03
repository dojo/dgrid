import * as registerSuite from 'intern!object';

import harness, { Harness } from '@dojo/test-extras/harness';
import { v } from '@dojo/widget-core/d';
import { HNode } from '@dojo/widget-core/interfaces';

import Footer, { FooterProperties } from '../../src/Footer';
import * as css from '../../src/styles/footer.m.css';

let widget: Harness<FooterProperties, typeof Footer>;

registerSuite({
	name: 'Footer',

	beforeEach() {
		widget = harness(Footer);
	},

	afterEach() {
		widget.destroy();
	},

	render: {
		'empty footer'() {
			widget.expectRender(v('div', {
				classes: widget.classes(css.footer)
			}));
		},

		'footer with children'() {
			const children: HNode[] = [
				v('div', [
					'test child1'
				]),
				v('div', [
					'test child2'
				])
			];

			widget.setChildren(children);
			widget.expectRender(v('div', {
				classes: widget.classes(css.footer)
			}, children));
		}
	}
});
