import { VNode } from '@dojo/interfaces/vdom';
import WidgetBase from '@dojo/widget-core/WidgetBase';
import WidgetRegistry from '@dojo/widget-core/WidgetRegistry';
import { assert } from 'chai';
import * as registerSuite from 'intern/lib/interfaces/object';
import { SinonSpy, spy, stub } from 'sinon';
import { cleanProperties, spyOnWidget } from '../support/util';
import Header from '../../src/Header';
import { HeaderCellProperties } from '../../src/HeaderCell';

let mockRegistry: WidgetRegistry;
let setProperties: SinonSpy | null = null;
let widgetBaseSpy: SinonSpy;

registerSuite({
	name: 'Header',
	beforeEach() {
		setProperties = null;
		widgetBaseSpy = spyOnWidget(WidgetBase, (prototype) => {
			setProperties = spy(prototype, 'setProperties');
		});
		mockRegistry = <any> {
			get: stub().withArgs('header-cell').returns(widgetBaseSpy),
			has() {
				return true;
			}
		};
	},
	render() {
		const properties = {
			registry: mockRegistry,
			columns: [
				{ id: 'foo', label: 'foo' },
				{ id: 'bar', label: 'bar' }
			]
		};

		const header = new Header();
		header.setProperties(<any> properties);
		const vnode = <VNode> header.__render__();

		assert.strictEqual(vnode.vnodeSelector, 'div');
		assert.strictEqual(vnode.properties!['role'], 'row');
		assert.lengthOf(vnode.children, 1);
		assert.strictEqual(vnode.children![0].vnodeSelector, 'table');
		assert.strictEqual(vnode.children![0].properties!['role'], 'presentation');
		assert.lengthOf(vnode.children![0].children, 1);
		assert.strictEqual(vnode.children![0].children![0].vnodeSelector, 'tr');
		assert.lengthOf(vnode.children![0].children![0].children, 2);
		assert.isTrue(widgetBaseSpy.calledTwice, 'WidgetBase called twice');
		assert.isTrue(widgetBaseSpy.calledWithNew(), 'WidgetBase called with new');
		assert.isNotNull(setProperties);
		assert.isTrue(setProperties!.calledTwice, 'setProperties called twice');
		let headerCellProperties = cleanProperties<HeaderCellProperties>(setProperties!.getCall(0).args[0]);
		assert.isUndefined(headerCellProperties.onSortRequest);
		delete headerCellProperties.onSortRequest;
		assert.deepEqual(headerCellProperties, {
			key: 'foo',
			column: properties.columns[0],
			sortDetail: undefined,
			theme: undefined
		});
		headerCellProperties = cleanProperties<HeaderCellProperties>(setProperties!.getCall(1).args[0]);
		assert.isUndefined(headerCellProperties.onSortRequest);
		delete headerCellProperties.onSortRequest;
		assert.deepEqual(headerCellProperties, {
			key: 'bar',
			column: properties.columns[1],
			sortDetail: undefined,
			theme: undefined
		});
	},
	sorted() {
		const properties = {
			registry: mockRegistry,
			sortDetails: [ { columnId: 'foo', descending: false } ],
			columns: [
				{ id: 'foo', label: 'foo' },
				{ id: 'bar', label: 'bar' }
			]
		};

		const header = new Header();
		header.setProperties(<any> properties);
		const vnode = <VNode> header.__render__();

		assert.strictEqual(vnode.vnodeSelector, 'div');
		assert.strictEqual(vnode.properties!['role'], 'row');
		assert.lengthOf(vnode.children, 1);
		assert.strictEqual(vnode.children![0].vnodeSelector, 'table');
		assert.strictEqual(vnode.children![0].properties!['role'], 'presentation');
		assert.lengthOf(vnode.children![0].children, 1);
		assert.strictEqual(vnode.children![0].children![0].vnodeSelector, 'tr');
		assert.lengthOf(vnode.children![0].children![0].children, 2);
		assert.isTrue(widgetBaseSpy.calledTwice, 'WidgetBase called twice');
		assert.isTrue(widgetBaseSpy.calledWithNew(), 'WidgetBase called with new');
		assert.isNotNull(setProperties);
		assert.isTrue(setProperties!.calledTwice, 'setProperties called twice');
		let headerCellProperties = cleanProperties<HeaderCellProperties>(setProperties!.getCall(0).args[0]);
		assert.isUndefined(headerCellProperties.onSortRequest);
		delete headerCellProperties.onSortRequest;
		assert.deepEqual(headerCellProperties, {
			key: 'foo',
			column: properties.columns[0],
			sortDetail: properties.sortDetails[0],
			theme: undefined
		});
		headerCellProperties = cleanProperties<HeaderCellProperties>(setProperties!.getCall(1).args[0]);
		assert.isUndefined(headerCellProperties.onSortRequest);
		delete headerCellProperties.onSortRequest;
		assert.deepEqual(headerCellProperties, {
			key: 'bar',
			column: properties.columns[1],
			sortDetail: undefined,
			theme: undefined
		});
	}
});
