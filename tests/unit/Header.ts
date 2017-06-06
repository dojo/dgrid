import * as registerSuite from 'intern!object';

import harness, { Harness } from '@dojo/test-extras/harness';
import { v } from '@dojo/widget-core/d';
import { HNode } from '@dojo/widget-core/interfaces';

import Header, { HeaderProperties } from '../../src/Header';
import * as css from '../../src/styles/header.m.css';

let widget: Harness<HeaderProperties, typeof Header>;

registerSuite({
	name: 'Header',

	beforeEach() {
		widget = harness(Header);
	},

	afterEach() {
		widget.destroy();
	},

	render: {
		'empty header'() {
			widget.expectRender(v('div', {
				classes: widget.classes(css.header)
			}));
		},

		'header with children'() {
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
				classes: widget.classes(css.header)
			}, children));
		}
	}
});
