"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var parser_babel_1 = require("prettier/parser-babel");
var parser_flow_1 = require("prettier/parser-flow");
var parser_html_1 = require("prettier/parser-html");
var parser_typescript_1 = require("prettier/parser-typescript");
var default_processor_1 = require("prettier-cp/lib/src/preprocessors/default-processor");
var vue_preprocessor_1 = require("prettier-cp/lib/src/preprocessors/vue-preprocessor");
var options = {
    importOrder: {
        type: 'path',
        category: 'Global',
        array: true,
        default: [{ value: [
            'components',
            'hook',
            'types',
            'utils|helpers',
            'lib',
            'constants',
        ] }],
        description: 'Provide an order to sort imports.',
    },
    importOrderSeparation: {
        type: 'boolean',
        category: 'Global',
        default: false,
        description: 'Should imports be separated by new line?',
    },
};
module.exports={
    parsers: {
        babel: __assign(
            __assign(
                {},
                parser_babel_1.parsers.babel
            ),
            {
                preprocess: default_processor_1.defaultPreprocessor
            }
        ),
        //flow: __assign(__assign({}, parser_flow_1.parsers.flow), { preprocess: default_processor_1.defaultPreprocessor }),
        typescript: __assign(__assign({}, parser_typescript_1.parsers.typescript), { preprocess: default_processor_1.defaultPreprocessor }),
        //vue: __assign(__assign({}, parser_html_1.parsers.vue), { preprocess: vue_preprocessor_1.vuePreprocessor }),
    },
    options: options,
};
