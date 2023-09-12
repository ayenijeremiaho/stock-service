const { NotFoundError } = require('../error/NotFoundError');
const { Stock, getStockById } = require('../model/Stock');
const { ADD_QUEUE, UPDATE_QUEUE } = require('../queue/constants');

//for saving and updating stock
exports.saveOrUpdateStock = async (action, data) => {
    //dictionary to hold all updated stock ame
    let stockNameAndData = {}

    //check if stock is add or update to perform appropriate action
    if (action === ADD_QUEUE) {

        const { body, email } = data;

        for (const stockData of body) {
            stockData.createdBy = email;
            stockData.updatedBy = null

            try {
                console.log("stock data", stockData);
                const stock = await Stock.create(stockData);
                console.log(stock);
                stockNameAndData[stock.name] = { count: stock.count, status: "success", message: "successful" };
            } catch (error) {
                console.log("Error message ___" + error);
                stockNameAndData[stockData.name] = { count: stockData.count, status: "failed", message: error.message };
            }
        }

        console.log(stockNameAndData);
        return stockNameAndData;

    } else if (action === UPDATE_QUEUE) {
        try {
            //check if stock id is valid
            let stock = await getStockById(id);

            //check if stock name did not change, if it did, check if not already existing
            const newStockName = data.name;
            if (stock.name != newStockName) {
                const exist = await Stock.count({ where: { name: newStockName } });
                if (exist > 0) {
                    throw Error(`Stock already exist with the same name as ${newStockName}`)
                }
            }

            //increment/decrement stock count, but make sure it is not less than 0
            const newCount = stock.count + data.count;
            if (newCount < 0) {
                throw Error(`${newStockName} stock cannot be less than 0`);
            }

            stock.name = newStockName;
            stock.amount = data.amount;
            stock.count = newCount;
            stock.updatedBy = data.email;


            stock = await stock.save();
            stockNameAndData[stock.name] = { count: stock.count, status: "success", message: "successful" };
        } catch (error) {
            stockNameAndData[stock.name] = { count: stock.count, status: "failed", message: error.message };
        }

        return stockNameAndData;

    } else {
        throw Error("Invalid queue action");
    }
}

exports.testMe = async (id) => {
    try {
        const stock = await getStockById(id);
        console.log(stock);
    } catch (error) {
        console.log(error);
        if (error instanceof NotFoundError) {
            console.log(error.message);
        }
    }

}