'use strict'

require('./server.bootstrap')

var gitDiffFake = require('./js/gitDiffFake')
var normaliseOptions = require('./js/normaliseOptions')
var validate = require('./js/validate')

var gitDiffSync = function(str1, str2, options) {

  validate(str1, str2)
  options = normaliseOptions(options)

  if (str1 === str2) return undefined

  return gitDiffFake(str1, str2, options)
}

module.exports = gitDiffSync
