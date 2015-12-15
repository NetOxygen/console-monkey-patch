"use strict";
/* global Symbol:true */
/* global describe:true */
/* global it:true */

var assert  = require("assert");
var console = require("console");

var console_monkey_patch = require('../');

// the methods we can patch
// XXX: copied from the plugin, since it doesn't expose them.
var methods = [
    'log', 'info', 'error', 'warn', 'dir', 'time', 'timeEnd', 'trace', 'assert'
];

describe("console-monkey-patch", function () {
    [null, undefined].forEach(function (noop) {
        it('should noop when ' + String(noop) + ' is given', function () {
            assert.doesNotThrow(function () {
                assert.strictEqual(noop, console_monkey_patch(noop));
            });
        });
    });

    methods.forEach(function (t) {
        it('should patch console.' + t, function () {
            // effectively create a new console with the same behaviour as the
            // default.
            var newcons = new console.Console(process.stdout, process.stderr);
            assert.strictEqual(newcons, console_monkey_patch(newcons));
            assert.strictEqual(console[t], newcons[t]);
        });
    });

    it('should allow partial patching', function () {
        // create a new console with only the "warn" function.
        var newcons = {
            warn: function () { return 42; }
        };
        // build the set of original console methods
        var oldcons = {};
        methods.forEach(function (t) {
            oldcons[t] = console[t];
        });
        assert.strictEqual(newcons, console_monkey_patch(newcons));
        for (var f in oldcons) {
            var cons = (f in newcons ? newcons : oldcons);
            assert.strictEqual(cons[f], console[f]);
        }
    });

    it('should only patch functions', function () {
        // create a new console with only the "warn" function.
        var newcons = {
            log: false,         // Boolean
            info: null,         // Null
            error: undefined,   // Undefined
            warn: 42,           // Number
            dir: "42",          // String
            time: Symbol('42'), // Symbol
            timeEnd: {},        // Object
        };
        assert.strictEqual(newcons, console_monkey_patch(newcons));
        for (var f in newcons)
            assert.notStrictEqual(newcons[f], console[f]);
    });
});
