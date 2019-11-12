# fastmock
### 版本说明
- 1.1.1
  1. 增加/修改接口界面交互调整。
- 1.1.0 
  1. 注册增加邮箱激活校验
  2. 增加找回密码功能
  3. 增加修改密码功能
  4. 部分页面调整和bug修复
### [fastmock文档](https://marvengong.github.io/fastmock-docs/book/)
fastmock可以让你在没有后端程序的情况下能真实地在线模拟ajax请求，你可以用fatmock实现项目初期纯前端的效果演示，也可以用fastmock实现开发中的数据模拟从而实现前后端分离。在使用fastmock之前，你的团队实现数据模拟可能是下面的方案中的一种或者多种

- 本地手写数据模拟，在前端代码中产生一大堆的mock代码。
- 利用mockjs或者canjs的can-fixture实现ajax拦截，本地配置必要的json规则。
- 后端在Controller层造假数据返回给前端。
- 上面的方式中，不管哪一种方式，都会要求开发人员写一些跟项目本无任何关联的代码，第一个和第二个方式还会需要前端项目在本地引入不必要的js文件。比如下面的mock数据
~~~javascript
// 产品配置
  {
    url: '/pms/product/list',
    on: true,
    type: 'get',
    resp: Mock.mock({
      'body': {
        'currentPage': 1,
        'isMore': 0,
        'pageSize': 15,
        'resultList|10': [
          {
            'productNo': '11111',
            'productName|1': ['产品名称1', '产品名称2', '产品名称3', '产品名称4', '产品名称5'],
            'productType|1': ['1', '2', '3', '4', '5'],
            'status|1': ['1', '2'],
            'gmtCreate': '@DATETIME("yyyy-MM-dd HH:mm:ss")',
            'gmtModified': '@now("yyyy-MM-dd HH:mm:ss")',
            'createUserCode': '@name'
          }
        ],
        'startIndex': 0,
        'totalNum': 100,
        'totalPage': 1
      },
      'reCode': '0000',
      'reMsg': '成功',
      'success': true
    })
  },
  // 产品配置-贷款材料配置
  {
    url: '/pms/cfgLoanDoc/list',
    on: true,
    resp: Mock.mock({
      'body': {
        'currentPage': 1,
        'isMore': 0,
        'pageSize': 15,
        'resultList|10': [
          {
            'loanDocCode|+1': 1,
            'loanDocName': /[测试字体]{4,30}/
          }
        ],
        'startIndex': 0,
        'totalNum': 100,
        'totalPage': 1
      },
      'reCode': '0000',
      'reMsg': '成功',
      'success': true
    })
  },
  // 产品配置-费用类型配置
  {
    url: '/pms/productFeeDetail/queryByProductNo',
    type: 'get',
    on: true,
    resp: Mock.mock({
      'body': {
        'currentPage': 1,
        'isMore': 0,
        'pageSize': 15,
        'resultList|10': [
          {
            'feeTypeNo|+1': 1,
            'feeTypeCode': /[A-Z]{4,8}/,
            'feeTypeName': '@name',
            'incomeType|1': ['1', '2'],
            'feeType|1': ['C', 'D'],
            'ratio|1': ['0.5', '0.25'],
            'productChargeBasis|1': ['1', '2', '3'],
            'fixedAmount|1-100': 5
          }
        ],
        'startIndex': 0,
        'totalNum': 100,
        'totalPage': 1
      },
      'reCode': '0000',
      'reMsg': '成功',
      'success': true
    })
  }
~~~
上面的代码为mockjs的事例代码，更多mockjs相关资料参考链接mockjs文档

为此，我们将mock层独立出来，通过中间服务的形式在前端和后端服务之前建立一道围栏，使用fastmock，前端只需要修改自己的XHR请求地址，后端只需要在开发前和前端约定好接口文档即可。等到后端服务开发完成，前端再将XHR请求地址替换回来进行联调测试即可。

tip:当然，你也可以通过npm script不同命令加载不同配置文件的形式切换你的XHR地址，这里不作详细介绍。

还是不了解fastmock？让我们跟着教程一探究竟吧 [开始使用fastmock](https://fmdocs.fastmock.site/book/)
