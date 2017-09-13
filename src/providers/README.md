# @dojo/dgrid/providers

A lightweight API is provided to use any underlying data format or store with dgrid.

Because dgrid takes a reactive, uni-directional approach, data providers may update state or interpret state without interference. The entirety of the grid's state is driven by the object created by the data provider.

## Features

- An abstract [base class](../bases/DataProviderBase.ts) to extend from
- Sort functionality

## Implementation

Extend `DataProviderBase` and implement `buildData`. Data providers should always leave intact the first generic, which allows consumers to indicate the structure of data that will be used.

`buildData` has access to two instance properties:

- `options`: Used to configure the data source and unique to each data provider, indicated through `DataProviderBase`'s second generic, passed to the constructor
- `state`: Contains how data should be processed
    - `state.sort`: An array of `SortDetails` objects containing the `columnId` and `direction`

## Data Structure

The object created by `buildData` must return a `DataProperties` instance which contains:

* `sort`: An array of `SortDetails` objects containing the `columnId` and `direction` that should match the current state
* `items`: An array of `ItemProperties` objects with an `id` of type string and the `data` value containing the underlying data object
