# snapshot_node_server
---
a node server for muti-snapshot crawler
---
1. 安装node.js环境，node版本12
    curl -sL https://rpm.nodesource.com/setup_12.x | sudo bash -
    sudo yum install nodejs
    node -v 查看输出，如果出现v12.*.*说明安装成功
2. 安装chrome浏览器
    curl https://intoli.com/install-google-chrome.sh | sudo bash -
    安装后的chrome理论上应该在 /usr/bin/google-chrome-stable 路径，检查确认一下，这个要在后面写到配置文件里
3. 安装pm2进程管理器
    npm install pm2 -g
4. 解压项目代码目录，然后
    cd src
    配置config.js，将"chrome_path"设置为第2步里的路径，配置"dest_dir"为放置静态html文件的跟目录
    然后
    npm install
    启动
    pm2 start app.js
    完毕
5. 查看进程状态: pm2 list
    结束进程用: pm2 delete 0
    重启进程用: pm2 restart 0
    查看日志用: pm2 logs 0
