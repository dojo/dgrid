import { Observable, Observer } from '@dojo/core/Observable';
import { DataProperties, SliceDetails, SortDetails } from '../interfaces';

/**
 * Used by subclasses to add properties
 * required for their backing data.
 */
export interface DataProviderOptions {}

/**
 * Used in the constructor and {@link DataProviderBase#configure}
 * to make batched state changes to the data provider.
 */
export interface DataProviderConfiguration {
	slice?: SliceDetails;
	sort?: SortDetails | SortDetails[];
}

/**
 * Passed to {@link DataProviderBase#buildData}
 * to provide state to subclasses.
 */
export interface DataProviderState {
	slice?: SliceDetails;
	sort?: SortDetails[];
}

/**
 * Main base for all data providers to extend.
 *
 * Subclasses should be able to provide functionality by
 * implementing {@link DataProviderBase#buildData}.
 */
abstract class DataProviderBase<T = object, O extends DataProviderOptions = DataProviderOptions, C extends DataProviderConfiguration = DataProviderConfiguration> {
	private _observable: Observable<DataProperties<T>>;
	private _observers: Observer<DataProperties<T>>[] = [];

	protected data: DataProperties<T>;
	protected options: O;
	protected state: DataProviderState = {};

	constructor(options: O, configuration?: C) {
		this.options = options;
		if (configuration) {
			this.configure(configuration, false);
		}

		this._observable = new Observable((observer: Observer<DataProperties<T>>) => {
			this._observers.push(observer);
			if (this.data) {
				observer.next(this.data);
			}
			return () => {
				const index = this._observers.indexOf(observer);
				/* istanbul ignore else: type safety in case this function is called more than once */
				if (index > -1) {
					this._observers.slice(index, 1);
				}
			};
		});
	}

	/**
	 * Subclasses must implement this method and use constructor {@link DataProviderBase#options}
	 * and the current {@link DataProviderBase#state} to transform their backing data.
	 *
	 * Data must be assigned to {@link DataProviderBase#data}
	 */
	protected buildData(): void {}

	/**
	 * Perform a batch of state changes at once.
	 *
	 * @param configuration - State changes to make
	 */
	configure({ slice, sort }: C, updateData = true): void {
		/* istanbul ignore else: slice is not a required argument */
		if (slice) {
			this.state.slice = slice;
		}
		/* istanbul ignore else: sort is not a required argument */
		if (sort) {
			this.state.sort = Array.isArray(sort) ? sort : [ sort ];
		}
		if (updateData) {
			this.updateData();
		}
	}

	/**
	 * Notifies all observers with the latest structured data.
	 */
	notify(): void {
		if (!this.data) {
			this.buildData();
		}
		this._observers.forEach((observer) => {
			observer.next(this.data);
		});
	}

	/**
	 * Listen for new structured data created by state changes.
	 */
	observe(): Observable<DataProperties<T>> {
		return this._observable;
	}

	/**
	 * Apply a slice to the data that would be returned
	 * otherwise. Can also be assigned from
	 * {@link DataProviderBase#configure}.
	 *
	 * @param slice - Where to slice from and how many items to include
	 */
	slice(slice: SliceDetails) {
		this.state.slice = slice;
		this.updateData();
	}

	/**
	 * Apply a sort to the backing data. Can also be assigned
	 * from {@link DataProviderBase#configure}.
	 *
	 * @param sort - What column(s) to sort and in what direction
	 */
	sort(sort: SortDetails | SortDetails[]): void {
		this.state.sort = (Array.isArray(sort) ? sort : [ sort ]).map((sortDetail) => {
			if (!sortDetail.direction) {
				sortDetail.direction = 'asc';
			}
			return sortDetail;
		});
		this.updateData();
	}

	/**
	 * Automatically called after state changes are made.
	 */
	protected updateData(): void {
		this.buildData();
		this.notify();
	}
}

export default DataProviderBase;
