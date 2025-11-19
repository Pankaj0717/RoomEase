const express = require('express');
const User = require('../models/User');
const Listing = require('../models/Listing');
const Booking = require('../models/Booking');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes are protected and only accessible by admin
router.use(protect, authorize('admin'));

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard stats
// @access  Private (Admin only)
router.get('/dashboard', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalListings = await Listing.countDocuments();
    const pendingApprovals = await Listing.countDocuments({ status: 'pending' });
    const totalBookings = await Booking.countDocuments();

    const usersByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    const listingsByStatus = await Listing.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalListings,
        pendingApprovals,
        totalBookings,
        usersByRole,
        listingsByStatus
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/admin/listings/pending
// @desc    Get all pending listings
// @access  Private (Admin only)
router.get('/listings/pending', async (req, res) => {
  try {
    const listings = await Listing.find({ status: 'pending' })
      .populate('owner', 'name email mobile')
      .sort('-createdAt');
    
    res.json({ success: true, count: listings.length, listings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/admin/listings/:id/approve
// @desc    Approve a listing
// @access  Private (Admin only)
router.put('/listings/:id/approve', async (req, res) => {
  try {
    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );

    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    res.json({ success: true, listing });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/admin/listings/:id/reject
// @desc    Reject a listing
// @access  Private (Admin only)
router.put('/listings/:id/reject', async (req, res) => {
  try {
    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );

    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    res.json({ success: true, listing });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private (Admin only)
router.get('/users', async (req, res) => {
  try {
    const { role, search } = req.query;
    let query = {};

    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ];
    }

    const users = await User.find(query).sort('-createdAt');
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete a user
// @access  Private (Admin only)
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await user.deleteOne();
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/admin/listings
// @desc    Get all listings
// @access  Private (Admin only)
router.get('/listings', async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    
    if (status) query.status = status;

    const listings = await Listing.find(query)
      .populate('owner', 'name email')
      .sort('-createdAt');
    
    res.json({ success: true, count: listings.length, listings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;