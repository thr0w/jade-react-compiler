var jact = require('..')
var expect = require('chai').expect
var esprima = require('esprima-fb')
var escodegen = require('escodegen-jsx')
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
    var src = ['custom(a=a)', 'custom(b=bb,c=cc)',
      '- var x: number;',
      '- var b: boolean;',
      '- var s: string;',
      '- var obj1: Cls;',
      '- var obj2: Mod.Cls;',
      // TODO      '- var gen: T<A>;',
      'div', 'script.', "  import {a} from 'a'"].join('\n')
    var custom_res = []
    var raw = jact.compileClient(src, {sourceFileName: 'test', raw: true,
      visits: {
        custom: fn_custom,
        arguments: fn_arguments
    }})

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
      debugger
      custom_res.push({name: v.id.name, val: jact.gen_annotation(v.id.typeAnnotation)})
    }
  })

  xit('custom tag - var <T>') // var a: T<X,Y>

})
