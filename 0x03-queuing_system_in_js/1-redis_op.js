import redis from 'redis';


const client = redis.createClient();


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
 * Retrieve the value of a given key from Redis
 * @param {string} schoolName - The key to retrieve from Redis
 */
function displaySchoolValue(schoolName) {
  client.get(schoolName, (err, value) => {
    if (err) {
      console.error(`Error retrieving value for ${schoolName}: ${err.message}`);
      return;
    }
    console.log(value);
  });
}


displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
