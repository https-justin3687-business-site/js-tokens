// Copyright 2014, 2015, 2016, 2017, 2018 Simon Lydell
// License: MIT. (See LICENSE.)

var fs           = require("fs")
var util         = require("util")
var assert       = require("assert")
var jsTokensTmp  = require("../")
var jsTokens     = jsTokensTmp.default
var matchToToken = jsTokensTmp.matchToToken


suite("jsTokens", function() {

  test("is a regex", function() {
    assert(util.isRegExp(jsTokens))
  })

})


suite("matchToToken", function() {

  test("is a function", function() {
    assert.equal(typeof matchToToken, "function")
  })

})


suite("tokens", function() {

  function token(name, fn) {
    suite(name, fn.bind(null, matchHelper.bind(null, name)))
  }

  function matchHelper(type, string, expected, extra) {
    extra = extra || {}
    if (typeof expected === "object") {
      extra = expected
      expected = undefined
    }
    jsTokens.lastIndex = 0
    var token = matchToToken(jsTokens.exec(string))

    test(String(string), function() {
      if (expected === false) {
        assert.notEqual(token.type, type)
      } else {
        assert.equal(token.type, type)
        assert.equal(
          token.value,
          (typeof expected === "string" ? expected : string)
        )
        if ("closed" in extra) {
          assert.equal(token.closed, extra.closed)
        } else if (type === "string") {
          assert.equal(token.closed, true)
        }
      }
    })
  }


  token("whitespace", function(match) {

    match(" ")
    match("    ")
    match(" a", " ")
    match("\t")
    match("\t\t\t")
    match("\ta", "\t")
    match("\n")
    match("\n\n\n")
    match("\na", "\n")
    match("\r")
    match("\r\r\r")
    match("\ra", "\r")
    match(" \t\n\r \r\n")
    match(" \t\n\r \r\n-1", " \t\n\r \r\n")
    match("\f")
    match("\v")

    match("\u00a0")
    match("\u1680")
    match("\u2000")
    match("\u2001")
    match("\u2002")
    match("\u2003")
    match("\u2004")
    match("\u2005")
    match("\u2006")
    match("\u2007")
    match("\u2008")
    match("\u2009")
    match("\u200a")
    match("\u2028")
    match("\u2029")
    match("\u202f")
    match("\u205f")
    match("\u3000")

  })


  token("comment", function(match) {

    match("//")
    match("//comment")
    match("// comment")
    match("//comment ")
    match("///")
    match("//**//")
    match("//comment\n", "//comment")
    match("//comment\r", "//comment")
    match("//comment\u2028", "//comment")
    match("//comment\u2029", "//comment")
    match("//comment\r\n", "//comment")
    match("//comment \n", "//comment ")
    match("//comment\t\n", "//comment\t")

    match("/**/", {closed: true})
    match("/*comment*/", {closed: true})
    match("/* comment */", {closed: true})
    match("/***/", {closed: true})
    match("/*/*/", {closed: true})
    match("/*\n\r\u2028\u2029 \r\n*/", {closed: true})

    match("/*", {closed: false})
    match("/*/", {closed: false})
    match("/*unclosed", {closed: false})
    match("/*unclosed\nnew Line(this == code ? true : false)", {closed: false})

  })


  token("string", function(match) {

    match("''")
    match('""')
    match("``")
    match("'string'")
    match('"string"')
    match("`string`")
    match("'\\''")
    match('"\\""')
    match("`\\``")
    match("'\\\\''", "'\\\\'")
    match('"\\\\""', '"\\\\"')
    match("`\\\\``", "`\\\\`")
    match("'\\\\\\''")
    match('"\\\\\\""')
    match("`\\\\\\``")
    match("'\\u05aF'")
    match('"\\u05aF"')
    match("`\\u05aF`")
    match("'invalid escape sequence is OK: \\u'")
    match('"invalid escape sequence is OK: \\u"')
    match("`invalid escape sequence is OK: \\u`")
    match("'\\\n'")
    match('"\\\n"')
    match("`\\\n`")
    match("'\\\r'")
    match('"\\\r"')
    match("`\\\r`")
    match("'\u2028'")
    match('"\u2028"')
    match("`\u2028`")
    match("'\u2029'")
    match('"\u2029"')
    match("`\u2029`")
    match("'\\\u2028'")
    match('"\\\u2028"')
    match("`\\\u2028`")
    match("'\\\u2029'")
    match('"\\\u2029"')
    match("`\\\u2029`")
    match("'\\\r\n'")
    match('"\\\r\n"')
    match("`\\\r\n`")
    match("'string'code'another string'", "'string'")
    match('"string"code"another string"', '"string"')
    match("`string`code`another string`", "`string`")
    match("'\"'")
    match("'`'")
    match('"\'"')
    match('"`"')
    match("`'`")
    match('`"`')

    match("'", {closed: false})
    match('"', {closed: false})
    match("`", {closed: false})
    match("'unclosed", {closed: false})
    match('"unclosed', {closed: false})
    match("`unclosed", {closed: false})
    match("'\n", "'", {closed: false})
    match('"\n', '"', {closed: false})
    match("`\n", {closed: false})
    match("'\r", "'", {closed: false})
    match('"\r', '"', {closed: false})
    match("`\r", {closed: false})
    match("'\u2028", {closed: false})
    match('"\u2028', {closed: false})
    match("`\u2028", {closed: false})
    match("'\u2029", {closed: false})
    match('"\u2029', {closed: false})
    match("`\u2029", {closed: false})
    match("'\r\n", "'", {closed: false})
    match('"\r\n', '"', {closed: false})
    match("`\r\n", {closed: false})
    match("'\\\n", {closed: false})
    match('"\\\n', {closed: false})
    match("`\\\n", {closed: false})
    match("'\\\r", {closed: false})
    match('"\\\r', {closed: false})
    match("`\\\r", {closed: false})
    match("'\\\u2028", {closed: false})
    match('"\\\u2028', {closed: false})
    match("`\\\u2028", {closed: false})
    match("'\\\u2029", {closed: false})
    match('"\\\u2029', {closed: false})
    match("`\\\u2029", {closed: false})
    match("'\\\r\n", {closed: false})
    match('"\\\r\n', {closed: false})
    match("`\\\r\n", {closed: false})

    match("'${}'")
    match('"${}"')
    match("`${}`")
    match("'${a}'")
    match('"${a}"')
    match("`${a}`")
    match("'a${b}c'")
    match('"a${b}c"')
    match("`a${b}c`")
    match("'${'a'}'", "'${'")
    match('"${"a"}"', '"${"')
    match("`${`a`}`")
    match("`${`${a}`}`")
    match("`${fn({a: b})}`")
    match("`${fn({a: '{'})}`")
    match("`a${}${a}${ `${b\r}` + `${`c`}` } d $${\n(x=>{return x*2})(4)}$`")
    match("`\\${{{}}}a`")

    match("`a ${b c`.length", {closed: false})
    match("`a ${`b${c`} d`.length", {closed: false})
    match("`a ${ {c:d } e`.length", {closed: false})

  })


  token("regex", function(match) {

    match("//", false)
    match("/a/")
    match("/\\//")
    match("/\\\\//", "/\\\\/")
    match("/\\\\\\//")
    match("/[/]/")
    match("/[\\]]/")
    match("/[\\]/]/")
    match("/[\\\\]/]/", "/[\\\\]/")
    match("/[\\\\\\]/]/")
    match(/\\u05aF/)
    match("/invalid escape sequence is OK: \\u/")
    match("/?foo/")
    match("/*foo/", false)

    match("/a/g")
    match("/a/m")
    match("/a/i")
    match("/a/y")
    match("/a/u")
    match("/a/s")
    match("/a/gmiyus")
    match("/a/myg")
    match("/a/e", false)
    match("/a/invalidFlags", false)
    match("/a/f00", false)

    match("/\n/", false)
    match("/\r/", false)
    match("/\u2028/", false)
    match("/\u2029/", false)
    match("/\r\n/", false)
    match("/\\\n/", false)
    match("/\\\r/", false)
    match("/\\\u2028/", false)
    match("/\\\u2029/", false)
    match("/\\\r\n/", false)
    match("/[\n]/", false)
    match("/[\r]/", false)
    match("/[\u2028]/", false)
    match("/[\u2029]/", false)
    match("/[\r\n]/", false)
    match("/[\\\n]/", false)
    match("/[\\\r]/", false)
    match("/[\\\u2028]/", false)
    match("/[\\\u2029]/", false)
    match("/[\\\r\n]/", false)

    match("/a/", "/a/")
    match("/a/g", "/a/g")
    match("/a/;", "/a/")
    match("/a/g;", "/a/g")
    match("/a/ ;", "/a/")
    match("/a/g ;", "/a/g")
    match("/a/, b", "/a/")
    match("/a/g, b", "/a/g")
    match("/a/ , b", "/a/")
    match("/a/g , b", "/a/g")
    match("/a/.exec(b)", "/a/")
    match("/a/g.exec(b)", "/a/g")
    match("/a/ .exec(b)", "/a/")
    match("/a/g .exec(b)", "/a/g")
    match("/a/['exec'](b)", "/a/")
    match("/a/g['exec'](b)", "/a/g")
    match("/a/ ['exec'](b)", "/a/")
    match("/a/g ['exec'](b)", "/a/g")
    match("/a/]", "/a/")
    match("/a/g]", "/a/g")
    match("/a/ ]", "/a/")
    match("/a/g ]", "/a/g")
    match("/a/)", "/a/")
    match("/a/g)", "/a/g")
    match("/a/ )", "/a/")
    match("/a/g )", "/a/g")
    match("/a/}", "/a/")
    match("/a/g}", "/a/g")
    match("/a/ }", "/a/")
    match("/a/g }", "/a/g")

    match("/a/+=b", "/a/")
    match("/a/ +=b", "/a/")
    match("/a/-=b", "/a/")
    match("/a/ -=b", "/a/")
    match("/a/*b", "/a/")
    match("/a/ *b", "/a/")
    match("/a/ *=b", "/a/")
    match("/a//b", "/a/")
    match("/a/ /b", "/a/")
    match("/a/ /=b", "/a/")
    match("/a/%b", "/a/")
    match("/a/ %b", "/a/")
    match("/a/%=b", "/a/")
    match("/a/ %=b", "/a/")
    match("/a/&b", "/a/")
    match("/a/ &b", "/a/")
    match("/a/&=b", "/a/")
    match("/a/ &=b", "/a/")
    match("/a/&&b", "/a/")
    match("/a/ &&b", "/a/")
    match("/a/|b", "/a/")
    match("/a/ |b", "/a/")
    match("/a/|=b", "/a/")
    match("/a/ |=b", "/a/")
    match("/a/||b", "/a/")
    match("/a/ ||b", "/a/")
    match("/a/^b", "/a/")
    match("/a/ ^b", "/a/")
    match("/a/^=b", "/a/")
    match("/a/ ^=b", "/a/")
    match("/a/<b", "/a/")
    match("/a/ <b", "/a/")
    match("/a/<=b", "/a/")
    match("/a/ <=b", "/a/")
    match("/a/<<b", "/a/")
    match("/a/ <<b", "/a/")
    match("/a/<<=b", "/a/")
    match("/a/ <<=b", "/a/")
    match("/a/>b", "/a/")
    match("/a/ >b", "/a/")
    match("/a/>=b", "/a/")
    match("/a/ >=b", "/a/")
    match("/a/>>b", "/a/")
    match("/a/ >>b", "/a/")
    match("/a/>>=b", "/a/")
    match("/a/ >>=b", "/a/")
    match("/a/>>>b", "/a/")
    match("/a/ >>>=b", "/a/")
    match("/a/>>>=b", "/a/")
    match("/a/ >>>b", "/a/")
    match("/a/!=b", "/a/")
    match("/a/ !=b", "/a/")
    match("/a/!==b", "/a/")
    match("/a/ !==b", "/a/")
    match("/a/=b", "/a/")
    match("/a/ =b", "/a/")
    match("/a/==b", "/a/")
    match("/a/ ==b", "/a/")
    match("/a/===b", "/a/")
    match("/a/ ===b", "/a/")

    match("/a/?b:c", "/a/")
    match("/a/ ? b : c", "/a/")
    match("/a/:c", "/a/")
    match("/a/g:c", "/a/g")
    match("/a/ : c", "/a/")
    match("/a/g : c", "/a/g")

    match("/a///", "/a/")
    match("/a/g//", "/a/g")
    match("/a/ //", "/a/")
    match("/a/g //", "/a/g")
    match("/a//**/", "/a/")
    match("/a/g/**/", "/a/g")
    match("/a/ /**/", "/a/")
    match("/a/g /**/", "/a/g")

    match("/a/g''", "/a/g")
    match("/a/g ''", "/a/g")

    match('/a/g""', "/a/g")
    match('/a/g ""', "/a/g")

    match("/a//b/", "/a/")
    match("/a/ /b/", "/a/")

    match("/a/g 0", "/a/g")
    match("/a/g 0.1", "/a/g")
    match("/a/g .1", "/a/g")
    match("/a/g 0x1", "/a/g")

    match("/a/g e", "/a/g")
    match("/a/g _", "/a/g")
    match("/a/g $", "/a/g")
    match("/a/g é", "/a/g")
    match("/a/g \\u0080", "/a/g")

  })


  token("number", function(match) {

    match("1")
    match("1.")
    match("1..", "1.")
    match("0.1")
    match(".1")
    match("0.1.", "0.1")

    match("-1", false)
    match("-1.", false)
    match("-1..", false)
    match("-0.1", false)
    match("-.1", false)
    match("-0.1.", false)
    match("-", false)

    match("1e1")
    match("1.e1")
    match("1.e1.", "1.e1")
    match("0.1e1")
    match(".1e1")
    match("0.1e1.", "0.1e1")

    match("1e+1")
    match("1e-1")
    match("1e0123")
    match("1e0.123", "1e0")
    match("1e0x123", "1e0")
    match("1E1")
    match("1E+1")
    match("1E-1")
    match("1E0123")
    match("1E0.123", "1E0")
    match("1E0x123", "1E0")
    match("1E0o123", "1E0")
    match("1E0b123", "1E0")

    match("e1", false)
    match("e+1", false)
    match("e-1", false)
    match("E1", false)
    match("E+1", false)
    match("E-1", false)

    match("-e1", false)
    match("-e+1", false)
    match("-e-1", false)
    match("-E1", false)
    match("-E+1", false)
    match("-E-1", false)

    match("0x1")
    match("0xa")
    match("0x015cF")
    match("0x1e1")
    match("0x1E1")
    match("0x1g1", "0x1")

    match("0X1")
    match("0Xa")
    match("0X015cF")
    match("0X1e1")
    match("0X1E1")
    match("0X1g1", "0X1")

    match("-0x1", false)
    match("-0xa", false)
    match("-0x015cF", false)
    match("-0x1e1", false)
    match("-0x1E1", false)
    match("-0x1g1", false)

    match("0x", "0")
    match("1x1", "1")
    match("0x1.", "0x1")
    match("0x1.1", "0x1")
    match("0.0x1", "0.0")
    match(".0x1", ".0")

    match("0o1")
    match("0oa", "0")
    match("0o01574")
    match("0o1e1", "0o1")
    match("0o1E1", "0o1")
    match("0o1g1", "0o1")

    match("0O1")
    match("0Oa", "0")
    match("0O01574")
    match("0O1e1", "0O1")
    match("0O1E1", "0O1")
    match("0O1g1", "0O1")

    match("-0o1", false)
    match("-0oa", false)
    match("-0o01574", false)
    match("-0o1e1", false)
    match("-0o1E1", false)
    match("-0o1g1", false)

    match("0o", "0")
    match("1o1", "1")
    match("0o1.", "0o1")
    match("0o1.1", "0o1")
    match("0.0o1", "0.0")
    match(".0o1", ".0")

    match("0b1")
    match("0ba", "0")
    match("0b01011")
    match("0b1e1", "0b1")
    match("0b1E1", "0b1")
    match("0b1g1", "0b1")

    match("0B1")
    match("0Ba", "0")
    match("0B01011")
    match("0B1e1", "0B1")
    match("0B1E1", "0B1")
    match("0B1g1", "0B1")

    match("-0b1", false)
    match("-0ba", false)
    match("-0b01011", false)
    match("-0b1e1", false)
    match("-0b1E1", false)
    match("-0b1g1", false)

    match("0b", "0")
    match("1b1", "1")
    match("0b1.", "0b1")
    match("0b1.1", "0b1")
    match("0.0b1", "0.0")
    match(".0b1", ".0")

  })


  token("name", function(match) {

    match("$")
    match("_")
    match("a")
    match("z")
    match("A")
    match("Z")
    match("å")
    match("π")
    match("0", false)
    match("0a", false)
    match("$0")
    match("_0")
    match("a0")
    match("z0")
    match("A0")
    match("Z0")
    match("å0")
    match("π0")
    match("a_56åπ")
    match("Iñtërnâtiônàlizætiøn☃💩") // The last character is Pile of poo.

    match("a\u00a0", "a")
    match("a\u1680", "a")
    match("a\u2000", "a")
    match("a\u2001", "a")
    match("a\u2002", "a")
    match("a\u2003", "a")
    match("a\u2004", "a")
    match("a\u2005", "a")
    match("a\u2006", "a")
    match("a\u2007", "a")
    match("a\u2008", "a")
    match("a\u2009", "a")
    match("a\u200a", "a")
    match("a\u2028", "a")
    match("a\u2029", "a")
    match("a\u202f", "a")
    match("a\u205f", "a")
    match("a\u3000", "a")

    match("\\u0000")
    match("\\u15cF")
    match("\\u15cG", false)
    match("\\u000", false)
    match("\\u00000")
    match("a\\u0000b")

    match("\\u{0}")
    match("\\u{01}")
    match("\\u{012}")
    match("\\u{0123}")
    match("\\u{01234}")
    match("\\u{012345}")
    match("\\u{0123456}")
    match("\\u{00000000000000a0}")
    match("\\u{15cF}")
    match("\\u{15cG}", false)
    match("a\\u{0000}b")

    match("\\x09", false)

  })


  token("punctuator", function(match) {

    match("+")
    match("++")
    match("+=")
    match("++=", "++")
    match("-")
    match("--")
    match("-=")
    match("--=", "--")
    match("*")
    match("**")
    match("*=")
    match("**=")
    match("/")
    match("//", false)
    match("/=")
    match("//=", false)
    match("%")
    match("%%", "%")
    match("%=")
    match("%%=", "%")
    match("&")
    match("&&")
    match("&=")
    match("&&=", "&&")
    match("|")
    match("||")
    match("|=")
    match("||=", "||")
    match("^")
    match("^^", "^")
    match("^=")
    match("^^=", "^")
    match("<")
    match("<<")
    match("<<<", "<<")
    match("<=")
    match("<<=")
    match(">")
    match(">>")
    match(">>>")
    match(">=")
    match(">>=")
    match(">>>=")
    match("!")
    match("!=")
    match("!==")
    match("!===", "!==")
    match("=")
    match("==")
    match("===")

    match("=>")
    match("==>", "==")
    match("=>>", "=>")

    match("...")
    match("..", ".")
    match(".")
    match("....", "...")

    match("?")
    match("~")
    match(".")
    match(",")
    match(":")
    match(";")
    match("[")
    match("]")
    match("(")
    match(")")
    match("{")
    match("}")

    match("/a/()", "/")
    match("/a/g()", "/")
    match("/a/ ()", "/")
    match("/a/g ()", "/")
    match("/a/{}", "/")
    match("/a/g{}", "/")
    match("/a/ {}", "/")
    match("/a/g {}", "/")

    match("/a/+b", "/")
    match("/a/ +b", "/")
    match("/a/++b", "/")
    match("/a/ ++b", "/")
    match("/a/-b", "/")
    match("/a/ -b", "/")
    match("/a/--b", "/")
    match("/a/ --b", "/")
    match("/a/!b", "/")
    match("/a/ !b", "/")
    match("/a/~b", "/")
    match("/a/ ~b", "/")

    match("/a/g+b", "/")
    match("/a/g +b", "/")
    match("/a/g+=b", "/")
    match("/a/g +=b", "/")
    match("/a/g++", "/")
    match("/a/g ++", "/")
    match("/a/g-b", "/")
    match("/a/g -b", "/")
    match("/a/g-=b", "/")
    match("/a/g -=b", "/")
    match("/a/g--", "/")
    match("/a/g --", "/")
    match("/a/g*b", "/")
    match("/a/g *b", "/")
    match("/a/g *=b", "/")
    match("/a/g/b", "/")
    match("/a/g /b", "/")
    match("/a/g /=b", "/")
    match("/a/g%b", "/")
    match("/a/g %b", "/")
    match("/a/g%=b", "/")
    match("/a/g %=b", "/")
    match("/a/g&b", "/")
    match("/a/g &b", "/")
    match("/a/g&=b", "/")
    match("/a/g &=b", "/")
    match("/a/g&&b", "/")
    match("/a/g &&b", "/")
    match("/a/g|b", "/")
    match("/a/g |b", "/")
    match("/a/g|=b", "/")
    match("/a/g |=b", "/")
    match("/a/g||b", "/")
    match("/a/g ||b", "/")
    match("/a/g^b", "/")
    match("/a/g ^b", "/")
    match("/a/g^=b", "/")
    match("/a/g ^=b", "/")
    match("/a/g<b", "/")
    match("/a/g <b", "/")
    match("/a/g<=b", "/")
    match("/a/g <=b", "/")
    match("/a/g<<b", "/")
    match("/a/g <<b", "/")
    match("/a/g<<=b", "/")
    match("/a/g <<=b", "/")
    match("/a/g>b", "/")
    match("/a/g >b", "/")
    match("/a/g>=b", "/")
    match("/a/g >=b", "/")
    match("/a/g>>b", "/")
    match("/a/g >>b", "/")
    match("/a/g>>=b", "/")
    match("/a/g >>=b", "/")
    match("/a/g>>>b", "/")
    match("/a/g >>>=b", "/")
    match("/a/g>>>=b", "/")
    match("/a/g >>>b", "/")
    match("/a/g!=b", "/")
    match("/a/g !=b", "/")
    match("/a/g!==b", "/")
    match("/a/g !==b", "/")
    match("/a/g=b", "/")
    match("/a/g =b", "/")
    match("/a/g==b", "/")
    match("/a/g ==b", "/")
    match("/a/g===b", "/")
    match("/a/g ===b", "/")

    match("/a/g?b:c", "/")
    match("/a/g ? b : c", "/")

    match("/a/''", "/")
    match("/a/ ''", "/")

    match('/a/""', "/")
    match('/a/ ""', "/")

    match("/a/g/b/", "/")
    match("/a/g /b/", "/")

    match("/a/0", "/")
    match("/a/ 0", "/")
    match("/a/0.1", "/")
    match("/a/ 0.1", "/")
    match("/a/.1", "/")
    match("/a/ .1", "/")

    match("/a/e", "/")
    match("/a/ e", "/")
    match("/a/_", "/")
    match("/a/ _", "/")
    match("/a/$", "/")
    match("/a/ $", "/")
    match("/a/é", "/")
    match("/a/ é", "/")
    match("/a/\\u0080", "/")
    match("/a/ \\u0080", "/")

    match("/a/ge", "/")
    match("/a/g_", "/")
    match("/a/g$", "/")
    match("/a/gé", "/")
    match("/a/g0", "/")
    match("/a/g\\u0080", "/")

  })


  token("invalid", function(match) {

    match("")
    match("@")
    match("#")
    match("\\")
    match("\\xa9", "\\")
    match("\u0000")
    match("\u007F")

  })

})


suite("tokenization", function() {

  function testFile(file) {
    var contents = fs.readFileSync("test/fixtures/" + file + ".js").toString()
    var expected = require("./fixtures/" + file + ".json")
    var actual = contents.match(jsTokens)
    test(file + ".js", function() {
      assert.deepEqual(actual, expected)
      assert.equal(actual.join(""), contents)
    })
  }

  testFile("base64")
  testFile("errors")
  testFile("regex")
  testFile("division")

})
