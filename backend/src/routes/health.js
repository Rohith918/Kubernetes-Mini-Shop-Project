const express = require('express');
const router = express.Router();

// Used for K8s liveness/readiness probes
router.get('/', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

module.exports = router;
