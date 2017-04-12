import { ItemProperties } from './interfaces';
import { v, w } from '@dojo/widget-core/d';
import { DNode } from '@dojo/widget-core/interfaces';
import { RegistryMixin, RegistryMixinProperties }  from '@dojo/widget-core/mixins/Registry';
import { theme, ThemeableMixin, ThemeableProperties } from '@dojo/widget-core/mixins/Themeable';
import WidgetBase from '@dojo/widget-core/WidgetBase';

import * as css from './styles/pagination.m.css';

export const PaginationBase = ThemeableMixin(RegistryMixin(WidgetBase));

export interface PaginationProperties extends ThemeableProperties, RegistryMixinProperties {
	items: ItemProperties<any>[];
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
				page
			});
		}

		return null;
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
		const totalPages = totalLength / itemsPerPage;
		const currentPageNumber = Math.round(startingIndex / itemsPerPage) + 1;
		const children = [
			v('div', {
				classes: this.classes(css.status)
			}, [
				`${startingIndex + 1} - ${Math.min(startingIndex + items.length, currentPageNumber * itemsPerPage)} of ${totalLength} results`
			])
		];

		if (totalLength > items.length) {
			children.push(v('div', {
				classes: this.classes(css.navigation)
			}, [
				v('span', {
					classes: this.classes(css.pageLink, css.previous, currentPageNumber === 1 ? css.disabled : null)
				}, ['‹']),
				v('span', {
					classes: this.classes(css.pageLinks)
				}, [
					v('span', {
						classes: this.classes(css.pageLink, currentPageNumber === 1 ? css.disabled : null),
						page: '1'
					}, [ '1' ]),
					currentPageNumber > 3 ? v('span', { classes: this.classes(css.pageSkip) }, [ '...' ]) : null,
					this.createPageLink(String(currentPageNumber - 2), Boolean(currentPageNumber - 2 > 1), false),
					this.createPageLink(String(currentPageNumber - 1), Boolean(currentPageNumber - 1 > 1), false),
					this.createPageLink(String(currentPageNumber), Boolean(currentPageNumber !== 1 && currentPageNumber !== totalPages), true),
					this.createPageLink(String(currentPageNumber + 1), Boolean(currentPageNumber + 1 < totalPages), false),
					this.createPageLink(String(currentPageNumber + 2), Boolean(currentPageNumber + 2 < totalPages), false),
					currentPageNumber !== totalPages ? v('span', { classes: this.classes(css.pageSkip) }, [ '...' ]) : null,
					v('span', {
						classes: this.classes(css.pageLink, currentPageNumber === totalPages ? css.disabled : null),
						page: String(totalPages)
					}, [ String(totalPages) ])
				]),
				v('span', {
					classes: this.classes(css.pageLink, css.next, currentPageNumber * itemsPerPage >= totalLength ? css.disabled : null)
				}, ['›'])
			]));
		}

		return v('div', {
			classes: this.classes(css.pagination)
		}, children);
	}
}

export default Pagination;
