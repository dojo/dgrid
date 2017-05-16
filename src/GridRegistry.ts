import { WidgetBaseConstructor } from '@dojo/widget-core/interfaces';
import WidgetRegistry from '@dojo/widget-core/WidgetRegistry';
import Body from './Body';
import Cell from './Cell';
import Header from './Header';
import HeaderCell from './HeaderCell';
import Row from './Row';

export interface GridRegistered {
	[key: string]: WidgetBaseConstructor;
	header: typeof Header;
	'header-cell': typeof HeaderCell;
	body: typeof Body;
	row: typeof Row;
	cell: typeof Cell;
}

export default class GridRegistry<T extends GridRegistered = GridRegistered> extends WidgetRegistry {
	constructor() {
		super();

		this.define('header', Header);
		this.define('header-cell', HeaderCell);
		this.define('body', Body);
		this.define('row', Row);
		this.define('cell', Cell);
	}

	define<K extends keyof T>(widgetLabel: K, registryItem: T[K]): void {
		super.define(widgetLabel, registryItem);
	}

	get<K extends keyof T>(widgetLabel: K): T[K] {
		return <WidgetBaseConstructor> super.get(widgetLabel);
	}

	has<K extends keyof T>(widgetLabel: K): boolean {
		return super.has(widgetLabel);
	}
}

export const gridRegistry = new GridRegistry();
