const { ADD_QUEUE, UPDATE_QUEUE } = require("../queue/constants");
const { sendEmail } = require("./mail-service");

function getResponseObject(status, message, data = null) {
    return { status, message, data }
}

function prepareMailToSendIfNeeded(job, status) {
    if (job.name = ADD_QUEUE) {
        //{ Test: { count: 15, status: 'success', message: 'successful' } }
        let subject = `Stock create ${status}, see details in message`;
        let message = "";

        //populate a table showing the status of each item
        for (const [key, value] of Object.entries(job.data)) {
            console.log(key, value);
            message += `Name: ${key} | Status: ${value.status} | New Stock count : ${value.count} | Message : ${value.message} \n`;
        }

        sendEmail(job.data.email, subject, message);
    } else if (job.name = UPDATE_QUEUE) {
        let subject = `Stock update  ${status}, see details in message`;
        let message = `Name: ${key} | Status: ${value.status} | New Stock count : ${value.count} | Message : ${value.message}`;

        sendEmail(job.data.email, subject, message);
    }
}

function validateStockData(stockData) {
    isValidString("Name", stockData.name);
    isValidNumber("Amount", stockData.amount);
    isValidNumber("Count", stockData.count);
}

function isValidString(key, value) {
    if (!value) {
        throw new Error(`${key} cannot be empty`);
    }
}

function isValidNumber(key, value) {
    if (!value) {
        throw new Error(`${key} cannot be empty`);
    }

    if (value < 1) {
        throw new Error(`${key} cannot be less than 1`);
    }
}

exports.getResponseObject = getResponseObject;
exports.validateStockData = validateStockData;
exports.prepareMailToSendIfNeeded = prepareMailToSendIfNeeded;