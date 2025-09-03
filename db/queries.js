const pool = require("./pool");

async function getAllPokemon() {
  const { rows } = await pool.query(`SELECT
 *
FROM
  pokemon
ORDER BY
  pokemon.id`);
  return rows;
}

async function getPokemon(pokemonId) {
  const query = {
    text: `SELECT * FROM pokemon
        WHERE id = ($1)`,
    values: [pokemonId],
  };
  const result = await pool.query(query);
  return result.rows[0];
}

async function getOwnedPokemon(trainerId) {
  const query = {
    text: `
        SELECT *
        FROM trainers
        INNER JOIN pokemon_owner
        ON trainers.id = pokemon_owner.trainer_id
        INNER JOIN pokemon
        ON pokemon_owner.pokemon_id = pokemon.id 
        WHERE trainer_id = ($1)
        ORDER BY pokemon.id
        `,
    values: [trainerId],
  };

  const result = await pool.query(query);
  return result.rows;
}

async function getAllTrainers() {
  const { rows } =
    await pool.query(`SELECT trainers.id, trainers.name, COUNT(pokemon_owner.trainer_id) AS pokemon_owned
             FROM trainers 
             INNER JOIN pokemon_owner on trainers.id = pokemon_owner.trainer_id
             GROUP BY trainers.id`);
  return rows;
}

async function getTrainer(trainerId) {
  const query = {
    text: `SELECT * FROM trainers WHERE id = ($1)`,
    values: [trainerId],
  };
  const result = await pool.query(query);
  return result.rows[0];
}

async function getAllOwners(pokemonId) {
  const query = {
    text: `SELECT * FROM pokemon
        INNER JOIN pokemon_owner ON pokemon.id = pokemon_owner.pokemon_id
        INNER JOIN trainers ON trainer.id = pokemon_owner.trainer_id
        WHERE pokemon_owner.pokemon_id = ($1)`,
    values: [pokemonId],
  };
  await pool.query(query);
}

async function addTrainer(trainerName) {
  const query = {
    text: `INSERT INTO trainers (name)
        VALUES ($1)`,
    values: [trainerName],
  };

  await pool.query(query);
}

async function addPokemon(trainerId, pokemonId) {
  // Add pokemon to pokemon_owner
  const query = {
    text: `INSERT INTO pokemon_owner (trainer_id, pokemon_id)
        VALUES ($1, $2)`,
    values: [trainerId, pokemonId],
  };

  await pool.query(query);
}

async function editTrainerName(trainerId, newName) {
  // Update trainers where id = trainerid
  await pool.query(
    `UPDATE trainers
    SET name = ($1)
    WHERE id = ($2)`,
    [newName, trainerId]
  );
}

async function deletePokemon(trainerId, pokemonId) {
  const query = {
    text: `DELETE FROM pokemon_owner
        WHERE trainer_id = ($1)
        AND pokemon_id = ($2)`,
    values: [trainerId, pokemonId],
  };
  await pool.query(query);
}

async function deleteTrainer(trainerId) {
  // Delete all pokemon owned by trainer
  await pool.query(
    `DELETE FROM pokemon_owner
    WHERE trainer_id = ($1)`,
    [trainerId]
  );
  // Delete trainer from db
  await pool.query(
    `DELETE FROM trainers
    WHERE id = ($1)`,
    [trainerId]
  );
}

module.exports = {
  getPokemon,
  getAllPokemon,
  getOwnedPokemon,
  getAllTrainers,
  getTrainer,
  getAllOwners,
  deletePokemon,
  addTrainer,
  addPokemon,
  editTrainerName,
  deleteTrainer,
};
