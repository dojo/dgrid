import { v } from '@dojo/widget-core/d';
import { DNode } from '@dojo/widget-core/interfaces';
import { theme, ThemeableMixin, ThemeableProperties } from '@dojo/widget-core/mixins/Themeable';
import WidgetBase from '@dojo/widget-core/WidgetBase';

import * as css from './styles/footer.m.css';

export const FooterBase = ThemeableMixin(WidgetBase);

export interface FooterProperties extends ThemeableProperties {}

@theme(css)
class Footer extends FooterBase<FooterProperties> {
	render(): DNode {
		return v('div', {
			classes: this.classes(css.footer)
		}, this.children);
	}
}

export default Footer;
