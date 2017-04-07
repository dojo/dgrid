export interface SortDetails {
	columnId: string;
	descending?: boolean;
}

export interface ItemProperties<T> {
	id: string;
	data: T;
}

export interface Column<T> {
	id: string;
	label?: string;
	field?: string;
	sortable?: boolean; // default true
}

export interface HasColumns {
	columns: Column<any>[];
}

export interface HasColumn {
	column: Column<any>;
}

export interface HasSortDetail {
	sortDetail?: SortDetails;
}

export interface HasSortDetails {
	sortDetails: SortDetails[];
}

export interface HasSortEvent {
	onSortRequest(sortDetail: SortDetails): void;
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
