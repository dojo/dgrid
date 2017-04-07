import { v, w } from '@dojo/widget-core/d';
import { DNode } from '@dojo/widget-core/interfaces';
import { RegistryMixin, RegistryMixinProperties }  from '@dojo/widget-core/mixins/Registry';
import { ThemeableMixin, theme, ThemeableProperties } from '@dojo/widget-core/mixins/Themeable';
import WidgetBase from '@dojo/widget-core/WidgetBase';
import { HeaderCellProperties } from './HeaderCell';
import { HasColumns, HasSortDetails, HasSortEvent } from './interfaces';

import * as css from './styles/header.m.css';
import * as tableCss from './styles/shared/table.m.css';

export const HeaderBase = ThemeableMixin(RegistryMixin(WidgetBase));

export interface HeaderProperties extends ThemeableProperties, HasColumns, HasSortDetails, HasSortEvent, RegistryMixinProperties { }

@theme(tableCss)
@theme(css)
class Header extends HeaderBase<HeaderProperties> {
	render(): DNode {
		const {
			columns,
			onSortRequest,
			registry,
			sortDetails = [],
			theme
		} = this.properties;

		return v('div', {
			classes: this.classes(css.header, css.headerRow),
			role: 'row'
		}, [
			v('table', {
				role: 'presentation',
				classes: this.classes(tableCss.table, css.headerTable)
			}, [
				v('tr', columns.map((column) => {
					let sortDetail;
					for (const detail of sortDetails) {
						if (detail.columnId === column.id) {
							sortDetail = detail;
							break;
						}
					}

					return w<HeaderCellProperties>('header-cell', {
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

export default Header;
