/*
 * @Author: your name
 * @Date: 2020-11-10 17:08:50
 * @LastEditTime: 2020-11-11 17:34:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \snapshot_node_server\src\app.js
 */
//1. 导入express
var express = require('express');
const path = require('path');
const fs = require("fs");
const savePage = require('./savepage.js');
const conf = require('./config.js');
const md5 = require('js-md5');


//2. 加载模块
var bodyParse = require('body-parser');
//3. 创建服务器
var server = express()

//4. 生成解析器
// application/x-www-form-urlencoded
var urlencoded = bodyParse.urlencoded({ extends:true })

// application/json
var jsonParser = bodyParse.json()

//5. 中间件: 把请求体参数 存放到request.body
server.use('/nb', jsonParser)

//6. 请求数据
// request:request请求头,请求体

function filterByPropertity(arr, site, position) {
    return arr.filter(s => s.site == site && s.position == position );
}

// var $$mkdir = function(dir, cb) {
//     var pathinfo = path.parse(dir)
//     if (!fs.existsSync(pathinfo.dir)) {
//         $$mkdir(pathinfo.dir,function() {
//             fs.mkdirSync(pathinfo.dir)
//         })
//     }
//     cb && cb()
// }

async function process(site, position, css, targetUrl, matchUrl, matchTitle, htmlPath){
    let browser = await savePage.launchBrowser();
    var sites_infos = filterByPropertity(conf.site_list, site, position)
    if (sites_infos.length == 0 && !targetUrl) {
        console.log("没有匹配到站点位置！")
        return 
    }
    if (sites_infos.length) {
        console.log(`<<<${site}-${position}>>> start`);
        const html =await savePage.scrape(browser, sites_infos[0], css, targetUrl, matchUrl, matchTitle, htmlPath);
        console.log(`<<<${site}-${position}>>> finish, path: ${html}`);
    } else {
        console.log(`<<<${targetUrl}>>> start`);
        const html =await savePage.scrape(browser, {}, css, targetUrl, matchUrl, matchTitle, htmlPath);
        console.log(`<<<${targetUrl}>>> finish, path: ${html}`);
    }
    await savePage.closeBrowser(browser);

}

function loop_body(site, position, css, targetUrl, matchUrl, matchTitle, destDir, targetPath) {
    console.log(`====Begin====`);
    console.log(`site: ${site}, position: ${position}, targetUrl:${targetUrl}, css: ${css}, matchUrl: ${matchUrl}, matchTitle: ${matchTitle}, destDir: ${destDir}, targetPath: ${targetPath}`);
    console.time('loop');
    if (targetPath) {
        var htmlPath = path.join(destDir, targetPath.endWith("html") ? targetPath : targetPath + ".html");
    } else if (site && position) {
        var hash = md5.create();
        hash.update(matchUrl ? matchUrl : matchTitle);
        const site_base64 = Buffer.from(site).toString('base64');
        const position_base64 = Buffer.from(position).toString('base64');
        var htmlPath = path.join(destDir, site_base64.replace("+", "-").replace("/", "_"), position_base64.replace("+", "-").replace("/", "_"), hash.hex() + ".html");
    } else {
        var hash = md5.create();
        hash.update(matchUrl ? matchUrl : matchTitle);
        var htmlPath = path.join(destDir, hash.hex() + ".html");
    }

    var msg = {
        htmlPath: htmlPath,
        msg: '',
        status: 1
    }
    
    var flag = fs.existsSync(htmlPath, (err) => {
        return !err ? true: false
    })

    if (flag) {
        console.log(`htmlPath: ${htmlPath}, 该网页已经渲染过了`)
        msg.msg = "duplicated";
        msg.status = 0;
        return msg
    }


    fs.mkdir(path.join(htmlPath, "../"), { recursive: true }, err => {
        if (err) {
            console.log(err);
        }
        const that = this;
        msg.msg = err
        msg.status = 0;
        return
    })

    process(site, position, css, targetUrl, matchUrl, matchTitle, htmlPath).then((response) => {
        console.log(`====Request done! ====`);
        status = response ? 1 : 0;
    }).catch(err => {
        console.log(err);
        msg = String(err.message);
        status = 0;
    }).finally(() => {
        console.timeEnd('loop');
    });
   
    return msg
    
}
// function timestr(t){
//     return `${t.getFullYear()}/${t.getMonth()}/${t.getDate()} ${t.getHours()}:${t.getMinutes()}:${t.getSeconds()}`;
// }

server.get('/nb', function (request, response) {
    var q = request.query;
    var site = q.site;
    var position = q.position;
    var matchUrl = q.matchUrl;
    var matchTitle = q.matchTitle;
    var css = q.css;
    var targetUrl = q.targetUrl;
    var targetPath = q.targetPath;
    const curTime = new Date();
    const destDir = path.join(conf.dest_dir, `${curTime.getFullYear()}-${curTime.getMonth()+1}`, `${curTime.getDate()}`);
    if ( !((site && position) || targetUrl)) {
        q.msg = "参数缺失!";
        q.status = 0;
        response.send(q)
        return
    }
    var info= loop_body(site, position, css, targetUrl, matchUrl, matchTitle, destDir, targetPath);
    q.status = info.status
    q.msg = info.msg
    q.htmlPath = info.htmlPath
    response.send(q)
})


server.get('/status', function (request, response) {
    var q = request.query;
    htmlPath = q.htmlPath;
    var flag = fs.existsSync(htmlPath, (err) => {
        return !err ? true: false
    })
    q.status = flag
    q.msg = flag ? "ok": "failed"
    q.htmlPath = htmlPath
    response.send(q)
})

//7. 绑定端口
server.listen(5050)
console.log("node server start!")
