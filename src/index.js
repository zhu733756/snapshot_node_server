/*
 * @Author: your name
 * @Date: 2020-11-10 13:57:37
 * @LastEditTime: 2020-11-11 11:15:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \src\index.js
 */
const path = require('path');
const savePage = require('./savepage.js');
const conf = require('./config.js');

async function process(){
    let browser = await savePage.launchBrowser();
    const curTime = new Date();
    const dest_dir = path.join(conf.dest_dir, `${curTime.getFullYear()}-${curTime.getMonth()+1}`, `${curTime.getDate()}`);
    for (const site of conf.site_list) {
        console.log(`<<<${site.url}>>> start`);
        html = await savePage.scrape(browser, site, dest_dir);
        console.log(`<<<${site.url}>>> finish`);
    }
    await savePage.closeBrowser(browser);
}

function loop_body(){
    const cur = new Date();
    console.log(`====Begin ${timestr(cur)}====`)
    console.time('loop');
    process().then(()=>{
        const next_time = new Date(cur.getTime() + time_interval);
        console.log(`====All done! next begin at ${timestr(next_time)}====`);
    }).catch(err=>{
        console.log(err);
    }).finally(()=>{
        console.timeEnd('loop');
    });
}

function timestr(t){
    return `${t.getFullYear()}/${t.getMonth()}/${t.getDate()} ${t.getHours()}:${t.getMinutes()}:${t.getSeconds()}`;
}

//先执行一次，然后循环间隔一段时间一次
loop_body();
const time_interval = conf.freqency * 60 * 60 * 1000;
setInterval(loop_body, time_interval);
