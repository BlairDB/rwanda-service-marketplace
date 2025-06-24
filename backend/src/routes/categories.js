const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Categories endpoint - coming soon' });
});

module.exports = router;