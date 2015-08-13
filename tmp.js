var jact = require('./index.js')
var fs = require('fs')
var assert = require('assert')

// Compile to code

var js = jact.compileClient(src, {
  sourceMap: 'src',
  sourceMapWithCode: true,
  sourceContent: src
})

fs.writeFileSync('./tmp2.js', js.code, 'utf8')
fs.writeFileSync('./tmp2.map', js.map, 'utf8')

console.log(js.code)
console.log(js.map)

/* Output:
module.exports = function () {
  return React.DOM.p(null, 'foobar')
}
*/

// Compile to function

// var fn = jact.compile('p foobar')
// var Component = React.createClass({ render: fn })
// console.log(fn.toString())

// var markup = React.renderComponentToStaticMarkup(new Component())

// var lex = require('jade-lexer')
// var parse = require('jade-parser')
// var walk = require('jade-walk')
//
// var ast1 = parse(lex('.my-class foo'))
// console.log(JSON.stringify(ast1, null, 2))
// //
// // var ast = walk(ast1), function before (node, replace) {
// //   // called before walking the children of `node`
// //   // to replace the node, call `replace(newNode)`
// //   // return `false` to skip descending
// //   if (node.type === 'Text') {
// //     replace({ type: 'CallStatementxx', val: 'bar', line: node.line })
// //   }
// // }, function after (node, replace) {
// //   // called after walking the children of `node`
// //   // to replace the node, call `replace(newNode)`
// // }, {includeDependencies: true})
