"use strict";
var Observable_1 = require("@dojo/core/Observable");
var DataProviderBase = (function () {
    function DataProviderBase(options) {
        var _this = this;
        this.observable = new Observable_1.Observable(function (observer) {
            _this.state = {
                options: options || {},
                sort: []
            };
            _this.observers.push(observer);
            if (_this.data) {
                observer.next(_this.data);
            }
        });
        this.updateData();
    }
    DataProviderBase.prototype.buildData = function (state) {
        return { items: [] };
    };
    DataProviderBase.prototype.configure = function (_a) {
        var sort = _a.sort;
        this.state.sort = Array.isArray(sort) ? sort : [sort];
        this.updateData();
    };
    DataProviderBase.prototype.observe = function () {
        return this.observable;
    };
    DataProviderBase.prototype.sort = function (sort) {
        this.state.sort = Array.isArray(sort) ? sort : [sort];
        this.updateData();
    };
    DataProviderBase.prototype.updateData = function () {
        var data = this.data = this.buildData(this.state);
        this.observers.forEach(function (observer) {
            observer.next(data);
        });
    };
    return DataProviderBase;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DataProviderBase;
