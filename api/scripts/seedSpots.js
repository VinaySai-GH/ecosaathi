const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const Spot = require('../models/Spot');
const User = require('../models/User');

const vijayawadaSpots = [
    { name: 'Bhavani Island', category: 'nature', address: 'Krishna River, Punnami Ghat, Vijayawada', lat: 16.5062, lng: 80.6120, city: 'Vijayawada', tips: ['Largest river island in AP'] },
    { name: 'Rajiv Gandhi Park', category: 'park', address: 'Krishnalanka, Vijayawada', lat: 16.5081, lng: 80.6198, city: 'Vijayawada', tips: ['Riverside green lung'] },
    { name: 'Kondapalli Reserve Forest', category: 'nature', address: 'Kondapalli Hills', lat: 16.6167, lng: 80.5333, city: 'Vijayawada', tips: ['Dense mixed-deciduous forest'] },
    { name: 'Mangalagiri Hills', category: 'nature', address: 'Mangalagiri', lat: 16.43, lng: 80.5580, city: 'Vijayawada' },
    { name: 'Undavalli Caves', category: 'nature', address: 'Undavalli', lat: 16.5151, lng: 80.6002, city: 'Vijayawada' },
    { name: 'Prakasam Barrage & Riverside', category: 'park', address: 'Vijayawada', lat: 16.5069, lng: 80.5962, city: 'Vijayawada' },
    { name: 'Gandhi Hill', category: 'park', address: 'Vijayawada', lat: 16.5097, lng: 80.636, city: 'Vijayawada' },
    { name: 'Mogalarajapuram Caves Park', category: 'park', address: 'Vijayawada', lat: 16.5064, lng: 80.6544, city: 'Vijayawada' },
    { name: 'Raghavaiah Park', category: 'park', address: 'Bandar Canal, Vijayawada', lat: 16.5085, lng: 80.6412, city: 'Vijayawada' },
    { name: 'Prakasam Park', category: 'park', address: 'Besant Rd, Vijayawada', lat: 16.5068, lng: 80.6427, city: 'Vijayawada' },
    { name: 'Andhra Ratna Municipal Park', category: 'park', address: 'Vijayawada', lat: 16.5182, lng: 80.6094, city: 'Vijayawada' },
    { name: 'KL Rao Park', category: 'park', address: 'Vijayawada', lat: 16.5005, lng: 80.6421, city: 'Vijayawada' },
    { name: 'Alluri Sitaramaraju Park', category: 'park', address: 'Bandar Canal, Vijayawada', lat: 16.5059, lng: 80.6395, city: 'Vijayawada' },
    { name: 'Veterinary Colony Park', category: 'park', address: 'Vijayawada', lat: 16.4983, lng: 80.6259, city: 'Vijayawada' },
    { name: 'Scrap Metal Sculpture Park', category: 'park', address: 'Auto Nagar, Vijayawada', lat: 16.4844, lng: 80.6698, city: 'Vijayawada' },
    { name: 'Kolleru Lake Bird Sanctuary', category: 'nature', address: 'Eluru District', lat: 16.6592, lng: 81.2222, city: 'Vijayawada' },
    { name: 'Kondapalli Fort Hilltop', category: 'nature', address: 'Kondapalli', lat: 16.6199, lng: 80.5356, city: 'Vijayawada' },
    { name: 'Akkana Madanna Caves', category: 'park', address: 'Vijayawada', lat: 16.5051, lng: 80.6109, city: 'Vijayawada' },
    { name: 'Indrakeeladri Hilltop Walk', category: 'nature', address: 'Vijayawada', lat: 16.5084, lng: 80.6008, city: 'Vijayawada' },
    { name: 'Punnami Ghat Riverside Walk', category: 'park', address: 'Vijayawada', lat: 16.506, lng: 80.6135, city: 'Vijayawada' },
    { name: 'Atapaka Bird Sanctuary', category: 'nature', address: 'Atapaka', lat: 16.7108, lng: 81.2027, city: 'Vijayawada' },
    { name: 'Alapadu Freshwater Wetland', category: 'nature', address: 'Krishna District', lat: 16.7783, lng: 80.9005, city: 'Vijayawada' },
    { name: 'Dharanikota Ancient Stupa Zone', category: 'park', address: 'Amaravati', lat: 16.5731, lng: 80.3579, city: 'Vijayawada' },
    { name: 'Amaravati Stupa & Museum', category: 'park', address: 'Amaravati', lat: 16.5744, lng: 80.3571, city: 'Vijayawada' },
    { name: 'Dhyana Buddha Park', category: 'park', address: 'Amaravati', lat: 16.5715, lng: 80.3632, city: 'Vijayawada' },
    { name: 'Undavalli Ghat Nature Walk', category: 'park', address: 'Guntur District', lat: 16.5145, lng: 80.5989, city: 'Vijayawada' },
    { name: 'Pedda Avutapalli Wetland', category: 'nature', address: 'NTR District', lat: 16.6833, lng: 80.8167, city: 'Vijayawada' },
    { name: 'Mallavalli Mango Orchards', category: 'nature', address: 'Krishna District', lat: 16.5521, lng: 80.9674, city: 'Vijayawada' },
    { name: 'Kondapalli Hills View Point', category: 'park', address: 'Kondapalli', lat: 16.6138, lng: 80.5298, city: 'Vijayawada' },
    { name: 'Bandar Canal Biodiversity Strip', category: 'park', address: 'Vijayawada', lat: 16.5041, lng: 80.6473, city: 'Vijayawada' },
    { name: 'Krishna Barrage Walkway', category: 'park', address: 'Vijayawada', lat: 16.5072, lng: 80.5969, city: 'Vijayawada' },
    { name: 'Devarkonda Hillocks', category: 'nature', address: 'Guntur District', lat: 16.3912, lng: 80.4957, city: 'Vijayawada' },
    { name: 'Kanaka Durga Temple Forest Belt', category: 'nature', address: 'Vijayawada', lat: 16.5091, lng: 80.6004, city: 'Vijayawada' },
    { name: 'Amaravati Riverine Plains', category: 'nature', address: 'Amaravati', lat: 16.5794, lng: 80.3698, city: 'Vijayawada' },
    { name: 'Thotlavalluru Wetlands', category: 'nature', address: 'Krishna District', lat: 16.5538, lng: 80.8444, city: 'Vijayawada' },
    { name: 'Chandarlapadu Reservoir Edge', category: 'nature', address: 'NTR District', lat: 16.7675, lng: 80.3091, city: 'Vijayawada' },
    { name: 'Mylavaram Forest Fringes', category: 'nature', address: 'Krishna District', lat: 16.7681, lng: 80.6065, city: 'Vijayawada' },
    { name: 'Nunna Village Tank', category: 'nature', address: 'Krishna District', lat: 16.6502, lng: 80.6841, city: 'Vijayawada' },
    { name: 'Tadepalli Krishna Riverbank', category: 'park', address: 'Guntur District', lat: 16.4849, lng: 80.6057, city: 'Vijayawada' },
    { name: 'Velagaleru Wet Fields', category: 'nature', address: 'Krishna District', lat: 16.6034, lng: 80.7592, city: 'Vijayawada' },
    { name: 'Ramalingeswara Nagar Park', category: 'park', address: 'Vijayawada', lat: 16.4937, lng: 80.6415, city: 'Vijayawada' },
    { name: 'Patamata Lake Edge', category: 'park', address: 'Vijayawada', lat: 16.5048, lng: 80.6674, city: 'Vijayawada' },
    { name: 'Gollapudi Green Belt', category: 'park', address: 'Vijayawada', lat: 16.5163, lng: 80.7148, city: 'Vijayawada' },
    { name: 'Undavalli Quarry Green Patch', category: 'park', address: 'Guntur District', lat: 16.5169, lng: 80.5944, city: 'Vijayawada' },
    { name: 'Krishna River Island Sandbars', category: 'nature', address: 'Vijayawada', lat: 16.509, lng: 80.605, city: 'Vijayawada' },
    { name: 'Pedavutapalli Coconut Groves', category: 'nature', address: 'Krishna District', lat: 16.6902, lng: 80.7791, city: 'Vijayawada' },
    { name: 'Penumaka Wetlands', category: 'nature', address: 'Guntur District', lat: 16.4828, lng: 80.5961, city: 'Vijayawada' },
    { name: 'Katrapadu Open Scrub Land', category: 'nature', address: 'Krishna District', lat: 16.6025, lng: 80.7228, city: 'Vijayawada' },
    { name: 'Mylavaram Reservoir', category: 'nature', address: 'Mylavaram', lat: 16.7885, lng: 80.6421, city: 'Vijayawada' },
    { name: 'Uppalapadu Bird Sanctuary', category: 'nature', address: 'Guntur District', lat: 16.2902, lng: 80.3874, city: 'Vijayawada' },
    { name: 'Krishna Wildlife Sanctuary', category: 'nature', address: 'Diviseema', lat: 16.2589, lng: 81.1253, city: 'Vijayawada' },
    { name: 'Amaravati Eco Tourism Circuit', category: 'park', address: 'Guntur District', lat: 16.565, lng: 80.371, city: 'Vijayawada' }
];

