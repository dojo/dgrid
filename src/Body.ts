import { v, w } from '@dojo/widget-core/d';
import { RegistryMixin, RegistryMixinProperties } from '@dojo/widget-core/mixins/Registry';
import { theme, ThemeableMixin, ThemeableProperties } from '@dojo/widget-core/mixins/Themeable';
import WidgetBase from '@dojo/widget-core/WidgetBase';
import { HasColumns, HasItems, HasScrollTo } from './interfaces';
import Row from './Row';

import * as bodyClasses from './styles/body.m.css';

export const BodyBase = ThemeableMixin(RegistryMixin(WidgetBase));

export interface BodyProperties extends ThemeableProperties, HasColumns, HasItems, HasScrollTo, RegistryMixinProperties { }

@theme(bodyClasses)
class Body extends BodyBase<BodyProperties> {
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
