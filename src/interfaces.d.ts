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
	onSliceRequest: SliceRequestListener;
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

export interface HasScrollTo {
	scrollTo?: ScrollToDetails;
	onScrollToComplete?: ScrollToCompleteListener;
	onScrollToRequest?: ScrollToRequestListener;
}

export interface HasValue {
	value: string;
}

export interface ItemProperties<T = any> {
	id: string;
	data: T;
}

export interface ScrollToDetails {
	index: number;
	position?: 'top';
}

export interface ScrollToCompleteListener {
	(index: number): void;
}

export interface ScrollToRequestListener {
	(index: number): void;
}

export interface SliceDetails {
	start: number;
	count: number;
}

export interface SliceRequestListener {
	onSliceRequest(sliceDetails: SliceDetails): void;
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
