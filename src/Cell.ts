import WidgetBase from '@dojo/widget-core/WidgetBase';
import { RegistryMixin, RegistryMixinProperties }  from '@dojo/widget-core/mixins/Registry';
import { v } from '@dojo/widget-core/d';
import { DNode } from '@dojo/widget-core/interfaces';
import { HasColumn, HasContent, HasItem, HasValue } from './interfaces';
import { theme, ThemeableMixin, ThemeableProperties } from '@dojo/widget-core/mixins/Themeable';

import * as cellCss from './styles/shared/cell.m.css';
import * as css from './styles/cell.m.css';

export interface CellProperties extends HasColumn, HasContent, HasItem, HasValue, RegistryMixinProperties, ThemeableProperties {
	key: string;
}

export const CellBase = ThemeableMixin(RegistryMixin(WidgetBase));

@theme(cellCss)
@theme(css)
class Cell extends CellBase<CellProperties> {
	render(): DNode {
		const {
			content
		} = this.properties;

		return v('td', {
			role: 'gridcell',
			classes: this.classes(cellCss.cell, css.rowCell)
		}, [
			content
		]);
	}
}

export default Cell;
