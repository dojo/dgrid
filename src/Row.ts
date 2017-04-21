import { v, w } from '@dojo/widget-core/d';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { RegistryMixin, RegistryMixinProperties } from '@dojo/widget-core/mixins/Registry';
import { theme, ThemeableMixin, ThemeableProperties } from '@dojo/widget-core/mixins/Themeable';
import WidgetBase from '@dojo/widget-core/WidgetBase';
import { DNode } from '@dojo/widget-core/interfaces';
import { CellProperties } from './Cell';
import { HasColumns, ItemProperties } from './interfaces';

import * as css from './styles/row.m.css';
import * as tableCss from './styles/shared/table.m.css';

export const RowBase = ThemeableMixin(RegistryMixin(WidgetBase));

export interface RowProperties extends WidgetProperties, HasColumns, RegistryMixinProperties, ThemeableProperties {
	item: ItemProperties<any>;
}

@theme(tableCss)
@theme(css)
class Row extends RowBase<RowProperties> {
	render(): DNode {
		const {
			columns,
			item,
			registry,
			theme
		} = this.properties;

		return v('div', {
			role: 'row',
			classes: this.classes(css.row)
		}, [
			v('table', {
				role: 'presentation',
				classes: this.classes(tableCss.table, css.rowTable)
			}, [
				v('tr', columns.map((column) => {
					const { id, field } = column;

					return w<CellProperties>('cell', {
						column,
						item,
						key: id,
						registry,
						theme,
						value: item.data[ field || id ]
					});
				}))
			])
		]);
	}
}

export default Row;
