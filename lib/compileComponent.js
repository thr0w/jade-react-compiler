var jaect = require('..')
var expect = require('chai').expect
var esprima = require('esprima-fb')
var path = require('path')
var escodegen = require('escodegen-ts')
var asttypes = require('ast-types')
var n = asttypes.namedTypes
var b = asttypes.builders

module.exports = compileComponent

function compileComponent (src, options) {
  var className = options.sourceFileName
  var args = [], locals = [], willMount = [], willUnmount = []
  options = options || {}
  options.raw = true

  options.createClass = options.createClass || b.identifier('createClass')
  options.createElement = options.createElement || b.identifier('createElement')

  options.visits = options.visits || {}
  options.visits.arguments = fn_arguments

  options.visitCode = options.visitCode || []
  options.visitCode.push({
    matches: /^\s*property\s*(.*)/,
    fn: visit_property
  })

  options.visitCode.push({
    matches: /^\s*reference\s*(.*)/,
    fn: visit_reference
  })

  var raw = jaect.compileClient(src, options)

  var render_fn = raw.ast.body[0]
  delete render_fn.id
  expect(render_fn.type).to.be.equal('FunctionDeclaration')
  render_fn.type = 'FunctionExpression'
  render_fn = apply_this(render_fn)
  render_fn.body.body.unshift(b.variableDeclaration('var', [b.variableDeclarator(
    b.identifier('_this'),
    b.thisExpression())]))
  var createClass_obj = b.objectExpression([
    b.property('init', b.identifier('displayName'), b.literal(className)),
    b.property('init', b.identifier('render'), render_fn)
  ])

  var createClass_call = b.callExpression(options.createClass, [createClass_obj])
  var createClass_body = []
  if (locals.length) {
    createClass_body.unshift(b.variableDeclaration('var', locals.map(function (decl) {
      return b.variableDeclarator(decl.id, null)
    })))
    willMount = willMount.concat(locals.reduce(function (inits, decl) {
      if (decl.init) {
        inits.push(b.expressionStatement(b.assignmentExpression('=',
          b.identifier(decl.id.name),
          decl.init
        )))
      }
      return inits
    }, []))
  }
  createClass_body.push(b.returnStatement(createClass_call))

  var createClass_fn = b.functionExpression(null, [],
    b.blockStatement(createClass_body)
  )
  var createClass_var = b.variableDeclaration('var', [
    b.variableDeclarator(b.identifier(className), b.callExpression(createClass_fn, []))
  ])

  raw.imports.unshift(gen_import(['createClass', 'createElement'], 'react'))

  var export_class = b.expressionStatement(b.assignmentExpression('=',
    b.memberExpression(b.identifier('module'), b.identifier('exports'), false),
    b.identifier(className)
  ))

  if (willMount.length)
    createClass_obj.properties.push(
      b.property('init', b.identifier('componentWillMount'),
        b.functionExpression(null, [], b.blockStatement(willMount)))
    )
  if (willUnmount.length)
    createClass_obj.properties.push(
      b.property('init', b.identifier('componentWillUnmount'),
        b.functionExpression(null, [], b.blockStatement(willUnmount)))
    )

  raw.ast.body = raw.imports.concat([createClass_var]).concat(export_class)

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
        var_declaration[0].declarations.forEach(function (d) {
          var init = d.init
          d.init = null
          locals.push(d)
          var prop = b.memberExpression(
            b.memberExpression(b.thisExpression(), b.identifier('props'), false),
            b.identifier(d.id.name), false
          )
          if (init)
            prop = b.logicalExpression('||', prop, init)
          willMount.push(
            b.expressionStatement(b.assignmentExpression('=',
              b.identifier(d.id.name),
              prop
            ))
          )
        })
      }
    }
  }

  function visit_reference (match) {
    return {
      parse: 'var ' + match[1],
      fn: function ( var_declaration) {
        var_declaration[0].declarations.forEach(function (d) {
          var local = b.identifier(d.id.name)
          var disposable = d.id.typeAnnotation.typeAnnotation.id
          var vd = b.variableDeclarator(b.identifier(local.name), null)
          vd.id.typeAnnotation = b.typeAnnotation(b.genericTypeAnnotation(
            b.qualifiedTypeIdentifier(b.identifier(disposable.name), b.identifier('TYPE')), null
          ))
          locals.push(vd)
          willMount.push(b.expressionStatement(b.assignmentExpression('=',
            local,
            b.callExpression(
              b.memberExpression(disposable, b.identifier('addRef'), false), [])
          )))
          willUnmount.push(b.expressionStatement(
            b.callExpression(
              b.memberExpression(local, b.identifier('releaseRef'), false), [])
          ))
        })
      }
    }
  }

  function fn_arguments (v) {
    locals.push(v)
    return []
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

function apply_this (ast) {
  if (ast === null)
    return null
  if (Array.isArray(ast)) {
    return ast.map(apply_this)
  }
  else if (typeof ast === 'object' && ast.type) {
    if (n.ThisExpression.check(ast)) {
      debugger
      return b.identifier('_this')
    }
    var ret = {}
    Object.keys(ast).forEach(function (prop) {
      ret[prop] = apply_this(ast[prop])
    })
    return ret
  }
  return ast
}
