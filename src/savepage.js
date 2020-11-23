const fs = require('fs');
const path = require('path');
const events = require('events');
const puppeteer = require('puppeteer-core');
const fetch = require('node-fetch');
const AbortController = require('abort-controller');
const conf = require('./config.js');


String.prototype.endWith=function(endStr){
    var d=this.length-endStr.length;
    return (d>=0&&this.lastIndexOf(endStr)==d)
}

events.EventEmitter.defaultMaxListeners = 50;

//const user_agent_string = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36';
const user_agent_string = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36 Edg/85.0.564.70';
const waitTimeout = ms => new Promise(resolve => setTimeout(resolve, ms));

//read pageloader 
const pageLoaderCompressed = fs.readFileSync('pageloader-compressed.js', 'utf8');

async function collect_resource(res_list){
    console.log(`collecting resources, ${res_list.length} total.`);
    const responses = {};
    let completed_requests = 0;
    let good_requests = 0;
    let bad_requests = 0;
    for (let [i, res] of res_list.entries()) {
        let content_type = '';
        const aborter = new AbortController();
        //const timeout = setTimeout(() => { aborter.abort(); }, 5000);
        fetch(res.url, {
            headers: {'User-Agent': user_agent_string, 'Referer': res.referer, 'Cookie':'' },
            signal: aborter.signal,
        }).then(resp=> {
            if (resp.ok) {
                content_type = resp.headers['content-type'];
                return resp.arrayBuffer();                    
            } else {
                throw(new Error(`http error ${resp.status}`));
            }
        }).then(buffer=>{
            const byteArray = new Uint8Array(buffer);
            const binaryString = byteArray.reduce((str, val)=>{return str + String.fromCharCode(val)}, '');
            // let binaryString = '';
            // for (let j = 0; j < byteArray.byteLength; j++) binaryString += String.fromCharCode(byteArray[j]);
            responses[i] = {
                "success": true,
                "content": binaryString,
                "mime": content_type,
            };
            good_requests++;
        }).catch(err=>{
            console.log(`[fail: ${err.message}]${res.url}`);
            responses[i] = {
                "success": false
            };
            bad_requests++;
        }).finally(()=>{
            //clearTimeout(timeout);
            completed_requests++;
        });

        //正在进行的请求数大于20，等待
        while (i - completed_requests > 20) {
            await waitTimeout(100);
        }
    }

    //等待直到所有请求完成
    while(completed_requests < res_list.length) {
        console.log(`finished: ${completed_requests} / ${res_list.length}, waiting...`);
        await waitTimeout(500);
    }

    console.log(`collect resources finish, succeed:[${good_requests}], failed:[${bad_requests}]`)
    return responses;
}


module.exports = {
    launchBrowser: async function(){
        return puppeteer.launch({
            executablePath:conf.chrome_path, 
            headless: true, 
            args: ['--no-sandbox', '--disable-web-security'] //disable web security to allow CORS requests
        });
    },
    closeBrowser: async function(browser){
        return browser.close();
    },
    scrape: async function (browser, site, css, targetUrl, matchUrl, matchTitle, htmlPath) {
        let page;

        // const t = new Date();
        // const timestr = `${t.getFullYear()}${t.getMonth()}${t.getDate()}${t.getHours()}${t.getMinutes()}${t.getSeconds()}`;
        const url = targetUrl ? targetUrl : site.url;

        try {
            page = await browser.newPage();
            await page.setUserAgent(user_agent_string);
            await page.setViewport({width: 1200, height: 800});

            console.log('loading site...');
            console.time('loading');
            
            await page.goto(url, { timeout: 300000 });
            console.timeEnd('loading');
            await page.addScriptTag({ path: "nodeSavePageWE_client.js" });

            if (site.manual_scroll) {
                console.log('simulate scroll');
                await page.evaluate(()=>{
                    window.scrollTo(0, document.body.scrollHeight);
                });
            }
            console.log('wait 1 sec');
            await waitTimeout(1000);

            if (site.img_tag) {
                console.log('replace lazyload image');
                const imgscount = await page.$$eval('img', (imglist, lazy_tag)=>{
                    let replaced = 0;
                    for (const img of imglist) {
                        if (img.dataset[lazy_tag]) {
                            img.src = img.dataset[lazy_tag];
                            replaced++ ;
                        } else {
                            console.log(img.dataset);
                        }
                    }
                    return replaced;
                }, site.img_tag);
                console.log(`replaced ${imgscount} images`);
            }

            console.log('wait 3 sec');
            await waitTimeout(3000);

            // 处理border
            css = css? css : site.css
            if (css) { 
                await page.waitForSelector(css);
            }
            
            var flag = true;
          
            if (matchUrl) {
                const eleString = css ? css + ' a[href="' + matchUrl + '"]' : 'a[href="' + matchUrl + '"]';
                const element = await page.$(eleString);
                if (!element) {
                    console.log(`url:${url} , matchUrl:${matchUrl}, 没有框到任何tags`)
                    return false
                }
                await page.evaluate(el => el.style.border = "4px solid red", element);

            } else if (matchTitle) {
                const eleString = css ? css + ' a:contains("' + matchTitle + '")' : 'a:contains("' + matchTitle + '")';
                await page.mainFrame().addScriptTag({ url: 'https://cdn.bootcss.com/jquery/3.2.0/jquery.min.js' });
                await page.waitForTimeout(2000);
                flag = await page.evaluate(e => {
                    if ($(e).length == 0) {
                        return false
                    }
                    $(e).css({ "border-width": "4px", "border-style": "solid", "border-color": "red" });
                    return  true
                }, eleString);
                if (!flag) {
                    console.log(`url:${url} , matchTitle:${matchTitle}, 没有框到任何tags`)
                    return false
                }
            }

            // console.log('getting resources in page...');
            // console.time('get resources');
            // //load website and gather all the resources
            // const resource_list = await page.evaluate(async (params) => {
            //     pageLoaderText = params.pageLoaderCompressed;
            //     return await identifyCrossFrames();
            // }, { "pageLoaderCompressed": pageLoaderCompressed });
            // console.timeEnd('get resources');

            // console.log('downloading resources...');
            // console.time('download resources');
            // //now collect all the resources
            // const responses = await collect_resource(resource_list);
            // console.timeEnd('download resources');

            // console.log('inserting resources to page...');
            // console.time('insert resources');
            // //now inject resources back into page
            // const savedHTML = await page.evaluate(async (params) => { 
            //     await loadPageLoader(params.scrapedResources);
            //     return htmlOutput;
            // }, { "scrapedResources": responses });
            // console.timeEnd('insert resources');
            console.log('extracting html page');
            console.time('extractHTML');
            const savedHTML = await page.evaluate(async (params)=>{
                pageLoaderText = params.pageLoaderCompressed;
                return await extractHTML2();
            }, { "pageLoaderCompressed": pageLoaderCompressed });
            console.timeEnd('extractHTML');

            console.log('saving...');
            await fs.promises.writeFile(htmlPath, savedHTML);
            await page.close();
            return htmlPath
        } catch (error) {
            console.log(error);
            await page.close();
            console.log('failed to scrap site: ' + url);
            return false
        }
    }
};

