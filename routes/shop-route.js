const express = require('express');
const { createStock, updateStock, deleteStock, viewStocks } = require('../service/shop-service')

const stockRouter = express.Router();

stockRouter.post("/", createStock);
stockRouter.put("/:id", updateStock);
stockRouter.delete("/", deleteStock);
stockRouter.get("/", viewStocks);

exports.stockRouter = stockRouter;