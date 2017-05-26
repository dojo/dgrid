import Map from '@dojo/shim/Map';
import { v, w } from '@dojo/widget-core/d';
import { RegistryMixin, RegistryMixinProperties } from '@dojo/widget-core/mixins/Registry';
import { theme, ThemeableMixin, ThemeableProperties } from '@dojo/widget-core/mixins/Themeable';
import WidgetBase from '@dojo/widget-core/WidgetBase';
import { HasColumns, HasItems, HasScrollTo, ItemProperties } from './interfaces';
import Row from './Row';

import * as bodyClasses from './styles/body.m.css';

export const BodyBase = ThemeableMixin(RegistryMixin(WidgetBase));

export interface BodyProperties extends ThemeableProperties, HasColumns, HasItems, HasScrollTo, RegistryMixinProperties { }

interface RenderedDetails {
	add: boolean;
	delete: boolean;
	element?: HTMLElement;
	index: number;
	height?: number;
};

@theme(bodyClasses)
class Body extends BodyBase<BodyProperties> {
	private _itemElementMap = new Map<string, RenderedDetails>;

	createNodeFromItem(item: ItemProperties, index: number) {
		const {
			_itemElementMap: itemElementMap,
			properties: {
				columns,
				theme,
				registry
			}
		} = this;

		const key = item.id;
		let details = itemElementMap.get(key);
		if (!details) {
			details = {
				add: true,
				delete: false,
				index: index
			};
			itemElementMap.set(key, details);
		}
		else {
			details.index = index;
		}

		return v('div', {
			key,
			role: 'row',
			classes: this.classes(bodyClasses.row)
		}, [
			w<Row>('row', {
				columns,
				item,
				key,
				registry,
				theme
			})
		]);
	}

	protected onElementChange(element: HTMLElement, key: string): void {
		const {
			_itemElementMap: itemElementMap
		} = this;

		const details = itemElementMap.get(key);
		if (details) {
			// store the DOM node if its representation changes
			details.element = element;
		}
	}

	protected onElementCreated(element: HTMLElement, key: string): void {
		this.onElementChange(element, key);
	}

	protected onElementUpdated(element: HTMLElement, key: string): void {
		this.onElementChange(element, key);
	}

	render() {
		const {
			columns,
			items,
			registry,
			theme
		} = this.properties;

		return v('div', {
				classes: this.classes(bodyClasses.scroller)
			},
			[
				v('div', {
					classes: this.classes(bodyClasses.content)
				},
				items.map((item) => {
					return w<Row>('row', {
						columns,
						item,
						key: item.id,
						registry,
						theme
					});
				}))
			]
		);
	}
}

export default Body;
