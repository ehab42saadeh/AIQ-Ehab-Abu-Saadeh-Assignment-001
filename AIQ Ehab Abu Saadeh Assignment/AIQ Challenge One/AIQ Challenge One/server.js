const express = require('express');
const cors = require('cors');
const sequelize = require('./database');
const compression = require('compression');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const app = express();

// Database
sequelize.authenticate().then(() => {
    console.log('Connected to the database');  
}).catch(err => {
    console.log('Unable to connect to databases:', err);
})

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use(cors());
app.use(compression());  // reduce file size before sending to web browser to ereduce latency

// Routes
const plantsRoutes = require('./routes/plantsRoutes');
app.use(plantsRoutes);

// Set up swagger ui
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "AIQ-rest API Swagger Documentation",
      version: "0.1.0",
      description: "The swagger doc for example api endpoints in this AIQ-rest ",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Charlie",
        url: "https://github.com/yfchiuaa",
      },
    },
  },
  apis: ['./models/plnt21Models.js','./models/Ba21Models.js', './routes/plantsRoutes.js'],
};
const specs = swaggerJsDoc(options);
const swaggerRouter = express.Router();
swaggerRouter.use('/api-docs', swaggerUi.serve);
swaggerRouter.get('/api-docs', swaggerUi.setup(specs));
app.use(swaggerRouter);

// Handle Errors
app.use((err, req, res, next) => {
    console.error(err.stack);
})
app.use((req, res, next) => {
    res.status(404).send('The page cannot be found!');
})

// Export app for testing
module.exports = app;

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('###############################');
    console.log(`The server starts at ${PORT}`);
    console.log('###############################');
});
