const express = require('express');
const User = require('../models/User');
const Booking = require('../models/Booking');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/users/favorites/:listingId
// @desc    Add/Remove favorite listing
// @access  Private
router.post('/favorites/:listingId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const listingId = req.params.listingId;

    const index = user.favorites.indexOf(listingId);
    
    if (index === -1) {
      user.favorites.push(listingId);
    } else {
      user.favorites.splice(index, 1);
    }

    await user.save();
    await user.populate('favorites');

    res.json({ success: true, favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/users/favorites
// @desc    Get user's favorite listings
// @access  Private
router.get('/favorites', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('favorites');
    res.json({ success: true, favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/users/analytics
// @desc    Get user analytics (payment history, bookings stats)
// @access  Private
router.get('/analytics', protect, async (req, res) => {
  try {
    let analytics = {};

    if (req.user.role === 'tenant') {
      const bookings = await Booking.find({ tenant: req.user.id });
      
      const totalBookings = bookings.length;
      const activeBookings = bookings.filter(b => b.status === 'active').length;
      
      let totalPaid = 0;
      let totalPending = 0;
      const paymentHistory = [];

      bookings.forEach(booking => {
        booking.payments.forEach(payment => {
          if (payment.status === 'paid') {
            totalPaid += payment.amount;
            paymentHistory.push({
              amount: payment.amount,
              date: payment.paidDate,
              month: payment.month,
              year: payment.year,
              listing: booking.listing
            });
          } else if (payment.status === 'pending') {
            totalPending += payment.amount;
          }
        });
      });

      analytics = {
        totalBookings,
        activeBookings,
        totalPaid,
        totalPending,
        paymentHistory: paymentHistory.sort((a, b) => new Date(b.date) - new Date(a.date))
      };

    } else if (req.user.role === 'owner') {
      const bookings = await Booking.find({ owner: req.user.id }).populate('listing tenant');
      
      const totalBookings = bookings.length;
      const activeBookings = bookings.filter(b => b.status === 'active').length;
      
      let totalEarned = 0;
      let totalPending = 0;
      const revenueByMonth = {};
      const paymentHistory = [];

      bookings.forEach(booking => {
        booking.payments.forEach(payment => {
          const monthKey = `${payment.month} ${payment.year}`;
          
          if (payment.status === 'paid') {
            totalEarned += payment.amount;
            revenueByMonth[monthKey] = (revenueByMonth[monthKey] || 0) + payment.amount;
            paymentHistory.push({
              amount: payment.amount,
              date: payment.paidDate,
              month: payment.month,
              year: payment.year,
              tenant: booking.tenant.name,
              listing: booking.listing.title
            });
          } else if (payment.status === 'pending') {
            totalPending += payment.amount;
          }
        });
      });

      analytics = {
        totalBookings,
        activeBookings,
        totalEarned,
        totalPending,
        revenueByMonth,
        paymentHistory: paymentHistory.sort((a, b) => new Date(b.date) - new Date(a.date))
      };
    }

    res.json({ success: true, analytics });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, mobile } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, mobile },
      { new: true, runValidators: true }
    );

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;