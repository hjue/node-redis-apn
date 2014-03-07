var redis = require('redis');
var push = require('./push_apn').push;

var client  = redis.createClient();

client.on('error', function(err) {
        console.log('Err:' + err);
});

function pushWorker() {
  client.blpop("apns", 0,function (err, res) {
    try{
      var messgage = JSON.parse(res[1]);
      if(messgage)
      {
        push(messgage)
        setTimeout(pushWorker, 0);        
        console.log('push message');
      }
    }catch(err)
    {
      console.log(err);
    }
  });
}

pushWorker();
