const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  type: {
    type: String,
    enum: ['single', 'shared', 'pg', 'hostel'],
    required: true
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: 0
  },
  location: {
    city: {
      type: String,
      required: true
    },
    area: {
      type: String,
      required: true
    },
    address: String
  },
  amenities: [{
    type: String
  }],
  images: [{
    url: String,
    publicId: String
  }],
  gender: {
    type: String,
    enum: ['male', 'female', 'any'],
    default: 'any'
  },
  occupancy: {
    current: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      required: true
    }
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'unlisted'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

listingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Listing', listingSchema);