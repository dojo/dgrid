import { ItemProperties } from './interfaces';
import { v, w } from '@dojo/widget-core/d';
import { DNode } from '@dojo/widget-core/interfaces';
import { theme, ThemeableMixin, ThemeableProperties } from '@dojo/widget-core/mixins/Themeable';
import WidgetBase from '@dojo/widget-core/WidgetBase';

import * as css from './styles/pagination.m.css';

export const PaginationBase = ThemeableMixin(WidgetBase);

export interface PaginationProperties extends ThemeableProperties {
	items: ItemProperties<any>[];
	onRequestPagination?: (pageNumber: number) => void;
	pagination: {
		itemsPerPage: number
	};
	size: {
		start: number;
		totalLength: number;
	};
}

@theme(css)
class Pagination extends PaginationBase<PaginationProperties> {
	createPageLink (page: string, visible: boolean, disabled: boolean): DNode {
		if (visible) {
			return v('span', {
				classes: this.classes(css.pageLink, disabled ? css.disabled : null),
				onclick: this.onClick,
				page,
				tabindex: disabled ? '-1' : '0'
			}, [ String(page) ]);
		}

		return null;
	}

	onClick (event: any) {
		if (event.target.className.indexOf(css.disabled) !== -1) {
			return;
		}

		const requestedPage = parseInt(event.target.getAttribute('page'), 10);

		this.properties.onRequestPagination && this.properties.onRequestPagination(requestedPage);
	}

	render (): DNode {
		const {
			items,
			pagination: {
				itemsPerPage
			},
			size: {
				start: startingIndex,
				totalLength
			}
		} = this.properties;
		const totalPages = Math.ceil(totalLength / itemsPerPage);
		const currentPageNumber = Math.round(startingIndex / itemsPerPage) + 1;
		const children = [
			v('div', {
				classes: this.classes(css.status)
			}, [
				`${startingIndex + 1} - ${Math.min(startingIndex + items.length, currentPageNumber * itemsPerPage)} of ${totalLength} results`
			])
		];

		if (totalLength > items.length || items.length > itemsPerPage) {
			children.push(v('div', {
				classes: this.classes(css.navigation)
			}, [
				v('span', {
					classes: this.classes(css.pageLink, css.previous, currentPageNumber === 1 ? css.disabled : null),
					onclick: this.onClick,
					page: String(currentPageNumber - 1),
					tabindex: currentPageNumber === 1 ? '-1' : '0'
				}, ['‹']),
				v('span', {
					classes: this.classes(css.pageLinks)
				}, [
					v('span', {
						classes: this.classes(css.pageLink, currentPageNumber === 1 ? css.disabled : null),
						onclick: this.onClick,
						page: '1',
						tabindex: currentPageNumber === 1 ? '-1' : '0'
					}, [ '1' ]),
					currentPageNumber > 4 ? v('span', { classes: this.classes(css.pageSkip) }, [ '...' ]) : null,
					this.createPageLink(String(currentPageNumber - 2), Boolean(currentPageNumber - 2 > 1), false),
					this.createPageLink(String(currentPageNumber - 1), Boolean(currentPageNumber - 1 > 1), false),
					this.createPageLink(String(currentPageNumber), Boolean(currentPageNumber !== 1 && currentPageNumber !== totalPages), true),
					this.createPageLink(String(currentPageNumber + 1), Boolean(currentPageNumber + 1 < totalPages), false),
					this.createPageLink(String(currentPageNumber + 2), Boolean(currentPageNumber + 2 < totalPages), false),
					currentPageNumber < (totalPages - 3) ? v('span', { classes: this.classes(css.pageSkip) }, [ '...' ]) : null,
					v('span', {
						classes: this.classes(css.pageLink, currentPageNumber === totalPages ? css.disabled : null),
						onclick: this.onClick,
						page: String(totalPages),
						tabindex: currentPageNumber === totalPages ? '-1' : '0'
					}, [ String(totalPages) ])
				]),
				v('span', {
					classes: this.classes(css.pageLink, css.next, currentPageNumber * itemsPerPage >= totalLength ? css.disabled : null),
					onclick: this.onClick,
					page: String(currentPageNumber + 1),
					tabindex: currentPageNumber * itemsPerPage >= totalLength ? '-1' : '0'
				}, ['›'])
			]));
		}

		return v('div', {
			classes: this.classes(css.pagination)
		}, children);
	}
}

export default Pagination;
