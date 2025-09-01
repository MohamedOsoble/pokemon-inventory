const { Router } = require("express");
const appController = require("../controllers/appController");
const appRouter = Router();

appRouter.get("/", appController.homeGet);
appRouter.get("/trainers", appController.viewAllTrainers);
appRouter.get("/trainer/:id", appController.viewTrainer);