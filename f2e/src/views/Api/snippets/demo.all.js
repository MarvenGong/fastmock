export default {
  'base': {
    'range': '@range(3, 7)',
    'string': '@string(7, 20)',
    'character': '@character("abcde")',
    'float': '@float(60, 100)',
    'integer': '@integer(60, 100)',
    'natural': '@natural(60, 100)',
    'boolean': '@boolean'
  },
  'date': {
    'date': '@date',
    'time': '@time',
    'datetime': '@datetime',
    'now': '@now'
  },
  'image': {
    'image': '@image("200x200", "#50B347", "#FFF", "FastMock")'
  },
  'color': {
    'color': '@color',
    'hex': '@hex',
    'rgb': '@rgb',
    'rgba': '@rgba',
    'hsl': '@hsl'
  },
  'text': {
    'paragraph': '@paragraph(1, 3)',
    'sentence': '@sentence(3, 5)',
    'word': '@word(3, 5)',
    'title': '@title(3, 5)',
    'cparagraph': '@cparagraph(1, 3)',
    'csentence': '@csentence(3, 5)',
    'cword': '@cword("零一二三四五六七八九十", 5, 7)',
    'ctitle': '@ctitle(3, 5)'
  },
  'name': {
    'first': '@first',
    'last': '@last',
    'name': '@name',
    'cfirst': '@cfirst',
    'clast': '@clast',
    'cname': '@cname'
  },
  'web': {
    'url': '@url',
    'domain': '@domain',
    'protocol': '@protocol',
    'tld': '@tld',
    'email': '@email',
    'ip': '@ip'
  },
  'address': {
    'region': '@region',
    'province': '@province',
    'city': '@city(true)',
    'county': '@county(true)',
    'zip': '@zip'
  },
  'helper': {
    'capitalize': '@capitalize("hello")',
    'upper': '@upper("hello")',
    'lower': '@lower("HELLO")',
    'pick': '@pick(["h", "e", "llo"])',
    'shuffle': '@shuffle(["h", "e", "llo"])'
  },
  'miscellaneous': {
    'id': '@id',
    'guid': '@guid',
    'increment': '@increment(1000)'
  }
};
