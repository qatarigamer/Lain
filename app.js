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
            let ret = data.toString().substr(0, data.indexOf("<script"));
            let matched = ret.toString().match(/\{.+?\}/g);

            matched.forEach(match => {
                let match_parsed = match.toString().split(" ").join("");

                if (match_parsed[1] === "!") {
                    let statement = match_parsed.substr(2, match_parsed.length - 3).split(":")[0];
                    let replace = match_parsed.substr(2, match_parsed.length - 3).split(":")[1];

                    if (options[statement.split("?")[0]] === statement.split("?")[1]) {
                        let key = replace.split("(")[0];
                        let value = replace.split("(")[1].split(")")[0];

                        ret = ret.toString().replace(match, key + "=\"" + value + "\"");
                    } else {
                        ret = ret.toString().replace(match, "");
                    }
                } else if (match_parsed[1] === "$") {
                    if (options[match_parsed.substr(2, match_parsed.length - 3)] != undefined) {
                        ret = ret.toString().replace(match, options[match_parsed.substr(2, match_parsed.length - 3)]);
                    } else {
                        ret = ret.toString().replace(match, "");
                    }
                } else if (match_parsed.substr(1, 2) === "if") {
                    let statement = match_parsed.substr(4, match_parsed.length - 6).split(":")[0];

                    const get_full_statement = (d, m) => {
                        let i = 0;
                        let full_statement = "";

                        while (full_statement.lastIndexOf("{") <= 0 && i < 100) {
                            full_statement = d.substring(d.indexOf(m), d.indexOf(m) + m.length + i);
                            i++;
                        }

                        if (full_statement.lastIndexOf("{") <= 0) {
                            return undefined;
                        } else {
                            let else_statement = d.match(/\{\ +else\ +\}/g)[0];
                            let endif_statement = d.match(/\{\ +endif\ +\}/g)[0];

                            if (else_statement != undefined && endif_statement != undefined) {
                                return d.substring(d.indexOf(full_statement), d.indexOf(endif_statement) + endif_statement.length);
                            } else {
                                return undefined;
                            }
                        }
                    };
                    const get_variants = (fs) => {
                        let else_statement = fs.match(/\{\ +else\ +\}/g)[0];
                        let endif_statement = fs.match(/\{\ +endif\ +\}/g)[0];

                        let true_variant = fs.substring(fs.indexOf("{", fs.indexOf("{", 0) + 1) + 1, fs.indexOf(else_statement) - 2);
                        true_variant = true_variant.split("");

                        while (
                            true_variant[0].charCodeAt(0) === 10 ||
                            true_variant[0].charCodeAt(0) === 32 ||
                            true_variant[0].charCodeAt(0) === 9
                        ) {
                            true_variant.splice(0, 1);
                        }
   
                        true_variant = true_variant.join("");
                        true_variant = true_variant.replace(/\s*$/, "");

                        let false_variant = fs.substring(fs.indexOf(else_statement) + else_statement.length + 2, fs.indexOf(endif_statement) - 2);
                        false_variant = false_variant.split("");

                        while (
                            false_variant[0].charCodeAt(0) === 10 ||
                            false_variant[0].charCodeAt(0) === 32 ||
                            false_variant[0].charCodeAt(0) === 9
                        ) {
                            false_variant.splice(0, 1);
                        }
   
                        false_variant = false_variant.join("");
                        false_variant = false_variant.replace(/\s*$/, "");

                        return [ false_variant, true_variant ];
                    };

                    let full_statement = get_full_statement(ret, match);
                    let variants = get_variants(full_statement);

                    if (options[statement.split("?")[0]] === statement.split("?")[1]) {
                        ret = ret.toString().replace(full_statement, variants[1]);
                    } else {
                        ret = ret.toString().replace(full_statement, variants[0]);
                    }
                }
            });

            return next(null, ret.toString());
        }
    });
});

app.set("views", "./public");
app.set("view engine", "tpl");

app.use("/assets", express.static(path.join(__dirname, "static")));
app.use((req, res) => {
    res.render("base.tpl", {
        title: "Home page",
        selected: req.originalUrl.split("/")[1] || "home",
        logged: req.query.logged || false
    });
});

app.listen(config.kaori.port);