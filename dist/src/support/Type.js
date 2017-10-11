"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var storage_1 = require("./storage");
var StringHelper_1 = require("./StringHelper");
var TypeMetadata_1 = require("./metadata/TypeMetadata");
function Type(type, jsonKey) {
    return function (target, key) {
        jsonKey = jsonKey ? jsonKey : StringHelper_1.StringHelper.toSnake(key);
        var metadata = new TypeMetadata_1.TypeMetadata(target.constructor, key, jsonKey, type);
        storage_1.defaultMetadataStorage.addTypeMetadata(metadata);
    };
}
exports.Type = Type;
//# sourceMappingURL=Type.js.map