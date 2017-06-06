import { DNode } from '@dojo/widget-core/interfaces';

/**
 * @type Column
 *
 * Adds information about a column that will be used by the
 * grid when retrieving and displaying data.
 *
 * @typeparam T        Used by field property and cell customization functions to enforce type safety
 * @typeparam V        Used by cell customization to ensure the same type is used by get and render
 * @property  field    Property on the row's data item to use to look up the column's value
 * @property  get      Manually return the value or content to use for this column
 * @property  id       A unique identifier for this column
 * @property  label    The label to use in the column's header
 * @property  sortable Set to false to indicate the column is not sortable
 * @property  render   Use this column's value to provide content for this column
 */
export interface Column<T = any, V = string> {
	field?: keyof T;
	get?: V | ((item: ItemProperties<T>, column: Column<T>) => V);
	id: string;
	label?: string;
	sortable?: boolean; // default true
	render?(options: ColumnRenderOptions<T, V>): DNode;
}

export interface ColumnRenderOptions<T = any, V = string> {
	column: Column<T>;
	item: ItemProperties<T>;
	value: V;
}

export interface DataProperties<T> {
	items: ItemProperties<T>[];
	size: SizeDetails;
	slice?: SliceDetails;
	sort?: SortDetails[];
}

export interface HasContent {
	content: DNode;
}

export interface HasColumn {
	column: Column<any, any>;
}

export interface HasColumns {
	columns: Column<any, any>[];
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

export interface HasSortEvent {
	onSortRequest: SortRequestListener;
}

export interface HasItem {
	item: ItemProperties;
}

export interface HasItems {
	items: ItemProperties[];
}

export interface HasValue {
	value: string;
}

export interface ItemProperties<T = any> {
	id: string;
	index: number;
	data: T;
}

/**
 * @type SizeDetails
 *
 * Adds information about the size of a data set
 *
 * @property  dataLength  The number of items in the data set available through a slice operation
 * @property  totalLength The total number of items in the data
 */
export interface SizeDetails {
	dataLength: number;
	totalLength: number;
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
