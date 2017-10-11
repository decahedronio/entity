"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StringHelper = (function () {
    function StringHelper() {
    }
    StringHelper.toCamel = function (source) {
        var str = source.replace(/_+(.)/g, function (x, chr) { return chr.toUpperCase(); });
        return this.lowercaseFirst(str);
    };
    StringHelper.toSnake = function (source) {
        var str = this.lowercaseFirst(source);
        return str.replace(/([A-Z])/g, function (x) { return '_' + x.toLowerCase(); });
    };
    StringHelper.lowercaseFirst = function (str) {
        return str.charAt(0).toLowerCase() + str.slice(1);
    };
    return StringHelper;
}());
exports.StringHelper = StringHelper;
//# sourceMappingURL=StringHelper.js.map