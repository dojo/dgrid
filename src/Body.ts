import { v, w } from '@dojo/widget-core/d';
import { RegistryMixin, RegistryMixinProperties } from '@dojo/widget-core/mixins/Registry';
import { ThemeableMixin, theme, ThemeableProperties } from '@dojo/widget-core/mixins/Themeable';
import WidgetBase from '@dojo/widget-core/WidgetBase';
import { HasColumns, HasItems } from './interfaces';
import { RowProperties } from './Row';

import * as bodyClasses from './styles/body.css';

export const BodyBase = ThemeableMixin(RegistryMixin(WidgetBase));

export interface BodyProperties extends ThemeableProperties, HasColumns, HasItems, RegistryMixinProperties { }

@theme(bodyClasses)
class Body extends BodyBase<BodyProperties> {
	render() {
		const {
			items,
			columns,
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
					return w<RowProperties>('row', {
						key: item.id,
						item,
						columns,
						registry,
						theme
					});
				}))
			]
		);
	}
}

export default Body;
