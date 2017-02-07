export interface SortDetail {
	columnId: string;
	descending?: boolean;
}

export interface ItemProperties<T> {
	id: string;
	data: T;
}

export interface DataProperties<T> {
	items: ItemProperties<T>[];
	sortDetails?: SortDetail[];
}