const tirupatiSpots = [
    { name: 'Jungle Book Water Falls', category: 'nature', address: 'Tirupati', city: 'Tirupati', lat: 13.653665, lng: 79.417866, tips: ['Best visited during monsoon'] },
    { name: 'Divyaramam Park', category: 'park', address: 'Tirupati', city: 'Tirupati', lat: 13.651817, lng: 79.416278 },
    { name: 'Birds Park', category: 'nature', address: 'Tirupati', city: 'Tirupati', lat: 13.654802, lng: 79.418993 },
    { name: 'S.V. National Park & Safari', category: 'nature', address: 'Tirupati', city: 'Tirupati', lat: 13.6244461, lng: 79.3652134 },
    { name: 'Srinivasa Puram TUDA Park', category: 'park', address: 'Tirupati', city: 'Tirupati', lat: 13.61558, lng: 79.430895 },
    { name: 'Silathoranam Garden', category: 'nature', address: 'Tirumala Hills', city: 'Tirupati', lat: 13.68732, lng: 79.340498 },
    { name: 'Green Valley View', category: 'nature', address: 'Tirumala Hills', city: 'Tirupati', lat: 13.670312, lng: 79.357092 },
    { name: 'Hill View Point – Srivari Mettu', category: 'nature', address: 'Tirumala Hills', city: 'Tirupati', lat: 13.670491, lng: 79.347067 },
    { name: 'Hill View Point – Alipiri', category: 'nature', address: 'Tirupati', city: 'Tirupati', lat: 13.646628, lng: 79.403877 },
    { name: 'Lord Balaji Flower Garden', category: 'nature', address: 'Tirumala', city: 'Tirupati', lat: 13.687433, lng: 79.349495 },
    { name: 'Geetopadesam Park', category: 'park', address: 'Tirumala', city: 'Tirupati', lat: 13.673642, lng: 79.350585 },
    { name: 'Tada Waterfalls', category: 'nature', address: 'Ubbalamadugu', city: 'Tirupati', lat: 13.604154, lng: 79.84381 },
    { name: 'Ubbalamadugu Upper Falls', category: 'nature', address: 'Ubbalamadugu', city: 'Tirupati', lat: 13.61407, lng: 79.843271 },
    { name: 'Nagalapuram Aare 2nd Waterfall', category: 'nature', address: 'Nagalapuram', city: 'Tirupati', lat: 13.475533, lng: 79.776455 },
    { name: 'Mamanduru Forest & Waterfalls', category: 'nature', address: 'Mamanduru', city: 'Tirupati', lat: 13.751763, lng: 79.46702 },
    { name: 'Talakona Waterfalls', category: 'nature', address: 'Talakona', city: 'Tirupati', lat: 13.811553, lng: 79.215878 },
    { name: 'Penchalakona Waterfalls', category: 'nature', address: 'Penchalakona', city: 'Tirupati', lat: 14.33036, lng: 79.404877 },
    { name: 'Pulicat Bird Sanctuary', category: 'nature', address: 'Pulicat', city: 'Tirupati', lat: 13.7242133, lng: 80.1234449 },
    { name: 'Pulicat Lake View Point', category: 'nature', address: 'Pulicat', city: 'Tirupati', lat: 13.7175849, lng: 80.1028969 },
    { name: 'Nelapattu Bird Sanctuary', category: 'nature', address: 'Nelapattu', city: 'Tirupati', lat: 13.825053, lng: 79.949571 },
    { name: 'Seshachalam Forests', category: 'nature', address: 'Seshachalam', city: 'Tirupati', lat: 13.687694, lng: 79.288226 },
    { name: 'Galibanda Viewpoint', category: 'nature', address: 'Horsley Hills', city: 'Tirupati', lat: 13.648546, lng: 78.396954 },
    { name: 'Gangotri Seasonal Lake', category: 'nature', address: 'Horsley Hills', city: 'Tirupati', lat: 13.646018, lng: 78.406437 },
    { name: 'KVS Sports Park', category: 'park', address: 'Tummalagunta', city: 'Tirupati', lat: 13.6078, lng: 79.388952 },
    { name: 'Prakasam Park', category: 'park', address: 'Tirupati', city: 'Tirupati', lat: 13.646998, lng: 79.426103 },
    { name: 'Municipal Park', category: 'park', address: 'Tirupati', city: 'Tirupati', lat: 13.647333, lng: 79.426351 },
    { name: 'Sri Babu Jagjivanram Park', category: 'park', address: 'Tirupati', city: 'Tirupati', lat: 13.618441, lng: 79.425009 },
    { name: 'World Scrap Recycling Solutions', category: 'ewaste', address: 'Tirupati', city: 'Tirupati', lat: 13.631745, lng: 79.484461 },
    { name: 'Eco Finix Compost', category: 'composting', address: 'Tirupati', city: 'Tirupati', lat: 13.626286, lng: 79.487016 },
    { name: 'HDFC Bank – Air Bypass Road', category: 'ewaste', address: 'Tirupati', city: 'Tirupati', lat: 13.622816, lng: 79.419447 },
    { name: 'HDFC Bank – KT Road', category: 'ewaste', address: 'Tirupati', city: 'Tirupati', lat: 13.644687, lng: 79.418845 },
    { name: 'SBI – Tilak Road', category: 'ewaste', address: 'Tirupati', city: 'Tirupati', lat: 13.63698, lng: 79.418236 },
    { name: 'Arya\'s Natural Farming Products', category: 'organic', address: 'Tirupati', city: 'Tirupati', lat: 13.616631, lng: 79.428573 },
    { name: 'Dharmika Healthy Foods', category: 'organic', address: 'Tirupati', city: 'Tirupati', lat: 13.618497, lng: 79.424305 },
    { name: 'Visishta Organics Shop', category: 'organic', address: 'Tirupati', city: 'Tirupati', lat: 13.649929, lng: 79.419956 },
    { name: 'Sushena Organics', category: 'organic', address: 'Tirupati', city: 'Tirupati', lat: 13.64656, lng: 79.42449 },
    { name: 'Preethi Garden & Nursery', category: 'nursery', address: 'Tirupati', city: 'Tirupati', lat: 13.604984, lng: 79.412981 },
    { name: 'Bala Brothers Nursery', category: 'nursery', address: 'Tirupati', city: 'Tirupati', lat: 13.603983, lng: 79.390368 },
    { name: 'Sri Srinivasa Nursery', category: 'nursery', address: 'Tirupati', city: 'Tirupati', lat: 13.613124, lng: 79.43783 },
    { name: 'Sri Vinayaka Nursery', category: 'nursery', address: 'Tirupati', city: 'Tirupati', lat: 13.650745, lng: 79.453657 },
    { name: 'Sri Tirumala Nursery', category: 'nursery', address: 'Tirupati', city: 'Tirupati', lat: 13.665136, lng: 79.495103 },
    { name: 'Sri Venkateswara Zoological Park', category: 'nature', address: 'Tirupati', city: 'Tirupati', lat: 13.624852, lng: 79.364649 }
];

async function seed() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected!');

        console.log('🗑️ Wiping Spots database...');
        await Spot.deleteMany({});

        const adminUser = await User.findOne({});
        const adminId = adminUser ? adminUser._id : null;

        const allSpots = [...vijayawadaSpots, ...tirupatiSpots];

        console.log(`🌱 Seeding ${allSpots.length} spots (53 Vijayawada + 42 Tirupati)...`);
        await Spot.insertMany(allSpots.map(s => ({ ...s, added_by: adminId })));

        console.log('✅ COMPLETE SUCCESS! All original spots from both cities are restored!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
}

seed();
