const { Router } = require("express");
const appController = require("../controllers/appController");
const appRouter = Router();

appRouter.get("/", appController.homeGet);
appRouter.get("/pokemon", appController.viewAllPokemon);
appRouter.get("/pokemon/:id", appController.viewPokemonOwners);
appRouter.get("/trainers", appController.viewAllTrainers);
appRouter.get("/trainers/:id", appController.viewTrainer);

appRouter.post("/trainers/:trainerid/:pokemonid", appController.deletePokemon);

module.exports = appRouter;
