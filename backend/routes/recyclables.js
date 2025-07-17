const express = require('express');
const router = express.Router();

// Dummy recyclables data
const recyclableItems = {
  '8901234567890': { material: 'Plastic', recyclable: true },
  '8900987654321': { material: 'Glass', recyclable: true },
  '1234567890123': { material: 'Carton', recyclable: false },
  '9876543210987': { material: 'Metal', recyclable: true },
  '0000000000000': { material: 'Unknown', recyclable: false },
};

// GET /api/recyclables/:barcode
router.get('/:barcode', (req, res) => {
  const { barcode } = req.params;
  const item = recyclableItems[barcode];

  if (!item) {
    return res.status(404).json({
      error: true,
      message: 'Item not found or not recyclable',
    });
  }

  res.json({
    recyclable: item.recyclable,
    material: item.material,
  });
});

module.exports = router;
