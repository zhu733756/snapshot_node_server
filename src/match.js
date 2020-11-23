/*
 * @Author: your name
 * @Date: 2020-11-10 14:02:57
 * @LastEditTime: 2020-11-10 16:23:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \src\match.js
 */
function matchUrl(url) {
    var tag = document.querySelectorAll('a[href="' + url + ']')[0]
    if (tag != undefined) {
        tag.style.border="4px solid red";
    }
}

function matchTitle(css, searchtext) {
    var reg = new RegExp(searchtext,"g");
    var objtext = document.getElementById("pretime").innerHTML;
    var sCurText;
    if (!reg.test(objtext)) {
        //没找到
        return;
    }
    
    var prehtml = document.getElementById("pretime").innerHTML;//获取目标文本容器的HTML字符串
    var newinner = prehtml.replace(reg,'<span class="highlight">'+searchtext+'</span>')//处理HTML字符串，为目标文本加上样式，即替换对应的HTML结构
    document.getElementById("pretime").innerHTML = newinner;//把处理后的HTML字符串写回到容器中

    jq('a:contains('+ title +')').css({"border-width": "4px","border-style": "solid","border-color": "red"})
}