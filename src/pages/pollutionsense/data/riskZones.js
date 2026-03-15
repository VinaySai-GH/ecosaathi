export const TIRUPATI_RISK_ZONES = [
    {
        name: "Flood Risk Zone - Swarnamukhi Basin",
        type: "flood",
        coordinates: [
            [13.6100, 79.4200],
            [13.6200, 79.4350],
            [13.6050, 79.4400],
            [13.5950, 79.4250]
        ],
        severity: "high",
        description: "Low-lying area near Swarnamukhi river. Historical flooding during NE monsoon."
    },
    {
        name: "Temple Crowd/Noise Zone - Tirumala Road",
        type: "noise_crowd",
        center: [13.6534, 79.4023],
        radius_km: 1.2,
        severity: "medium",
        description: "High crowd density, loudspeaker noise, heavy pilgrimage traffic daily 4am-11pm."
    },
    {
        name: "Construction Dust Zone - AIIMS Tirupati",
        type: "construction",
        center: [13.6089, 79.4156],
        radius_km: 0.8,
        severity: "medium",
        description: "Active large-scale construction. High PM10 dust. Expected completion 2026."
    },
    {
        name: "Industrial Corridor - Renigunta",
        type: "industrial_corridor",
        coordinates: [
            [13.6300, 79.4900],
            [13.6600, 79.5100],
            [13.6700, 79.5300],
            [13.6400, 79.5200]
        ],
        severity: "high",
        description: "Dense industrial activity. Multiple small factories. Poor air quality reported by residents."
    }
];
