'use strict';

Object.defineProperty(exports, '__esModule', { value: true });
exports.preprocessor = void 0;
var fs = require('fs');
var parser = require('@babel/parser');
var get_code_from_ast_1 = require('prettier-cp/lib/src/utils/get-code-from-ast');
var get_sorted_nodes_1 = require('prettier-cp/lib/src/utils/get-sorted-nodes');

const labelsRegEx = new RegExp(/^\/\/(?:lib|components|hooks|types|utils\|helpers|constants)\n/gm);

var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.extractASTNodes = void 0;
var traverse = __importDefault(require('@babel/traverse'));

function extractASTNodes(ast) {
  var importNodes = [];
  traverse.default(ast, {
    ImportDeclaration: function (path) {
      importNodes.push(path.node);
    },
  });

  return { importNodes: importNodes };
}

function preprocessor(code, options) {
  var importOrder = options.importOrder,
    importOrderSeparation = options.importOrderSeparation;

  var parserOptions = {
    sourceType: 'module',
    plugins: ['typescript', 'jsx'],
  };
  code = code.replace(labelsRegEx, '');
  var ast = parser.parse(code, parserOptions);
  var interpreter = ast.program.interpreter;
  var _a = extractASTNodes(ast),
    importNodes = _a.importNodes;
  //directives = _a.directives;

  // short-circuit if there are no import declaration
  if (importNodes.length === 0) return code;

  code.repl;
  var allImports = (0, get_sorted_nodes_1.getSortedNodes)(
    importNodes,
    {
      importOrder: importOrder,
      importOrderSeparation: importOrderSeparation,
    },
    options.filepath
  );
  return (0, get_code_from_ast_1.getCodeFromAst)(allImports, code, interpreter);
}
exports.preprocessor = preprocessor;
