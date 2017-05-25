import { v, w } from '@dojo/widget-core/d';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { RegistryMixin, RegistryMixinProperties } from '@dojo/widget-core/mixins/Registry';
import { theme, ThemeableMixin, ThemeableProperties } from '@dojo/widget-core/mixins/Themeable';
import WidgetBase from '@dojo/widget-core/WidgetBase';
import { DNode } from '@dojo/widget-core/interfaces';
import Cell from './Cell';
import { HasColumns, ItemProperties } from './interfaces';

import * as css from './styles/row.m.css';
import * as tableCss from './styles/shared/table.m.css';

export const RowBase = ThemeableMixin(RegistryMixin(WidgetBase));

export interface RowProperties extends WidgetProperties, HasColumns, RegistryMixinProperties, ThemeableProperties {
	item: ItemProperties;
	key: string;
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
					const { field, id } = column;

					let value: any;
					if (typeof column.get === 'function') {
						// Get the value from the column callback
						value = column.get(item, column);
					}
					else if (typeof column.get !== 'undefined') {
						// Get the value from the column property
						value = column.get;
					}
					else {
						// Get the value using a property lookup on the item data
						value = item.data[ field || id ];
					}

					let content: DNode;
					if (column.render) {
						// The column callback calculates its own value and DNode/string
						content = column.render({ value, item, column });
					}
					else {
						// The value from get/item data is cast to a string
						content = String(value);
					}

					return w<Cell>('cell', {
						content,
						column,
						item,
						key: id,
						registry,
						theme,
						value
					});
				}))
			])
		]);
	}
}

export default Row;
