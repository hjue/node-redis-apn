var PushWorker = require('./lib/worker').PushWorker;
var config = require('./config');
config = config.development;

worker = new PushWorker(config.worker);
worker.work();
