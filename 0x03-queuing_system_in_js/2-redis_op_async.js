import redis from 'redis';
import { promisify } from 'util';


const client = redis.createClient();

 
const getAsync = promisify(client.get).bind(client);

 
client.on('connect', () => {
  console.log('Redis client connected to the server');
});


client.on('error', (err) => {
  console.error(`Redis client not connected to the server: ${err.message}`);
});

/**
 * Set a key-value pair in Redis and log confirmation
 * @param {string} schoolName - The key to set in Redis
 * @param {string} value - The value to set for the key
 */
function setNewSchool(schoolName, value) {
  client.set(schoolName, value, redis.print);
}

/**
 * Retrieve the value of a given key from Redis using async/await
 * @param {string} schoolName - The key to retrieve from Redis
 */
async function displaySchoolValue(schoolName) {
  try {
    const value = await getAsync(schoolName);
    console.log(value);
  } catch (err) {
    console.error(`Error retrieving value for ${schoolName}: ${err.message}`);
  }
}


(async () => {
  await displaySchoolValue('Holberton');
  setNewSchool('HolbertonSanFrancisco', '100');
  await displaySchoolValue('HolbertonSanFrancisco');
})();
