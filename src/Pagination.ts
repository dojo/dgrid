import { ItemProperties } from './interfaces';
import { v, w } from '@dojo/widget-core/d';
import { DNode } from '@dojo/widget-core/interfaces';
import { theme, ThemeableMixin, ThemeableProperties } from '@dojo/widget-core/mixins/Themeable';
import WidgetBase from '@dojo/widget-core/WidgetBase';
import PageLink, { PageLinkProperties } from './pagination/PageLink';

import * as css from './styles/pagination.m.css';

export const PaginationBase = ThemeableMixin(WidgetBase);

export interface PaginationProperties extends ThemeableProperties {
	page: number;
	pages: number;
	status: string;
	onPageRequest?: (pageNumber: number) => void;
}

@theme(css)
class Pagination extends PaginationBase<PaginationProperties> {
	render (): DNode {
		const {
			onPageRequest,
			page,
			pages,
			status
		} = this.properties;
		const isFirstPage = page === 1;
		const isLastPage = page === pages;
		const children = [
			v('div', {
				classes: this.classes(css.status)
			}, [
				status
			])
		];
		const onclick = onPageRequest ? { onPageRequest } : {};

		if (pages > 1) {
			const pageLinks = [];

			pageLinks.push(w(PageLink, <PageLinkProperties> { key: '1', disabled: isFirstPage, page: 1, ...onclick }));

			if (page > 4) {
				pageLinks.push(v('span', { classes: this.classes(css.pageSkip) }, [ '...' ]));
			}
			if (page > 3) {
				pageLinks.push(w(PageLink, <PageLinkProperties> { key: '2', page: page - 2, ...onclick }));
			}
			if (page > 2) {
				pageLinks.push(w(PageLink, <PageLinkProperties> { key: '3', page: page - 1, ...onclick }));
			}
			if (page !== 1 && page !== pages) {
				pageLinks.push(w(PageLink, <PageLinkProperties> { key: '4', disabled: true, page: page, ...onclick }));
			}
			if (page + 1 < pages) {
				pageLinks.push(w(PageLink, <PageLinkProperties> { key: '5', page: page + 1, ...onclick }));
			}
			if (page + 2 < pages) {
				pageLinks.push(w(PageLink, <PageLinkProperties> { key: '6', page: page + 2, ...onclick }));
			}
			if (page < (pages - 3)) {
				pageLinks.push(v('span', { classes: this.classes(css.pageSkip) }, [ '...' ]));
			}

			pageLinks.push(w(PageLink, <PageLinkProperties> {
				key: String(pages),
				disabled: isLastPage,
				page: pages,
				...onclick
			}));

			children.push(v('div', {
				classes: this.classes(css.navigation)
			}, [
				w(PageLink, <PageLinkProperties> {
					key: 'previous',
					disabled: isFirstPage,
					isArrow: true,
					page: page - 1,
					label: '‹',
					...onclick
				}),
				v('span', {
					classes: this.classes(css.pageLinks)
				}, pageLinks),
				w(PageLink, <PageLinkProperties> {
					key: 'next',
					disabled: isLastPage,
					isArrow: true,
					page: page + 1,
					label: '›',
					...onclick
				})
			]));
		}

		return v('div', {
			classes: this.classes(css.pagination)
		}, children);
	}
}

export default Pagination;
