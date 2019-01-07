/* eslint-disable */
import DemoAll from './demo.all';
export default [
  // base
  { content: '@boolean', name: 'mj.base.boolean', tabTrigger: 'mj'},
  { name: 'mj.base.natural', content: '@natural(${1:60}, ${2:100})', tabTrigger: 'mj' },
  { name: 'mj.base.integer', content: '@integer(${1:60}, ${2:100})', tabTrigger: 'mj' },
  { name: 'mj.base.float', content: '@float(${1:60}, ${2:100})', tabTrigger: 'mj' },
  { name: 'mj.base.character', content: '@character(${1:"abcde"})', tabTrigger: 'mj' },
  { name: 'mj.base.string', content: '@string(${1:7}, ${2:20})', tabTrigger: 'mj' },
  { name: 'mj.base.range', content: '@range(${1:3}, ${2:7})', tabTrigger: 'mj' },
  // date
  { name: 'mj.date.date', content: '@date', tabTrigger: 'mj' },
  { name: 'mj.date.time', content: '@time', tabTrigger: 'mj' },
  { name: 'mj.date.datetime', content: '@datetime', tabTrigger: 'mj' },
  { name: 'mj.date.now', content: '@now', tabTrigger: 'mj' },
  // image
  { name: 'mj.image.image', content: '@image(${1:"200x200"}, ${2:"#50B347"}, ${3:"#FFF"}, ${4:"FastMock"})', tabTrigger: 'mj' },
  { name: 'mj.image.dataImage', content: '@time', tabTrigger: 'mj' },
  // color
  { name: 'mj.color.color', content: '@color', tabTrigger: 'mj' },
  { name: 'mj.color.hex', content: '@hex', tabTrigger: 'mj' },
  { name: 'mj.color.rgb', content: '@rgb', tabTrigger: 'mj' },
  { name: 'mj.color.rgba', content: '@rgba', tabTrigger: 'mj' },
  { name: 'mj.color.hsl', content: '@hsl', tabTrigger: 'mj' },
  // Text
  { name: 'mj.text.paragraph', content: '@paragraph(${1:1}, ${2:3})', tabTrigger: 'mj' },
  { name: 'mj.text.sentence', content: '@sentence(${1:3}, ${2:5})', tabTrigger: 'mj' },
  { name: 'mj.text.word', content: '@word(${1:3}, ${2:5})', tabTrigger: 'mj' },
  { name: 'mj.text.title', content: '@title(${1:3}, ${2:5})', tabTrigger: 'mj' },
  { name: 'mj.text.cparagraph', content: '@cparagraph(${1:1}, ${2:3})', tabTrigger: 'mj' },
  { name: 'mj.text.csentence', content: '@csentence(${1:3}, ${2:5})', tabTrigger: 'mj' },
  { name: 'mj.text.cword', content: '@cword(${1:"零一二三四五六七八九十"}, ${2:5}, ${3:7})', tabTrigger: 'mj' },
  { name: 'mj.text.ctitle', content: '@ctitle(${1:3}, ${2:5})', tabTrigger: 'mj' },
  // name
  { name: 'mj.name.first', content: '@first', tabTrigger: 'mj' },
  { name: 'mj.name.last', content: '@last', tabTrigger: 'mj' },
  { name: 'mj.name.name', content: '@name', tabTrigger: 'mj' },
  { name: 'mj.name.cfirst', content: '@cfirst', tabTrigger: 'mj' },
  { name: 'mj.name.clast', content: '@clast', tabTrigger: 'mj' },
  { name: 'mj.name.cname', content: '@cname', tabTrigger: 'mj' },
  // web
  { name: 'mj.web.url', content: '@url', tabTrigger: 'mj' },
  { name: 'mj.web.domain', content: '@domain', tabTrigger: 'mj' },
  { name: 'mj.web.protocol', content: '@protocol', tabTrigger: 'mj' },
  { name: 'mj.web.email', content: '@email', tabTrigger: 'mj' },
  { name: 'mj.email', content: '@email', tabTrigger: 'mj' },
  { name: 'mj.web.ip', content: '@ip', tabTrigger: 'mj' },
  { name: 'mj.web.url', content: '@cname', tabTrigger: 'mj' },
  // Address
  { name: 'mj.address.region', content: '@region', tabTrigger: 'mj' },
  { name: 'mj.address.province', content: '@province', tabTrigger: 'mj' },
  { name: 'mj.address.city', content: '@city(${1:true})', tabTrigger: 'mj' },
  { name: 'mj.address.county', content: '@county(${1:true})', tabTrigger: 'mj' },
  { name: 'mj.address.zip', content: '@zip', tabTrigger: 'mj' },
  // Address
  { name: 'mj.helper.capitalize', content: '@capitalize(${1:"fastmock"})', tabTrigger: 'mj' },
  { name: 'mj.helper.upper', content: '@upper(${1:"fastmock"})', tabTrigger: 'mj' },
  { name: 'mj.helper.lower', content: '@lower(${1:"FASTMOCK"})', tabTrigger: 'mj' },
  { name: 'mj.helper.pick', content: '@pick(["fast", "mock", ${1}])', tabTrigger: 'mj' },
  { name: 'mj.helper.shuffle', content: '@shuffle(["fast", "mock", ${1}])', tabTrigger: 'mj' },
  // Miscellaneous
  { name: 'mj.miscellaneous.guid', content: '@guid', tabTrigger: 'mj' },
  { name: 'mj.miscellaneous.id', content: '@id', tabTrigger: 'mj' },
  { name: 'mj.miscellaneous.increment', content: '@increment(${1:1000})', tabTrigger: 'mj' },
  { name: 'mj.address.zip', content: '@zip', tabTrigger: 'mj' },
  // demo
  { name: 'mj.demo', content: JSON.stringify(DemoAll), tabTrigger: 'mj' },
];
