// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true
  },
  // https://github.com/standard/standard/blob/master/docs/RULES-en.md
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    // 'vuefix',
    'html'
  ],
  // add your custom rules here
  'rules': {
    // allow paren-less arrow functions
    'indent': [2, 2], // 两个空格的缩进
    'quotes': [2, 'single'], // js必须使用单引号
    'linebreak-style': [2, 'unix'], // 换行风格 unix/windows
    'semi': [2, 'always'], // 语句强制分号结尾
    'no-console': [1], // 不允许console语句
    'no-unused-vars': [0], // 声明了变量但是没有使用检测
    'space-unary-ops': [1, { 'words': true, 'nonwords': false }], // 一元运算符的前/后要不要加空格
    'brace-style': [2, '1tbs', { 'allowSingleLine': false }], // 大括号风格
    'comma-spacing': [2, { 'before': false, 'after': true }],   // 逗号后有空格，前没有空格
    'comma-style': [2, 'last'],  // 逗号跟在结尾
    'key-spacing': [2, { 'beforeColon': false, 'afterColon': true }], // 对象字面量中冒号的前后空格
    'lines-around-comment': [ // 行前/行后备注
      2, {
        'beforeBlockComment': false, // 段注释的前后
        'beforeLineComment': false, // 行注释的前面
        'afterBlockComment': false, // 块注释的后面
        'afterLineComment': false, // 行注释的后面
        'allowBlockStart': true,
        'allowObjectStart': true,
        'allowArrayStart': true
      }],
    'max-depth': [2, 4], // 代码最多允许4层嵌套
    'max-len': [1, 160, 2],
    'max-nested-callbacks': [2, 3], // 回调嵌套深度
    'max-params': [2, 5], // 函数最多只能有5个参数
    'max-statements': [1, 80],  // 单个函数最多80条语句
    'no-array-constructor': [2], // 禁止使用数组构造器
    'no-lonely-if': 2, // // 禁止else语句内只有if语句
    'no-multiple-empty-lines': [2, { 'max': 3, 'maxEOF': 1 }], // 空行最多不能超过2行
    'no-nested-ternary': 2,  // 不使用嵌套的三元表达式
    'no-spaced-func': 2, // 函数调用时 函数名与()之间不能有空格
    'no-trailing-spaces': 2, // 一行结束后面不要有空格
    'no-unneeded-ternary': 2, // 禁止不必要的嵌套 var isYes = answer === 1 ? true : false;简单的判断用三元表达式代替
    'object-curly-spacing': [2, 'always', { // 大括号内是否允许不必要的空格 always始终允许；never始终不允许
      'objectsInObjects': false,
      'arraysInObjects': false
    }],
    'arrow-spacing': 2, // =>的前/后括号
    'block-scoped-var': 2, // 块语句中使用var
    'no-dupe-class-members': 2,
    // 'no-var': 1, // 禁用var，用let和const代替
    'object-shorthand': [1, 'always'], // 强制对象字面量缩写语法
    'array-bracket-spacing': [2, 'never'], // 是否允许非空数组里面有多余的空格
    'operator-linebreak': [2, 'after'], // 换行时运算符在行尾还是行首
    'semi-spacing': [2, { 'before': false, 'after': true }], // 分号前后空格
    'keyword-spacing': ['error'],
    'space-before-blocks': 2, // 不以新行开始的块{前面要不要有空格
    'block-spacing': [2, 'always'],
    'space-before-function-paren': [2, 'never'], // 函数定义时括号前面要不要有空格
    'space-in-parens': [2, 'never'], // 小括号里面要不要有空格
    'spaced-comment': [1, 'always',
      { 'exceptions': ['-', '*', '+']
      }], // 注释风格要不要有空格什么的
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  },
  globals: {
    http: false
  },
  settings: {
    "import/ignore": [
      "node_modules",
      "config"
    ]
  }
};
