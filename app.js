const express = require("express");
const config = require("./config");
const app = express();

const fs = require("fs");
const path = require("path");

app.engine("tpl", (path, options, next) => {
    fs.readFile(path, (error, data) => {
        if (error) {
            return next(null, error);
        } else {
            data = data.toString().substr(0, data.indexOf("<script"));

            let regex = new RegExp(/\{.+?\}/g);
            let match = regex.test(data.toString());

            console.log(match);
        }
    });
});

app.set("views", "./public");
app.set("view engine", "tpl");

app.use("/", express.static(path.join(__dirname, "static")));
app.get("/", (req, res) => {
    res.render("base.tpl", {
        title: "Home page"
    })
});

app.listen(config.kaori.port);