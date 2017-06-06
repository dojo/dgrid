import { WidgetBaseConstructor } from '@dojo/widget-core/interfaces';
import WidgetRegistry from '@dojo/widget-core/WidgetRegistry';
import Body, { BodyProperties } from './Body';
import Cell, { CellProperties } from './Cell';
import ColumnHeaderCell, { ColumnHeaderCellProperties } from './ColumnHeaderCell';
import ColumnHeaders, { ColumnHeadersProperties } from './ColumnHeaders';
import Footer, { FooterProperties } from './Footer';
import Header, { HeaderProperties } from './Header';
import PageLink, { PageLinkProperties } from './pagination/PageLink';
import Pagination, { PaginationProperties } from './Pagination';
import Row, { RowProperties } from './Row';

export interface GridRegistered {
	[key: string]: WidgetBaseConstructor;
	body: WidgetBaseConstructor<BodyProperties>;
	cell: WidgetBaseConstructor<CellProperties>;
	'column-header-cell': WidgetBaseConstructor<ColumnHeaderCellProperties>;
	'column-headers': WidgetBaseConstructor<ColumnHeadersProperties>;
	footer: WidgetBaseConstructor<FooterProperties>;
	header: WidgetBaseConstructor<HeaderProperties>;
	'page-link': WidgetBaseConstructor<PageLinkProperties>;
	pagination: WidgetBaseConstructor<PaginationProperties>;
	row: WidgetBaseConstructor<RowProperties>;
}

export default class GridRegistry<T extends GridRegistered = GridRegistered> extends WidgetRegistry {
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

	define<K extends keyof T>(widgetLabel: K, registryItem: T[K]): void {
		this._overrides.define(widgetLabel, registryItem);
	}

	get<K extends keyof T>(widgetLabel: K): T[K] {
		return <WidgetBaseConstructor> this._overrides.get(widgetLabel) || super.get(widgetLabel);
	}

	has<K extends keyof T>(widgetLabel: K): boolean {
		return this._overrides.has(widgetLabel) || super.has(widgetLabel);
	}
}

export const gridRegistry = new GridRegistry();
