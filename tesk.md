
## 题目1：数组去重
/* --------- 数组去重 ----------- */
/* 尽量不使用 JS 特有的语法糖，尽量不使用如 Array.sort 等语言特有的方法。*/
~~~javascript
const arr1 = [1, 1, 2, 3, 3, 3, 4, 5, 5, 7, 8, 8, 8, 9];
/**
 * 返回一个新的数组，去掉了重复的数字
 * @param {number[]} arr
 * @return {number[]}
 */
function union(arr) {
  var aryTemp = [];
  for(var i = 0; i < arr.length; i++){
    if(!aryTemp.includes(arr[i])){
      aryTemp.push(arr[i]);
    }
  }
  return aryTemp;
}
// es6常用方法
function union2(arr) {
  return Array.from(new Set(arr));
}
console.log(union(arr1));
console.log(union2(arr1));
~~~
## 题目2：CSS选择器考察
~~~html
<!DOCTYPE html><html lang="en"><head>
    <meta charset="UTF-8">
    <title>Title</title>
    <!--题目说明-->
    <!--将children下，第3个div子元素，背景颜色置为红色-->
    <style>
      div.children > div:nth-of-type(3) {background-color: #f33;}
    </style>
    <!--将children下，第2个子元素，文字颜色置为蓝色-->
    <style>
      .children > *:nth-child(2) {color: blue;}
    </style>
    <!--将children下，lang属性包含bcd，文字颜色置为绿色-->
    <style>
      .children > *[lang*="bcd"] {color: green;}
    </style>
</head>
<body>
<div>
    <div class="children">
        <div>test</div>
        <p>test</p>
        <div>test</div>
        <p>test</p>
        <div lang="abc">testqqqq</div>
        <div lang="abcd">test</div>
        <div>test</div>
        <div>test</div>
    </div>
</div>
</body>
</html>
~~~
## 题目3：实现一个方法，拆解URL参数中queryString
~~~javascript
// 入参格式参考：
const url = 'http://sample.com/?a=1&b=2&c=xx&d#hash';

// 出参格式参考：
const result = { a: '1', b: '2', c: 'xx', d: '' };

/*拆解URL参数中queryString，返回一个 key - value 形式的 object*/
function querySearch(url) {
  // your code are here...
  // 截取？之后#之前的部分并用&符号拆分成数组
  let sear = url.slice(url.indexOf("?") + 1, url.indexOf("#")).split("&")
  let p = {};
  // 循环数组并根据=符号拆分键值对
  for (var i = 0, j = sear.length; j > i; i++) {
      var s = sear[i].split("=");
      p[s[0]] = s[1] || ''; // 没有值的参数用空字符串填充
  }
  return p;
}
console.log(querySearch(url));
~~~
## 题目4：实现findFibonacci函数
~~~javascript
// 斐波那契数列段：从第三位起，每个数字都是前两位数字之和，不一定要从 1 开始

// 入参格式参考：
const inputArr = [13, 9, 3, 8, 5, 25, 31, 11, 21];

// 出参格式参考：
const sequence = [3, 5, 8, 13, 21];

/* 实现findFibonacci函数，在一堆正整数中，找到最长的一组斐波那契数列段*/
// 定义一个sort排序规则，升序排列
function ascSort(a,b){
  return a - b
}
function findFibonacci(arr) {
  /**
   * 此处写代码逻辑
   */
  // 判断是不是数组并且数组长度大于3
  if (!(arr instanceof Array) || arr.length < 3) {
  	return [];
  }
  // 现将数组从小到大排序
  const sortAry = arr.sort(ascSort);
  let aryTemp = [];
  // 遍历数组，前两个最小元素直接保存，后面的元素满足等于已有元素的最后两个元素的和则保存
  sortAry.map(function(item, index) {
  	const currLastTwoSum = aryTemp[aryTemp.length - 1] + aryTemp[aryTemp.length - 2];
    if (index <= 1 || item === currLastTwoSum) {
    	aryTemp.push(item);
    }
  })
  return aryTemp;
}
console.log(findFibonacci(inputArr));
~~~
## 题目5：Vue 双向绑定的理解

> 实现一个简单的 DOM-JS数据绑定方案，要求在 JS 中改变变量数据后 DOM 视图会自动更新
~~~html
<!DOCTYPE html>
<html>
<head>
  <title>DOM-JS数据绑定方案</title>
</head>
<body>
  <div id="app">
    <h1 v-text="title"></h1>
    <p>当前时间：<span v-text="time"></span></p>
  </div>
  <script>
    function ViewBind({ el = 'body', data = {}} = {}) {
      // TODO，请在此书写代码
      // 要返回的对象实例
      let obj = {};
 			// 遍历data的所有属性
      let dataKeys = Object.keys(data);
      dataKeys.map(key => {
      	// 为data的所有属性添加set方法
        Object.defineProperty(data, key, {
          set: function(newVal) {
            // 修改v-text属性对应的data中的key的值
            document.querySelector(el + " *[v-text=" + key + "]").textContent = newVal;
          }
        });
      });
      // 将处理好的data赋值给要返回的对象
      obj.data = data;
      return obj;
    }

    /**
     * step: 1
     * 调用方式类似 Vue 初始化，
     * el 代表根元素，data 中的字段会自动和 DOM 中 v-text 属性对应元素内容绑定
     **/
    const app = new ViewBind({
      el: '#app',
      data: {
        title: '这是标题',
        time: +new Date()
      }
    })
    /**
     * step: 2
     * 初始化之后页面#app显示效果如下：
      <div id="app">
        <h1 v-text="title">这是标题</h1>
        <p>当前时间戳：<span v-text="time">1522070099060</span></p>
      </div>
     * 类似于 Vue，初始化之后 app 内部有一个 data 对象，
     * 通过修改 data 对象的属性来间接修改 DOM 中挂载了对应 v-text 属性的元素内容
     **/
    setInterval(() => {
      // 定时修改页面上<span v-text="time">元素中的内容
      app.data.time = +new Date();
      app.data.title = '这是标题' + new Date();
    }, 1000)

    /**
     * step3: 请实现上述 ViewBind 方法
     * 提示：可参考 Vue 中响应式数据绑定和指令的实现原理
     **/
  </script>
</body>
</html>
~~~