import { Subscription } from '@dojo/shim/Observable';
import { v, w } from '@dojo/widget-core/d';
import { DNode, PropertyChangeRecord } from '@dojo/widget-core/interfaces';
import { RegistryMixin }  from '@dojo/widget-core/mixins/Registry';
import { theme, ThemeableMixin, ThemeableProperties } from '@dojo/widget-core/mixins/Themeable';
import WidgetBase, { diffProperty } from '@dojo/widget-core/WidgetBase';
import { reference } from '@dojo/widget-core/diff';
import DataProviderBase from './bases/DataProviderBase';
import Body from './Body';
import ColumnHeaders from './ColumnHeaders';
import Footer from './Footer';
import GridRegistry, { gridRegistry } from './GridRegistry';
import Header, { HeaderType } from './Header';
import { DataProperties, HasColumns, SortRequestListener } from './interfaces';

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
	registry?: GridRegistry;
	dataProvider: DataProviderBase;
	footers?: (HeaderType | DNode)[];
	headers?: (HeaderType | DNode)[];
}

@theme(css)
class Grid extends GridBase<GridProperties> {
	private _data: DataProperties<object> = <DataProperties<object>> {};
	private _subscription: Subscription;
	private _sortRequestListener: SortRequestListener;

	constructor() {
		super();

		this.getRegistries().add(gridRegistry);
	}

	@diffProperty('dataProvider', reference)
	protected diffPropertyDataProvider({ dataProvider: previousDataProvider }: GridProperties, { dataProvider }: GridProperties) {
		this._sortRequestListener = dataProvider.sort.bind(dataProvider);

		this._subscription && this._subscription.unsubscribe();
		this._subscription = dataProvider.observe().subscribe((data) => {
			this._data = (data || {});
			this.invalidate();
		});
		// TODO: Remove notify when on demand scrolling (https://github.com/dojo/dgrid/issues/21 Initialization) is added
		dataProvider.notify();
	}

	protected inflateHeaderTypes(nodes: (HeaderType | DNode)[]): DNode[] {
		const {
			_data: {
				sort: sortDetails = []
			},
			_sortRequestListener: onSortRequest,
			properties: {
				columns,
				theme,
				registry = gridRegistry
			}
		} = this;

		return nodes.map((child) => {
			return (child === HeaderType.COLUMN_HEADERS) ? w<ColumnHeaders>('column-headers', {
				columns,
				registry,
				sortDetails,
				theme,
				onSortRequest
			}) : <DNode> child;
		});
	}

	render(): DNode {
		const {
			_data: {
				items = []
			},
			properties: {
				columns,
				footers = [],
				headers = [ HeaderType.COLUMN_HEADERS ],
				theme,
				registry = gridRegistry
			}
		} = this;

		return v('div', {
			classes: this.classes(css.grid),
			role: 'grid'
		}, [
			w<Header>('header', {
				registry,
				theme
			}, this.inflateHeaderTypes(headers)),
			w<Body>('body', {
				columns,
				items,
				registry,
				theme
			}),
			w<Footer>('footer', {
				registry,
				theme
			}, this.inflateHeaderTypes(footers))
		]);
	}
}

export default Grid;
