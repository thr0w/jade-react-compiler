var esprima = require('esprima')
var escodegen = require('escodegen')
var b = require('./builder')
var assert = require('assert')
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
    this.depth_tag = -1
    var body = this.visitBlock(this.node)
    var _loc = {start: {line: 1,column: 1}, end: {line: lastrow, column: 1}}
    var fn = b.functionDeclaration(b.identifier(this.options.sourceMap, _loc), this.fn_arguments, b.blockStatement(body, _loc), false, false, _loc)
    return b.program([fn], _loc)
  },

  /**
   * Interpolate the given `str`.
   *
   * @param {String} str
   * @api public
   */

  interpolate: function (text) {
    var match
    var result = []
    var str = text.val, _loc = loc(text), js, bracket_idx

    if (str === '') return []

    while (str && (match = /(\\)?([#!]){((?:.|\n)*)$$/.exec(str))) {
      push_literal(str.substr(0, match.index))
      str = match[3]

      if (match[1]) { // escape
        push_literal(match[2] + '{')
        continue
      }

      if (match[2] == '!')
        this.error("Don't use unescape interpolate with React. This forces a dangerouslySetInnerHTML", text)

      bracket_idx = findBracket()
      var js = parseJs(str.substr(0, bracket_idx), false, true, _loc)

      result.push(js)

      str = str.substr(bracket_idx + 1)
    }

    push_literal(str)

    return result

    function findBracket () {
      var state = 0, c
      for (var i = 0;i < str.length;i++) {
        c = str.charAt(i)
        if (c == '{') state++
        else if (c == '}')
          if (state)  state--
          else return i
      }
    }

    function push_literal (s) {
      if (s) {
        var l = result.length - 1
        if (l >= 0 && b.isLiteral(result[l])) {
          result[l].literal = result[l] + s
          result[l].raw = JSON.stringify(result[l].literal)
        }
        else
          result.push(b.literal(s, _loc))
      }
    }
  },

  /**
   * Visit `node`.
   *
   * @param {Node} node
   * @api public
   */

  visit: function (node) {
    this.depth++
    console.log('depth ' + this.depth + ', visit' + JSON.stringify(node))
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
    return b.literal(node.str, loc(node))
  },

  /**
   * Visit all nodes in `block`.
   *
   * @param {Block} block
   * @return {tag_count: number, stmts: []}
   * @api public
   */

  visitBlock: function (block) {
    var _this = this, ret
    var in_children = this.in_children
    var save_in_children = this.in_children
    var $ret = false, $ret_push
    var node_if, _loc = loc(block)
    var stmts = block.nodes.reduce(function (stmts, node) {
      var stmt
      if (node.type == 'Code' && /^\s*if\b/.test(node.val)) {
        $ret = true
        stmt = node_if = _this.visitIf(node, node.val)
      }
      else if (node.type == 'Code' && /^\s*unless\b/.test(node.val)) {
        $ret = true
        stmt = node_if = _this.visitIf(node, '!(' + code.val.replace(/^\s*unless\b/, '') + ')')
      }
      else if (node.type == 'Code' && /^\s*else\b/.test(node.val)) {
        $ret = true
        node_if = _this.visitElse(node, node_if)
        stmt = null
      }
      else if (node.type == 'Code' && /^\s*while\b/.test(node.val)) {
        $ret = true
        stmt = _this.visitWhile(node)
      }
      else
        stmt = _this.visit(node)
      if (stmt)
        stmts.push(stmt)
      return stmts
    }, [])

    if ($ret) {
      in_children = 'push'
      $ret = b.identifier('$ret', _loc)
      ret = [b.variableDeclaration('var', [b.variableDeclarator($ret, b.arrayExpression([]), _loc)], _loc)]
    }
    else
      ret = []
    stmt_ret(stmts)
    if ($ret) {
      ret.push(b.returnStatement($ret, _loc))
      var block_body = b.blockStatement(ret, _loc)
      var fn_block = b.functionExpression(null, [], block_body, false, false, _loc)
      ret = []
      in_children = save_in_children
      stmt_element(b.callExpression(fn_block, [], _loc))
    }
    return ret

    function stmt_ret (stmt) {
      if (Array.isArray(stmt))
        stmt.forEach(stmt_ret)
      else if (b.isExpressionStatement(stmt) && isReactCreateElement(stmt.expression))
        stmt_element(stmt.expression)
      else if (isReactCreateElement(stmt))
        stmt_element(stmt)
      else
        ret.push(stmt)
    }

    function stmt_element (e) {
      if (in_children === 'push')
        ret.push(b.expressionStatement(
          b.callExpression(b.memberExpression(
            b.identifier('$ret', _loc), b.identifier('push', _loc), false, _loc),
            [e], _loc)))
      else if (in_children)
        ret.push(e)
      else
        ret.push(b.returnStatement(e, _loc))
    }
  },

  /**
   * Visit a mixin's `block` keyword.
   *
   * @param {MixinBlock} block
   * @api public
   */

  visitMixinBlock: function (block) {
    debugger
    this.error('todo')
    this.buf += 'block ? block() : null;\n'
  },

  /**
   * Visit `doctype`.
   *
   * @param {Doctype} doctype
   * @api public
   */

  visitDoctype: function () {
    this.error("Don't use doctype with React")
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
    this.depth_tag++
    this.in_children = true
    var name = /^[A-Z]/.test(tag.name)? b.identifier(tag.name): b.literal(tag.name)
    var attrs = this.visitAttributes(tag, tag.attrs, tag.attributeBlocks)
    var children = tag.block.nodes.length ? this.visitBlock(tag.block) : []
    if (tag.code) {
      var code = this.visitCode(tag.code)
      assert(code.length == 1 && b.isExpressionStatement(code[0]))
      children.push(code[0].expression)
    }
    var callee = b.memberExpression(b.identifier('React'), b.identifier('createElement'), false, loc(tag))
    var args = [name]
    var has_attrs = attrs && attrs.properties.length
    var has_children = children && children.length
    if (has_attrs || has_children)
      args.push(has_attrs ? attrs : b.identifier('null'))
    if (has_children)
      flat_children(children)

    this.depth_tag--
    return b.callExpression(callee, args, loc(tag))

    function flat_children (c) {
      c.forEach(function (gc) {
        if (Array.isArray(gc))
          flat_children(gc)
        else
          args.push(gc)
      })
    }
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
    return this.interpolate(text)
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

  visitCode: function (code) {
    var js = parseJs(code.val, code.buffer && code.escape, false, loc(code))

    // Block support
    if (code.block) {
      debugger
      throw new Error('todo')
      var block = this.visit(code.block)
      js.push(block)
    }
    return js

  },

  visitIf: function (code, js) {
    var _loc = loc(code)
    js = '(' + js.replace(/^\s*if\b/, '') + ')'
    this.in_children = 'push'
    js = parseJs(js, code.buffer && code.escape, true, loc(code))
    var body = this.visitBlock(code.block)
    return b.ifStatement(js, b.blockStatement(body, _loc), null, _loc)
  },

  visitElse: function (code, if_node) {
    if (!if_node || (if_node.alternate && if_node.alternate.type))
      this.error('invalid else')
    var _loc = loc(code)
    this.in_children = 'push'
    var val = code.val.replace(/^\s*else\b/, '')
    if (/^\s*if\b/.test(val)) {
      return if_node.alternate = this.visitIf(code, val)
    }
    assert(!val)
    var body = this.visitBlock(code.block)
    if_node.alternate = b.blockStatement(body, _loc)

    return null
  },

  visitWhile: function (code) {
    var _loc = loc(code)
    js = '(' + code.val.replace(/^\s*while\b/, '') + ')'
    this.in_children = 'push'
    js = parseJs(js, code.buffer && code.escape, true, loc(code))
    var body = this.visitBlock(code.block)
    return b.whileStatement(js, b.blockStatement(body, _loc), null, _loc)
  },

  /**
   * Visit `each` block.
   *
   * @param {Each} each
   * @api public
   */

  visitEach: function (each, start) {
    var _loc = loc(each), map, callee, map_cb
    var obj = parseJs(each.obj, false, true)
    this.in_children = false
    var body = this.visitBlock(each.block)
    var id_val = b.identifier(each.val, _loc)

    if (each.key == '$index') {
      callee = b.memberExpression(obj, b.identifier('map', _loc), false, _loc)
      map_cb = b.functionExpression(null, [b.identifier(each.val, _loc)], b.blockStatement(body, _loc), false, false, _loc)
      map = b.callExpression(callee, [map_cb], _loc)
      return map
    } else {
      var $obj = b.identifier('$obj', _loc)
      var keys = b.callExpression(b.memberExpression(b.identifier('Object'), b.identifier('keys'), false, _loc), [$obj], _loc)
      var id_key = b.identifier(each.key, _loc)
      var val = b.variableDeclaration('var', [
        b.variableDeclarator(id_val,
          b.memberExpression($obj, id_key, true, _loc)
        )])
      body.splice(0, 0, val)
      callee = b.memberExpression(keys, b.identifier('map', _loc), false, _loc)
      map_cb = b.functionExpression(null, [id_key], b.blockStatement(body, _loc), false, false, _loc)
      map = b.callExpression(callee, [map_cb], _loc)
      var block_body = b.blockStatement([b.returnStatement(map, _loc)], _loc)
      var fn_block = b.functionExpression(null, [$obj], block_body, false, false, _loc)
      return b.callExpression(fn_block, [obj], _loc)
    }

  // this.buf += 'ǃmap＿(' + each.obj + ', (function('
  // this.buf += each.val + ', ' + each.key + '){\n'
  //
  // debugger
  // this.buf += '\n}).bind(this)'
  //
  // if (each.alternative) {
  //   this.buf += ', function(){\n'
  //   this.visit(each.alternative)
  //   debugger
  //   this.buf += '\n}'
  // }
  //
  // this.buf += '\n);'
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
          var ast = parseJs(attr.val, !attr.escaped, true)
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

  error: function (msg, _loc) {
    _loc = loc(_loc)
    throw new Error('Line: ' + _loc.start.line + ' ' + msg)
  }

}

var lastrow = 1

function loc () {
  var line = lastrow
  var node
  for (var i = 0;i < arguments.length;i++) {
    if (arguments[i]) {
      node = arguments[i]
      if (node.loc) {
        lastrow = node.loc.start.line
        return node.loc
      }
      break
    }
  }
  if (node && node.line)
    line = lastrow
  lastrow = line
  return {
    start: {line: line, column: 1},
    end: {line: line, column: 2}
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
    if (loc) {
      var bl = []
      for (var i = 1;i < loc.start.line;i++)
        bl.push('\n')
      src = bl.join('') + src
    }
    var stmts = esprima.parse(src, {sourceType: 'module', range: true,loc: true}).body
    var r = expr? stmts[0].expression: stmts
    return r
  } catch(e) {
    throw new Error('Line ' + (loc ? loc.start.line : lastrow + ' (near)') + ' ' + e.message)
  }
}

function isReactCreateElement (node) {
  return b.isCallExpression(node) &&
  b.isMemberExpression(node.callee) &&
  b.isIdentifier(node.callee.object) && node.callee.object.name === 'React' &&
  b.isIdentifier(node.callee.property) && node.callee.property.name === 'createElement'
}
