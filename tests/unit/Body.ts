import { VNode } from '@dojo/interfaces/vdom';
import FactoryRegistry from '@dojo/widget-core/FactoryRegistry';
import WidgetBase from '@dojo/widget-core/WidgetBase';
import * as registerSuite from 'intern/lib/interfaces/object';
import { assert } from 'chai';
import { spy, stub, SinonSpy } from 'sinon';
import { spyOnWidget, cleanProperties } from '../support/util';
import Body, { BodyProperties } from '../../src/Body';
import { RowProperties } from '../../src/Row';

let mockRegistry: FactoryRegistry;
let setProperties: SinonSpy | null = null;
let widgetBaseSpy: SinonSpy;

registerSuite({
	name: 'Body',
	beforeEach() {
		setProperties = null;
		widgetBaseSpy = spyOnWidget(WidgetBase, (prototype) => {
			setProperties = spy(prototype, 'setProperties');
		});
		mockRegistry = <any> {
			get: stub().withArgs('row').returns(widgetBaseSpy),
			has() {
				return true;
			}
		};
	},
	'render with items'() {
		const items = [
			{
				id: 'id',
				data: { id: 'id', foo: 'bar' }
			}
		];
		const properties: BodyProperties = {
			registry: mockRegistry,
			items,
			columns: [
				{ id: 'foo', label: 'foo' }
			]
		};

		const body = new Body();
		body.setProperties(properties);
		const promise = new Promise((resolve) => setTimeout(resolve, 10));

		return promise.then(() => {
			const vnode = <VNode> body.__render__();

			assert.strictEqual(vnode.vnodeSelector, 'div');
			assert.lengthOf(vnode.children, 1);
			assert.equal(vnode.children![0].vnodeSelector, 'div');
			assert.lengthOf(vnode.children![0].children, 1);
			assert.isTrue(widgetBaseSpy.calledOnce, 'WidgetBase called once');
			assert.isTrue(widgetBaseSpy.calledWithNew(), 'WidgetBase called with new');
			assert.isNotNull(setProperties);
			assert.isTrue(setProperties!.calledOnce, 'setProperties called once');
			const rowProperties = cleanProperties<RowProperties>(setProperties!.getCall(0).args[0]);
			assert.deepEqual(rowProperties, {
				key: 'id',
				theme: undefined,
				columns: properties.columns,
				item: properties.items[0]
			});
		});
	},
	'render with no items'() {
		const items: any[] = [];
		const properties: BodyProperties = {
			registry: mockRegistry,
			items,
			columns: [
				{ id: 'foo', label: 'foo' }
			]
		};

		const row = new Body();
		row.setProperties(properties);
		const promise = new Promise((resolve) => setTimeout(resolve, 10));

		return promise.then(() => {
			const vnode = <VNode> row.__render__();

			assert.strictEqual(vnode.vnodeSelector, 'div');
			assert.lengthOf(vnode.children, 1);
			assert.equal(vnode.children![0].vnodeSelector, 'div');
			assert.lengthOf(vnode.children![0].children, 0);
			assert.isTrue(widgetBaseSpy.notCalled);
		});
	}
});
