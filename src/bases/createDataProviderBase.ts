import { SortDetail, DataProperties } from '../interfaces';
import { Observable, Observer } from '@dojo/core/Observable';
import compose, { Options } from '@dojo/compose/compose';
import WeakMap from '@dojo/shim/WeakMap';

export interface DgridDataProviderGridState<O extends Options> {
	options: O;
	sorts: SortDetail[];
}

export interface DgridDataProviderState extends DgridDataProviderGridState<Options> {
	data?: DataProperties<any>;
	observers: Observer<DataProperties<any>>[];
	observable: Observable<DataProperties<any>>;
}

export interface DgridDataProvider {
	data(state: DgridDataProviderGridState<Options>): DataProperties<any>;
	sorts: SortDetail[];
	observe(): Observable<DataProperties<any>>;
	onSortRequest(sortDetail: SortDetail): void;
}

const instanceStateMap = new WeakMap<DgridDataProvider, DgridDataProviderState>();

function updateData(dataProvider: DgridDataProvider, observer?: Observable<DataProperties<any>>) {
	const state = instanceStateMap.get(dataProvider);
	const data = state.data = dataProvider.data(state);
	state.observers.forEach((observer) => {
		observer.next(data);
	});
}

const createDataProviderBase = compose<DgridDataProvider, Options>({
	data() {
		return {
			items: [ ]
		};
	},
	set sorts(this: DgridDataProvider, sorts: SortDetail[]) {
		const state = instanceStateMap.get(this);
		state.sorts = sorts;
		updateData(this);
	},
	get sorts(this: DgridDataProvider) {
		return instanceStateMap.get(this).sorts;
	},
	observe(this: DgridDataProvider) {
		return instanceStateMap.get(this).observable;
	},
	onSortRequest(this: DgridDataProvider, sortDetail: SortDetail) {
		const {
			columnId,
			descending = false
		} = sortDetail;
		this.sorts = [ { columnId, descending }];
	}
}, function(instance, options) {
	const observable = new Observable<DataProperties<any>>(function subscribe(this: DgridDataProvider, observer: Observer<DataProperties<any>>) {
		const state = instanceStateMap.get(this);
		state.observers.push(observer);
		if (state.data) {
			observer.next(state.data);
		}
		return () => {
			function remove(observer: Observer<DataProperties<any>>) {
				state.observers.splice(state.observers.indexOf(observer), 1);
			}
			setTimeout(() => {
				remove(observer);
			});
		};
	}.bind(instance));
	const state: DgridDataProviderState = {
		options: options || {},
		sorts: [],
		observers: [],
		observable: observable
	};
	instanceStateMap.set(instance, state);

	updateData(instance);
});

export default createDataProviderBase;
