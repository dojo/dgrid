import { v, w } from '@dojo/widget-core/d';
import { DNode } from '@dojo/widget-core/interfaces';
import { theme, ThemeableMixin, ThemeableProperties } from '@dojo/widget-core/mixins/Themeable';
import WidgetBase from '@dojo/widget-core/WidgetBase';
import PageLink from './pagination/PageLink';

import * as css from './styles/pagination.m.css';

export const PaginationBase = ThemeableMixin(WidgetBase);

export interface PaginationProperties extends ThemeableProperties {
	page: number;
	totalPageCount: number;
	status: string;
	onPageRequest: (pageNumber: number) => void;
}

@theme(css)
class Pagination extends PaginationBase<PaginationProperties> {
	render (): DNode {
		const {
			onPageRequest,
			page,
			totalPageCount,
			status
		} = this.properties;
		const isFirstPage = page === 1;
		const isLastPage = page === totalPageCount;
		const children: DNode[] = [
			v('div', {
				classes: this.classes(css.paginationStatus)
			}, [
				status
			])
		];

		if (totalPageCount > 1) {
			const pageLinks: DNode[] = [];

			pageLinks.push(w<PageLink>('page-link', { key: '1', disabled: isFirstPage, page: 1, onPageRequest }));

			if (page > 4) {
				pageLinks.push(v('span', { key: 'skip1', classes: this.classes(css.pageSkip) }, [ '...' ]));
			}
			if (page > 3) {
				pageLinks.push(w<PageLink>('page-link', { key: String(page - 2), page: page - 2, onPageRequest }));
			}
			if (page > 2) {
				pageLinks.push(w<PageLink>('page-link', { key: String(page - 1), page: page - 1, onPageRequest }));
			}
			if (!isFirstPage && !isLastPage) {
				pageLinks.push(w<PageLink>('page-link', { key: String(page), disabled: true, page: page, onPageRequest }));
			}
			if (page + 1 < totalPageCount) {
				pageLinks.push(w<PageLink>('page-link', { key: String(page + 1), page: page + 1, onPageRequest }));
			}
			if (page + 2 < totalPageCount) {
				pageLinks.push(w<PageLink>('page-link', { key: String(page + 2), page: page + 2, onPageRequest }));
			}
			if (page < (totalPageCount - 3)) {
				pageLinks.push(v('span', { key: 'skip2', classes: this.classes(css.pageSkip) }, [ '...' ]));
			}

			pageLinks.push(w<PageLink>('page-link', {
				key: String(totalPageCount),
				disabled: isLastPage,
				page: totalPageCount,
				onPageRequest
			}));

			children.push(v('div', {
				classes: this.classes(css.navigation)
			}, [
				w<PageLink>('page-link', {
					key: 'previous',
					disabled: isFirstPage,
					isArrow: true,
					page: page - 1,
					label: '‹',
					onPageRequest
				}),
				v('span', {
					classes: this.classes(css.pageLinks)
				}, pageLinks),
				w<PageLink>('page-link', {
					key: 'next',
					disabled: isLastPage,
					isArrow: true,
					page: page + 1,
					label: '›',
					onPageRequest
				})
			]));
		}

		return v('div', {
			classes: this.classes(css.pagination)
		}, children);
	}
}

export default Pagination;
