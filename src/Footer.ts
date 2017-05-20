import { v } from '@dojo/widget-core/d';
import { DNode } from '@dojo/widget-core/interfaces';
import { RegistryMixin, RegistryMixinProperties } from '@dojo/widget-core/mixins/Registry';
import { theme, ThemeableMixin, ThemeableProperties } from '@dojo/widget-core/mixins/Themeable';
import WidgetBase from '@dojo/widget-core/WidgetBase';

import * as css from './styles/footer.m.css';

export const FooterBase = ThemeableMixin(RegistryMixin(WidgetBase));

export interface FooterProperties extends ThemeableProperties, RegistryMixinProperties {}

@theme(css)
class Footer extends FooterBase<FooterProperties> {
	render(): DNode {
		return v('div', {
			classes: this.classes(css.footer)
		}, this.children);
	}
}

export default Footer;
