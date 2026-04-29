require('dotenv').config();
const mongoose = require('mongoose');
const Spot = require('../models/Spot');
const User = require('../models/User');

// Seed data - spots from Tirupati
// Note: You'll need to geocode addresses or extract lat/lng from Google Maps URLs
// For now, this includes place IDs from Google Maps URLs that can be used with Places API

const seedSpots = [
    // Nature Spots – Tirupati City
    {
        name: 'Jungle Book Water Falls',
        category: 'nature',
        address: 'Tirupati, Andhra Pradesh',
        lat: 13.653665,
        lng: 79.417866,
        cost: 'Free',
        tips: ['Best visited during monsoon', 'Wear comfortable shoes'],
    },
    {
        name: 'Divyaramam Park',
        category: 'park',
        address: 'Tirupati, Andhra Pradesh',
        lat: 13.651817,
        lng: 79.416278,
        opening_hours: '9AM–3:20PM',
        cost: 'Free',
        tips: ['Peaceful environment', 'Good for meditation'],
    },
    {
        name: 'Birds Park',
        category: 'nature',
        address: 'Tirupati, Andhra Pradesh',
        lat: 13.654802,
        lng: 79.418993,
        tips: ['Great for bird watching'],
    },
    {
        name: 'S.V. National Park & Safari',
        category: 'nature',
        address: 'Tirupati, Andhra Pradesh',
        lat: 13.6244461,
        lng: 79.3652134,
        tips: ['Safari timings vary, check before you go'],
    },
    {
        name: 'Srinivasa Puram TUDA Park',
        category: 'park',
        address: 'Srinivasa Puram, Tirupati',
        lat: 13.61558,
        lng: 79.430895,
        opening_hours: '4AM–8:30PM',
        cost: 'Free',
        tips: ['Early morning best time', 'Free entry'],
    },
    // Tirumala Hills
    {
        name: 'Silathoranam Garden',
        category: 'nature',
        address: 'Tirumala Hills, Andhra Pradesh',
        lat: 13.68732,
        lng: 79.340498,
    },
    {
        name: 'Green Valley View',
        category: 'nature',
        address: 'Tirumala Hills, Andhra Pradesh',
        lat: 13.670312,
        lng: 79.357092,
    },
    {
        name: 'Hill View Point – Srivari Mettu',
        category: 'nature',
        address: 'Tirumala Hills, Andhra Pradesh',
        lat: 13.670491,
        lng: 79.347067,
    },
    {
        name: 'Hills View Point – Alipiri',
        category: 'nature',
        address: 'Alipiri, Tirupati',
        lat: 13.646628,
        lng: 79.403877,
    },
    {
        name: 'Lord Balaji Flower Garden, Tirumala',
        category: 'nature',
        address: 'Tirumala, Andhra Pradesh',
        lat: 13.687433,
        lng: 79.349495,
    },
    {
        name: 'Geetopadesam Park, Tirumala',
        category: 'park',
        address: 'Tirumala, Andhra Pradesh',
        lat: 13.673642,
        lng: 79.350585,
        opening_hours: '5AM–9PM',
    },
    // Day Trips / Waterfalls
    {
        name: 'Tada Waterfalls (Ubbalamadugu)',
        category: 'nature',
        address: 'Ubbalamadugu, Andhra Pradesh',
        lat: 13.604154,
        lng: 79.84381,
        tips: ['Best Aug–Dec', 'Trek with proper shoes'],
    },
    {
        name: 'Ubbalamadugu Upper Falls',
        category: 'nature',
        address: 'Ubbalamadugu, Andhra Pradesh',
        lat: 13.61407,
        lng: 79.843271,
        cost: '₹50',
    },
    {
        name: 'Nagalapuram Aare 2nd Waterfall',
        category: 'nature',
        address: 'Nagalapuram, Andhra Pradesh',
        lat: 13.475533,
        lng: 79.776455,
        opening_hours: '8AM–3PM',
    },
    {
        name: 'Mamanduru Forest & Waterfalls',
        category: 'nature',
        address: 'Mamanduru, Andhra Pradesh',
        lat: 13.751763,
        lng: 79.46702,
        tips: ['Best Dec–Jan'],
    },
    {
        name: 'Talakona Waterfalls',
        category: 'nature',
        address: 'Talakona, Andhra Pradesh',
        lat: 13.811553,
        lng: 79.215878,
        cost: '₹30',
    },
    {
        name: 'Penchalakona Waterfalls',
        category: 'nature',
        address: 'Penchalakona, Andhra Pradesh',
        lat: 14.33036,
        lng: 79.404877,
        opening_hours: '7AM–4PM',
    },
    // Bird Sanctuaries & Forests
    {
        name: 'Pulicat Bird Sanctuary',
        category: 'nature',
        address: 'Pulicat, Andhra Pradesh',
        lat: 13.7242133,
        lng: 80.1234449,
        opening_hours: '8AM–5PM',
    },
    {
        name: 'Pulicat Lake View Point',
        category: 'nature',
        address: 'Pulicat, Andhra Pradesh',
        lat: 13.7175849,
        lng: 80.1028969,
        tips: ['Best 3–6PM'],
    },
    {
        name: 'Nelapattu Bird Sanctuary',
        category: 'nature',
        address: 'Nelapattu, Andhra Pradesh',
        lat: 13.825053,
        lng: 79.949571,
        cost: '₹50',
        tips: ['Best Jan–Feb'],
    },
    {
        name: 'Seshachalam Forests (Biosphere)',
        category: 'nature',
        address: 'Seshachalam, Andhra Pradesh',
        lat: 13.687694,
        lng: 79.288226,
        tips: ['UNESCO biosphere reserve'],
    },
    // Horsley Hills
    {
        name: 'Galibanda Viewpoint, Horsley Hills',
        category: 'nature',
        address: 'Horsley Hills, Andhra Pradesh',
        lat: 13.648546,
        lng: 78.396954,
    },
    {
        name: 'Gangotri Seasonal Lake, Horsley Hills',
        category: 'nature',
        address: 'Horsley Hills, Andhra Pradesh',
        lat: 13.646018,
        lng: 78.406437,
    },
    // Parks & Green Spaces
    {
        name: 'KVS Sports Park (Tummalagunta)',
        category: 'park',
        address: 'Tummalagunta, Tirupati',
        lat: 13.6078,
        lng: 79.388952,
        opening_hours: '5:30AM–8:30PM',
        cost: 'Free',
        tips: ['Great for morning walks', 'Well-maintained green space'],
    },
    {
        name: 'KVS Park (Tummalagunta)',
        category: 'park',
        address: 'Tummalagunta, Tirupati',
        lat: 13.608998,
        lng: 79.387843,
        cost: 'Free',
    },
    {
        name: 'Prakasam Park',
        category: 'park',
        address: 'Tirupati, Andhra Pradesh',
        lat: 13.646998,
        lng: 79.426103,
        opening_hours: '5AM–9PM',
        cost: '₹10',
        tips: ['Good for family outings'],
    },
    {
        name: 'Municipal Park',
        category: 'park',
        address: 'Tirupati, Andhra Pradesh',
        lat: 13.647333,
        lng: 79.426351,
        cost: '₹20',
    },
    {
        name: 'Sri Babu Jagjivanram Park',
        category: 'park',
        address: 'Tirupati, Andhra Pradesh',
        lat: 13.618441,
        lng: 79.425009,
        cost: '₹10',
        opening_hours: '5–9AM & 5–9PM',
    },
    {
        name: 'Rajanna Municipal Park',
        category: 'park',
        address: 'Tirupati, Andhra Pradesh',
        lat: 13.638704,
        lng: 79.415617,
        cost: 'Free',
        opening_hours: '3–7PM',
    },
    {
        name: 'Jungle Book & Park',
        category: 'park',
        address: 'Tirupati, Andhra Pradesh',
        lat: 13.655172,
        lng: 79.420525,
        opening_hours: '9AM–3PM',
        cost: 'Free',
    },
    // E-Waste & Composting
    {
        name: 'World Scrap Recycling Solutions',
        category: 'ewaste',
        address: 'Tirupati, Andhra Pradesh',
        lat: 13.631745,
        lng: 79.484461,
        opening_hours: 'Mon–Fri 8AM–6:30PM, Sat 9AM–5PM',
        cost: 'Free',
        tips: ['Call ahead before dropping e-waste', 'Accepts all electronic items'],
    },
    {
        name: 'Eco Finix Compost',
        category: 'composting',
        address: 'Tirupati, Andhra Pradesh',
        lat: 13.626286,
        lng: 79.487016,
        opening_hours: 'Daily 9AM–6PM',
        cost: 'Free',
        tips: ['Bring organic waste in biodegradable bags', 'Compost available for purchase'],
    },
    {
        name: 'Tirupati Municipal Corporation',
        category: 'ewaste',
        address: 'Tirupati, Andhra Pradesh',
        lat: 13.640402,
        lng: 79.409964,
        opening_hours: 'Mon–Sat 10AM–6PM',
        cost: 'Free',
        tips: ['Municipal e-waste collection point', 'Check timings before visit'],
    },
    // Bank E-Waste Bins
    {
        name: 'HDFC Bank – Air Bypass Road',
        category: 'ewaste',
        address: 'Air Bypass Road, Tirupati',
        lat: 13.622816,
        lng: 79.419447,
        cost: 'Free',
        tips: ['Call ahead to confirm', 'E-waste bin in lobby'],
    },
    {
        name: 'HDFC Bank – KT Road',
        category: 'ewaste',
        address: 'KT Road, Tirupati',
        lat: 13.644687,
        lng: 79.418845,
        cost: 'Free',
        tips: ['Call ahead to confirm', 'E-waste bin in lobby'],
    },
    {
        name: 'HDFC Bank – Renigunta Road',
        category: 'ewaste',
        address: 'Renigunta Road, Tirupati',
        lat: 13.629642,
        lng: 79.437767,
        cost: 'Free',
        tips: ['Call ahead to confirm', 'E-waste bin in lobby'],
    },
    {
        name: 'SBI – Tilak Road / KT Road',
        category: 'ewaste',
        address: 'Tilak Road, Tirupati',
        lat: 13.63698,
        lng: 79.418236,
        cost: 'Free',
        tips: ['Call ahead to confirm', 'E-waste bin in lobby'],
    },
    {
        name: 'SBI RBO 1 – S.V. Nagar',
        category: 'ewaste',
        address: 'S.V. Nagar, Tirupati',
        lat: 13.623564,
        lng: 79.4047,
        cost: 'Free',
        tips: ['Has e-corner'],
    },
    {
        name: 'SBI – Korlagunta',
        category: 'ewaste',
        address: 'Korlagunta, Tirupati',
        lat: 13.641908,
        lng: 79.42764,
        cost: 'Free',
        tips: ['Call ahead to confirm', 'E-waste bin in lobby'],
    },
    // Organic Stores
    {
        name: "Arya's Natural Farming Products",
        category: 'organic',
        address: 'Tirupati, Andhra Pradesh',
        lat: 13.616631,
        lng: 79.428573,
        opening_hours: '9AM–9:30PM',
        tips: ['Bring your own bag', 'Wide variety of organic produce'],
    },
    {
        name: 'Dharmika Healthy Foods',
        category: 'organic',
        address: 'Tirupati, Andhra Pradesh',
        lat: 13.618497,
        lng: 79.424305,
        opening_hours: '9AM–9PM',
        tips: ['Organic grains and pulses', 'Bulk purchase available'],
    },
    {
        name: 'Visishta Organics Shop',
        category: 'organic',
        address: 'KT Road, Tirupati',
        lat: 13.649929,
        lng: 79.419956,
        tips: ['KT Road location', 'Organic vegetables and fruits'],
    },
    {
        name: 'Sushena Organics',
        category: 'organic',
        address: 'Tirupati, Andhra Pradesh',
        lat: 13.64656,
        lng: 79.42449,
        tips: ['Also a homestay'],
    },
    // Plant Nurseries
    {
        name: 'Preethi Garden & Nursery',
        category: 'nursery',
        address: 'Tirupati, Andhra Pradesh',
        lat: 13.604984,
        lng: 79.412981,
        opening_hours: '7AM–6:30PM',
        tips: ['Wide variety of plants', 'Good prices'],
    },
    {
        name: 'Bala Brothers Nursery',
        category: 'nursery',
        address: 'Tirupati, Andhra Pradesh',
        lat: 13.603983,
        lng: 79.390368,
        tips: ['Best prices in town', 'Quality plants'],
    },
    {
        name: 'Sri Srinivasa Nursery & Gardens',
        category: 'nursery',
        address: 'Tirupati, Andhra Pradesh',
        lat: 13.613124,
        lng: 79.43783,
    },
    {
        name: 'Sri Vinayaka Nursery & Garden',
        category: 'nursery',
        address: 'Tirupati, Andhra Pradesh',
        lat: 13.650745,
        lng: 79.453657,
        tips: ['Ceramic & PVC pots'],
    },
    {
        name: 'Sri Tirumala Nursery',
        category: 'nursery',
        address: 'Tirupati, Andhra Pradesh',
        lat: 13.665136,
        lng: 79.495103,
    },
    // Zoo
    {
        name: 'Sri Venkateswara Zoological Park',
        category: 'nature',
        address: 'Tirupati, Andhra Pradesh',
        lat: 13.624852,
        lng: 79.364649,
        tips: ['Closed Tuesdays. 8:30AM–4:45PM'],
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
        // await Spot.deleteMany({});
        // console.log('✅ Cleared existing spots');

        // Insert seed spots
        const spotsWithUser = seedSpots.map((spot) => ({
            ...spot,
            added_by: adminUser._id,
            verified_by: [], // Allow users to verify
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
