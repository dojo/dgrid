import { from, includes } from '@dojo/shim/array';
import Map from '@dojo/shim/Map';
import { v, w } from '@dojo/widget-core/d';
import { DNode, PropertiesChangeEvent } from '@dojo/widget-core/interfaces';
import { RegistryMixin, RegistryMixinProperties } from '@dojo/widget-core/mixins/Registry';
import { theme, ThemeableMixin, ThemeableProperties } from '@dojo/widget-core/mixins/Themeable';
import WidgetBase, { onPropertiesChanged } from '@dojo/widget-core/WidgetBase';
import { HasBufferRows, HasColumns, HasItems, HasScrollTo, HasScrollToEvent, HasSize, HasSlice, HasSliceEvent, ItemProperties } from './interfaces';
import Row from './Row';

import * as css from './styles/body.m.css';

export const BodyBase = ThemeableMixin(RegistryMixin(WidgetBase));

export interface BodyProperties extends ThemeableProperties, HasBufferRows, HasColumns, HasItems, HasScrollTo, HasScrollToEvent, HasSize, HasSlice, HasSliceEvent, RegistryMixinProperties {}

interface RenderedDetails {
	add: boolean;
	remove: boolean;
	element?: HTMLElement;
	index: number;
	height?: number;
}

@theme(css)
class Body extends BodyBase<BodyProperties> {
	private _firstVisibleKey: string;
	private _itemElementMap = new Map<string, RenderedDetails>();
	private _marginTop?: RenderedDetails;
	private _scrollerElement: HTMLElement;
	private _scrollTop = 0;

	/**
	 * Creates a DNode for the passed item and either
	 * creates or updates an associated entry in
	 * the item element map.
	 */
	protected createNodeFromItem(item: ItemProperties, index: number) {
		const {
			_itemElementMap: itemElementMap,
			properties: {
				columns,
				theme,
				registry
			}
		} = this;

		const key = item.id;
		let details = itemElementMap.get(key);
		if (!details) {
			details = {
				add: true,
				remove: false,
				index: index
			};
			itemElementMap.set(key, details);
		}
		else {
			details.index = index;
		}

		return v('div', {
			key
		}, [
			w<Row>('row', {
				columns,
				item,
				key,
				registry,
				theme
			})
		]);
	}

	/**
	 * Uses the height of the scroll area and the estimated row height
	 * to estimate the number of rows that will fill it
	 */
	protected estimatedRowCount(): number {
		const {
			_scrollerElement: scrollerElement
		} = this;

		const height = scrollerElement.offsetHeight;
		if (height) {
			return Math.round(height / this.estimatedRowHeight());
		}
		return 30;
	}

	/**
	 * Based on what is currently rendered, find the average height
	 * of each row and, if nothing is rendered, return 20.
	 */
	protected estimatedRowHeight(): number {
		const {
			_itemElementMap: itemElementMap
		} = this;

		let rowHeight = 0;
		let rowCount = 0;
		for (let details of from(itemElementMap.values())) {
			if (details.element) {
				rowHeight += details.element.offsetHeight;
				rowCount++;
			}
		}

		return Math.round(rowHeight / rowCount) || 20;
	}

	/**
	 * Shared method used by both onElementCreated and
	 * onElementUpdated to track DOM changes
	 */
	protected onElementChange(element: HTMLElement, key: string): void {
		const {
			_itemElementMap: itemElementMap,
			_marginTop: marginTop
		} = this;

		if (key === 'marginTop') {
			marginTop && (marginTop.element = element);
			return;
		}

		if (key === 'marginBottom') {
			return;
		}

		if (key === 'scroller') {
			this._scrollerElement = element;

			const {
				properties: {
					items,
					slice: {
						start = 0
					} = {},
					onSliceRequest
				}
			} = this;

			if (items.length === 0) {
				// If there has been no data passed (e.g. during initialization),
				// we wait until the scroll area appears to get a more accurate
				// estimate of how many rows to ask for initially

				// Use the start value we found and request an amount of data
				// equal to the additional data above the scroll area, the number
				// of visible rows and the additional data below the scroll area
				onSliceRequest && onSliceRequest({ start, count: this.estimatedRowCount() });
			}
			else {
				// We hit this when the children of the scroll area change
				// e.g. after we guess how many rows we'll need. The onScroll
				// method will take this information and add additional rows
				// before and after this content as padding.
				this.onScroll();
			}

			return;
		}

		const details = itemElementMap.get(key);
		if (details) {
			// store the DOM node if its representation changes
			details.element = element;
		}
	}

