require('dotenv').config();
const mongoose = require('mongoose');
const Listing = require('./models/Listing');
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const mockListings = [
  {
    title: 'Comfortable Single Room near KLE College',
    description: 'Well-maintained single occupancy room perfect for students and working professionals. Located near KLE College with easy access to public transport. Room includes bed, study table, and wardrobe. 24/7 water and power backup available.',
    type: 'single',
    price: 5500,
    location: {
      city: 'Belagavi',
      area: 'Tilakwadi',
      address: 'Near KLE College Main Gate'
    },
    amenities: ['Wi-Fi', 'Power Backup', 'Water Supply', 'Security', 'Furnished'],
    images: [
      { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', publicId: 'mock1' }
    ],
    gender: 'male',
    occupancy: { current: 0, max: 1 },
    status: 'approved'
  },
  {
    title: 'Spacious PG for Girls - Angol',
    description: 'Safe and secure PG accommodation for working women and students. Homely atmosphere with nutritious meals included. Close to Market Area and bus stand. Includes laundry service and housekeeping.',
    type: 'pg',
    price: 7000,
    location: {
      city: 'Belagavi',
      area: 'Angol',
      address: 'Opposite Angol Market'
    },
    amenities: ['Wi-Fi', 'Kitchen', 'Washing Machine', 'TV', 'Refrigerator', 'Security', 'Furnished'],
    images: [
      { url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800', publicId: 'mock2' }
    ],
    gender: 'female',
    occupancy: { current: 2, max: 4 },
    status: 'approved'
  },
  {
    title: 'Affordable Shared Room - Camp Area',
    description: 'Budget-friendly shared accommodation in the heart of Belagavi. Perfect for students. Walking distance to colleges and shopping areas. Includes all basic amenities. Friendly roommates and peaceful environment.',
    type: 'shared',
    price: 3500,
    location: {
      city: 'Belagavi',
      area: 'Camp',
      address: 'Near Camp Market'
    },
    amenities: ['Wi-Fi', 'Washing Machine', 'Power Backup', 'Water Supply', 'Furnished'],
    images: [
      { url: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800', publicId: 'mock3' }
    ],
    gender: 'male',
    occupancy: { current: 1, max: 2 },
    status: 'approved'
  },
  {
    title: 'Premium Single Room with AC - Hindalga',
    description: 'Luxurious single room with AC and attached bathroom. Perfect for working professionals who value privacy and comfort. Modern amenities including high-speed WiFi, refrigerator, and geyser. Quiet neighborhood with 24/7 security.',
    type: 'single',
    price: 8500,
    location: {
      city: 'Belagavi',
      area: 'Hindalga',
      address: 'Hindalga Road, Near BIMS Hospital'
    },
    amenities: ['Wi-Fi', 'Air Conditioning', 'Refrigerator', 'TV', 'Parking', 'Security', 'Furnished', 'Power Backup'],
    images: [
      { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', publicId: 'mock4' }
    ],
    gender: 'any',
    occupancy: { current: 0, max: 1 },
    status: 'approved'
  },
  {
    title: 'Boys Hostel near Engineering College',
    description: 'Well-maintained hostel facility for engineering students. Located just 5 minutes walk from KLE Tech. Includes mess facility with 3 meals a day. Study room, gym, and recreational facilities available. Strict study hours maintained.',
    type: 'hostel',
    price: 6500,
    location: {
      city: 'Belagavi',
      area: 'Machhe',
      address: 'Near KLE Technological University'
    },
    amenities: ['Wi-Fi', 'Kitchen', 'Gym', 'TV', 'Security', 'Furnished', 'Power Backup', 'Water Supply'],
    images: [
      { url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800', publicId: 'mock5' }
    ],
    gender: 'male',
    occupancy: { current: 8, max: 20 },
    status: 'approved'
  },
  {
    title: 'Cozy Single Room - Shahapur',
    description: 'Independent single room in a quiet residential area. Ideal for students preparing for competitive exams or working professionals. Includes study table, chair, and good lighting. Vegetarian cooking allowed. Close to market and hospitals.',
    type: 'single',
    price: 4500,
    location: {
      city: 'Belagavi',
      area: 'Shahapur',
      address: 'Shahapur Main Road'
    },
    amenities: ['Wi-Fi', 'Kitchen', 'Power Backup', 'Water Supply', 'Furnished'],
    images: [
      { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', publicId: 'mock6' }
    ],
    gender: 'male',
    occupancy: { current: 0, max: 1 },
    status: 'approved'
  },
  {
    title: 'Girls PG with Food - Tilakwadi',
    description: 'Comfortable PG for working women with homemade food facility. Safe locality with CCTV surveillance. Close to Dharwad Road and easily accessible to all parts of city. Includes breakfast and dinner. Friendly atmosphere.',
    type: 'pg',
    price: 7500,
    location: {
      city: 'Belagavi',
      area: 'Tilakwadi',
      address: 'Tilakwadi Main Road, Near Police Station'
    },
    amenities: ['Wi-Fi', 'Kitchen', 'Washing Machine', 'TV', 'Security', 'Furnished', 'Refrigerator'],
    images: [
      { url: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800', publicId: 'mock7' }
    ],
    gender: 'female',
    occupancy: { current: 3, max: 6 },
    status: 'approved'
  },
  {
    title: 'Budget Shared Room near Market',
    description: 'Very affordable shared room for students. Located in the heart of city near main market. Easy access to all amenities, shops, and restaurants. Suitable for those who want to save money while studying. Friendly roommates.',
    type: 'shared',
    price: 3000,
    location: {
      city: 'Belagavi',
      area: 'Khanapur Road',
      address: 'Near Central Bus Stand'
    },
    amenities: ['Wi-Fi', 'Water Supply', 'Furnished', 'Security'],
    images: [
      { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', publicId: 'mock8' }
    ],
    gender: 'male',
    occupancy: { current: 1, max: 3 },
    status: 'approved'
  },
  {
    title: 'Modern AC Room - Ramnagar',
    description: 'Fully furnished AC room with modern interiors. Suitable for working professionals. Includes high-speed internet, attached bathroom with geyser, and private balcony. Peaceful environment with parking facility. Close to IT companies.',
    type: 'single',
    price: 9000,
    location: {
      city: 'Belagavi',
      area: 'Ramnagar',
      address: 'Ramnagar Extension'
    },
    amenities: ['Wi-Fi', 'Air Conditioning', 'Parking', 'Security', 'Furnished', 'TV', 'Refrigerator', 'Power Backup'],
    images: [
      { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', publicId: 'mock9' }
    ],
    gender: 'any',
    occupancy: { current: 0, max: 1 },
    status: 'approved'
  },
  {
    title: 'Girls Hostel with Mess - Medical College Area',
    description: 'Secure hostel for medical and nursing students. Located near BIMS and KLE Hospital. Includes mess with nutritious meals, study room, and recreation area. Strict timings and rules maintained. Warden available 24/7.',
    type: 'hostel',
    price: 8000,
    location: {
      city: 'Belagavi',
      area: 'BIMS Campus',
      address: 'Near BIMS Hospital'
    },
    amenities: ['Wi-Fi', 'Kitchen', 'TV', 'Gym', 'Security', 'Furnished', 'Power Backup', 'Water Supply'],
    images: [
      { url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800', publicId: 'mock10' }
    ],
    gender: 'female',
    occupancy: { current: 12, max: 30 },
    status: 'approved'
  },
  {
    title: 'Family PG - Udyambag',
    description: 'Homely PG run by family. Like home away from home. Includes breakfast and dinner. Perfect for students who miss home food. Caring owners who treat tenants like family. Clean and well-maintained rooms.',
    type: 'pg',
    price: 6000,
    location: {
      city: 'Belagavi',
      area: 'Udyambag',
      address: 'Udyambag Main Road'
    },
    amenities: ['Wi-Fi', 'Kitchen', 'Washing Machine', 'TV', 'Security', 'Furnished', 'Water Supply'],
    images: [
      { url: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800', publicId: 'mock11' }
    ],
    gender: 'male',
    occupancy: { current: 2, max: 5 },
    status: 'approved'
  },
  {
    title: 'Premium Shared Room - Hindwadi',
    description: 'Well-furnished shared room in premium locality. Suitable for working professionals who want to network. Includes all modern amenities. Close to restaurants, gyms, and entertainment centers. Good connectivity to all parts of city.',
    type: 'shared',
    price: 4500,
    location: {
      city: 'Belagavi',
      area: 'Hindwadi',
      address: 'Hindwadi Layout'
    },
    amenities: ['Wi-Fi', 'Air Conditioning', 'Parking', 'Gym', 'Security', 'Furnished', 'Power Backup'],
    images: [
      { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', publicId: 'mock12' }
    ],
    gender: 'any',
    occupancy: { current: 1, max: 2 },
    status: 'approved'
  }
];

async function seedListings() {
  try {
    console.log('🌱 Starting to seed listings...');

    // Find an owner user or create one
    let owner = await User.findOne({ role: 'owner' });
    
    if (!owner) {
      console.log('⚠️  No owner found. Creating default owner...');
      const bcrypt = require('bcryptjs');
      owner = await User.create({
        name: 'RoomEase Admin',
        email: 'owner@roomease.com',
        password: await bcrypt.hash('password123', 12),
        mobile: '9876543210',
        role: 'owner'
      });
      console.log('✅ Default owner created: owner@roomease.com / password123');
    }

    // Add owner to all listings
    const listingsWithOwner = mockListings.map(listing => ({
      ...listing,
      owner: owner._id
    }));

    // Clear existing mock listings (optional)
    // await Listing.deleteMany({ 'location.city': 'Belagavi' });

    // Insert listings
    const result = await Listing.insertMany(listingsWithOwner);
    
    console.log(`✅ Successfully added ${result.length} listings to database!`);
    console.log('📍 All listings are from Belagavi city');
    console.log('🎉 Seed data inserted successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

seedListings();