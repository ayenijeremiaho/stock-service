const { ADD_QUEUE, UPDATE_QUEUE } = require('../queue/constants');
const { addToQueue } = require('../queue/queue-service');
const { getResponseObject, validateStockData } = require('./util-service')
const { Stock, getStockById } = require('../model/Stock');
const { NotFoundError } = require('../error/NotFoundError');

async function createStock(req, res) {
    //destructre details in request
    const { body, headers } = req;

    const email = headers.email;
    if (!email) {
        res.status(401).send(getResponseObject(401, "Email is required on the header"))
    }

    //validate body is valid
    if (!body || !Array.isArray(body)) {
        res.status(400).send(getResponseObject(400, "Malformed request"))
    }

    //validate each stock data
    for (let index = 0; index < body.length; index++) {
        const stockData = body[index];
        try {
            validateStockData(stockData);
        } catch (error) {
            res.status(400).send(getResponseObject(400, `${error.message} on line ${index + 1}`));
            return;
        }
    }

    try {
        //add the data to the queue to be processed later
        const toSave = { body, email }
        await addToQueue(ADD_QUEUE, toSave);
    } catch (error) {
        res.status(500).send(getResponseObject(500, "An error occurred while preparing to add stock"));
        return;
    }

    res.status(200).send(getResponseObject("01", "Request received, you will be notified by email shortly the status"));
}

async function updateStock(req, res) {
    //destructre details in request
    const { body, headers, params } = req;

    const id = params.id;
    const email = headers.email;

    if (!email) {
        res.status(401).send(getResponseObject(401, "Email is required on the header"));
        return;
    }

    if (!id) {
        res.status(400).send(getResponseObject(400, "Id of stock is required"));
        return;
    }

    //validate body is valid
    if (!body) {
        res.status(400).send(getResponseObject(400, "Malformed request"));
        return;
    }

    //validate each stock data
    try {
        validateStockData(body);
    } catch (error) {
        res.status(400).send(getResponseObject(400, `${error.message}`));
        return;
    }

    try {
        //add the data to the queue to be processed later
        body.id = id;
        body.email = email;
        await addToQueue(UPDATE_QUEUE, body);
        res.status(200).send(getResponseObject("01", "Request received, you will be notified by email shortly the status"));
    } catch (error) {
        res.status(500).send(getResponseObject(500, "An error occurred while preparing to update stock"));
        return;
    }

}

async function deleteStock(req, res) {
    //destructre details in request
    const { headers, params } = req;

    const id = params.id;
    const email = headers.email;

    if (!email) {
        res.status(401).send(getResponseObject(401, "Email is required on the header"));
        return;
    }

    console.log(`Delete request for ${id} by ${email}`);

    if (!id) {
        res.status(400).send(getResponseObject(400, "Id of stock is required"));
        return;
    }

    try {
        //get the stock then delete if exist
        let stock = await getStockById(id);
        let name = stock.name;
        await stock.destroy();

        res.status(200).send(getResponseObject("01", `${name} stock removed successfully`));
        return;
    } catch (error) {
        if (error instanceof NotFoundError) {
            res.status(404).send(getResponseObject(404, error.message));
        } else {
            res.status(500).send(getResponseObject(500, "An error occurred while deleting stock"));
        }
    }

}

async function viewStocks(req, res) {
    //destructre details in request
    const { headers, query } = req;

    const size = query.size ? query.size : 10;
    const page = query.page ? query.page : 1;
    const email = headers.email;

    if (!email) {
        res.status(401).send(getResponseObject(401, "Email is required on the header"));
        return;
    }

    try {
        //get the stock paginated
        const { rows } = await Stock.findAndCountAll({
            offset: page,
            limit: size
        });

        res.status(200).send(getResponseObject("00", "Successfully retrieved data", rows));
        return;
    } catch (error) {
        res.status(500).send(getResponseObject(500, error.message));
        return;
    }

}

exports.createStock = createStock;
exports.updateStock = updateStock;
exports.deleteStock = deleteStock;
exports.viewStocks = viewStocks;
exports.getStockById = getStockById;

