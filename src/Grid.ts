import { Subscription } from '@dojo/shim/Observable';
import { v, w } from '@dojo/widget-core/d';
import { DNode, PropertyChangeRecord } from '@dojo/widget-core/interfaces';
import { RegistryMixin }  from '@dojo/widget-core/mixins/Registry';
import { theme, ThemeableMixin, ThemeableProperties } from '@dojo/widget-core/mixins/Themeable';
import WidgetBase, { diffProperty } from '@dojo/widget-core/WidgetBase';
import WidgetRegistry from '@dojo/widget-core/WidgetRegistry';
import DataProviderBase, { Options } from './bases/DataProviderBase';
import Body from './Body';
import Cell from './Cell';
import Header from './Header';
import HeaderCell from './HeaderCell';
import { DataProperties, HasColumns, OnSortRequest } from './interfaces';
import Row from './Row';

import * as css from './styles/grid.m.css';

export const GridBase = ThemeableMixin(RegistryMixin(WidgetBase));

/**
 * @type GridProperties
 *
 * Properties that can be set on a Grid
 *
 * @property columns		Column definitions
 * @property dataProvider	An observable object that responds to events and returns {@link DataProperties}
 */
export interface GridProperties extends ThemeableProperties, HasColumns {
	registry?: WidgetRegistry;
	dataProvider: DataProviderBase<any, Options>;
}

const gridRegistry = new WidgetRegistry();
gridRegistry.define('header', Header);
gridRegistry.define('header-cell', HeaderCell);
gridRegistry.define('body', Body);
gridRegistry.define('row', Row);
gridRegistry.define('cell', Cell);

@theme(css)
class Grid extends GridBase<GridProperties> {
	private _data: DataProperties<any>;
	private _subscription: Subscription;
	private _onSortRequest: OnSortRequest;

	constructor() {
		super();

		this.registries.add(gridRegistry);
	}

	@diffProperty('dataProvider')
	protected diffPropertyDataProvider(previousDataProvider: DataProviderBase<any, Options>, dataProvider: DataProviderBase<any, Options>): PropertyChangeRecord {
		const changed = (previousDataProvider !== dataProvider);
		if (changed) {
			this._onSortRequest = dataProvider.sort.bind(dataProvider);

			this._subscription && this._subscription.unsubscribe();
			this._subscription = dataProvider.observe().subscribe((data) => {
				this._data = data;
				setTimeout(this.invalidate.bind(this));
			});
			// TODO: Remove notify when on demand scrolling (https://github.com/dojo/dgrid/issues/21 Initialization) is added
			dataProvider.notify();
		}

		return {
			changed,
			value: dataProvider
		};
	}

	render(): DNode {
		const {
			_data: {
				items = [],
				sort: sortDetails = []
			},
			_onSortRequest: onSortRequest,
			properties: {
				columns,
				theme
			}
		} = this;
		const registry: WidgetRegistry = <any> this.registries; // Pass down combined gridRegistry/properties.registry

		return v('div', {
			classes: this.classes(css.grid),
			role: 'grid'
		}, [
			w<Header>('header', {
				columns,
				registry,
				sortDetails,
				theme,
				onSortRequest
			}),
			w<Body>('body', {
				columns,
				items,
				registry,
				theme
			})
		]);
	}
}

export default Grid;
