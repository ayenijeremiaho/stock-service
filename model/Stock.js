const { DataTypes } = require('sequelize');
const { sequelizeConnection } = require('../db-connection');
const { NotFoundError } = require('../error/NotFoundError');

const Stock = sequelizeConnection.define('Stock', {
    name: DataTypes.STRING,
    amount: DataTypes.DECIMAL,
    count: DataTypes.INTEGER,
    createdBy: DataTypes.STRING,
    updatedBy: DataTypes.STRING
});

async function getStockById(id) {
    try {
        const stock = await Stock.findByPk(id);
        return stock;
    } catch (error) {
        throw new NotFoundError(`Stock with id ${id} does not exist`);
    }
}

exports.Stock = Stock;
exports.getStockById = getStockById;