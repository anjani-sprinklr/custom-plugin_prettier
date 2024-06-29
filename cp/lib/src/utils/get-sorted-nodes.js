'use strict';

var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };

var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };

Object.defineProperty(exports, '__esModule', { value: true });

exports.getSortedNodes = void 0;
var types_1 = require('@babel/types');
var lodash_1 = require('lodash');
var constants_1 = require('prettier-cp/lib/src/constants');

/**
 * This function returns all the nodes which are in the importOrder array.
 * The plugin considered these import nodes as local import declarations.
 * @param nodes all import nodes
 * @param options
 */
var constants_1 = require('prettier-cp/lib/src/constants');

/**
 * Get the regexp group to keep the import nodes.
 * @param node
 * @param importOrder
 */

var notLib =
  /^(?:@sprinklrjs|actions|hooks|containers|components|constants|scss|experience|events|eventTracking|factory|models|refluxActions|refluxStores|contexts|controller|validators|enterprise|rules|decorators|types|entities|img|i18n|client|core|emails-app|external-app|integrations-app|libs|lite-app|modules|platform|sandbox|server|sos|systems|typings|virality-app|routes|\.\.\/|\.\/|@\/)/gm;
var regExIsHook = new RegExp(/^use/g);
var regExIsComponent = new RegExp(/^with/g);
var lineimportMap = new Map();
var count = 1;
var importOrder = undefined;

function isFirstLetterCapital(word) {
  if (word.length === 0) return false;
  return word[0] === word[0].toUpperCase();
}

function getSpecifier(subNode) {
  var specifier;
  if (subNode.type === 'ImportDefaultSpecifier') {
    specifier = subNode.local.name;
  } else if (subNode.type === 'ImportSpecifier') {
    specifier = subNode.imported.name;
  }
  return specifier;
}

function isConst(node) {
  var isCONST = false;
  if (node.specifiers) {
    for (var i = 0; i < node.specifiers.length; i++) {
      var subNode = node.specifiers[i];
      var specifier = getSpecifier(subNode);
      var alphabeticalChars = specifier.replace('/[^A-Za-z]/g', '').split('');
      var isthisChildConst = true;
      for (var j = 0; j < alphabeticalChars.length; j++) {
        var char = alphabeticalChars[j];
        if (char !== char.toUpperCase()) {
          isthisChildConst = false;
          break;
        }
      }
      if (isthisChildConst) isCONST = true;
    }
  }
  return isCONST;
}

function isComponent(node) {
  var regExp = new RegExp('components');
  if (node.source.value.match('@sprinklrjs/spaceweb-icons/') !== null) return true;
  //if (node.source.value.match('@sprinklrjs/spaceweb') !== null) return true;

  var isComp = false;

  if (node.specifiers) {
    for (var i = 0; i < node.specifiers.length; i++) {
      var subNode = node.specifiers[i];
      var specifier = getSpecifier(subNode);
      if (specifier.match(regExIsComponent) !== null) {
        isComp = true;
      }
      if (
        !isComp &&
        isFirstLetterCapital(specifier) &&
        node.source.value.match(new RegExp('types')) === null &&
        node.source.value.match(regExp) !== null &&
        node.importKind !== 'type'
      ) {
        isComp = true;
      }
    }
  }
  return isComp;
}

function isHook(node) {
  var isHook = false;
  if (node.specifiers) {
    for (var i = 0; i < node.specifiers.length; i++) {
      var subNode = node.specifiers[i];
      var specifier = getSpecifier(subNode);
      if (specifier.match(regExIsHook) !== null) {
        isHook = true;
        break;
      }
    }
  }
  return isHook;
}

function isType(node) {
  if (node.importKind === 'type') return true;
  if (node.source.value.match(new RegExp('types'))) return true;
  return false;
}

function isMentionedType(node, type) {
  //console.log(type, node.source.value.match(new RegExp(type)));
  if (node.source.value.match(new RegExp(type)) !== null) return true;
  return null;
}

function getImportNodesMatchedGroup(node) {
  if (isMentionedType(node, notLib) === null) return 'lib';
  else if (isComponent(node)) return 'components';
  else if (isHook(node)) return 'hooks';
  else if (isType(node)) return 'types';
  else if (isMentionedType(node, 'utils|helpers')) return 'utils|helpers';
  else if (isConst(node)) return 'constants';
  return 'unidentified';
}

