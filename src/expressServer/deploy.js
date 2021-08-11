const path = require("path");
const express = require("express");
const app = express(); // create express app

// add middlewares
app.use(express.static(path.join(__dirname, "..", "..", "/dist/app")));

app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, "..", ".." , "dist", "app", "index.html"));
});

// start express server on port 5000
app.listen(8080, () => {
    console.log(path.join(__dirname, "..", "..",  ));
    console.log("server started on port 8080");
});
