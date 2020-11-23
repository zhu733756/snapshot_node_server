# 重点频道转载画框nodejs爬虫-v1.0.md

## ip
  - 本地`localhost`
  - 服务器`原来重点频道转载爬虫项目的ip`

## 请求指定重点频道位置【从已配置的重点频道站点快照采集】

- 通过url匹配画框

  - 样例 
    ```
    API: http://localhost:5050/nb 
    method: GET
    params: {
        'site': '人民网',
        'position': '首页-头条区',
        'matchUrl': 'http://cpc.people.com.cn/n1/2020/1111/c64094-31926269.html',
    }
    ```

  - 返回结果样例
  
    ```JSON
    {
        site: "人民网",
        position: "首页-头条区",
        matchUrl: "http://world.people.com.cn/n1/2020/1111/c1002-31926354.html",
        status: 1,
        msg: "",
        htmlPath: "C:\Users\Lenovo\Desktop\pages\2020-10\11\5Lq65rCR572R\6aaW6aG1LeWktOadoeWMug==\2ac48b9ea3508041a26e3e39d553e725.html"
    }
    ```
    
  - htmlPath相对路径解析规则
    - 主目录
      - `/data/micor_nfs/snapshot_zdpd`
    - 相对路径
      - `年-月/日/base64(site)/base64(position)/md5(matchUrl).html`
    

- 通过标题匹配画框

  - 样例 
    ```
    API: http://localhost:5050/nb 
    method: GET
    params: {
        'site': '人民网',
        'position': '首页-头条区',
        'matchTitle': '栗战书主持全国人大常委会会议',
    }
    ```

  - 返回结果样例
  
    ```JSON
    {
        site: "人民网",
        position: "首页-头条区",
        matchTitle: "栗战书主持全国人大常委会会议",
        status: 1,
        msg: "",
        htmlPath: "C:\Users\Lenovo\Desktop\pages\2020-10\11\5Lq65rCR572R\6aaW6aG1LeWktOadoeWMug==\041ff03d8826b7e8d22090db45e13533.html"
    }
    ```
    
  - htmlPath相对路径解析规则
    - 主目录
      - `/data/micor_nfs/snapshot_zdpd`
    - 相对路径
      - `年-月/日/base64(site)/base64(position)/md5(matchTitle).html`

- 可请求范围
    ```
    {site:'中安在线', position: '首页-宣城频道', url: 'http://www.anhuinews.com/'},
    {site:'光明网', position: '首页-头条区', url: 'http://www.gmw.cn/'},
    {site:'光明网', position: '首页-要闻区', url: 'http://www.gmw.cn/'},
    {site:'光明网', position: '首页-时评区', url: 'http://www.gmw.cn/'},
    {site:'光明网', position: '首页-热点区', url: 'http://www.gmw.cn/'},
    {site:'光明网', position: '新闻-要闻区', url: 'http://news.gmw.cn/'},
    {site:'光明网', position: '时政-要闻区', url: 'http://politics.gmw.cn/'},
    {site:'光明网', position: '时政-列表区', url: 'http://politics.gmw.cn/'},
    {site:'光明网', position: '国际-要闻区', url: 'http://world.gmw.cn/'},
    {site:'光明网', position: '地方-要闻区', url: 'http://difang.gmw.cn/'},
    {site:'凤凰网', position: '首页-要闻区', url: 'http://www.ifeng.com/'},
    {site:'光明网', position: '资讯-头条区', url: 'http://news.ifeng.com/'},
    {site:'网易', position: '首页-要闻区', url: 'http://www.163.com/'},
    {site:'网易', position: '新闻-要闻区', url: 'http://news.163.com/'},
    {site:'人民网', position: '首页-头条区', url: 'http://people.com.cn/'},
    {site:'人民网', position: '首页-要闻区', url: 'http://people.com.cn/'},
    {site:'人民网', position: '首页-快讯区', url: 'http://people.com.cn/'},
    {site:'人民网', position: '时政首页-头条区', url: 'http://politics.people.com.cn/'},
    {site:'人民网', position: '时政首页-要闻区', url: 'http://politics.people.com.cn/'},
    {site:'人民网', position: '国际首页-要闻区', url: 'http://world.people.com.cn/'},
    {site:'人民网', position: '社会首页-头条区', url: 'http://society.people.com.cn/'},
    {site:'人民网', position: '社会首页-要闻区', url: 'http://society.people.com.cn/'},
    {site:'腾讯', position: '首页-要闻区', url: 'http://www.qq.com/'},
    {site:'腾讯', position: '首页-要闻区', url: 'http://news.qq.com/'},
    {site:'新浪网', position: '首页-新闻区', url: 'http://www.sina.com.cn/'},
    {site:'新浪网', position: '新闻-要闻区', url: 'http://news.sina.com.cn/'},
    {site:'搜狐', position: '首页-新闻区', url: 'http://www.sohu.com/'},
    {site:'搜狐', position: '新闻-要闻区', url: 'http://news.sohu.com/'},
    {site:'搜狐', position: '新闻-时政社会', url: 'http://news.sohu.com/'},
    {site:'新华网', position: '首页-头条区', url: 'http://www.news.cn/'},
    {site:'新华网', position: '首页-要闻区', url: 'http://www.news.cn/'},
    {site:'新华网', position: '首页-新华聚焦', url: 'http://www.news.cn/'},
    {site:'新华网', position: '时政首页-新观察', url: 'http://www.news.cn/politics/'},
    {site:'新华网', position: '时政首页-列表区', url: 'http://www.news.cn/politics/'},
    {site:'新华网', position: '地方首页-微观中国', url: 'http://www.news.cn/local/index.htm'},
    {site:'新华网', position: '地方首页-暖新闻', url: 'http://www.news.cn/local/index.htm'},
    {site:'新华网', position: '地方首页-列表区', url: 'http://www.news.cn/local/index.htm'},
    {site:'新华网', position: '国际首页', url: 'http://www.news.cn/world/index.htm'},   
    ```