function getCommentAST(value) {
  return {
    type: 'CommentLine',
    value: value,
  };
}

function getSortedNodes(nodes, options, fileName) {
  lineimportMap.clear();
  count = 1;
  importOrder = options.importOrder;

  var importOrderSeparation = options.importOrderSeparation;
  var originalNodes = nodes.map(lodash_1.clone);
  var finalNodes = [];
  var importOrderGroups = {};

  // to group things based on utils, types, etc.
  for (var i = 0; i < importOrder.length; i++) {
    importOrderGroups[importOrder[i]] = [];
  }

  for (var i = 0; i < originalNodes.length; i++) {
    var node = originalNodes[i];
    var matchedGroup = getImportNodesMatchedGroup(node);
    if (matchedGroup === 'unidentified') lineimportMap.set(count, [node]);
    else importOrderGroups[matchedGroup].push(node);
    count += 1;
  }

  // Sort the imports within each group based on node.source or import paths
  for (var group in importOrderGroups) {
    importOrderGroups[group].sort(function (a, b) {
      if (a.source.value < b.source.value) return -1;
      if (a.source.value > b.source.value) return 1;
      return 0;
    });
    //asdasd
  }
  // adding sorted import statements and the unidentified ones as well
  var firstKey = lineimportMap.keys().next().value;
  var currentCount = 0;
  for (var i = 0; i < importOrder.length; i++) {
    var group = importOrder[i];
    var groupNodes = importOrderGroups[group];
    if (groupNodes.length === 0) continue;

    // adding the unidentified ones
    var wentInsideWhileLoop = false;
    if (lineimportMap.size > 0) firstKey = lineimportMap.keys().next().value;
    while (lineimportMap.size > 0 && currentCount + groupNodes.length >= firstKey) {
      if (finalNodes[finalNodes.length - 1] === constants_1.newLineNode) finalNodes.pop();
      finalNodes.push.apply(finalNodes, lineimportMap.get(firstKey));
      currentCount += 1;
      lineimportMap.delete(firstKey);
      wentInsideWhileLoop = true;
      if (lineimportMap.size > 0) firstKey = lineimportMap.keys().next().value;
    }
    if (wentInsideWhileLoop) finalNodes.push(constants_1.newLineNode);

    // adding the labels
    var comments = groupNodes[0].leadingComments;
    if (comments && comments.length) {
      var commentValue = comments[0].value;
      if (commentValue.match(importOrder[i]) === null) {
        groupNodes[0].leadingComments = [getCommentAST(importOrder[i])].concat(groupNodes[0].leadingComments);
      }
    } else {
      groupNodes[0].leadingComments = [getCommentAST(importOrder[i])];
    }

    // add the group
    finalNodes.push.apply(finalNodes, groupNodes);
    currentCount += groupNodes.length;
    if (importOrderSeparation) {
      finalNodes.push(constants_1.newLineNode);
    }
    if (importOrder[i] === 'lib') console.log(finalNodes[5].leadingComments);
  }

  // the left unidentified ones need to be put on last
  if (lineimportMap.size > 0) firstKey = lineimportMap.keys().next().value;
  while (lineimportMap.size > 0) {
    if (finalNodes[finalNodes.length - 1] === constants_1.newLineNode) finalNodes.pop();
    finalNodes.push.apply(finalNodes, lineimportMap.get(firstKey));
    lineimportMap.delete(firstKey);
    if (lineimportMap.size > 0) firstKey = lineimportMap.keys().next().value;
    else {
      finalNodes.push(constants_1.newLineNode);
    }
  }

  // maintain a copy of the nodes to extract comments from
  var finalNodesClone = finalNodes.map(lodash_1.clone);
  // make a copy of first comment
  var firstNodesComments = nodes[0].leadingComments;

  if (finalNodes.length > 0) {
    finalNodes.forEach(types_1.removeComments);

    // insert comments other than the first comments
    finalNodes.forEach(function (node, index) {
      if (lodash_1.isEqual(nodes[0].loc, node.loc)) return;
      types_1.addComments(node, 'leading', finalNodesClone[index].leadingComments || []);
    });

    // inserting first commnent separately on top
    if (firstNodesComments) {
      types_1.addComments(finalNodes[0], 'leading', firstNodesComments);
    }
  }

  return finalNodes;
}

exports.getSortedNodes = getSortedNodes;
