import { Evented } from '@dojo/core/Evented';
import Promise from '@dojo/shim/Promise';
import { WidgetConstructor } from '@dojo/widget-core/interfaces';
import WidgetRegistry from '@dojo/widget-core/WidgetRegistry';

export default class RegistryHandler extends Evented {
	private _registries: { handle?: any, registry: WidgetRegistry }[] = [];

	add(registry: WidgetRegistry) {
		this._registries.unshift({ registry });
	}

	remove(registry: WidgetRegistry): boolean {
		return this._registries.some((registryWrapper, i) => {
			if (registryWrapper.registry === registry) {
				// registry.destroy();
				this._registries.splice(i, 1);
				return true;
			}
			return false;
		});
	}

	replace(original: WidgetRegistry, replacement: WidgetRegistry): boolean {
		return this._registries.some((registryWrapper, i) => {
			if (registryWrapper.registry === original) {
				// original.destroy();
				registryWrapper.registry = replacement;
				return true;
			}
			return false;
		});
	}

	has(widgetLabel: string): boolean {
		return this._registries.some((registryWrapper) => {
			return registryWrapper.registry.has(widgetLabel);
		});
	}

	get(widgetLabel: string): WidgetConstructor | Promise<WidgetConstructor> | null {
		for (let i = 0; i < this._registries.length; i++) {
			const registryWrapper = this._registries[i];
			const item = registryWrapper.registry.get(widgetLabel);
			if (item) {
				return item;
			}
		}
		return null;
	}
}
