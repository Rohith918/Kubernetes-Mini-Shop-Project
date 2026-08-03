const redis = require('redis');

const client = redis.createClient({
  url: process.env.REDIS_URL || 'redis://redis-service:6379',
});

client.on('error', (err) => console.error('Redis Client Error', err));

client.connect().catch(console.error);

module.exports = client;
