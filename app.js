const express = require("express");
const http = require("http");
const path = require("path");
const cors = require("cors");
const { routesInit } = require("./routes/configRoutes");
require("./db/mongoConnect");
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
routesInit(app);
app.use((req, res) => {
    res.status(404).send('<h1>404 Page Was Not Found!</h1>');
});
const server = http.createServer(app);
let port = process.env.PORT || 3001;
server.listen(port);
