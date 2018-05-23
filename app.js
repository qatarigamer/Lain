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
            let matched = data.toString().match(/\{.+?\}/g);

            matched.forEach(match => {
                if (match[1] === "!") {
                    let statement = match.substr(2, match.length - 3).split(":")[0];
                    let replace = match.substr(2, match.length - 3).split(":")[1];

                    if (options[statement.split("?")[0]] === statement.split("?")[1]) {
                        let key = replace.split("(")[0];
                        let value = replace.split("(")[1].split(")")[0];

                        data.replace(match, key + "=\"" + value + "\"");
                    }
                } else if (match[1] === "$") {
                    if (options[match.substr(2, match.length - 3)] != undefined) {
                        data.replace(match, options[match.substr(2, match.length - 3)]);
                    }
                }
            });

            return next(null, data.toString());
        }
    });
});

app.set("views", "./public");
app.set("view engine", "tpl");

app.use("/", express.static(path.join(__dirname, "static")));
app.get("/", (req, res) => {
    res.render("base.tpl", {
        title: "Home page",
        selected: req.query.page || "home"
    });
});

app.listen(config.kaori.port);