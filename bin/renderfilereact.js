var jact = require('..')
var expect = require('chai').expect
var esprima = require('esprima-fb')
var escodegen = require('escodegen-jsx')
var asttypes = require('ast-types')
var fs = require('fs')
var n = asttypes.namedTypes
var b = asttypes.builders

function compile (path) {
  var references = [], properties = []

  debugger
  src = fs.readFileSync(path, 'utf8')
  var raw = jact.compileClient(src, {sourceFileName: path, raw: true,
    xvisits: {
      references: visit_references,
      property: visit_property,
      arguments: visit_state
  }})

  var src_args = raw.ast.body[0].params

  var ts = escodegen.generate(raw.ast)

  path = path.replace(/\.jade$/, '.ts')
  fs.writeFileSync(path, ts, 'utf8')

  function visit_references () {
    return []
  }
  function visit_property () {
    return []
  }
  function visit_state () {
    return []
  }
}

function renderFile (path) {
  var re = /\.jade$/
  fs.lstat(path, function (err, stat) {
    if (err) throw err
    // Found jade file
    if (stat.isFile() && re.test(path)) {
      fs.readFile(path, 'utf8', function (err, str) {
        if (err) throw err
        compile(path)
      })
    // Found directory
    } else if (stat.isDirectory()) {
      fs.readdir(path, function (err, files) {
        if (err) throw err
        files.map(function (filename) {
          return path + '/' + filename
        }).forEach(renderFile)
      })
    }
  })
}

module.exports = renderFile
