import { Observable, Observer } from '@dojo/core/Observable';
import { DataProperties, SortDetails } from '../interfaces';

/**
 * Used in the constructor and {@link DataProviderBase#configure}
 * to make batched state changes to the data provider.
 */
export interface DataProviderConfiguration {
	sort?: SortDetails | SortDetails[];
}

/**
 * Used by subclasses to add properties
 * required for their backing data.
 */
export interface Options {
	[option: string]: any;
	configuration?: DataProviderConfiguration;
}

/**
 * Passed to {@link DataProviderBase#buildData}
 * to provide state to subclasses.
 */
export interface DataProviderState<O extends Options> {
	options: O;
	sort?: SortDetails[];
}

/**
 * Main base for all data providers to extend.
 *
 * Subclasses should be able to provide functionality by
 * implementing {@link DataProviderBase#buildData}.
 */
abstract class DataProviderBase<T, O extends Options> {
	private _data: DataProperties<T>;
	private _state: DataProviderState<O>;
	private _observable: Observable<DataProperties<T>>;
	private _observers: Observer<DataProperties<T>>[] = [];

	constructor(options: O) {
		const {
			configuration: {
				sort = []
			} = {}
		} = options;

		this._state = {
			options
		};
		this._state.sort = Array.isArray(sort) ? sort : [ sort ];
		this._observable = new Observable((observer: Observer<DataProperties<T>>) => {
			this._observers.push(observer);
			if (this._data) {
				observer.next(this._data);
			}
		});
	}

	/**
	 * Subclasses must implement this method and use
	 * the current state to structure their backing data.
	 *
	 * @param state - The state (e.g. sorting) to apply to backing data
	 */
	protected abstract buildData(state: DataProviderState<O>): DataProperties<T>;

	/**
	 * Perform a batch of state changes at once.
	 *
	 * @param configuration - State changes to make
	 */
	configure({ sort }: DataProviderConfiguration): void {
		if (sort) {
			this._state.sort = Array.isArray(sort) ? sort : [ sort ];
		}
		this.updateData();
	}

	/**
	 * Notifies all observers with the latest structured data.
	 */
	notify(): void {
		let { _data: data } = this;
		if (!data) {
			data = this._data = this.buildData(this._state);
		}
		this._observers.forEach((observer) => {
			observer.next(data);
		});
	}

	/**
	 * Listen for new structured data created by state changes.
	 */
	observe(): Observable<DataProperties<T>> {
		return this._observable;
	}

	/**
	 * Apply a sort to the backing data. Can also be assigned
	 * from {@link DataProviderBase#configure}.
	 *
	 * @param sort - What column(s) to sort and in what direction
	 */
	sort(sort: SortDetails | SortDetails[]): void {
		this._state.sort = (Array.isArray(sort) ? sort : [ sort ]).map((sortDetail) => {
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
		this._data = this.buildData(this._state);
		this.notify();
	}
}

export default DataProviderBase;
