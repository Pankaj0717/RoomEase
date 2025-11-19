const express = require('express');
const Listing = require('../models/Listing');
const { protect, authorize } = require('../middleware/auth');
const { upload, uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

const router = express.Router();

// IMPORTANT: Specific routes MUST come before parameterized routes

// @route   GET /api/listings/owner/my-listings
// @desc    Get owner's listings
// @access  Private (Owner only)
router.get('/owner/my-listings', protect, authorize('owner'), async (req, res) => {
  try {
    const listings = await Listing.find({ owner: req.user.id }).sort('-createdAt');
    res.json({ success: true, count: listings.length, listings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/listings
// @desc    Create new listing
// @access  Private (Owner only)
router.post('/', protect, authorize('owner'), upload.array('images', 5), async (req, res) => {
  try {
    const { title, description, type, price, location, amenities, gender, occupancy } = req.body;

    const images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.buffer, 'roomease/listings');
        images.push({ url: result.secure_url, publicId: result.public_id });
      }
    }

    const listing = await Listing.create({
      title,
      description,
      type,
      price,
      location: JSON.parse(location),
      amenities: JSON.parse(amenities),
      gender,
      occupancy: JSON.parse(occupancy),
      images,
      owner: req.user.id
    });

    res.status(201).json({ success: true, listing });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/listings
// @desc    Get all approved listings with filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { location, budget, roomType, gender, amenities, search } = req.query;
    
    let query = { status: 'approved' };
    
    if (location) query['location.city'] = new RegExp(location, 'i');
    if (budget) query.price = { $lte: parseInt(budget) };
    if (roomType) query.type = roomType;
    if (gender) query.gender = gender;
    if (amenities) query.amenities = { $in: amenities.split(',') };
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { 'location.city': new RegExp(search, 'i') },
        { 'location.area': new RegExp(search, 'i') }
      ];
    }

    const listings = await Listing.find(query).populate('owner', 'name email mobile profilePicture').sort('-createdAt');
    res.json({ success: true, count: listings.length, listings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/listings/:id
// @desc    Get single listing
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('owner', 'name email mobile profilePicture');
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }
    res.json({ success: true, listing });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/listings/:id
// @desc    Update listing
// @access  Private (Owner only)
router.put('/:id', protect, authorize('owner'), upload.array('images', 5), async (req, res) => {
  try {
    let listing = await Listing.findById(req.params.id);
    
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    if (listing.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const updateData = { ...req.body };
    
    if (req.body.location) updateData.location = JSON.parse(req.body.location);
    if (req.body.amenities) updateData.amenities = JSON.parse(req.body.amenities);
    if (req.body.occupancy) updateData.occupancy = JSON.parse(req.body.occupancy);

    if (req.files && req.files.length > 0) {
      for (const img of listing.images) {
        await deleteFromCloudinary(img.publicId);
      }
      
      const images = [];
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.buffer, 'roomease/listings');
        images.push({ url: result.secure_url, publicId: result.public_id });
      }
      updateData.images = images;
    }

    listing = await Listing.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    res.json({ success: true, listing });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/listings/:id
// @desc    Delete listing
// @access  Private (Owner only)
router.delete('/:id', protect, authorize('owner'), async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    if (listing.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    for (const img of listing.images) {
      await deleteFromCloudinary(img.publicId);
    }

    await listing.deleteOne();
    res.json({ success: true, message: 'Listing deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/listings/owner/my-listings
// @desc    Get owner's listings
// @access  Private (Owner only)
router.get('/owner/my-listings', protect, authorize('owner'), async (req, res) => {
  try {
    const listings = await Listing.find({ owner: req.user.id }).sort('-createdAt');
    res.json({ success: true, count: listings.length, listings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/listings/:id
// @desc    Get single listing for editing
// @access  Private (Owner only for their listings)
router.get('/:id/edit', protect, authorize('owner'), async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    if (listing.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, listing });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;