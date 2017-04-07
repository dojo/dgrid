import { Observable, Observer } from '@dojo/core/Observable';
import { DataProperties, SortDetails } from '../interfaces';

export interface Options {
	[option: string]: any;
}

export interface DataProviderState<O extends Options> {
	options: O;
	sort: SortDetails[];
}

abstract class DataProviderBase<T, O extends Options> {
	private data: DataProperties<T>;
	private state: DataProviderState<O>;

	observable: Observable<DataProperties<T>>;
	observers: Observer<DataProperties<T>>[];

	constructor(options: O) {
		this.state = {
			options: options || {},
			sort: []
		};
		this.observers = [];
		this.observable = new Observable((observer: Observer<DataProperties<T>>) => {
			this.observers.push(observer);
			if (this.data) {
				observer.next(this.data);
			}
		});

		this.updateData();
	}

	protected abstract buildData(state: DataProviderState<O>): DataProperties<T>;

	configure({ sort }: { sort: SortDetails | SortDetails[] }) {
		this.state.sort = Array.isArray(sort) ? sort : [ sort ];
		this.updateData();
	}

	observe() {
		return this.observable;
	}

	sort(sort: SortDetails | SortDetails[]) {
		this.state.sort = (Array.isArray(sort) ? sort : [ sort ]).map((sortDetail) => {
			if (!sortDetail.direction) {
				sortDetail.direction = 'asc';
			}
			return sortDetail;
		});
		this.updateData();
	}

	protected updateData() {
		const data = this.data = this.buildData(this.state);
		this.observers.forEach((observer) => {
			observer.next(data);
		});
	}
}

export default DataProviderBase;