## 请求未知频道【这种模式要求给定列表url以及匹配的标题或者url】

- 通过url匹配画框
  - 样例 
    ```
    API: http://localhost:5050/nb 
    method: GET
    params: {
        'targetUrl': 'http://people.com.cn/',
        'matchUrl': 'http://cpc.people.com.cn/n1/2020/1111/c64094-31926269.html',
    }
    ```
    
  - htmlPath相对路径解析规则
    - 主目录
      - `/data/micor_nfs/snapshot_zdpd`
    - 相对路径
      - `年-月/日/md5(matchUrl).html`
     
- 通过标题匹配画框
  - 样例 
    ```
    API: http://localhost:5050/nb 
    method: GET
    params: {
        'targetUrl': 'http://people.com.cn/',
        'matchTitle': '栗战书主持全国人大常委会会议',
    }
    ```
  - htmlPath相对路径解析规则
    - 主目录
      - `/data/micor_nfs/snapshot_zdpd`
    - 相对路径
      - `年-月/日/md5(matchUrl).html`

## 自定义存储路径【以匹配url为例子，标题换成matchTitle即可】
  - htmlPath相对路径解析规则
    - 主目录
      - `/data/micor_nfs/snapshot_zdpd`
    - 相对路径
      - `自定义的路径.html`
  - 指定频道模式
    ```样例
    API: http://localhost:5050/nb 
    method: GET
    params: {
        
        'site': '人民网',
        'position': '首页-头条区',
        'matchUrl': 'http://cpc.people.com.cn/n1/2020/1111/c64094-31926269.html',
        'targetPath':'产品研发中心/数据采集小组/大帅比/爆照了.hmtl'
    }
    ```
    ```数据
    {
    targetUrl: "http://people.com.cn/",
    matchTitle: "栗战书主持全国人大常委会会议",
    targetPath: "产品研发中心/数据采集小组/大帅比/爆照了.hmtl",
    status: 1,
    msg: "",
    htmlPath: "C:\Users\Lenovo\Desktop\pages\2020-10\11\产品研发中心\数据采集小组\大帅比\爆照了.hmtl.html"
    }
    ```
 - 不指定频道模式
    ```样例
    API: http://localhost:5050/nb 
    method: GET
    params: {
        'targetUrl': 'http://people.com.cn/',
        'targetUrl': 'http://people.com.cn/',
        'matchUrl': 'http://cpc.people.com.cn/n1/2020/1111/c64094-31926269.html',
        'targetPath':'产品研发中心/数据采集小组/大帅比/爆照了.hmtl'
    }
    ```
    ```数据
    {
    targetUrl: "http://people.com.cn/",
    matchUrl: "http://cpc.people.com.cn/n1/2020/1111/c64094-31926269.html",
    targetPath: "产品研发中心/数据采集小组/大帅比/爆照了.hmtl",
    status: 0,
    msg: "duplicated",
    htmlPath: "C:\Users\Lenovo\Desktop\pages\2020-10\11\产品研发中心\数据采集小组\大帅比\爆照了.hmtl.html"
    }
    ```

## 查看是否渲染成功

```
GET http://localhost:5050/status?htmlPath=C:\Users\Lenovo\Desktop\pages\2020-10\11\5Lq65rCR572R\6aaW6aG1LeWktOadoeWMug==\e139d76b86a9a0410824ec6765dbe683.html

{
htmlPath: "C:\Users\Lenovo\Desktop\pages\2020-10\11\5Lq65rCR572R\6aaW6aG1LeWktOadoeWMug==\e139d76b86a9a0410824ec6765dbe683.html",
status: false,
msg: "failed"
}

```

## 友情提示：
  - 提交之后不会马上查询到，正常需要渲染一段时间 10s左右
