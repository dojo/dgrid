import { WidgetBaseConstructor } from '@dojo/widget-core/interfaces';
import WidgetRegistry from '@dojo/widget-core/WidgetRegistry';
import Body, { BodyInterface } from './Body';
import Cell, { CellInterface } from './Cell';
import Footer, { FooterInterface } from './Footer';
import Header, { HeaderInterface } from './Header';
import HeaderCell, { HeaderCellInterface } from './HeaderCell';
import Row, { RowInterface } from './Row';

export interface GridRegistered {
	[key: string]: WidgetBaseConstructor;
	body: BodyInterface;
	cell: CellInterface;
	footer: FooterInterface;
	header: HeaderInterface;
	'header-cell': HeaderCellInterface;
	row: RowInterface;
}

export default class GridRegistry<T extends GridRegistered = GridRegistered> extends WidgetRegistry {
	private _overrides: WidgetRegistry = new WidgetRegistry();

	constructor() {
		super();

		super.define('body', Body);
		super.define('cell', Cell);
		super.define('footer', Footer);
		super.define('header', Header);
		super.define('header-cell', HeaderCell);
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
