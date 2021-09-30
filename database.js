const debug = require('debug')('app:database');
const { MongoClient, ObjectId } = require('mongodb');
const config = require('config');

const newId = (str) => ObjectId(str);

let _db = null;

/**
 * Connect to the database
 * @returns {Promise<Db>} the database
 */
async function connect() {
  if (!_db) {
    const dbUrl = config.get('db.url'); // url for local server
    const dbName = config.get('db.name'); // your database name here
    const client = await MongoClient.connect(dbUrl); // create a client
    _db = client.db(dbName); // select a database
    debug('Connected');
  }
  return _db;
}

/** Connect to the database and verify the connection */
async function ping() {
  const db = await connect(); // establish a connection
  await db.command({ ping: 1 }); // verify the connection
  debug('Ping');
}

/** Find all pets */
async function findAllPets() {
  const db = await connect(); // don't use _db directly!!
  const pets = await db.collection('pets').find({}).toArray();
  return pets;
}

async function findPetById(petId) {
  const db = await connect(); // don't use _db directly!!
  const pet = await db.collection('pets').findOne({ _id: { $eq: petId } });
  return pet;
}

async function insertOnePet(pet) {
  const db = await connect();
  await db.collection('pets').insertOne(pet);
}

async function updateOnePet(petId, update) {
  const db = await connect();
  await db.collection('pets').updateOne(
    { _id: { $eq: petId } },
    {
      $set: {
        ...update,
        lastUpdated: new Date(),
      },
    },
  );
}

async function deleteOnePet(petId) {
  const db = await connect(); // don't use _db directly!!
  await db.collection('pets').deleteOne({ _id: { $eq: petId } });
}

ping();

module.exports = {
  newId,
  connect,
  ping,
  findAllPets,
  findPetById,
  insertOnePet,
  updateOnePet,
  deleteOnePet,
};
