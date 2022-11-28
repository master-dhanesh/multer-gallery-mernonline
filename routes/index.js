var express = require("express");
var router = express.Router();

const fs = require("fs");
const path = require("path");

const upload = require("./multer");

let LOCAL_DB = [
    {
        id: "online-1669648747453",
        title: "Title 01",
        author: "Author 01",
        image: "online-1669650379137.png",
    },
];

router.get("/", function (req, res, next) {
    res.render("show", { cards: LOCAL_DB });
});

router.get("/add", function (req, res, next) {
    res.render("add");
});

router.post("/add", function (req, res, next) {
    upload(req, res, (err) => {
        if (err) return res.send(err);
        const formdata = {
            id: req.file.filename.split(".")[0],
            title: req.body.title,
            author: req.body.author,
            image: req.file.filename,
        };
        LOCAL_DB.push(formdata);
        res.redirect("/");
    });
});

router.get("/delete/:id", function (req, res, next) {
    const id = req.params.id;
    const cardIndex = LOCAL_DB.findIndex((card) => card.id === id);
    const card = LOCAL_DB.find((card) => card.id === id);
    LOCAL_DB.splice(cardIndex, 1);
    fs.unlinkSync(path.join(__dirname, "..", "public", "uploads", card.image));
    res.redirect("/");
});

router.get("/update/:id", function (req, res, next) {
    const id = req.params.id;
    const card = LOCAL_DB.find((card) => card.id === id);
    res.render("update", { card });
});

router.post("/update/:id", function (req, res, next) {
    upload(req, res, (err) => {
        if (err) return res.send(err);
        const updatedCard = {
            title: req.body.title,
            author: req.body.author,
        };
        if (req.file) {
            fs.unlinkSync(
                path.join(
                    __dirname,
                    "..",
                    "public",
                    "uploads",
                    req.body.oldimage
                )
            );
            updatedCard.image = req.file.filename;
        }
        const id = req.params.id;
        const cardIndex = LOCAL_DB.findIndex((card) => card.id === id);
        LOCAL_DB[cardIndex] = { ...LOCAL_DB[cardIndex], ...updatedCard };

        res.redirect("/");
    });
});

module.exports = router;
