import { WidgetProperties } from '@dojo/widget-core/interfaces';
import WidgetBase from '@dojo/widget-core/WidgetBase';
import { RegistryMixin, RegistryMixinProperties } from '@dojo/widget-core/mixins/Registry';
import { v, w } from '@dojo/widget-core/d';
import { HasColumns } from './interfaces';
import { CellProperties } from './Cell';
import { theme, ThemeableMixin } from '@dojo/widget-core/mixins/Themeable';

import * as rowClasses from './styles/row.css';

export interface RowProperties extends WidgetProperties, HasColumns, RegistryMixinProperties {
	item: any;
}

@theme(rowClasses)
class Row  extends ThemeableMixin(RegistryMixin(WidgetBase))<RowProperties> {
	render() {
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
				v('tr', columns.map(({ id, field }) => {
					return w('cell', <CellProperties> {
						registry,
						key: id,
						item: item,
						value: item.data[ field || id ]
					});
				}))
			])
		]);
	}
}

export default Row;
