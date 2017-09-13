# @dojo/dgrid

[![Build Status](https://travis-ci.org/dojo/dgrid.svg?branch=master)](https://travis-ci.org/dojo/dgrid)
[![codecov](https://codecov.io/gh/dojo/dgrid/branch/master/graph/badge.svg)](https://codecov.io/gh/dojo/dgrid)
[![npm version](https://badge.fury.io/js/%40dojo%2Fdgrid.svg)](http://badge.fury.io/js/%40dojo%2Fdgrid)

dgrid is a reactive, unidirectional grid component built using [Dojo 2](https://github.com/dojo/widget-core).

## Features

- [Lightweight interface](src/providers/README.md) to use any underlying data format or store
- Customizable columns and cells
- Sortable columns

![Image of basic grid](http://placekitten.com/450/300)

## Data Providers

Each grid must be passed a `dataProvider`. dgrid ships with a [data provider](src/providers/ArrayDataProvider.ts) to read an array of data.

## Column Configuration

Each grid must be passed an array of `Column` objects.

`Column<T = any, V = string>` has two optional generics:

- `T`: The data type contained in each row
- `V`: The data type returned by `get`

Each column supports properties that allow customization:

- `id: string`: Unique to each column, used if `field` is not provided. Useful if a field appears twice
- `field?: keyof T`: Indicates the property to use to retrieve this column's value from data
- `get?: V`: Use a static value for this column's value
- `get?(item: ItemProperties<T>, column: Column<T>): V`: Use a dynamic value for this column's value
- `label?: string`: Used to display the column's label in the grid header
- `sortable?: boolean`: Whether this column is sortable. Default value is `true`
- `render?(options: ColumnRenderOptions<T, V>): DNode`: Used to render dynamic content. Passed a value retrieved from data or `get`

## Example Usage

*Basic Example*

```typescript
const data = [
	{ order: 1, name: 'preheat', description: 'Preheat your oven to 350F' },
	{ order: 2, name: 'mix dry', description: 'In a medium bowl, combine flour, salt, and baking soda' },
	{ order: 3, name: 'mix butter', description: 'In a large bowl, beat butter, then add the brown sugar and white sugar then mix' },
	{ order: 4, name: 'mix together', description: 'Slowly add the dry ingredients from the medium bowl to the wet ingredients in the large bowl, mixing until the dry ingredients are totally combined' },
	{ order: 5, name: 'chocolate chips', description: 'Add chocolate chips' },
	{ order: 6, name: 'make balls', description: 'Scoop up a golf ball size amount of dough with a spoon and drop it onto a cookie sheet' },
	{ order: 7, name: 'bake', description: 'Put the cookies in the oven and bake for about 10-14 minutes' },
	{ order: 8, name: 'remove', description: 'Using a spatula, lift cookies off onto wax paper or a cooling rack' },
	{ order: 9, name: 'eat', description: 'Eat and enjoy!' }
];

const dataProvider = new ArrayDataProvider({
	idProperty: 'order',
	data
});

const columns = [
	{
		id: 'order',
		label: 'step' // use a custom column name
	},
	{
		id: 'name'
	},
	{
		id: 'description',
		sortable: false
	}
];

w(Grid, {
    dataProvider,
    columns
});
```

*Cell Customization*
```typescript
const columns: Column[] = [
	{
		id: 'order'
	},
	{
		id: 'description',
		render({ item, column }) {
			return v('dl', [
				v('dt', [
					item.data.name
				]),
				v('dd', [
					item.data[column.id]
				])
			]);
		}
	}
];
```

*Value Customization*
```typescript
const columns: Column[] = [
    {
        id: 'description',
        get(item, column) {
            return `Step #${item.data.order}: ${item.data.description}`;
        }
    }
];
```

*Multi-Column Sorting*
```typescript
const dataProvider = new ArrayDataProvider({
	data,
	idProperty: 'order'
}, {
	sort: [ { columnId: 'name', direction: 'desc' }, { columnId: 'description', direction: 'asc' } ]
});
```

## Theming

The following CSS classes are used to style the `Grid` widget:

- `grid`: Applied to the root node to set the height and border
- `table`: Used by `columnHeadersTable` and `rowTable` to style inline tables
- `cell`: Used by `rowCell` and `columnHeaderCell` to add padding and border
- `header`: Applied to the header area to set the background color
- `columnHeaders`: Applied to the area surrounding all column rows (currently a single row)
- `columnHeadersRow`: Applied to each row surrounding header column cells
- `columnHeadersTable`: Applied to the inline table in each column header row
- `columnHeaderCell`: Applied to each cell in the column header area
- `sortable`: Applied to a header cell when the cell is sortable
- `sortArrow`: Applied to a node within the header cell when a cell is sortable
- `sortArrowUp`: Applied to `sortArrow` when the cell is sorted up (ascending)
- `sortArrowDown`: Applied to `sortArrow` when the cell is sorted down (descending)
- `scroller`: Applied to the area containing scrollable content
- `row`: Applied to each row in the grid
- `rowTable`: Applied to the inline table in each grid row
- `rowCell`: Applied to each cell in each grid row

## How do I contribute?

We appreciate your interest!  Please see the [Dojo 2 Meta Repository](https://github.com/dojo/meta#readme) for the
Contributing Guidelines and Style Guide.

## Testing

Test cases MUST be written using [Intern](https://theintern.github.io) using the Object test interface and Assert assertion interface.

90% branch coverage MUST be provided for all code submitted to this repository, as reported by istanbul’s combined coverage results for all supported platforms.

To test locally in node run:

`grunt test`

To test against browsers with a local selenium server run:

`grunt test:local`

To test against BrowserStack or Sauce Labs run:

`grunt test:browserstack`

or

`grunt test:saucelabs`

## Licensing information

TODO: If third-party code was used to write this library, make a list of project names and licenses here

* [Third-party lib one](https//github.com/foo/bar) ([New BSD](http://opensource.org/licenses/BSD-3-Clause))

© 2017 [JS Foundation](https://js.foundation/). [New BSD](http://opensource.org/licenses/BSD-3-Clause) license.
