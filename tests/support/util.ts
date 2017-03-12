import { WidgetConstructor, WidgetProperties } from '@dojo/widget-core/interfaces';
import { spy } from 'sinon';

/**
 * Thenable represents any object with a callable `then` property.
 */
export interface Thenable<T> {
	then<U>(onFulfilled?: (value?: T) => U | Thenable<U>, onRejected?: (error?: any) => U | Thenable<U>): Thenable<U>;
}

export function isEventuallyRejected<T>(promise: Thenable<T>): Thenable<boolean> {
	return promise.then<any>(function () {
		throw new Error('unexpected code path');
	}, function () {
		return true; // expect rejection
	});
}

export function throwImmediately() {
	throw new Error('unexpected code path');
}

export function spyOnWidget<C extends WidgetConstructor>(constructor: C, addSpies: (prototype: any) => void) {
	const constructorSpy = spy(function(this: C) {
		constructor.apply(this, arguments);
	});
	constructorSpy.prototype = Object.create(constructor.prototype);
	addSpies.call({}, constructorSpy.prototype);
	(<any> constructorSpy)['_type'] = (<any> constructor)['_type'];
	return constructorSpy;
}

export function cleanProperties<P extends WidgetProperties>(properties: Partial<P>): Partial<P> {
	delete properties.bind;
	delete (<any> properties).registry;
	return properties;
}
