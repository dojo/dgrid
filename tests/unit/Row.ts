import { VNode } from '@dojo/interfaces/vdom';
import FactoryRegistry from '@dojo/widget-core/FactoryRegistry';
import WidgetBase from '@dojo/widget-core/WidgetBase';
import { assert } from 'chai';
import * as registerSuite from 'intern/lib/interfaces/object';
import { spy, stub, SinonSpy } from 'sinon';
import { CellProperties } from '../../src/Cell';
import Row from '../../src/Row';
import { spyOnWidget, cleanProperties } from '../support/util';

let mockRegistry: FactoryRegistry;
let setProperties: SinonSpy | null = null;
let widgetBaseSpy: SinonSpy;

registerSuite({
	name: 'Row',
	beforeEach() {
		setProperties = null;
		widgetBaseSpy = spyOnWidget(WidgetBase, (prototype) => {
			setProperties = spy(prototype, 'setProperties');
		});
		mockRegistry = <any> {
			get: stub().withArgs('cell').returns(widgetBaseSpy),
			has() {
				return true;
			}
		};
	},
	render() {
		const properties = {
			registry: mockRegistry,
			columns: [
				{ id: 'foo', label: 'foo' }
			],
			item: {
				data: { foo: 'bar' }
			}
		};

		const row = new Row();
		row.setProperties(properties);
		const vnode = <VNode> row.__render__();

		assert.strictEqual(vnode.vnodeSelector, 'div');
		assert.strictEqual(vnode.properties!['role'], 'row');
		assert.lengthOf(vnode.children, 1);

		const table = vnode.children![0];
		assert.strictEqual(table.vnodeSelector, 'table');
		assert.strictEqual(table.properties!['role'], 'presentation');
		assert.lengthOf(table.children, 1);

		assert.isTrue(widgetBaseSpy.calledOnce, 'WidgetBase called once');
		assert.isTrue(widgetBaseSpy.calledWithNew(), 'WidgetBase called with new');
		assert.isNotNull(setProperties);
		assert.isTrue(setProperties!.calledOnce, 'setProperties called once');
		const cellProperties = cleanProperties<CellProperties>(setProperties!.getCall(0).args[0]);
		assert.deepEqual(cellProperties, {
			value: properties.item.data.foo,
			item: properties.item,
			key: properties.columns[0].id
		});
	},
	'render with no columns'() {
		const properties: any = {
			registry: mockRegistry,
			item: { foo: 'bar' }
		};

		const row = new Row();
		row.setProperties(properties);
		const vnode = <VNode> row.__render__();

		assert.strictEqual(vnode.vnodeSelector, 'div');
		assert.lengthOf(vnode.children, 1);

		const table = vnode.children![0];
		assert.lengthOf(table.children, 1);

		const tr = table.children![0];
		assert.lengthOf(tr.children, 0);
		assert.isTrue(widgetBaseSpy.notCalled);
	}
});
