"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EntityBuilder_1 = require("./EntityBuilder");
var storage_1 = require("./support/storage");
var StringHelper_1 = require("./support/StringHelper");
var Entity = (function () {
    function Entity() {
    }
    Entity.jsonParse = function (sourceObject, jsonObject) {
        for (var key in jsonObject) {
            if (jsonObject.hasOwnProperty(key)) {
                var metadata = storage_1.defaultMetadataStorage.findTypeMetadata(sourceObject.constructor, key);
                var value = jsonObject[key];
                if (typeof value === 'object' && !(value instanceof Array)) {
                    if (metadata) {
                        sourceObject[metadata.propertyName] = EntityBuilder_1.EntityBuilder.buildOne(metadata.type, value);
                    }
                    continue;
                }
                if (value instanceof Array && value.length > 0 && typeof value[0] === 'object') {
                    if (metadata) {
                        sourceObject[metadata.propertyName] = EntityBuilder_1.EntityBuilder.buildMany(metadata.type, value);
                    }
                    continue;
                }
                if (metadata) {
                    sourceObject[metadata.propertyName] = value;
                    continue;
                }
                key = StringHelper_1.StringHelper.toCamel(key);
                if (sourceObject.hasOwnProperty(key)) {
                    sourceObject[key] = value;
                }
            }
        }
        return sourceObject;
    };
    Entity.prototype.fromJson = function (jsonData) {
        return Entity.jsonParse(this, jsonData);
    };
    Entity.prototype.toJson = function (toSnake, asString) {
        if (toSnake === void 0) { toSnake = true; }
        if (asString === void 0) { asString = false; }
        var data = {};
        for (var key in this) {
            if (!this.hasOwnProperty(key)) {
                continue;
            }
            var outputKey = toSnake ? StringHelper_1.StringHelper.toSnake(key) : key;
            var value = this[key];
            if (value instanceof Entity) {
                data[outputKey] = value.toJson(toSnake, asString);
                continue;
            }
            var metadata = storage_1.defaultMetadataStorage.findTypeMetadata(this.constructor, key);
            if (value instanceof Array && value.length > 0 && value[0] instanceof Object) {
                if (value[0] instanceof Entity) {
                    data[outputKey] = value.map(function (entity) { return entity.toJson(toSnake, asString); });
                }
                if (metadata && metadata.type === Object) {
                    data[outputKey] = value;
                }
                continue;
            }
            if (typeof value === 'object' && !(value instanceof Array)) {
                if (metadata && metadata.type === Object) {
                    data[outputKey] = value;
                }
                continue;
            }
            data[outputKey] = value;
        }
        return asString ? JSON.stringify(data) : data;
    };
    return Entity;
}());
exports.Entity = Entity;
//# sourceMappingURL=Entity.js.map