export const TIRUPATI_INDUSTRIES = [
    {
        name: "Sri Venkateswara Cooperative Sugar Factory",
        type: "sugar_factory",
        lat: 13.6892,
        lng: 79.5023,
        riskLevel: "medium",
        pollutants: ["PM10", "odour"],
        buffer_km: 1.5
    },
    {
        name: "Renigunta Industrial Area",
        type: "industrial_estate",
        lat: 13.6478,
        lng: 79.5134,
        riskLevel: "high",
        pollutants: ["PM2.5", "VOCs", "NOx"],
        buffer_km: 2
    },
    {
        name: "Tirupati Municipal Solid Waste Plant",
        type: "waste_facility",
        lat: 13.5878,
        lng: 79.3934,
        riskLevel: "medium",
        pollutants: ["CH4", "H2S", "PM10"],
        buffer_km: 1.5
    },
    {
        name: "Renigunta Airport",
        type: "airport",
        lat: 13.6329,
        lng: 79.5430,
        riskLevel: "medium",
        pollutants: ["NOx", "noise", "PM2.5"],
        buffer_km: 2
    }
];
