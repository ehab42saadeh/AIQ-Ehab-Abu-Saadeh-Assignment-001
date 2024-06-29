const { Sequelize } = require('sequelize');
require('dotenv').config()

module.exports = new Sequelize(process.env.DATABASE_URL, {
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idel: 10000
    },
    // Display all log function call parameter
    // logging: (...msg) => console.log(msg),
});
