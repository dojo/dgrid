import { Subscription } from '@dojo/shim/Observable';
import { v, w } from '@dojo/widget-core/d';
import { DNode, PropertyChangeRecord } from '@dojo/widget-core/interfaces';
import { RegistryMixin }  from '@dojo/widget-core/mixins/Registry';
import { theme, ThemeableMixin, ThemeableProperties } from '@dojo/widget-core/mixins/Themeable';
import WidgetBase, { diffProperty } from '@dojo/widget-core/WidgetBase';
import DataProviderBase from './bases/DataProviderBase';
import Body from './Body';
import GridRegistry, { gridRegistry } from './GridRegistry';
import Header from './Header';
import {  DataProperties, HasBufferRows,  HasColumns, HasScrollTo, ScrollToDetails, SliceRequestListener,  SortRequestListener } from './interfaces';

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
export interface GridProperties extends ThemeableProperties, HasBufferRows, HasColumns, HasScrollTo {
	dataProvider: DataProviderBase;
	registry?: GridRegistry;
}

@theme(css)
class Grid extends GridBase<GridProperties> {
	private _data: DataProperties<object> = <DataProperties<object>> {};
	private _scrollTo: ScrollToDetails;
	private _subscription: Subscription;
	private _sortRequestListener: SortRequestListener;
	private _sliceRequestListener: SliceRequestListener;

	constructor() {
		super();

		this.registries.add(gridRegistry);
	}

	@diffProperty('dataProvider')
	protected diffPropertyDataProvider(previousDataProvider: DataProviderBase, dataProvider: DataProviderBase): PropertyChangeRecord {
		const changed = (previousDataProvider !== dataProvider);
		if (changed) {
			this._sliceRequestListener = dataProvider.slice.bind(dataProvider);
			this._sortRequestListener = dataProvider.sort.bind(dataProvider);

			this._subscription && this._subscription.unsubscribe();
			this._subscription = dataProvider.observe().subscribe((data) => {
				this._data = (data || {});
				this.invalidate();
			});
		}

		return {
			changed,
			value: dataProvider
		};
	}

	private onScrollToRequest(scrollTo: ScrollToDetails) {
		this._scrollTo = scrollTo;
		this.invalidate();
	}

	private onScrollToComplete(scrollTo: ScrollToDetails) {
		delete this._scrollTo;
		const {
			onScrollToComplete
		} = this.properties;
		onScrollToComplete && onScrollToComplete(scrollTo);
	}

	render(): DNode {
		const {
			_data: {
				items = [],
				size = { dataLength: 0, totalLength: 0 },
				slice,
				sort: sortDetails = []
			},
			_sliceRequestListener: onSliceRequest,
			_sortRequestListener: onSortRequest,
			onScrollToComplete,
			onScrollToRequest,
			properties: {
				bufferRows,
				columns,
				theme,
				registry = gridRegistry,
				rowDrift,
				scrollTo = this._scrollTo
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
				bufferRows,
				columns,
				items,
				onScrollToComplete,
				onScrollToRequest,
				onSliceRequest,
				registry,
				scrollTo,
				size,
				slice,
				rowDrift,
				theme
			})
		]);
	}
}

export default Grid;
