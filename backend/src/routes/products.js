const express = require('express');
const router = express.Router();
const pool = require('../db/pool');
const redisClient = require('../cache/redisClient');

router.get('/', async (req, res) => {
  try {
    const cacheKey = 'products:all';
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const result = await pool.query('SELECT * FROM products');
    await redisClient.set(cacheKey, JSON.stringify(result.rows), { EX: 30 });

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

module.exports = router;
