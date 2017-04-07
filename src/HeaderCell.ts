import { v } from '@dojo/widget-core/d';
import { RegistryMixin, RegistryMixinProperties } from '@dojo/widget-core/mixins/Registry';
import { ThemeableMixin, theme, ThemeableProperties } from '@dojo/widget-core/mixins/Themeable';
import WidgetBase from '@dojo/widget-core/WidgetBase';
import { DNode } from '@dojo/widget-core/interfaces';
import { HasColumn, HasSortDetail, HasSortEvent } from './interfaces';

import * as css from './styles/headerCell.m.css';
import * as cellCss from './styles/shared/cell.m.css';

export const HeaderCellBase = ThemeableMixin(RegistryMixin(WidgetBase));

export interface HeaderCellProperties extends ThemeableProperties, HasColumn, HasSortDetail, HasSortEvent, RegistryMixinProperties {}

@theme(cellCss)
@theme(css)
class HeaderCell extends HeaderCellBase<HeaderCellProperties> {
	onSortRequest(): void {
		const {
			key = '',
			sortDetail,
			onSortRequest
		} = this.properties;

		onSortRequest({
			columnId: key,
			direction: (sortDetail && sortDetail.direction === 'asc') ? 'desc' : 'asc'
		});
	}

	render(): DNode {
		const {
			key,
			column,
			sortDetail,
			onSortRequest
		} = this.properties;

		const classes = [ cellCss.cell, css.headerCell, column.sortable !== false ? css.sortable : null ];

		const sortClasses = sortDetail ? [
			css.sortArrow,
			sortDetail.direction === 'asc' ? css.sortArrowUp : css.sortArrowDown
			] : [];

		const onclick = (onSortRequest && column.sortable !== false) ? { onclick: this.onSortRequest } : {};

		return v('th', {
			role: 'columnheader',
			...onclick,
			classes: this.classes(...classes)
		}, [
			v('span', [ column.label || column.id ]),
			sortDetail && sortDetail.columnId === key ? v('div', {
				role: 'presentation',
				classes: this.classes(...sortClasses)
			}) : null
		]);
	}
}

export default HeaderCell;
