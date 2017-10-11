"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EntityBuilder = (function () {
    function EntityBuilder() {
    }
    EntityBuilder.buildOne = function (buildClass, sourceData) {
        this.checkClassValidity(buildClass);
        if (buildClass === Object) {
            return sourceData;
        }
        var entity = new buildClass();
        entity.fromJson(sourceData);
        return entity;
    };
    EntityBuilder.buildMany = function (buildClass, sourceData) {
        var _this = this;
        this.checkClassValidity(buildClass);
        return sourceData.map(function (entityData) { return _this.buildOne(buildClass, entityData); });
    };
    EntityBuilder.checkClassValidity = function (className) {
        if (typeof className !== 'function') {
            throw new Error('Class could not be found');
        }
    };
    return EntityBuilder;
}());
exports.EntityBuilder = EntityBuilder;
//# sourceMappingURL=EntityBuilder.js.map