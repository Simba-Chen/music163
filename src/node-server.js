var fs = require('fs')
var http = require('http')
var url = require('url')
var qiniu = require('qiniu')

var server = http.createServer(function(request, response){
        let parseUrl = url.parse(request.url,true)
        let path = parseUrl.pathname
        if(path === '/uptoken'){
            response.setHeader('Content-Type','text/html; charset=utf-8')
            response.setHeader('Access-Control-Allow-Origin','*')
            let json = fs.readFileSync('./qiniu-key.json')
            json = JSON.parse(json)
            let {accessKey, secretKey} = json
            
            let mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
            let options = {
                scope: 'music163',
                expires: 7200
            };
            var putPolicy = new qiniu.rs.PutPolicy(options);
            var uploadToken= putPolicy.uploadToken(mac);
            response.write(`{
                "uptoken": "${uploadToken}"
            }`)
            response.end()
        }else{
            response.setHeader('Content-Type','text/html; charset=utf-8')
            response.write('地址错误')
            response.end()
        }      
    })
server.listen(8888)
console.log('打开localhost:8888')