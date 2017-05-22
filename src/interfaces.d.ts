import { DNode } from '@dojo/widget-core/interfaces';

export interface Column<T = any, V = string> {
	field?: keyof T;
	id: string;
	label?: string;
	sortable?: boolean; // default true
	render?(item: ItemProperties<T>, column: Column<T>): DNode;
	get?(item: ItemProperties<T>, column: Column<T>): V;
	renderValue?(value: V, item: ItemProperties<T>, column: Column<T>): DNode;
}

export interface DataProperties<T> {
	items: ItemProperties<T>[];
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

export interface HasSortDetail {
	sortDetail?: SortDetails;
}

export interface HasSortDetails {
	sortDetails: SortDetails[];
}

export interface SortRequestListener {
	(sortDetail: SortDetails): void;
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
	data: T;
}

export type SortDirection = 'asc' | 'desc';

export interface SortDetails {
	columnId: string;
	/**
	 * @default 'asc'
	 */
	direction?: SortDirection;
}
