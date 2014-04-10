redis = require('redis')
apn = require('apn')

class PushWorker

  constructor: (options) ->
    @redisClient = redis.createClient(options.redis.port, options.redis.host)
    @listKey = options.redis.listKey
    @apnConnection = new apn.Connection(options.apn)
    @apnConnection.on 'connected', ->
      console.log("Connected")
    @apnConnection.on 'transmitted', (notification, device) ->
      # TODO : 从payload中获取messageid，记录发送成功日志
      console.log("Notification transmitted to:" + device.token.toString('hex'))
    @apnConnection.on 'transmissionError', (errCode, notification, device) ->
      console.error("Notification caused error: " + errCode + " for device ", device, notification)
    @apnConnection.on 'timeout', ->
      console.log("Connection Timeout")
    @apnConnection.on 'disconnected', ->
      console.log("Disconnected from APNS")
    @apnConnection.on 'socketError', console.error

  work: ->
    self = @
    @redisClient.blpop @listKey, 0, (err, res) ->
      try
        message = JSON.parse(res[1]);
        if message
          self.push(message)
        self.work()
      catch err
        console.error(err);
        self.work()

  push: (message) ->
    console.log('message', message)
    if !message.token
      console.log('token missing')
      return
    message.token = message.token.replace(/\s/g, '')
    if message.token.length isnt 64
      console.log('bad token', message.token)
      return

    device = new apn.Device(message.token);

    note = new apn.Notification();
    if message.expiry and message.expiry > 0
      note.expiry = message.expiry
    else
      note.expiry = Math.floor(Date.now() / 1000) + 3600
    if message.payload and (typeof message.payload == 'object')
      note.payload = message.payload

    if message.alert
      note.setAlertText(message.alert);
    if message.badge and message.badge > 0
      note.badge = message.badge
    if message.sound and message.sound.length > 0
      note.sound = message.sound;

    @apnConnection.pushNotification(note, device);

exports.PushWorker = PushWorker