	protected onElementCreated(element: HTMLElement, key: string): void {
		this.onElementChange(element, key);
	}

	protected onElementUpdated(element: HTMLElement, key: string): void {
		if (key === 'scroller') {
			const {
				_firstVisibleKey: firstVisibleKey,
				_itemElementMap: itemElementMap,
				_marginTop: marginTop,
				_scrollerElement: scrollerElement,
				properties: {
					onScrollToComplete,
					scrollTo
				}
			} = this;
			let scrollTop = this._scrollTop;

			const detailsEntries = from(itemElementMap.entries());

			// Check to see if all items are new
			let cleared = true;
			for (const [ , details] of detailsEntries) {
				if (!details.add) {
					cleared = false;
					break;
				}
			}
			if (cleared) {
				scrollTop = 0;
				if (marginTop && marginTop.element) {
					scrollTop = marginTop.element.offsetHeight;
				}

				if (onScrollToComplete && scrollTo) {
					onScrollToComplete(scrollTo);
				}

				// mark nodes as having been factored into scroll calculations
				for (const [ , details] of detailsEntries) {
					details.add = false;
				}
				marginTop && (marginTop.add = false);
			}
			else {
				// Track size changed of rows before the first visible row
				let beforeVisible = true;
				for (const [ itemKey, details ] of detailsEntries) {
					if (itemKey === firstVisibleKey) {
						beforeVisible = false;
					}

					if (beforeVisible) {
						if (details.add && details.element) {
							// added items increase scrollTop
							scrollTop += details.element.offsetHeight;
						}
						if (details.remove) {
							// removed items decrease scrollTop
							scrollTop -= (details.height || 0);
						}
					}

					// mark nodes as having been factored into scroll calculations
					details.add = false;
					if (details.remove) {
						itemElementMap.delete(itemKey);
					}
				}

				// factor in the addition or removal of the top margin
				if (marginTop) {
					if (marginTop.add && marginTop.element) {
						scrollTop += marginTop.element.offsetHeight;
						marginTop.add = false;
					}
					if (marginTop.remove) {
						scrollTop -= (marginTop.height || 0);
						delete this._marginTop;
					}
				}
			}

			if (scrollerElement.scrollTop !== scrollTop) {
				// The scroll event handler will adjust the slice
				scrollerElement.scrollTop = scrollTop;
				return;
			}
			// Otherwise, let the onElementChange method handle the slice
		}

		this.onElementChange(element, key);
	}

	@onPropertiesChanged()
	onPropertiesChanged(evt: PropertiesChangeEvent<this, BodyProperties>) {
		const {
			scrollTo
		} = evt.properties;
		const {
			_itemElementMap: itemElementMap,
			_scrollerElement: scrollerElement,
			properties: {
				items,
				onScrollToComplete,
				onSliceRequest
			}
		} = this;

		if (includes(evt.changedPropertyKeys, 'scrollTo') && scrollTo) {
			// the scrollTo property was passed either by the user
			// or by the grid after a call to onScrollToRequest
			const index = scrollTo.index;
			for (const item of items) {
				// we saved the "true" index on all details
				// objects so we can just directly compare
				if (item.index === index) {
					const renderedDetails = itemElementMap.get(item.id);
					if (renderedDetails && renderedDetails.element) {
						// if this exists within the grid, just scroll to it
						// and allow the event handler to fill in any missing data
						scrollerElement.scrollTop = renderedDetails.element.offsetTop;
						// notify the property listener that this is done
						// to allow it to clear this property
						onScrollToComplete && onScrollToComplete(scrollTo);
						return;
					}
					break;
				}
			}

			// this index is not currently rendered so we request a slice
			// of the data with a number of rows to hopefully fill in the scroll area
			onSliceRequest && onSliceRequest({ start: index, count: this.estimatedRowCount() });
		}
	}

