const pool = require('./pool');

async function getAllPokemon() {
    const { rows } = await pool.query("SELECT * FROM pokemon");
    return rows;
};

async function getOwnedPokemon(trainerId){
    const query = {
    text: `
        SELECT *
        FROM pokemon
        INNER JOIN pokemon_owner
        ON pokemon.id = pokemon_owner.pokemon_id
        INNER JOIN trainers
        ON pokemon_owner.trainer_id = trainers.id 
        WHERE trainer_id = ($1)
        `,
    values: [trainerId]
    }

    const result = await pool.query(query)
    console.log(result)
    return result
};

async function getAllTrainers() {
        const { rows } = await pool.query("SELECT * FROM trainers");
        return rows;
}

async function getTrainer(trainerId) {
    const query = {
        text: `SELECT * FROM trainers WHERE ID ($1)`,
        values: [trainerId]
    }
    const result = await pool.query(query)
    console.log(query.values)
    return result.rows;
}

module.exports = {
    getAllPokemon,
    getOwnedPokemon,
    getAllTrainers,
    getTrainer,
}