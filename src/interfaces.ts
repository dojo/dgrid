import { WidgetBaseConstructor, WidgetProperties } from '@dojo/widget-core/interfaces';
import { RegistryMixinProperties } from '@dojo/widget-core/mixins/Registry';

export interface ItemProperties<T> {
	id: string;
	data: T;
}

export interface CellRendererProperties extends WidgetProperties, HasValue, HasColumn, HasItem, RegistryMixinProperties { }

export interface HasCellRenderer<T> {
	cellRenderer?(item: ItemProperties<T>): string | WidgetBaseConstructor<CellRendererProperties>;
}

export interface Column<T> extends HasCellRenderer<T> {
	id: string;
	label?: string;
	field?: string;
	sortable?: boolean; // default true
}

export interface HasColumn {
	column: Column<any>;
}

export interface HasItem {
	item: ItemProperties<any>;
}

export interface HasValue {
	value: string;
}
