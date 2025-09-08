const db = require("../db/queries");
const { all } = require("../routes/routes");

async function homeGet(req, res) {
  res.render("index");
}

async function viewAllTrainers(req, res) {
  const allTrainers = await db.getAllTrainers();
  res.render("trainers/trainers", { trainers: allTrainers });
}

async function viewTrainer(req, res) {
  console.log(res.locals);
  const trainerId = req.params.id || res.locals.trainerid;
  const trainer = await db.getTrainer(trainerId);
  const trainerPokemon = await db.getOwnedPokemon(trainerId);
  const allPokemon = await db.getAllPokemon();
  res.render("trainers/trainer", {
    trainer: trainer,
    ownedPokemon: trainerPokemon,
    allPokemon: allPokemon,
  });
}

async function getNewTrainer(req, res) {
  const pokemonList = await db.getAllPokemon();
  res.render("trainers/newtrainer", { allPokemon: pokemonList });
}

async function postNewTrainer(req, res) {
  try {
    const trainerName = req.body.name;
    const pokemonId = req.body.starter;
    const trainerId = await db.addTrainer(trainerName);
    console.log(trainerId);
    await db.addPokemon(trainerId.id, pokemonId);
    res.redirect("/trainers");
  } catch (error) {
    console.error(error);
    if (error.code === "23505") {
      const pokemonList = await db.getAllPokemon();
      res.render("trainers/newtrainer", {
        allPokemon: pokemonList,
        errors: [
          {
            msg: "Username already exists",
          },
        ],
      });
    } else {
      const pokemonList = await db.getAllPokemon();
      res.render("trainers/newtrainer", {
        allPokemon: pokemonList,
        errors: [
          {
            msg: "Error occured, please try again",
          },
        ],
      });
    }
  }
}

async function viewAllPokemon(req, res) {
  const pokemonList = await db.getAllPokemon();
  console.log(pokemonList);
  res.render("pokemon/allPokemon", {
    title: "Pokemon List",
    pokemonList: pokemonList,
  });
}

async function viewPokemonOwners(req, res) {
  const pokemonId = req.params.id;
  const pokemon = await db.getPokemon(pokemonId);
  const allOwners = await db.getAllOwners(pokemonId);
  console.log(allOwners.rows);
  res.render("pokemon/pokemon", {
    title: pokemon.name,
    pokemon: pokemon,
    owners: allOwners.rows,
  });
}

async function deletePokemon(req, res) {
  const trainerId = req.params.trainerid;
  const pokemonId = req.params.pokemonid;
  console.log(trainerId, pokemonId);
  await db.deletePokemon(trainerId, pokemonId);
  res.redirect("/trainers/" + trainerId);
}

async function deleteTrainer(req, res) {
  await db.deleteTrainer(req.params.trainerid);
  res.redirect("/trainers");
}

async function addPokemon(req, res) {
  const pokemonId = req.body.pokemon;
  const trainerId = req.body.trainerid;
  await db.addPokemon(trainerId, pokemonId);
  res.redirect("/trainers/" + trainerId);
}

async function updateTrainerName(req, res, next) {
  res.locals.trainerid = req.body.trainerid;
  const trainerId = req.body.trainerid;
  const newName = req.body.newName;
  try {
    await db.editTrainerName(trainerId, newName);
    res.redirect("/trainers/" + trainerId);
  } catch (error) {
    console.error(error);
    const pokemonList = await db.getAllPokemon();
    const trainer = await db.getTrainer(trainerId);
    const trainerPokemon = await db.getOwnedPokemon(trainerId);
    console.log(trainerPokemon);
    if (error.code === "23505") {
      res.render("trainers/trainer", {
        trainer: trainer,
        ownedPokemon: trainerPokemon,
        allPokemon: pokemonList,
        errors: [
          {
            msg: "Username already exists in db",
          },
        ],
      });
    } else {
      res.render("trainers/trainer", {
        trainer: trainer,
        ownedPokemon: trainerPokemon,
        allPokemon: pokemonList,
        errors: [
          {
            msg: "Username already exists in db",
          },
        ],
      });
    }
  }
}

module.exports = {
  homeGet,
  viewAllTrainers,
  viewTrainer,
  getNewTrainer,
  postNewTrainer,
  viewAllPokemon,
  viewPokemonOwners,
  deletePokemon,
  deleteTrainer,
  addPokemon,
  updateTrainerName,
};
