import { v } from '@dojo/widget-core/d';
import { DNode } from '@dojo/widget-core/interfaces';
import { RegistryMixin, RegistryMixinProperties } from '@dojo/widget-core/mixins/Registry';
import { theme, ThemeableMixin, ThemeableProperties } from '@dojo/widget-core/mixins/Themeable';
import WidgetBase from '@dojo/widget-core/WidgetBase';

import * as css from './styles/header.m.css';

export const HeaderBase = ThemeableMixin(RegistryMixin(WidgetBase));

export interface HeaderProperties extends ThemeableProperties, RegistryMixinProperties {}

export const enum HeaderType {
	COLUMN_HEADERS = 1
};

@theme(css)
class Header extends HeaderBase<HeaderProperties> {
	render(): DNode {
		return v('div', {
			classes: this.classes(css.header)
		}, this.children);
	}
}

export default Header;
