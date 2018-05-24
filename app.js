const express = require("express");
const express_php = require("express-php");
const express_haml = require("hamljs").renderFile;

const config = require("./config");
const app = express();

const fs = require("fs");
const path = require("path");

app.get("*.html", (req, res) => res.redirect("/404"));
app.get("*.php", (req, res) => res.redirect("/404"));

app.get("/", (req, res) => res.redirect("/home"));

app.use("/assets", express.static(path.join(__dirname, "static")));

app.use(express_php.cgi(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public")));

app.get("*", (req, res) => res.redirect("/404"));
app.listen(config.kaori.port);