	protected onScroll() {
		const {
			_itemElementMap: itemElementMap,
			_scrollerElement: scrollerElement,
			properties: {
				bufferRows = 10,
				items,
				rowDrift = 5,
				slice: {
					start = 0
				} = {},
				size: {
					dataLength
				},
				onScrollToRequest,
				onSliceRequest
			}
		} = this;
		const max = (dataLength > 0 ? dataLength - 1 : 0);
		const visibleKeys = this.visibleKeys();

		// On a very rapid scroll, the grid may have reached
		// an area with no rendered rows
		if (visibleKeys.length === 0) {
			const scroll = scrollerElement.scrollTop;
			const allDetails = from(itemElementMap.values());
			for (const details of allDetails) {
				if (details.element && details.element.offsetTop) {
					const delta = (details.element.offsetTop - scroll);
					if (delta > 0) {
						// The top of the rendered data is below the current viewport
						// so we try to guess how many rows were skipped and jump
						// down to that area
						const estimatedRowHeight = this.estimatedRowHeight();
						const index = Math.max(0, (start - Math.round(delta / estimatedRowHeight)));
						onScrollToRequest && onScrollToRequest({ index });
						return;
					}
					break;
				}
			}
			for (const renderedDetails of allDetails.reverse()) {
				if (renderedDetails.element && renderedDetails.element.offsetTop && renderedDetails.element.offsetHeight) {
					const delta = (scroll - (renderedDetails.element.offsetTop + renderedDetails.element.offsetHeight));
					if (delta > 0) {
						// The bottom of the rendered data is above the current viewport
						// so we try to guess how many rows were skipped and jump
						// down to that area
						const estimatedRowHeight = this.estimatedRowHeight();
						const index = Math.min(max, (start + items.length + Math.round(delta / estimatedRowHeight)));
						onScrollToRequest && onScrollToRequest({ index });
						return;
					}
					break;
				}
			}
		}
		else {
			// This is the typical path the code will take
			this._scrollTop = scrollerElement.scrollTop;
			this._firstVisibleKey = visibleKeys[0];
			const details = itemElementMap.get(this._firstVisibleKey);
			if (details) {
				// Use the index of the first row as a starting point
				// as well as moving back a few rows so there's
				// additional data above the scroll area
				const sliceStart = Math.max(0, details.index - bufferRows);
				let sliceCount = (Math.min(details.index, bufferRows) + visibleKeys.length + bufferRows);
				// Use the start value we found and request an amount of data
				// equal to the additional data above the scroll area, the number
				// of visible rows and the additional data below the scroll area

				// Limit data requests so that we only ever ask for
				// a. start/count combinations that differ from what we already have (see c.)
				// b. a start or end index change that exceeds a limit we're comfortable with
				// c. the very start or very end of the data even if that limit is not reached
				const startDelta = Math.abs(sliceStart - start);
				const countDelta = Math.abs(sliceCount - items.length);
				const atStart = (sliceStart === 0);
				const atEnd = (sliceStart + sliceCount) === max;
				if ((startDelta || countDelta) && (atStart || atEnd || startDelta > rowDrift || countDelta > rowDrift)) {
					onSliceRequest && onSliceRequest({ start: sliceStart, count: sliceCount });
				}
			}
		}
	}

