import { v, w } from '@dojo/widget-core/d';
import {DNode} from '@dojo/widget-core/interfaces';
import { theme, ThemeableMixin, ThemeableProperties } from '@dojo/widget-core/mixins/Themeable';
import WidgetBase from '@dojo/widget-core/WidgetBase';
import { HasColumns, HasItems } from './interfaces';
import Row from './Row';

import * as bodyClasses from './styles/body.m.css';

export const BodyBase = ThemeableMixin(WidgetBase);

export interface BodyProperties extends ThemeableProperties, HasColumns, HasItems { }

@theme(bodyClasses)
class Body extends BodyBase<BodyProperties> {
	render(): DNode {
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
