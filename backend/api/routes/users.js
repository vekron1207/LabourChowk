const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// Validation middleware for user updates
const updateUserValidation = [
  body('name').optional().isLength({ min: 1 }).withMessage('Name cannot be empty'),
  body('language').optional().isIn(['hi', 'en']).withMessage('Language must be either hi or en'),
  body('location').optional().isObject().withMessage('Location must be an object'),
  body('location.lat').optional().isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
  body('location.lng').optional().isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude'),
];

// PUT /api/users/me (Protected - Update current user)
router.put('/me', authMiddleware, updateUserValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updates = {};

    if (req.body.name !== undefined) updates.name = req.body.name;
    if (req.body.language !== undefined) updates.language = req.body.language;
    if (req.body.location) {
      if (req.body.location.lat !== undefined) updates.location_lat = req.body.location.lat;
      if (req.body.location.lng !== undefined) updates.location_lng = req.body.location.lng;
    }

    const updatedUser = await User.update(req.user.id, updates);

    res.status(200).json({
      user: {
        id: updatedUser.id.toString(),
        phone: updatedUser.phone,
        role: updatedUser.role,
        name: updatedUser.name || '',
        language: updatedUser.language || 'hi',
        location: {
          lat: parseFloat(updatedUser.location_lat) || 0,
          lng: parseFloat(updatedUser.location_lng) || 0
        },
        createdAt: updatedUser.created_at.toISOString()
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Server error during update' });
  }
});

// GET /api/users/:id (Protected - Get user by ID)
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      user: {
        id: user.id.toString(),
        phone: user.phone,
        role: user.role,
        name: user.name || '',
        language: user.language || 'hi',
        location: {
          lat: parseFloat(user.location_lat) || 0,
          lng: parseFloat(user.location_lng) || 0
        },
        createdAt: user.created_at.toISOString()
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
