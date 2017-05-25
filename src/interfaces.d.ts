export interface Column<T> {
	field?: keyof T;
	id: string;
	label?: string;
	sortable?: boolean; // default true
}

export interface DataProperties<T> {
	items: ItemProperties<T>[];
	slice?: SliceDetails;
	sort?: SortDetails[];
}

export interface HasColumn {
	column: Column<any>;
}

export interface HasColumns {
	columns: Column<any>[];
}

export interface HasSortDetail {
	sortDetail?: SortDetails;
}

export interface HasSortDetails {
	sortDetails: SortDetails[];
}

export interface HasSliceEvent {
	onSliceRequest(sliceDetails: SliceDetails): void;
}

export interface HasSortEvent {
	onSortRequest: SortRequestListener;
}

export interface HasItem {
	item: ItemProperties<any>;
}

export interface HasItems {
	items: ItemProperties<any>[];
}

export interface HasValue {
	value: string;
}

export interface ItemProperties<T> {
	id: string;
	data: T;
}

export interface SliceDetails {
	start: number;
	count: number;
}

export type SortDirection = 'asc' | 'desc';

export interface SortDetails {
	columnId: string;
	/**
	 * @default 'asc'
	 */
	direction?: SortDirection;
}

export interface SortRequestListener {
	(sortDetail: SortDetails): void;
}
