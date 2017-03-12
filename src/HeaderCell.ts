import { v } from '@dojo/widget-core/d';
import { RegistryMixin } from '@dojo/widget-core/mixins/Registry';
import { ThemeableMixin, theme, ThemeableProperties } from '@dojo/widget-core/mixins/Themeable';
import WidgetBase from '@dojo/widget-core/WidgetBase';
import { HasColumn, HasSortDetail, HasSortEvent } from './interfaces';

import * as headerCellClasses from './styles/headerCell.css';

export const HeaderCellBase = ThemeableMixin(RegistryMixin(WidgetBase));

export interface HeaderCellProperties extends ThemeableProperties, HasColumn, HasSortDetail, HasSortEvent { }

@theme(headerCellClasses)
class HeaderCell extends HeaderCellBase<HeaderCellProperties> {
	onSortRequest(): void {
		const {
			key = '',
			sortDetail,
			onSortRequest
		} = this.properties;

		onSortRequest({
			columnId: key,
			descending: Boolean(sortDetail && sortDetail.columnId === key && !sortDetail.descending)
		});
	}

	render() {
		const {
			key,
			column,
			sortDetail,
			onSortRequest
		} = this.properties;

		const classes = [ headerCellClasses.headerCell, column.sortable !== false ? headerCellClasses.sortable : null ];

		const sortClasses = [
			sortDetail ? headerCellClasses.sortArrow : null,
			sortDetail && sortDetail.descending ? headerCellClasses.sortArrowDown : null,
			sortDetail && !sortDetail.descending ? headerCellClasses.sortArrowUp : null
		];

		const onclick = (onSortRequest && (column.sortable || !column.hasOwnProperty('sortable'))) ? { onclick: this.onSortRequest } : {};

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
