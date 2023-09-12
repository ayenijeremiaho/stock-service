const { stockRouter } = require("./routes/shop-route");

//define specific url to a specific router implementation
exports.allRoutes = (app) => {
    app.use("/api/stocks", stockRouter)
}