'use strict'

var DEFAULTS = require('../_shared/defaultOptions')
var imp = require('../../test/_js/testImports')
var gitDiffReal = require('./index')

var GREEN = '\u001b[32m'
var RED = '\u001b[31m'
var str1 = imp.readfilego(__dirname + '/../_shared/str1.txt', {throw: true, save: true})
var str2 = imp.readfilego(__dirname + '/../_shared/str2.txt')

describe('gitDiffReal', function() {

  var sandbox

  describe('real is available', function() {

    before(function() {
      imp.loglevel.setLevel('silent')
    })

    beforeEach(function() {
      sandbox = imp.sinon.sandbox.create()
      sandbox.spy(imp.loglevel, 'info')
      sandbox.spy(imp.loglevel, 'warn')
    })

    afterEach(function() {
      sandbox.restore()
    })

    describe('line difference', function() {

      before(function() {
        if (!imp.keepIt.real()) this.skip()
      })

      it('color', function() {
        var actual = gitDiffReal(str1, str2, {color: true, wordDiff: false})
        imp.expect(actual).to.include(RED)
        imp.expect(actual).to.include(GREEN)
      })

      it('no color', function() {
        var expected = imp.readfilego(__dirname + '/../_shared/lineDiffVim.txt')
        var actual = gitDiffReal(str1, str2, {color: false, wordDiff: false})
        imp.expect(actual).to.equal(expected)
        imp.expect(actual).to.not.include(RED)
        imp.expect(actual).to.not.include(GREEN)
      })

      it('no difference', function() {
        var actual = gitDiffReal('', '', {wordDiff: false})
        imp.expect(actual).to.be.undefined
      })
    })

    describe('word difference', function() {

      before(function() {
        if (!imp.keepIt.real()) this.skip()
      })

      it('color', function() {
        var actual = gitDiffReal(str1, str2, {color: true, wordDiff: true})
        imp.expect(actual).to.include(RED)
        imp.expect(actual).to.include(GREEN)
      })

      it('no color', function() {
        var expected = imp.readfilego(__dirname + '/../_shared/wordDiffReal.txt')
        var actual = gitDiffReal(str1, str2, {color: false, wordDiff: true})
        imp.expect(actual).to.equal(expected)
        imp.expect(actual).to.not.include(RED)
        imp.expect(actual).to.not.include(GREEN)
      })

      it('no difference', function() {
        var actual = gitDiffReal('', '', {wordDiff: true})
        imp.expect(actual).to.be.undefined
      })
    })

    describe('flags', function() {

      before(function() {
        if (!imp.keepIt.real()) this.skip()
      })

      it('valid', function() {
        var expected = imp.readfilego(__dirname + '/../_shared/shortStatReal.txt')
        var actual = gitDiffReal(str1, str2, {flags: '--shortstat'})
        imp.expect(actual).to.equal(expected)
        imp.expect(imp.loglevel.warn).to.have.not.been.called
        imp.expect(imp.loglevel.info).to.have.not.been.called
      })

      it('invalid', function() {
        var actual = gitDiffReal(str1, str2, {flags: '--oops'})
        var expected = imp.readfilego(__dirname + '/../_shared/lineDiffVim.txt')
        imp.expect(actual).to.equal(expected)
        imp.expect(imp.loglevel.warn).to.have.been.calledWith('Ignoring invalid git diff options: --oops')
        imp.expect(imp.loglevel.info).to.have.been.calledWith('For valid git diff options refer to https://git-scm.com/docs/git-diff#_options')
      })
    })
  })

  describe('real is unavailable', function() {

    beforeEach(function() {
      sandbox = imp.sinon.sandbox.create()
      sandbox.stub(imp.keepIt, 'real').returns(false)
    })

    afterEach(function() {
      sandbox.restore()
    })

    it('line difference', function() {
      var actual = gitDiffReal(str1, str2, {color: false, wordDiff: false})
      imp.expect(actual).to.be.undefined
    })

    it('word difference', function() {
      var actual = gitDiffReal(str1, str2, {color: false, wordDiff: true})
      imp.expect(actual).to.be.undefined
    })
  })
})
