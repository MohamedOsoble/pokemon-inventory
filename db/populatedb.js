const { Client } = require("pg");
const pool = require("./pool");
const pokemonAPI = "https://pokeapi.co/api/v2/pokemon/";
require("dotenv").config();

const TABLESQL = `
DROP TABLE IF EXISTS pokemon_owner;
DROP TABLE IF EXISTS pokemon_type;
    DROP TABLE IF EXISTS type;
    DROP TABLE IF EXISTS trainers;
    DROP TABLE IF EXISTS pokemon;
    

    

    CREATE TABLE IF NOT EXISTS trainers (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(50) NOT NULL
);

    CREATE TABLE IF NOT EXISTS pokemon (
    id INTEGER PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    sprite VARCHAR(255) NOT NULL,
    ability VARCHAR(50),
    primary_type VARCHAR(50),
    secondary_type VARCHAR(50)
);
    CREATE TABLE IF NOT EXISTS pokemon_owner (
    trainer_id INTEGER NOT NULL,
    pokemon_id INTEGER NOT NULL,
    CONSTRAINT trainer_id
        FOREIGN KEY(trainer_id)
            REFERENCES trainers(id),
    CONSTRAINT pokemon_id
        FOREIGN KEY(pokemon_id)
            REFERENCES pokemon(id)
);

    INSERT INTO trainers (
    name)
    VALUES
    ('Mohamed'),
    ('Ash'),
    ('Professor Oak'),
    ('Brock'),
    ('Misty');
`;

const OwnersQuery = `
    INSERT INTO pokemon_owner (trainer_id, pokemon_id)
    VALUES
    (1, 1),
    (1, 151),
    (1, 123),
    (1, 122),
    (1, 111),
    (1, 118),
    (1, 7),
    (1, 84),
    (1, 93),
    (1, 18),
    (1, 125),
    (1, 127),
    (1, 71),
    (1, 51),
    (1, 16),
    (1, 18),
    (1, 81),
    (1, 12),
    (1, 10),
    (2, 1),
    (2, 151),
    (2, 123),
    (2, 122),
    (2, 111),
    (2, 118),
    (2, 7),
    (2, 84),
    (3, 93),
    (3, 18),
    (3, 125),
    (3, 127),
    (4, 71),
    (4, 51),
    (4, 16),
    (5, 18),
    (5, 81),
    (5, 12),
    (5, 10);
`;

function fixPokemonName(pokemonName) {
  return pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);
}

function getAbility(pokemonAbilities) {
  return pokemonAbilities.ability.name;
}

function pokemonObject(pokemon) {
  return {
    id: pokemon.id,
    name: fixPokemonName(pokemon.name),
    ability: getAbility(pokemon.abilities[0]),
    types: pokemon.types,
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" +
      pokemon.id +
      ".png",
  };
}

async function insertPokemon(pokemon) {
  await pool.query(
    "INSERT INTO pokemon (id, name, sprite, ability, primary_type, secondary_type) VALUES ($1, $2, $3, $4, $5, $6);",
    [
      pokemon.id,
      pokemon.name,
      pokemon.sprite,
      pokemon.ability,
      pokemon.primary_type,
      pokemon.secondary_type,
    ]
  );
}

// async function insertType(pokemon_id, type_id, isPrimary) {
//   await pool.query(
//     "INSERT INTO pokemon_type (pokemon_id, type_id, primary_type) VALUES ($1, $2, $3);",
//     [pokemon_id, type_id, isPrimary]
//   );
// }

// async function getTypeId(type_name) {
//   const query = {
//     text: `SELECT * FROM type WHERE name = ($1)`,
//     values: [type_name],
//   };
//   const result = await pool.query(query);
//   return result.rows[0].id;
// }

async function populatePokemonTable() {
  for (let i = 1; i < 152; i++) {
    fetch(pokemonAPI + i)
      .then((response) => response.json())
      .then((pokemon) => {
        return pokemonObject(pokemon);
      })
      .then(async (pokemonObj) => {
        if (pokemonObj.types.length > 1) {
          pokemonObj.primary_type = pokemonObj.types[0].type.name;
          pokemonObj.secondary_type = pokemonObj.types[1].type.name;
        } else {
          pokemonObj.primary_type = pokemonObj.types[0].type.name;
          pokemonObj.secondary_type = null;
        }
        insertPokemon(pokemonObj);
      });
  }
}

async function populateOwners() {
  console.log("seeding for owners table...");
  const client = new Client({
    connectionString: process.env.DB_URL,
  });
  await client.connect();
  await client.query(OwnersQuery);
  await client.end();
  console.log("owners table populated");
}

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: process.env.DB_URL,
  });
  await client.connect();
  await client.query(TABLESQL);
  console.log("Tables created");
  await populatePokemonTable();
  console.log("pokemon table populated");
  await client.end();
  console.log("done");
}

main();
populateOwners();
