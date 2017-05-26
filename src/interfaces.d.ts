export interface Column<T> {
	field?: keyof T;
	id: string;
	label?: string;
	sortable?: boolean; // default true
}

export interface DataProperties<T> {
	items: ItemProperties<T>[];
	size: SizeDetails;
	slice?: SliceDetails;
	sort?: SortDetails[];
}

export interface HasBufferRows {
	/**
	 * @default 10
	 */
	bufferRows?: number;
	/**
	 * @default 5
	 */
	rowDrift?: number;
}

export interface HasColumn {
	column: Column<any>;
}

export interface HasColumns {
	columns: Column<any>[];
}

export interface HasSize {
	size: SizeDetails;
}

export interface HasSortDetail {
	sortDetail?: SortDetails;
}

export interface HasSortDetails {
	sortDetails: SortDetails[];
}

export interface HasSlice {
	slice?: SliceDetails;
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
	index: number;
	data: T;
}

export interface ScrollToDetails {
	index: number;
	position?: 'top';
}

export interface ScrollToCompleteListener {
	(scrollTo: ScrollToDetails): void;
}

export interface ScrollToRequestListener {
	(scrollTo: ScrollToDetails): void;
}

export interface SizeDetails {
	dataLength: number;
	totalLength: number;
}

export interface SliceDetails {
	start: number;
	count: number;
}

export interface SliceRequestListener {
	(sliceDetails: SliceDetails): void;
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
