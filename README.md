#node-redis-apn

Apple Push Notification service with Node.js and Redis.


## Requirement

*     安装Redis
*    生成推送证书 cert.pem和key.pem,放置到项目根目录

## Installation

    $ npm install 
    
## Run

    $ NODE_ENV=production node app.js 
    
    $ node app.js   # for development
    
    放置message到redis的apns队列中，通知即刻便会发送出去。消息格式如下：
    {'token':'your token','sound':'default.aiff','alert':'pushtest', 'badge':1,'payload':''}
    
    
## Resources

* [Local and Push Notification Programming Guide: Apple Push Notification Service][pl]

## License

Released under the MIT License

Copyright (c) 2013 Andrew Naylor

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[pl]: https://developer.apple.com/library/ios/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/Chapters/ApplePushService.html#//apple_ref/doc/uid/TP40008194-CH100-SW1 "Local and Push Notification Programming Guide: Apple Push Notification Service"