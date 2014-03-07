var apn = require('apn');

var pushserver = process.env.NODE_ENV == 'production'?'gateway.push.apple.com':'gateway.sandbox.push.apple.com';

var apnconn = new apn.connection({ gateway:pushserver });
exports.apnconn = apnconn;

apnconn.on('connected', function() {
    console.log("Connected");
});

apnconn.on('transmitted', function(notification, device) {
    console.log("Notification transmitted to:" + device.token.toString('hex'));
});

apnconn.on('transmissionError', function(errCode, notification, device) {
    console.error("Notification caused error: " + errCode + " for device ", device, notification);
});

apnconn.on('timeout', function () {
    console.log("Connection Timeout");
});

apnconn.on('disconnected', function() {
    console.log("Disconnected from APNS");
});

apnconn.on('socketError', console.error);


function push(message) {
    var note = new apn.Notification();
    var device = new apn.Device(message.token);
    note.setAlertText(message.alert);
    if (message.alert.length==0 || message.token==0)
    {
      return ;
    }
    
    if(message.badge!=null && message.badge>0){
      note.badge = message.badge;
    }
    
    if(message.expiry!=null && message.expiry>0){
      note.expiry = message.expiry;
    }else{
      note.expiry = Math.floor(Date.now() / 1000) + 86400;
    }
        
    if(message.payload!=null && message.payload.length>0){
      note.payload = message.payload;
    }
    
    if(message.sound!=null  && message.sound.length>0){
        note.sound = message.sound;
    }
    
    apnconn.pushNotification(note, device);
}
exports.push = push;

if (!module.parent) {
  push({'token':'your token','sound':'default.aiff','alert':'pushtest', 'badge':1});
}
