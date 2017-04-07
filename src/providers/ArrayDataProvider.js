"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DataProviderBase_1 = require("../bases/DataProviderBase");
function expand(items, idProperty, array) {
    if (array === void 0) { array = []; }
    for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
        var item = items_1[_i];
        var id = item[idProperty];
        array.push({
            id: id,
            data: item
        });
    }
    return array;
}
var ArrayDataProvider = (function (_super) {
    __extends(ArrayDataProvider, _super);
    function ArrayDataProvider() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ArrayDataProvider.prototype.buildData = function (state) {
        var _a = state.options, _b = _a.idProperty, idProperty = _b === void 0 ? 'id' : _b, _c = _a.data, data = _c === void 0 ? [] : _c, _d = state.sort, sort = _d === void 0 ? [] : _d;
        var items = data;
        if (sort.length) {
            items = items.sort(function (a, b) {
                for (var _i = 0, sort_1 = sort; _i < sort_1.length; _i++) {
                    var field = sort_1[_i];
                    var aValue = a[field.columnId];
                    var bValue = b[field.columnId];
                    var descending = field.descending;
                    if (aValue !== bValue) {
                        if (descending) {
                            return (aValue > bValue ? -1 : 1);
                        }
                        else {
                            return (aValue < bValue ? -1 : 1);
                        }
                    }
                }
                return 0;
            });
        }
        var itemProperties = expand(items, idProperty);
        return {
            sort: sort,
            items: itemProperties
        };
    };
    return ArrayDataProvider;
}(DataProviderBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ArrayDataProvider;
