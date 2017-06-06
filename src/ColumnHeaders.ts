import { v, w } from '@dojo/widget-core/d';
import { DNode } from '@dojo/widget-core/interfaces';
import { RegistryMixin, RegistryMixinProperties }  from '@dojo/widget-core/mixins/Registry';
import { theme, ThemeableMixin, ThemeableProperties } from '@dojo/widget-core/mixins/Themeable';
import WidgetBase from '@dojo/widget-core/WidgetBase';
import ColumnHeaderCell from './ColumnHeaderCell';
import { HasColumns, HasSortDetails, HasSortEvent } from './interfaces';

import * as css from './styles/columnHeaders.m.css';
import * as tableCss from './styles/shared/table.m.css';

export const ColumnHeadersBase = ThemeableMixin(RegistryMixin(WidgetBase));

export interface ColumnHeadersProperties extends ThemeableProperties, HasColumns, HasSortDetails, HasSortEvent, RegistryMixinProperties {}

@theme(tableCss)
@theme(css)
class ColumnHeaders extends ColumnHeadersBase<ColumnHeadersProperties> {
	render(): DNode {
		const {
			columns,
			onSortRequest,
			registry,
			sortDetails,
			theme
		} = this.properties;

		return v('div', {
			classes: this.classes(css.columnHeaders, css.columnHeadersRow),
			role: 'row'
		}, [
			v('table', {
				role: 'presentation',
				classes: this.classes(tableCss.table, css.columnHeadersTable)
			}, [
				v('tr', columns.map((column) => {
					let sortDetail;
					for (const detail of sortDetails) {
						if (detail.columnId === column.id) {
							sortDetail = detail;
							break;
						}
					}

					return w<ColumnHeaderCell>('column-header-cell', {
						column,
						key: column.id,
						onSortRequest,
						registry,
						sortDetail,
						theme
					});
				}))
			])
		]);
	}
}

export default ColumnHeaders;
