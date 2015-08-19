var jact = require('..')
var expect = require('chai').expect
var esprima = require('esprima-fb')
var escodegen = require('escodegen-ts')
var asttypes = require('ast-types')
var n = asttypes.namedTypes
var b = asttypes.builders

describe('ReactCase_plugin', function () {
  it('custom tag', function () {
    var src = ['custom(a=a)', 'custom(b=bb,c=cc)', 'div', 'script.', "  import {a} from 'a'"].join('\n')
    var custom_res = []
    var raw = jact.compileClient(src, {sourceFileName: 'test', raw: true, visits: {custom: fn_custom}})

    var src_args = raw.ast.body[0].params
    var params = []
    custom_res.forEach(function (custom) {
      params.push(custom.name + ': ' + custom.val)
    // var id = b.identifier(custom.name)
    // var generic_type_annotation = b.genericTypeAnnotation(b.identifier(custom.val), null)
    // var type_annotation = b.typeAnnotation(generic_type_annotation)
    // id.typeAnnotation = type_annotation
    // src_args.push(id)
    })

    debugger
    raw.ast.body = raw.imports.concat(raw.ast.body)
    var js = escodegen.generate(raw.ast)
    js = js.replace('test()', 'test(' + params.join(', ') + ')')

    // console.log(JSON.stringify(raw.ast, null, 2))

    expect(js).to.equal(
      "import { a } from 'a';\n" +
      'function test(a: a, b: bb, c: cc) {\n' +
      "    return React.createElement('div');\n" +
      '}'
    )

    function fn_custom (tag) {
      tag.attrs.forEach(function (attr) {
        custom_res.push({name: attr.name, val: attr.val})
      })
      return []
    }
  })

  it('custom tag - var', function () {
    debugger
    var src = ['custom(a=a)', 'custom(b=bb,c=cc)',
      '- var x: number;',
      '- var b: boolean;',
      '- var s: string;',
      '- var obj1: Cls;',
      '- var obj2: Mod.Cls;',
      // TODO      '- var gen: T<A>;',
      'div', 'script.', "  import {a} from 'a'"].join('\n')
    var custom_res = [], params = []
    var raw = jact.compileClient(src, {sourceFileName: 'test', raw: true,
      visits: {
        custom: fn_custom,
        arguments: fn_arguments
    }})

    var i = 0
    custom_res.forEach(function (custom) {
      var id = b.identifier(custom.name)
      var generic_type_annotation = b.genericTypeAnnotation(b.identifier(custom.val), null)
      var type_annotation = b.typeAnnotation(generic_type_annotation)
      id.typeAnnotation = type_annotation
      params.splice(i, 0, id)
      i++
    })

    debugger
    raw.ast.body[0].params = params
    raw.ast.body = raw.imports.concat(raw.ast.body)
    var js = escodegen.generate(raw.ast)

    // console.log(JSON.stringify(raw.ast, null, 2))

    expect(js).to.equal(
      "import { a } from 'a';\n" +
      'function test(a: a, b: bb, c: cc, x: number, b: boolean, s: string, obj1: Cls, obj2: Mod.Cls) {\n' +
      "    return React.createElement('div');\n" +
      '}'
    )

    function fn_custom (tag) {
      tag.attrs.forEach(function (attr) {
        custom_res.push({name: attr.name, val: attr.val})
      })
      return []
    }

    function fn_arguments (v) {
      params.push(v)
    }
  })

  it('custom code - var', function () {
    debugger
    var src = [
      '- custom a: a',
      '- custom b:bb,c:cc',
      '- var x: number;',
      '- var b: boolean;',
      '- var s: string;',
      '- var obj1: Cls;',
      '- var obj2: Mod.Cls;',
      // TODO      '- var gen: T<A>;',
      'div', 'script.', "  import {a} from 'a'"].join('\n')
    var args = [], locals = []
    var raw = jact.compileClient(src, {sourceFileName: 'test', raw: true,
      visits: {
        custom: fn_custom,
        arguments: fn_arguments
      },
      visitCode: [
        {  matches: /^\s*custom\b(.*)/,
        fn: fn_custom}
      ]
    })

    raw.ast.body[0].params = args
    raw.ast.body[0].body.body.unshift(b.variableDeclaration('var', locals))
    raw.ast.body = raw.imports.concat(raw.ast.body)
    var js = escodegen.generate(raw.ast)

    // console.log(JSON.stringify(raw.ast, null, 2))

    expect(js).to.equal(
      "import { a } from 'a';\n" +
      'function test(a: a, b: bb, c: cc) {\n' +
      '    var x: number, b: boolean, s: string, obj1: Cls, obj2: Mod.Cls;\n' +
      "    return React.createElement('div');\n" +
      '}'
    )

    function fn_custom (match) {
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
  })

  xit('custom tag - var <T>') // var a: T<X,Y>

})
