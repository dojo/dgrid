import { v } from '@dojo/widget-core/d';
import { DNode } from '@dojo/widget-core/interfaces';
import { theme, ThemeableMixin, ThemeableProperties } from '@dojo/widget-core/mixins/Themeable';
import WidgetBase from '@dojo/widget-core/WidgetBase';

import * as css from '../styles/pagination.m.css';

export const PageLinkBase = ThemeableMixin(WidgetBase);

export interface PageLinkProperties extends ThemeableProperties {
	disabled?: boolean;
	isArrow?: boolean;
	label?: string;
	page: number;
	onPageRequest: (page: number) => void;
}

@theme(css)
class PageLink extends PageLinkBase<PageLinkProperties> {
	onClick (event: any) {
		const {
			disabled = false,
			onPageRequest,
			page
		} = this.properties;

		if (disabled === false) {
			onPageRequest(page);
		}
	}

	render (): DNode {
		const {
			disabled = false,
			isArrow = false,
			label = String(this.properties.page)
		} = this.properties;

		return v('span', {
			classes: this.classes(css.pageLink, disabled ? css.disabled : null, isArrow ? css.paginationArrow : null),
			onclick: this.onClick,
			tabindex: disabled ? '-1' : '0'
		}, [ label ]);
	}
}

export default PageLink;
