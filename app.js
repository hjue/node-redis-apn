var redis = require('redis');
var push = require('./push_apn').push;

process.on('uncaughtException', function (err) {
   console.error('uncaughtException:' + err.stack);
});

var client  = redis.createClient();

client.on('error', function(err) {
        console.log('Err:' + err);
});

function pushWorker() {
  client.blpop("apns", 0,function (err, res) {
    try{
      var message = JSON.parse(res[1]);
      if(message)
      {
        push(message)
        setTimeout(pushWorker, 0);
      }
    }catch(err)
    {
      console.log(err);
      setTimeout(pushWorker, 0);      
    }
  });
}

pushWorker();
