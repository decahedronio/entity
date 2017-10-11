"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MetadataStorage = (function () {
    function MetadataStorage() {
        this.typeMetadatas = [];
    }
    MetadataStorage.prototype.addTypeMetadata = function (metadata) {
        this.typeMetadatas.push(metadata);
    };
    MetadataStorage.prototype.findTypeMetadata = function (target, propertyName) {
        var metadataFromTarget = this.typeMetadatas.find(function (meta) {
            return meta.target === target && meta.sourcePropertyName === propertyName;
        });
        var metadataFromChildren = this.typeMetadatas.find(function (meta) {
            return target.prototype instanceof meta.target && meta.sourcePropertyName === propertyName;
        });
        return metadataFromTarget || metadataFromChildren;
    };
    return MetadataStorage;
}());
exports.MetadataStorage = MetadataStorage;
//# sourceMappingURL=MetadataStorage.js.map