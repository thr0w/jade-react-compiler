var esprima = require('esprima')
var escodegen = require('escodegen')
var parseJSExpression = require('character-parser').parseMax
var b = require('./builder')

/**
 * Initialize `Compiler` with the given `token` and `options`.
 *
 * @param {Node} node
 * @param {Object} [options]
 * @api public
 */

var Compiler = module.exports = function Compiler (node, options) {
  this.visit = this.visit.bind(this)
  this.options = options || {}
  this.node = node
}

/**
 * Compiler prototype.
 */

Compiler.prototype = {
  /**
   * Compile parse tree to JavaScript.
   *
   * @api public
   */

  compile: function () {
    var ast = this.generate()
    var esoptions = {
      format: this.options.format,
      sourceMap: this.options.sourceMap,
      sourceMapWithCode: this.options.sourceMapWithCode,
      sourceContent: this.options.sourceContent
    }

    var gen = escodegen.generate(ast, esoptions)
    var js = esoptions.sourceMap? gen.code: gen
    js = [js].concat(this.helpers).join('\n')
    if (esoptions.sourceMap)
      return {code: js, map: gen.map.toString()}
    return js
  },

  /**
   * Generate intermediate JavaScript.
   *
   * @api public
   */

  generate: function () {
    this.helpers = []
    this.fn_arguments = []
    this.depth = -1
    var block = this.visit(this.node)
    if (!block || block.type != 'ArrayExpression')
      throw new Error('Invalido')
    var body = [], ret
    for (var i = 0; i < block.elements.length;i++) {
      var e = block.elements[i]
      if (e && e.type == 'CallExpression' && e.callee.object.name == 'React' && e.callee.property.name == 'createElement')
        ret = b.returnStatement(e)
      else if (Array.isArray(e))         body = body.concat(e)
      else {
        debugger
        throw new Error('Not implemented')
      }
    }
    if (!ret)
      throw new Error('Invalido')
    body.push(ret)
    var fn = b.functionDeclaration(b.identifier(this.options.sourceMap), this.fn_arguments, b.blockStatement(body), false, false)
    return b.program([fn])
  },

  /**
   * Interpolate the given `str`.
   *
   * @param {String} str
   * @api public
   */

  interpolate: function (str) {
    var match
    var range
    var src

    var result = []
    var buf = '""'

    if (str.val != null) str = str.val
    if (str === '') return [this.text('""')]

    while (str && (match = /(\\)?([#!]){((?:.|\n)*)$$/.exec(str))) {
      buf += ' + ' + JSON.stringify(str.substr(0, match.index))
      str = match[3]

      if (match[1]) { // escape
        buf += ' + ' + JSON.stringify(match[2] + '{')
        continue
      }

      range = parseJSExpression(str)
      src = range.src

      if (match[2] === '!') {
        if (buf) result.push(this.text(buf)), buf = '""'
        result.push(unescape(src))
      } else {
        buf += ' + ' + src
      }

      str = str.substr(range.end + 1)
    }

    if (str) buf += ' + ' + JSON.stringify(str)
    if (buf !== '""') result.push(this.text(buf))

    return result
  },

  /**
   * Wrap the given `str` around a text sentinel.
   *
   * @param {AST_Node} node
   * @api public
   */

  text: function (str) {
    debugger
    return 'ǃtext＿(' + str + ')'
  },

  /**
   * Visit `node`.
   *
   * @param {Node} node
   * @api public
   */

  visit: function (node) {
    this.depth++
    var ret = this['visit' + node.type](node)
    this.depth--
    return ret
  },

  /**
   * Visit case `node`.
   *
   * @param {Literal} node
   * @api public
   */

  visitCase: function (node) {
    throw new Error('not supported')
    this.buf += 'switch(' + node.expr + '){\n'
    this.visit(node.block)
    debugger
    this.buf += '}\n'
  },

  /**
   * Visit when `node`.
   *
   * @param {Literal} node
   * @api public
   */

  visitWhen: function (node, start) {
    if (node.expr === 'default') {
      this.buf += 'default:\n'
    } else {
      this.buf += 'case ' + node.expr + ':\n'
    }
    if (node.block) {
      this.visit(node.block)
      debugger
      this.buf += 'break;\n'
    }
  },

  /**
   * Visit literal `node`.
   *
   * @param {Literal} node
   * @api public
   */

  visitLiteral: function (node) {
    this.buf += this.text(JSON.stringify(node.str)) + '\n'
  },

  /**
   * Visit all nodes in `block`.
   *
   * @param {Block} block
   * @api public
   */

  visitBlock: function (block, start) {
    var elements = block.nodes.map(this.visit)
    return b.arrayExpression(elements, loc(block))
  },

  /**
   * Visit a mixin's `block` keyword.
   *
   * @param {MixinBlock} block
   * @api public
   */

  visitMixinBlock: function (block) {
    this.buf += 'block ? block() : null;\n'
  },

  /**
   * Visit `doctype`.
   *
   * @param {Doctype} doctype
   * @api public
   */

  visitDoctype: function () {
    throw new Error("Don't use doctype with React");
  },

  /**
   * Visit `mixin`, generating a function that
   * may be called within the template.
   *
   * @param {Mixin} mixin
   * @api public
   */

  visitMixin: function (mixin) {
    throw new Error('not implemented')
  },

  /**
   * Visit `tag`, translate the tag name, generate attributes, and
   * visit the `tag`'s code and block.
   *
   * @param {Tag} tag
   * @api public
   */

  visitTag: function (tag) {
    var name = /^[A-Z]/.test(tag.name)? b.identifier(tag.name): b.literal(tag.name)
    var attrs = this.visitAttributes(tag, tag.attrs, tag.attributeBlocks)
    var children = this.visit(tag.block)
    if (tag.code) {
      debugger
      this.visitCode(tag.code)
    }
    var callee = b.memberExpression(b.identifier('React'), b.identifier('createElement'), false, loc(tag))
    var args = [name]
    var has_attrs = attrs && attrs.properties.length
    var has_children = children && children.elements.length
    if (has_attrs || has_children)
      args.push(has_attrs ?attrs : b.identifier('null'));
    if (has_children)
      args.push(children);
    return b.callExpression(callee, args, loc(tag))
  },

  /**
   * Visit `filter`, throwing when the filter does not exist.
   *
   * @param {Filter} filter
   * @api public
   */

  visitFilter: function (filter) {
    throw new Error('not implemented')
  },

  /**
   * Visit `text` node.
   *
   * @param {Text} text
   * @api public
   */

  visitText: function (text) {
    this.interpolate(text).forEach(function (str) {
      this.buf += str + ';\n'
    }.bind(this))
  },

  /**
   * Visit a `comment`.
   *
   * @param {Comment} comment
   * @api public
   */

  visitComment: function (comment) {
    if (comment.buffer) this.buf += '//' + comment.val + '\n'
  },

  /**
   * Visit a `BlockComment`.
   *
   * @param {Comment} comment
   * @api public
   */

  visitBlockComment: function (comment) {
    if (!comment.buffer) return
    this.buf += '/*' + comment.val + '\n'
    this.visit(comment.block)
    debugger
    this.buf += '*/\n'
  },

  /**
   * Visit `code`, respecting buffer / escape flags.
   * If the code is followed by a block, wrap it in
   * a self-calling function.
   *
   * @param {Code} code
   * @api public
   */

  visitCode: function (code, start) {
    debugger
    var js = parseJs(code.val, code.buffer && code.escape, false, loc(code))

    // Block support
    if (code.block) {
      debugger
      var block = this.visit(code.block)
      js.push(block)
    }
    return js

  },

  /**
   * Visit `each` block.
   *
   * @param {Each} each
   * @api public
   */

  visitEach: function (each, start) {
    if (!this.hasEachHelper) {
      this.helpers.push(ǃmap＿.toString())
      this.hasEachHelper = true
    }

    this.buf += 'ǃmap＿(' + each.obj + ', (function('
    this.buf += each.val + ', ' + each.key + '){\n'
    this.visit(each.block)
    debugger
    this.buf += '\n}).bind(this)'

    if (each.alternative) {
      this.buf += ', function(){\n'
      this.visit(each.alternative)
      debugger
      this.buf += '\n}'
    }

    this.buf += '\n);'
  },

  /**
   * Visit `attrs`.
   *
   * @param {Array} attrs
   * @api public
   */

  visitAttributes: function (tag, attrs, attributeBlocks) {
    if (attributeBlocks.length) {
      if (attrs.length) {
        var val = this.attrs(attrs)
        attributeBlocks.unshift(val)
      }
      this.injectAttrsHelper()
      this.xxinjectClassHelper()
      return 'ǃattrs＿(' + attributeBlocks.join(',') + ')'
    } else if (attrs.length) {
      return this.attrs(tag, attrs, true)
    }
    return b.objectExpression([], loc(attrs))
  },

  /**
   * Compile attributes.
   */

  attrs: function (tag, attrs, buffer) {
    var properties = []
    var self = this
    var className

    attrs.forEach(function (attr) {
      var key = parseKey(attr)
      if (key) {
        var val = parseJs(attr.val, !attr.escaped, true)
        attr = b.property('init', b.identifier(key), val, locref(val, tag, attr))
        properties.push(attr)
      }
    })

    if (className) {
      if (b.isArrayExpression(className.value)) {
        className.value = b.callExpression(
          b.memberExpression(className.value, b.identifier('join'), false),
          [b.literal(' ')])
      }
      properties.push(className)
    }

    return b.objectExpression(properties, loc(tag, attrs))

    function parseKey (attr) {
      var key = attr.name
      switch (key) {
        case 'class':
        case 'className':
          var ast = parseJs(attr.val,!attr.escaped, true)
          if (b.isArrayExpression(ast)) {
            ast.elements.forEach(function (it) {
              addClass(attr, it, it)
            })
          }
          else
            addClass(attr, ast, attr.val)
          return
        case 'for':
          key = 'htmlFor'
          break
        default:
          if (key.indexOf('data-') === 0) {
            if (attr.val == null || attr.val === 'null') return
            break
          }
          if (key.indexOf('aria-') === 0)
            return key
          key = key.split('-')
          key = key[0] + key.slice(1).map(function (it) {
              return it[0].toUpperCase() + it.substr(1)
            }).join('')
      }
      return key
    }

    function addClass (attr, ast) {
      var _class

      if (className) {
        var v = className.value
        if (b.isLiteral(v) || b.isIdentifier(v)) className.value = b.arrayExpression([v], loc(tag, attr))
      }

      if (b.isEmpty(ast) || b.isLiteral(ast, 'string') && !ast.value.trim()) {
        return // no-op
      } else if (b.isObjectExpression(ast)) {
        debugger
        _class = b.arrayExpression(ast.properties.map(function (p) {
          return b.conditionalExpression(
            p.value,
            b.literal(p.key.name),
            b.literal(''),
            locref(p, tag, attr))
        }))
      } else {
        ast.loc = loc(tag, attr)
        _class = ast
      }
      if (!className) {
        className = b.property('init', b.identifier('className'), _class, loc(tag, attr))
      } else {
        var els = className.value.elements
        if (b.isLiteral(_class) || b.isIdentifier(_class)) {
          els.push(_class)
        } else {
          _class.elements.forEach(function (c) {
            els.push(c)
          })
        }
      }
    }
  },

  /**
   * Inject attrs helper.
   */

  injectAttrsHelper: function () {
    this.helpers.push(ǃattrs＿.toString())
    this.injectAttrsHelper = function () {}
  },

  /**
   * Inject class helper.
   */

  visitClass: function (tag, attr, _ast) {
    this.helpers.push(ǃclass＿.toString())

  }

}

function ǃattrs＿ () {
  var classes = []
  var attrs = {};[].slice.call(arguments).forEach(function (it) {
    for (var key in it) {
      var val = it[key]
      switch (key) {
        case 'class':
        case 'className':
          classes.push(val)
          return
        case 'for':
          key = 'htmlFor'
          break
        default:
          if (key.indexOf('data-') === 0) {
            if (val == null) return
            val = JSON.stringify(val)
            break
          }
          if (key.indexOf('aria-') === 0)
            break
          key = key.split('-')
          key = key[0] + key.slice(1).map(function (it) {
              return it.charAt(0).toUpperCase() + it.substr(1)
            }).join('')
      }
      attrs[key] = val
    }
  })
  if (classes.length) attrs.className = ǃclass＿.apply(null, classes)
  return attrs
}

function ǃclass＿ () {
  return [].slice.call(arguments).reduce(function (args, it) {
    if (it == null || it === '') {
      return args
    } if (typeof it.length === 'number') {
      return args.concat(it)
    } else {
      return args.push(it), args
    }
  }, []).join(' ')
}

function ǃmap＿ (obj, each, alt) {
  var result = [], key
  if (typeof obj.length === 'number') {
    result = [].map.call(obj, each)
  } else {
    for (key in obj) result.push(each(obj[key], key))
  }
  return result.length ? result : alt && alt()
}

function loc () {
  var node
  for (var i = 0;i < arguments.length;i++) {
    if (arguments[i]) {
      node = arguments[i]
      break
    }
  }
  if (node && node.line)
    return {
      start: {line: node.line, column: 1},
      end: {line: node.line, column: 2}
    }
}

function locref (refnode) {
  var args = [].slice.call(arguments, 1)
  var r = loc.apply(null, args)
  return {
    start: {
      line: r.start.line + refnode.loc.start.line - 1,
      column: r.start.column + refnode.loc.start.column - 1
    },
    end: {
      line: r.end.line + refnode.loc.end.line - 1,
      column: r.end.column + refnode.loc.end.column - 1
    }
  }
}

/**
 * Wrap the given `str` around an unescape sentinel.
 *
 * @param {str} escaped str
 * @api public
 */

function unescape (str) {
  return String(str)
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
}

function parseJs (src, escape, expr, loc) {
  if (escape) src = unescape(src)
  try {
//    console.log('parseJs: ' + src)
    if (expr) src = '(' + src + ')'
    var stmts = esprima.parse(src, {range: true,loc: true}).body
    var r = expr? stmts[0].expression: stmts
    if (loc)
      apply_loc(loc, r)
    return r
  } catch(e) {
    throw new Error('Line ' + loc.start.line + ' ' + e.message)
  }
}

function apply_loc (loc, node) {
  if (Array.isArray(node))
    node.forEach(function (n) {
      apply_loc(loc, n)
    })
  else if (typeof node === 'object') {
    for (var prop in node)
      if (node[prop].type)
        apply_loc(loc, node[prop])
  } else {
    node.loc = {
      start: {
        line: node.start.line + loc.start.line - 1,
        column: node.start.column + loc.start.column - 1
      },
      end: {
        line: node.end.line + loc.end.line - 1,
        column: node.end.column + loc.end.column - 1
      }
    }
  }
}
