// Green Spot mock data — seed pins for IIT Tirupati campus area

import type { SpotListResponse } from './greenspot.types';

export const MOCK_SPOTS: SpotListResponse = {
    spots: [
        {
            _id: 'spot-001',
            name: 'IIT Tirupati E-Waste Drop Point',
            category: 'ewaste',
            lat: 13.7105,
            lng: 79.5983,
            address: 'Admin Block, IIT Tirupati, Yerpedu',
            tips: ['Bring old chargers and batteries', 'Open Mon–Fri 9 AM–5 PM'],
            photos: [],
            verified_by: [],
            added_by: 'mock-user-001',
            createdAt: new Date().toISOString(),
        },
        {
            _id: 'spot-002',
            name: 'Tirupati Water Refill Station',
            category: 'refill',
            lat: 13.6288,
            lng: 79.4192,
            address: 'Railway Station Rd, Tirupati',
            tips: ['Bring your own bottle', 'Free for students'],
            photos: [],
            verified_by: [],
            added_by: 'mock-user-001',
            createdAt: new Date().toISOString(),
        },
        {
            _id: 'spot-003',
            name: 'Rythubazar Organic Market',
            category: 'organic',
            lat: 13.6353,
            lng: 79.4145,
            address: 'Rythubazar, Tirupati',
            tips: ['Open daily 6 AM–1 PM', 'Best prices on weekdays'],
            photos: [],
            verified_by: [],
            added_by: 'mock-user-001',
            createdAt: new Date().toISOString(),
        },
    ],
};
