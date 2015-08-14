/*
(The MIT License)

Copyright (c) 2009-2014 TJ Holowaychuk <tj@vision-media.ca>
Copyright (c) 2014 Michael Phan-Ba <michael@mikepb.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

var Parser = require('jade').Parser
var Compiler = require('./lib/compiler')

/**
 * Jade React
 r version.
 */

exports.version = '0.3.0'

/**
 * Jade filters.
 */

exports.filters = {}

/**
 * Compile Jade to React view function.
 *
 * @param {String} str
 * @param {Object} options
 * @api public
 */

exports.compile = function (str, options) {
  return eval(getCompiler(str, options).compile())
}

/**
 * Compile Jade to React view module.
 *
 * @param {String} str
 * @param {Object} options
 * @api public
 */

exports.compileClient = function (str, options) {
  return getCompiler(str, options).compile()
}

/**
 * Get compiler for input `str`.
 *
 * @param {String} str
 * @param {Object} options
 * @api private
 */

function getCompiler (str, options) {
  if (!options) options = {}
  str = str.toString('utf8')

  // Parse
  var parser = new Parser(str, options.filename, options)
  var tokens = parser.parse()

  // Compile
  return new Compiler(str, tokens, options)
}
