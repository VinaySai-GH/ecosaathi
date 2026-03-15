require('dotenv').config();
const mongoose = require('mongoose');
const Spot = require('../models/Spot');
const User = require('../models/User');

// Seed data - spots from Tirupati
// Note: You'll need to geocode addresses or extract lat/lng from Google Maps URLs
// For now, this includes place IDs from Google Maps URLs that can be used with Places API

const seedSpots = [
    // E-Waste & Composting
    {
        name: 'World Scrap Recycling Solutions',
        category: 'ewaste',
        address: 'Tirupati, Andhra Pradesh',
        lat: 13.6288,
        lng: 79.4192,
        opening_hours: 'Mon-Fri 8AM-6:30PM, Sat 9AM-5PM',
        cost: 'Free',
        tips: ['Call ahead before dropping e-waste', 'Accepts all electronic items'],
        google_place_id: 'ChIJ13117411536548716407',
    },
    {
        name: 'Eco Finix Compost',
        category: 'composting',
        address: 'Tirupati, Andhra Pradesh',
        lat: 13.6263,
        lng: 79.4870,
        opening_hours: 'Daily 9AM-6PM',
        cost: 'Free',
        tips: ['Bring organic waste in biodegradable bags', 'Compost available for purchase'],
    },
    {
        name: 'Tirupati Municipal Corporation',
        category: 'ewaste',
        address: 'Tirupati, Andhra Pradesh',
        lat: 13.6288,
        lng: 79.4192,
        opening_hours: 'Mon-Sat 10AM-6PM',
        cost: 'Free',
        tips: ['Municipal e-waste collection point', 'Check timings before visit'],
    },
    // Bank E-Waste Bins
    {
        name: 'HDFC Bank - Air Bypass Road',
        category: 'ewaste',
        address: 'Air Bypass Road, Tirupati',
        lat: 13.6288,
        lng: 79.4192,
        cost: 'Free',
        tips: ['Call ahead to confirm', 'E-waste bin in lobby'],
    },
    {
        name: 'HDFC Bank - KT Road',
        category: 'ewaste',
        address: 'KT Road, Tirupati',
        lat: 13.6288,
        lng: 79.4192,
        cost: 'Free',
        tips: ['Call ahead to confirm', 'E-waste bin in lobby'],
    },
    {
        name: 'SBI - Tilak Road / KT Road',
        category: 'ewaste',
        address: 'Tilak Road, Tirupati',
        lat: 13.6288,
        lng: 79.4192,
        cost: 'Free',
        tips: ['Call ahead to confirm', 'E-waste bin in lobby'],
    },
    // Organic Stores
    {
        name: "Arya's Natural Farming Products",
        category: 'organic',
        address: 'Tirupati, Andhra Pradesh',
        lat: 13.6288,
        lng: 79.4192,
        opening_hours: '9AM-9:30PM',
        tips: ['Bring your own bag', 'Wide variety of organic produce'],
    },
    {
        name: 'Dharmika Healthy Foods',
        category: 'organic',
        address: 'Tirupati, Andhra Pradesh',
        lat: 13.6288,
        lng: 79.4192,
        opening_hours: '9AM-9PM',
        tips: ['Organic grains and pulses', 'Bulk purchase available'],
    },
    {
        name: 'Visishta Organics Shop',
        category: 'organic',
        address: 'KT Road, Tirupati',
        lat: 13.6288,
        lng: 79.4192,
        tips: ['KT Road location', 'Organic vegetables and fruits'],
    },
    // Parks
    {
        name: 'KVS Sports Park (Tummalagunta)',
        category: 'park',
        address: 'Tummalagunta, Tirupati',
        lat: 13.6288,
        lng: 79.4192,
        opening_hours: '5:30AM-8:30PM',
        cost: 'Free',
        tips: ['Great for morning walks', 'Well-maintained green space'],
    },
    {
        name: 'Prakasam Park',
        category: 'park',
        address: 'Tirupati, Andhra Pradesh',
        lat: 13.6288,
        lng: 79.4192,
        opening_hours: '5AM-9PM',
        cost: '₹10',
        tips: ['Entry fee ₹10', 'Good for family outings'],
    },
    {
        name: 'Srinivasa Puram TUDA Park',
        category: 'park',
        address: 'Srinivasa Puram, Tirupati',
        lat: 13.6288,
        lng: 79.4192,
        opening_hours: '4AM-8:30PM',
        cost: 'Free',
        tips: ['Early morning best time', 'Free entry'],
    },
    // Nature Spots
    {
        name: 'Jungle Book Water Falls',
        category: 'nature',
        address: 'Tirupati, Andhra Pradesh',
        lat: 13.6288,
        lng: 79.4192,
        cost: 'Free',
        tips: ['Best visited during monsoon', 'Wear comfortable shoes'],
    },
    {
        name: 'Divyaramam Park',
        category: 'park',
        address: 'Tirupati, Andhra Pradesh',
        lat: 13.6288,
        lng: 79.4192,
        opening_hours: '9AM-3:20PM',
        cost: 'Free',
        tips: ['Peaceful environment', 'Good for meditation'],
    },
    // Plant Nurseries
    {
        name: 'Preethi Garden & Nursery',
        category: 'nursery',
        address: 'Tirupati, Andhra Pradesh',
        lat: 13.6288,
        lng: 79.4192,
        opening_hours: '7AM-6:30PM',
        tips: ['Wide variety of plants', 'Good prices'],
    },
    {
        name: 'Bala Brothers Nursery',
        category: 'nursery',
        address: 'Tirupati, Andhra Pradesh',
        lat: 13.6288,
        lng: 79.4192,
        tips: ['Best prices in town', 'Quality plants'],
    },
];

async function seedDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecosaathi');
        console.log('✅ Connected to MongoDB');

        // Get or create a default admin user for seeding
        let adminUser = await User.findOne({ phone: '9999999999' });
        if (!adminUser) {
            adminUser = await User.create({
                name: 'Admin',
                phone: '9999999999',
                password: 'admin123',
            });
            console.log('✅ Created admin user for seeding');
        }

        // Clear existing spots (optional - comment out if you want to keep existing)
        await Spot.deleteMany({});
        console.log('✅ Cleared existing spots');

        // Insert seed spots
        const spotsWithUser = seedSpots.map((spot) => ({
            ...spot,
            added_by: adminUser._id,
            verified_by: [adminUser._id], // Pre-verify seed spots
        }));

        await Spot.insertMany(spotsWithUser);
        console.log(`✅ Seeded ${seedSpots.length} spots`);

        console.log('🎉 Database seeding completed!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
