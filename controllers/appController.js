const db = require("../db/queries");

async function homeGet(req, res) {
  res.render("index");
}

async function viewAllTrainers(req, res) {
  const allTrainers = await db.getAllTrainers();
  res.render("trainers", { trainers: allTrainers });
}

async function viewTrainer(req, res) {
  const trainerId = req.params.id;
  const trainer = await db.getTrainer(trainerId);
  const trainerPokemon = await db.getOwnedPokemon(trainerId);
  res.render("trainer", { trainer: trainer, ownedPokemon: trainerPokemon });
}

async function newTrainer(req, res) {
  console.log(req.body);
}

async function viewAllPokemon(req, res) {
  const pokemonList = await db.getAllPokemon();
  res.render("allPokemon", { title: "Pokemon List", pokemonList: pokemonList });
}

async function viewPokemonOwners(req, res) {
  const pokemonId = req.params.id;
  const pokemon = await db.getPokemon(pokemonId);
  let allOwners = await db.getAllOwners(pokemonId);
  res.render("pokemon", {
    title: pokemon.name,
    pokemon: pokemon,
    owners: allOwners,
  });
}

async function deletePokemon(req, res) {
  const trainerId = req.params.trainerid;
  const pokemonId = req.params.pokemonid;
  console.log(trainerId, pokemonId);
  await db.deletePokemon(trainerId, pokemonId);
  res.redirect("/");
}

module.exports = {
  homeGet,
  viewAllTrainers,
  viewTrainer,
  newTrainer,
  viewAllPokemon,
  viewPokemonOwners,
  deletePokemon,
};
