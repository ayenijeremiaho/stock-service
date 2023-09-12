const { Queue, Worker } = require('bullmq');
const { QUEUE_NAME, REDIS_CONNECTION } = require('./constants');
const { saveOrUpdateStock } = require('../service/processor-service');
const { prepareMailToSendIfNeeded } = require('../service/util-service');

const stockQueue = new Queue(QUEUE_NAME, REDIS_CONNECTION);

//add data to queue
async function addToQueue(action, stockData) {
    const val = await stockQueue.add(action, stockData, { delay: 5000 });
    console.log("added to queue", val.id);
}

//handles all jobb created
async function workerHandler(job) {
    console.log(job.data);
    console.log(job.name);

    const result = await saveOrUpdateStock(job.name, job.data);
    job.result = result;
}

//worker service implementation, it processes event in queue
const stockWorker = new Worker(QUEUE_NAME, workerHandler, REDIS_CONNECTION);

//notifies when event completed
stockWorker.on('completed', job => {
    console.log(`${job.id} has completed!`);
    console.log(job.result)

    prepareMailToSendIfNeeded(job, "completed");
});

//notifies when event failed
stockWorker.on('failed', (job, err) => {
    console.log(`${job.id} has failed with ${err.message}`);

    prepareMailToSendIfNeeded(job, "failed");
});


exports.addToQueue = addToQueue;
