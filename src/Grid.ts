import { Subscription } from '@dojo/shim/Observable';
import { v, w } from '@dojo/widget-core/d';
import { DNode, PropertyChangeRecord } from '@dojo/widget-core/interfaces';
import { theme, ThemeableMixin, ThemeableProperties } from '@dojo/widget-core/mixins/Themeable';
import WidgetBase, { diffProperty } from '@dojo/widget-core/WidgetBase';
import WidgetRegistry from '@dojo/widget-core/WidgetRegistry';
import DataProviderBase, { Options } from './bases/DataProviderBase';
import Body, { BodyProperties } from './Body';
import Cell from './Cell';
import Header, { HeaderProperties } from './Header';
import HeaderCell from './HeaderCell';
import { DataProperties, HasColumns } from './interfaces';
import Row from './Row';

import * as css from './styles/grid.m.css';

export const GridBase = ThemeableMixin(WidgetBase);

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

function createRegistry(registry?: WidgetRegistry) {
	if (!registry) {
		registry = new WidgetRegistry();
	}
	!registry.has('header') && registry.define('header', Header);
	!registry.has('header-cell') && registry.define('header-cell', HeaderCell);
	!registry.has('body') && registry.define('body', Body);
	!registry.has('row') && registry.define('row', Row);
	!registry.has('cell') && registry.define('cell', Cell);
	return registry;
}

@theme(css)
class Grid extends GridBase<GridProperties> {
	private _data: DataProperties<any>;
	private _subscription: Subscription;

	protected registry: WidgetRegistry;

	constructor() {
		super();

		this.registry = createRegistry();
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

	@diffProperty('registry')
	public diffPropertyRegistry(previousValue: WidgetRegistry, value: WidgetRegistry): PropertyChangeRecord {
		this.registry = createRegistry(value);

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
			},
			registry
		} = this;
		const {
			sort: onSortRequest
		} = dataProvider;

		return v('div', {
			classes: this.classes(css.grid),
			role: 'grid'
		}, [
			w<HeaderProperties>('header', {
				columns,
				registry,
				sortDetails: sort,
				theme,
				onSortRequest: onSortRequest && onSortRequest.bind(dataProvider)
			}),
			w<BodyProperties>('body', {
				columns,
				items,
				registry,
				theme
			})
		]);
	}
}

export default Grid;
