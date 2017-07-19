/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
'use strict';

var REACT_STATICS = {
    childContextTypes: true,
    contextTypes: true,
    defaultProps: true,
    displayName: true,
    getDefaultProps: true,
    mixins: true,
    propTypes: true,
    type: true
};

var getOwnPropertyNames = Object.getOwnPropertyNames
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var defineProperty = Object.defineProperty;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;
var getPrototypeOf = Object.getPrototypeOf;
var objectPrototype = getPrototypeOf && getPrototypeOf(Object);

function copyProperty(targetComponent, sourceComponent, key) {
    try { // Avoid failures from read-only properties
        var descriptor = getOwnPropertyDescriptor(sourceComponent, key);
        var targetDescriptor = getOwnPropertyDescriptor(targetComponent, key);
        if (descriptor.writable !== false && (!targetDescriptor || targetDescriptor.configurable !== false)) {
            defineProperty(targetComponent, key, descriptor);
        }
    } catch (e) {}
}

module.exports = function hoistNonReactStatics(targetComponent, sourceComponent, blacklist) {
    if (typeof sourceComponent !== 'string') { // don't hoist over string (html) components

        if (objectPrototype) {
            var inheritedComponent = getPrototypeOf(sourceComponent);
            if (inheritedComponent && inheritedComponent !== objectPrototype) {
                hoistNonReactStatics(targetComponent, inheritedComponent, blacklist);
            }
        }

        var names = getOwnPropertyNames(sourceComponent);
        for (var i = 0; i < names.length; i++) {
            var name = names[i];
            if (!REACT_STATICS[name] && (!blacklist || !blacklist[name])) {
                copyProperty(targetComponent, sourceComponent, name);
            }
        }

        if (getOwnPropertySymbols) {
            var symbols = getOwnPropertySymbols(sourceComponent);
            for (i = 0; i < symbols.length; i++) {
                var symbol = symbols[i];
                if (!REACT_STATICS[symbol] && (!blacklist || !blacklist[symbol])) {
                    copyProperty(targetComponent, sourceComponent, symbol);
                }
            }
        }

        return targetComponent;
    }

    return targetComponent;
};
