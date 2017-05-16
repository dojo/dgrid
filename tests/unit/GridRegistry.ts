import * as registerSuite from 'intern/lib/interfaces/object';
import { assert } from 'chai';

import WidgetBase from '@dojo/widget-core/WidgetBase';

import GridRegistry, { GridRegistered, gridRegistry } from '../../src/GridRegistry';
import Header, { HeaderProperties } from '../../src/Header';
import HeaderCell from '../../src/HeaderCell';
import Body from '../../src/Body';
import Row from '../../src/Row';
import Cell from '../../src/Cell';
import Footer from '../../src/Footer';

registerSuite({
	name: 'GridRegistry',

	'GridRegistry'() {
		assert.equal(gridRegistry.get('body'), Body);
		assert.equal(gridRegistry.get('cell'), Cell);
		assert.equal(gridRegistry.get('footer'), Footer);
		assert.equal(gridRegistry.get('header'), Header);
		assert.equal(gridRegistry.get('header-cell'), HeaderCell);
		assert.equal(gridRegistry.get('row'), Row);
	},

	'Additional type'() {
		class Header2 extends WidgetBase<HeaderProperties> {}

		interface MoreRegistered extends GridRegistered {
			header: typeof Header2;
		}

		const gridRegistry2 = new GridRegistry<MoreRegistered>();
		gridRegistry2.define('header', Header2);
		assert.equal(gridRegistry2.get('header'), Header2);
	}
});
