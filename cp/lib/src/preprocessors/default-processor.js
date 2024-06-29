"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultPreprocessor = void 0;
var preprocessor_1 = require("prettier-cp/lib/src/preprocessors/preprocessor");
function defaultPreprocessor(code, options) {
    var _a;
    //console.log("options:",options);
    if ((_a = options.filepath) === null || _a === void 0 ? void 0 : _a.endsWith('.vue'))
        return code;
    return (0, preprocessor_1.preprocessor)(code, options);
}
exports.defaultPreprocessor = defaultPreprocessor;
