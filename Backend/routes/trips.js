const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const tripController = require('../controllers/tripController');
const { protect, admin } = require('../../middlewares/auth');

// public list and single
router.get('/', tripController.getTrips);
router.get('/:id', tripController.getTrip);

// admin only: create/update/delete
router.post('/',
  protect, admin,
  [
    body('title').notEmpty(),
    body('from').notEmpty(),
    body('to').notEmpty(),
    body('departAt').notEmpty(),
    body('price').isNumeric(),
    body('seatsTotal').isInt({ min: 1 })
  ],
  tripController.createTrip);

router.put('/:id', protect, admin, tripController.updateTrip);
router.delete('/:id', protect, admin, tripController.deleteTrip);

module.exports = router;