	render(): DNode {
		const {
			_itemElementMap: itemElementMap,
			properties: {
				items,
				size: {
					dataLength
				},
				slice: {
					start = 0
				} = {}
			}
		} = this;
		const max = (dataLength > 0 ? dataLength - 1 : 0);

		const children: DNode[] = [];

		// Create a top margin if the data has any offset at all
		let marginTop = this._marginTop;
		if (start > 0) {
			if (!marginTop) {
				marginTop = this._marginTop = {
					add: true,
					remove: false,
					index: -1
				};
			}
			children.push(v('div', {
				key: 'marginTop',
				styles: {
					height: '10000px'
				}
			}));
		}
		else if (marginTop) {
			if (marginTop.element) {
				marginTop.height = marginTop.element.offsetHeight;
			}
			marginTop.remove = true;
		}

		const previousKeys = from(itemElementMap.keys());
		if (previousKeys.length === 0) {
			// There were no item rows the last time render was called
			// so every row is added
			for (let i = 0, item; (item = items[i]); i++) {
				children.push(this.createNodeFromItem(item, (start + i)));
			}
		}
		else {
			// Create a new map so that the items will be ordered correctly
			const updatedElementMap = new Map<string, RenderedDetails>();

			// Keep a map of current keys (item IDs) and items
			const itemsByKey: { [key: string]: DNode } = {};
			const currentKeys: string[] = items.map((item, index) => {
				const key = item.id;
				// createNodeFromItem marks this item as having been added
				// automatically if it didn't exist in the mapping (is new)
				itemsByKey[key] = this.createNodeFromItem(item, (start + index));
				return key;
			});

			// find which keys are new and at what index they will appear
			let cleared = true;
			let addedKeys: string[] = [];
			const keyPatches: { [ index: number]: string[] } = {};
			let previousKeyIndex = 0;
			for (const currentKey of currentKeys) {
				const foundAtIndex = previousKeys.indexOf(currentKey, previousKeyIndex);
				if (foundAtIndex === -1) {
					addedKeys.push(currentKey);
				}
				else {
					if (addedKeys.length) {
						keyPatches[previousKeyIndex] = addedKeys;
						addedKeys = [];
					}

					cleared = false;
					previousKeyIndex = (foundAtIndex + 1);
				}
			}
			if (addedKeys.length) {
				keyPatches[previousKeys.length] = addedKeys;
			}

			// If all keys are new, we can start from scratch
			if (cleared) {
				itemElementMap.clear();
				return this.render();
			}

			// Use previous keys to watch for deleted items
			// and insert new keys at the indexes detected above
			for (let i = 0, il = previousKeys.length; i <= il; i++) {
				const key = previousKeys[i];

				const keyPatch = keyPatches[i];
				if (keyPatch) {
					for (const addedKey of keyPatch) {
						// Insert any newly introduced items
						// that were added at this index
						children.push(itemsByKey[addedKey]);

						// Add to the updated element map
						const update = itemElementMap.get(addedKey);
						if (update) {
							updatedElementMap.set(addedKey, update);
						}
					}
				}

				if (i < il) {
					const item = itemsByKey[key];
					const details = itemElementMap.get(key);
					if (item) {
						// This item has neither been added nor removed
						// since the last render
						children.push(item);

						// Add to the updated element map
						const update = itemElementMap.get(key);
						if (update) {
							updatedElementMap.set(key, update);
						}
					}
					else if (details) {
						// This item was deleted since the last render
						if (!details.remove && details.element) {
							// Store its rendered height before it is removed from DOM
							// as it will not be added as a row in the next render
							details.height = details.element.offsetHeight;
						}
						// Mark this item as having been deleted
						details.remove = true;

						// Add to the updated element map.
						// This entry will be deleted once its size
						// is taken into account in onElementUpdated
						const updated = itemElementMap.get(key);
						if (updated) {
							updatedElementMap.set(key, updated);
						}
					}
				}
			}

			// Store the updated item map
			this._itemElementMap = updatedElementMap;
		}

		// Create a bottom margin if the data doesn't extend all the way to the end
		if (start + items.length < max) {
			children.push(v('div', {
				key: 'marginBottom',
				styles: {
					height: ('10000px')
				}
			}));
		}

		return v('div', {
			classes: this.classes(css.scroller),
			key: 'scroller',
			onscroll: this.onScroll
		}, children);
	}

	protected visibleKeys() {
		const {
			_itemElementMap: itemElementMap,
			_scrollerElement: scrollerElement
		} = this;

		const scrollTop = scrollerElement.scrollTop;
		const contentHeight = scrollerElement.offsetHeight;
		const visible: string[] = [];
		for (const [ key, details ] of from(itemElementMap.entries())) {
			const element = details.element;
			if (element) {
				const top = element.offsetTop;
				const height = element.offsetHeight;
				if ((top + height) >= scrollTop && top < (scrollTop + contentHeight)) {
					visible.push(key);
				}
				else if (visible.length) {
					break;
				}
			}
		}
		return visible;
	}
}

export default Body;
