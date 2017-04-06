import WidgetBase from '@dojo/widget-core/WidgetBase';
import { RegistryMixin, RegistryMixinProperties }  from '@dojo/widget-core/mixins/Registry';
import { v } from '@dojo/widget-core/d';
import { DNode } from '@dojo/widget-core/interfaces';
import { HasValue, HasColumn, HasItem } from './interfaces';
import { theme, ThemeableMixin, ThemeableProperties } from '@dojo/widget-core/mixins/Themeable';

import * as css from './styles/cell.m.css';
import * as cellCss from './styles/shared/cell.m.css';

export interface CellProperties extends ThemeableProperties, HasValue, HasColumn, HasItem, RegistryMixinProperties { }

export const CellBase = ThemeableMixin(RegistryMixin(WidgetBase));

@theme(css)
class Cell extends CellBase<CellProperties> {
	render(): DNode {
		const {
			value = ''
		} = this.properties;

		return v('td', {
			role: 'gridcell',
			classes: this.classes(cellCss.cell, css.rowCell)
		}, [
			String(value)
		]);
	}
}

export default Cell;
