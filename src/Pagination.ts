import { ItemProperties } from './interfaces';
import { v, w } from '@dojo/widget-core/d';
import { DNode } from '@dojo/widget-core/interfaces';
import { theme, ThemeableMixin, ThemeableProperties } from '@dojo/widget-core/mixins/Themeable';
import WidgetBase from '@dojo/widget-core/WidgetBase';
import PageLink from './pagination/PageLink';

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
		const isFirstPage = currentPageNumber === 1;
		const isLastPage = currentPageNumber === totalPages;
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
					classes: this.classes(css.pageLink, css.previous, isFirstPage ? css.disabled : null),
					onclick: this.onClick,
					page: String(currentPageNumber - 1),
					tabindex: isFirstPage ? '-1' : '0'
				}, ['‹']),
				v('span', {
					classes: this.classes(css.pageLinks)
				}, [
					v('span', {
						classes: this.classes(css.pageLink, isFirstPage ? css.disabled : null),
						onclick: this.onClick,
						page: '1',
						tabindex: isFirstPage ? '-1' : '0'
					}, [ '1' ]),
					currentPageNumber > 4 ? v('span', { classes: this.classes(css.pageSkip) }, [ '...' ]) : null,
					currentPageNumber - 2 > 1 ?
						w(PageLink, { key: '1', disabled: false, page: currentPageNumber - 2 }) :
						null,
					currentPageNumber - 1 > 1 ?
						w(PageLink, { key: '2', disabled: false, page: currentPageNumber - 1 }) :
						null,
					currentPageNumber !== 1 && currentPageNumber !== totalPages ?
						w(PageLink, { key: '3', disabled: true, page: currentPageNumber }) :
						null,
					currentPageNumber + 1 < totalPages ?
						w(PageLink, { key: '4', disabled: false, page: currentPageNumber + 1 }) :
						null,
					currentPageNumber + 2 < totalPages ?
						w(PageLink, { key: '5', disabled: false, page: currentPageNumber + 2 }) :
						null,
					currentPageNumber < (totalPages - 3) ? v('span', { classes: this.classes(css.pageSkip) }, [ '...' ]) : null,
					v('span', {
						classes: this.classes(css.pageLink, isLastPage ? css.disabled : null),
						onclick: this.onClick,
						page: String(totalPages),
						tabindex: isLastPage ? '-1' : '0'
					}, [ String(totalPages) ])
				]),
				v('span', {
					classes: this.classes(css.pageLink, css.next, isLastPage ? css.disabled : null),
					onclick: this.onClick,
					page: String(currentPageNumber + 1),
					tabindex: isLastPage ? '-1' : '0'
				}, ['›'])
			]));
		}

		return v('div', {
			classes: this.classes(css.pagination)
		}, children);
	}
}

export default Pagination;
