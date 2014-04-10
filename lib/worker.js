(function() {
  var PushWorker, apn, redis;

  redis = require('redis');

  apn = require('apn');

  PushWorker = (function() {
    function PushWorker(options) {
      this.redisClient = redis.createClient(options.redis.port, options.redis.host);
      this.listKey = options.redis.listKey;
      this.apnConnection = new apn.Connection(options.apn);
      this.apnConnection.on('connected', function() {
        return console.log("Connected");
      });
      this.apnConnection.on('transmitted', function(notification, device) {
        return console.log("Notification transmitted to:" + device.token.toString('hex'));
      });
      this.apnConnection.on('transmissionError', function(errCode, notification, device) {
        return console.error("Notification caused error: " + errCode + " for device ", device, notification);
      });
      this.apnConnection.on('timeout', function() {
        return console.log("Connection Timeout");
      });
      this.apnConnection.on('disconnected', function() {
        return console.log("Disconnected from APNS");
      });
      this.apnConnection.on('socketError', console.error);
    }

    PushWorker.prototype.work = function() {
      var self;
      self = this;
      return this.redisClient.blpop(this.listKey, 0, function(err, res) {
        var message;
        try {
          message = JSON.parse(res[1]);
          if (message) {
            self.push(message);
          }
          return self.work();
        } catch (_error) {
          err = _error;
          console.error(err);
          return self.work();
        }
      });
    };

    PushWorker.prototype.push = function(message) {
      var device, note;
      console.log('message', message);
      if (!message.token) {
        console.log('token missing');
        return;
      }
      message.token = message.token.replace(/\s/g, '');
      if (message.token.length !== 64) {
        console.log('bad token', message.token);
        return;
      }
      device = new apn.Device(message.token);
      note = new apn.Notification();
      if (message.expiry && message.expiry > 0) {
        note.expiry = message.expiry;
      } else {
        note.expiry = Math.floor(Date.now() / 1000) + 3600;
      }
      if (message.payload && (typeof message.payload === 'object')) {
        note.payload = message.payload;
      }
      if (message.alert) {
        note.setAlertText(message.alert);
      }
      if (message.badge && message.badge > 0) {
        note.badge = message.badge;
      }
      if (message.sound && message.sound.length > 0) {
        note.sound = message.sound;
      }
      return this.apnConnection.pushNotification(note, device);
    };

    return PushWorker;

  })();

  exports.PushWorker = PushWorker;

}).call(this);
