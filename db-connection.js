const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('sqlite::memory:');

async function validateDBConnection() {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ force: true });
        console.log('Database connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

exports.sequelizeConnection = sequelize
exports.validateDBConnection = validateDBConnection