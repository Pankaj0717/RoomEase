const express = require('express');
const Booking = require('../models/Booking');
const Listing = require('../models/Listing');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/bookings
// @desc    Create new booking
// @access  Private (Tenant only)
router.post('/', protect, authorize('tenant'), async (req, res) => {
  try {
    const { listingId, startDate, endDate } = req.body;

    const listing = await Listing.findById(listingId).populate('owner');
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    const booking = await Booking.create({
      listing: listingId,
      tenant: req.user.id,
      owner: listing.owner._id,
      startDate,
      endDate,
      monthlyRent: listing.price
    });

    // Generate monthly payments
    booking.payments = booking.generateMonthlyPayments();
    await booking.save();

    res.status(201).json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/bookings/tenant/my-bookings
// @desc    Get tenant's bookings
// @access  Private (Tenant only)
router.get('/tenant/my-bookings', protect, authorize('tenant'), async (req, res) => {
  try {
    const bookings = await Booking.find({ tenant: req.user.id })
      .populate('listing')
      .populate('owner', 'name email mobile')
      .sort('-createdAt');
    res.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/bookings/owner/my-bookings
// @desc    Get owner's bookings
// @access  Private (Owner only)
router.get('/owner/my-bookings', protect, authorize('owner'), async (req, res) => {
  try {
    const bookings = await Booking.find({ owner: req.user.id })
      .populate('listing')
      .populate('tenant', 'name email mobile')
      .sort('-createdAt');
    res.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/bookings/:id/payment/:paymentId
// @desc    Mark payment as paid
// @access  Private
router.put('/:id/payment/:paymentId', protect, async (req, res) => {
  try {
    const { transactionId, paymentMethod } = req.body;
    
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const payment = booking.payments.id(req.params.paymentId);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    payment.status = 'paid';
    payment.paidDate = new Date();
    payment.transactionId = transactionId;
    payment.paymentMethod = paymentMethod;

    await booking.save();
    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/bookings/:id
// @desc    Get single booking
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('listing')
      .populate('tenant', 'name email mobile')
      .populate('owner', 'name email mobile');
    
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.tenant._id.toString() !== req.user.id && booking.owner._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/bookings/:id/status
// @desc    Update booking status
// @access  Private
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    booking.status = status;
    await booking.save();

    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;