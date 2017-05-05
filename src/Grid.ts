import { includes } from '@dojo/shim/array';
import { Subscription } from '@dojo/shim/Observable';
import { v, w } from '@dojo/widget-core/d';
import { DNode, PropertyChangeRecord, PropertiesChangeEvent } from '@dojo/widget-core/interfaces';
import { RegistryMixin }  from '@dojo/widget-core/mixins/Registry';
import { theme, ThemeableMixin, ThemeableProperties } from '@dojo/widget-core/mixins/Themeable';
import WidgetBase, { diffProperty, onPropertiesChanged } from '@dojo/widget-core/WidgetBase';
import WidgetRegistry from '@dojo/widget-core/WidgetRegistry';
import DataProviderBase, { Options } from './bases/DataProviderBase';
import Body from './Body';
import Cell from './Cell';
import Header from './Header';
import HeaderCell from './HeaderCell';
import { DataProperties, HasColumns } from './interfaces';
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

	constructor() {
		super();

		this.registries.add(gridRegistry);
	}

	@diffProperty('dataProvider')
	protected diffPropertyDataProvider(previousValue: DataProviderBase<any, Options>, value: DataProviderBase<any, Options>): PropertyChangeRecord {
		if (this._subscription) {
			this._subscription.unsubscribe();
		}

		if (value) {
			this._subscription = value.observe().subscribe((data) => {
				this._data = data;
				this.invalidate();
			});
		}

		return {
			changed: (previousValue !== value),
			value
		};
	}

	render(): DNode {
		const {
			_data: {
				items = [],
				sort = []
			} = {},
			properties: {
				columns,
				dataProvider,
				theme
			}
		} = this;
		const {
			sort: onSortRequest
		} = dataProvider;
		const registry: WidgetRegistry = <any> this.registries;

		return v('div', {
			classes: this.classes(css.grid),
			role: 'grid'
		}, [
			w<Header>('header', {
				columns,
				registry,
				sortDetails: sort,
				theme,
				onSortRequest: onSortRequest && onSortRequest.bind(dataProvider)
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
