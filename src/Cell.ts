import WidgetBase from '@dojo/widget-core/WidgetBase';
import { RegistryMixin, RegistryMixinProperties }  from '@dojo/widget-core/mixins/Registry';
import { v } from '@dojo/widget-core/d';
import { HasValue, HasColumn, HasItem } from './interfaces';
import { theme, ThemeableMixin, ThemeableProperties } from '@dojo/widget-core/mixins/Themeable';

import * as cellClasses from './styles/cell.css';

export interface CellProperties extends ThemeableProperties, HasValue, HasColumn, HasItem, RegistryMixinProperties { }

@theme(cellClasses)
class Cell extends ThemeableMixin(RegistryMixin(WidgetBase))<CellProperties> {
	render() {
		const {
			value = ''
		} = this.properties;

		return v('td', {
			role: 'gridcell',
			classes: this.classes(cellClasses.cell)
		}, [
			String(value)
		]);
	}
}

export default Cell;
