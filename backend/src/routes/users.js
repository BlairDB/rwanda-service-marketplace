const express = require('express');
const router = express.Router();

// Placeholder routes
router.get('/profile', (req, res) => {
  res.json({ message: 'User profile endpoint - coming soon' });
});

router.put('/profile', (req, res) => {
  res.json({ message: 'Update profile endpoint - coming soon' });
});

module.exports = router;
