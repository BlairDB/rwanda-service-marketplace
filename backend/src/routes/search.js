const express = require('express');
const router = express.Router();

router.get('/businesses', (req, res) => {
  res.json({ message: 'Search businesses endpoint - coming soon' });
});

module.exports = router;