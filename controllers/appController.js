const db = require("../db/queries");

async function homeGet(req, res) {
    res.render("index");
};

async function viewAllTrainers(req, res) {
    res.render("trainers");
}

async function viewTrainer(req, res) {
    res.render("trainer");
}

async function newTrainer(req, res) {
    console.log(req.body)
}

module.exports = {
    homeGet,
    viewAllTrainers,
    viewTrainer,
    newTrainer,
}