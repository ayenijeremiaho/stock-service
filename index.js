const express = require('express');
const { allRoutes } = require('./routes');
const app = express();
const { validateDBConnection } = require('./db-connection')


// setup express app here
app.use(express.json());

//setup routes
allRoutes(app);

const hostname = 'localhost';
const port = process.env.PORT || 3000;

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

//to validate db conenction on startup
validateDBConnection()
