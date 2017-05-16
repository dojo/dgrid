import { Subscription } from '@dojo/shim/Observable';
import { v, w } from '@dojo/widget-core/d';
import { DNode, PropertyChangeRecord, WidgetBaseConstructor } from '@dojo/widget-core/interfaces';
import { RegistryMixin }  from '@dojo/widget-core/mixins/Registry';
import { theme, ThemeableMixin, ThemeableProperties } from '@dojo/widget-core/mixins/Themeable';
import WidgetBase, { diffProperty } from '@dojo/widget-core/WidgetBase';
import DataProviderBase from './bases/DataProviderBase';
import Body from './Body';
import GridRegistry, { gridRegistry } from './GridRegistry';
import Header from './Header';
import { DataProperties, HasColumns, SortRequestListener } from './interfaces';

import * as css from './styles/grid.m.css';

export const GridBase = ThemeableMixin(RegistryMixin(WidgetBase));

export type GridInterface = WidgetBaseConstructor<GridProperties>;

/**
 * @type GridProperties
 *
 * Properties that can be set on a Grid
 *
 * @property columns		Column definitions
 * @property dataProvider	An observable object that responds to events and returns {@link DataProperties}
 */
export interface GridProperties extends ThemeableProperties, HasColumns {
	registry?: GridRegistry;
	dataProvider: DataProviderBase;
}

@theme(css)
class Grid extends GridBase<GridProperties> {
	private _data: DataProperties<object> = <DataProperties<object>> {};
	private _subscription: Subscription;
	private _sortRequestListener: SortRequestListener;

	constructor() {
		super();

		this.registries.add(gridRegistry);
	}

	@diffProperty('dataProvider')
	protected diffPropertyDataProvider(previousDataProvider: DataProviderBase, dataProvider: DataProviderBase): PropertyChangeRecord {
		const changed = (previousDataProvider !== dataProvider);
		if (changed) {
			this._sortRequestListener = dataProvider.sort.bind(dataProvider);

			this._subscription && this._subscription.unsubscribe();
			this._subscription = dataProvider.observe().subscribe((data) => {
				this._data = (data || {});
				// TODO: Remove setTimeout when invalidation loop is adjusted (https://github.com/dojo/widget-core/pull/494/files)
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
			_sortRequestListener: onSortRequest,
			properties: {
				columns,
				theme,
				registry = gridRegistry
			}
		} = this;

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
