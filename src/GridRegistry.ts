import { Constructor, RegistryLabel, WidgetBaseInterface } from '@dojo/widget-core/interfaces';
import WidgetRegistry, { WidgetRegistryItem } from '@dojo/widget-core/WidgetRegistry';
import Body from './Body';
import Cell from './Cell';
import ColumnHeaderCell from './ColumnHeaderCell';
import ColumnHeaders from './ColumnHeaders';
import Footer from './Footer';
import Header from './Header';
import Pagination from './Pagination';
import PageLink from './pagination/PageLink';
import Row from './Row';

export default class GridRegistry extends WidgetRegistry {
	private _overrides: WidgetRegistry = new WidgetRegistry();

	constructor() {
		super();

		super.define('body', Body);
		super.define('cell', Cell);
		super.define('column-header-cell', ColumnHeaderCell);
		super.define('column-headers', ColumnHeaders);
		super.define('footer', Footer);
		super.define('header', Header);
		super.define('page-link', PageLink);
		super.define('pagination', Pagination);
		super.define('row', Row);
	}

	define(widgetLabel: RegistryLabel, registryItem: WidgetRegistryItem): void {
		this._overrides.define(widgetLabel, registryItem);
	}

	get<T extends WidgetBaseInterface = WidgetBaseInterface>(widgetLabel: RegistryLabel): Constructor<T> | null {
		return this._overrides.get(widgetLabel) || super.get(widgetLabel);
	}

	has(widgetLabel: RegistryLabel): boolean {
		return this._overrides.has(widgetLabel) || super.has(widgetLabel);
	}
}

export const gridRegistry = new GridRegistry();
