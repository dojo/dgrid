import { v } from '@dojo/widget-core/d';
import { RegistryMixin, RegistryMixinProperties } from '@dojo/widget-core/mixins/Registry';
import { ThemeableMixin, theme, ThemeableProperties } from '@dojo/widget-core/mixins/Themeable';
import WidgetBase from '@dojo/widget-core/WidgetBase';
import { DNode } from '@dojo/widget-core/interfaces';
import { HasColumn, HasSortDetail, HasSortEvent } from './interfaces';

import * as cellCss from './styles/shared/cell.m.css';
import * as css from './styles/columnHeaderCell.m.css';

export const ColumnHeaderCellBase = ThemeableMixin(RegistryMixin(WidgetBase));

export interface ColumnHeaderCellProperties extends ThemeableProperties, HasColumn, HasSortDetail, HasSortEvent, RegistryMixinProperties {
	key: string;
}

@theme(cellCss)
@theme(css)
class ColumnHeaderCell extends ColumnHeaderCellBase<ColumnHeaderCellProperties> {
	onSortRequest(): void {
		const {
			key,
			sortDetail,
			onSortRequest
		} = this.properties;

		// The following inputs should create the respective outputs:
		// undefined => 'asc'
		// { columnId: string } => 'desc'
		// { columnId: string, direction: 'asc' } => 'desc'
		// { columnId: string, direction: 'desc' } => 'asc'
		onSortRequest({
			columnId: key,
			direction: (!sortDetail || sortDetail.direction === 'desc') ? 'asc' : 'desc'
		});
	}

	render(): DNode {
		const {
			key,
			column,
			sortDetail,
			onSortRequest
		} = this.properties;

		const classes = [ cellCss.cell, css.columnHeaderCell, column.sortable !== false ? css.sortable : null ];

		const sortClasses = sortDetail ? [
			css.sortArrow,
			sortDetail.direction === 'desc' ? css.sortArrowDown : css.sortArrowUp
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

export default ColumnHeaderCell;
