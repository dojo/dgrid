import { v, w } from '@dojo/widget-core/d';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { RegistryMixin, RegistryMixinProperties } from '@dojo/widget-core/mixins/Registry';
import { theme, ThemeableMixin, ThemeableProperties } from '@dojo/widget-core/mixins/Themeable';
import WidgetBase from '@dojo/widget-core/WidgetBase';
import { DNode } from '@dojo/widget-core/interfaces';
import { CellProperties } from './Cell';
import { HasColumns, ItemProperties } from './interfaces';

import * as rowClasses from './styles/row.css';

export const RowBase = ThemeableMixin(RegistryMixin(WidgetBase));

export interface RowProperties extends WidgetProperties, HasColumns, RegistryMixinProperties, ThemeableProperties {
	item: ItemProperties<any>;
}

@theme(rowClasses)
class Row extends RowBase<RowProperties> {
	render(): DNode {
		const {
			registry,
			item,
			columns = []
		} = this.properties;

		return v('div', {
			role: 'row',
			classes: this.classes(rowClasses.row)
		}, [
			v('table', {
				role: 'presentation',
				classes: this.classes(rowClasses.rowTable)
			}, [
				v('tr', columns.map((column) => {
					const { id, field } = column;

					return w<CellProperties>('cell', {
						registry,
						key: id,
						column,
						item,
						value: item.data[ field || id ]
					});
				}))
			])
		]);
	}
}

export default Row;
