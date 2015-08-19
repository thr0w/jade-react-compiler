var jaect = require('..')
var expect = require('chai').expect
var esprima = require('esprima-fb')
var escodegen = require('escodegen-ts')
var asttypes = require('ast-types')
var n = asttypes.namedTypes
var b = asttypes.builders

module.exports = compileComponent

function compileComponent (src, options) {
  var className = options.sourceFileName
  var args = [], locals = []
  options = options || {}
  options.raw = true
  options.visits = options.visits || {}
  options.visits.arguments = fn_arguments
  options.visitCode = options.visitCode || []
  options.visitCode.push({
    matches: /^\s*property\s*(.*)/,
    fn: visit_property
  })
  options.createClass = options.createClass || b.identifier('createClass')
  options.createElement = options.createElement || b.identifier('createElement')

  // options.visitCode.push({
  //   matches: /^\s*reference\s*(.*)/,
  //   fn: visit_reference
  // })

  var raw = jaect.compileClient(src, options)

  var render_fn = raw.ast.body[0]
  delete render_fn.id
  expect(render_fn.type).to.be.equal('FunctionDeclaration')
  render_fn.type = 'FunctionExpression'
  var createClass_obj = b.objectExpression([
    b.property('init', b.identifier('displayName'), b.literal(className)),
    b.property('init', b.identifier('render'), render_fn)
  ])
  var createClass_body = [b.returnStatement(createClass_obj)]
  // createClass_body.unshift(b.variableDeclaration('var', locals))
  var createClass_fn = b.functionDeclaration(b.identifier(className), [],
    b.blockStatement(createClass_body)
  )

  debugger
  raw.imports.unshift(gen_import(['createClass', 'createElement'], 'react'))

  // raw.imports[0].importKind = 'value'

  raw.ast.body = raw.imports.concat([createClass_fn])

  var esoptions = {
    format: options.format,
    sourceMap: options.sourceFileName,
    sourceMapWithCode: !!options.sourceFileName,
    sourceContent: src
  }

  var js = escodegen.generate(raw.ast, esoptions)
  return js

  function visit_property (match) {
    return {
      parse: 'var ' + match[1],
      fn: function ( var_declaration) {
        args = args.concat(var_declaration[0].declarations.map(function (d) {
          return d.id
        }))
      }
    }
  }

  function fn_arguments (v) {
    locals.push(v)
  }

  function gen_import (locals, source) {
    return b.importDeclaration(
      locals.map(function (l) {
        var s = b.importSpecifier(b.identifier(l))
        //        s.name = b.identifier(l)
        s.id = b.identifier(l)
        return s}),
      b.literal('react')
    )
  }
}
