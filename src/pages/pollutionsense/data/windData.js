export const TIRUPATI_WINDS = {
    winter: {        // Oct - Feb
        months: [10, 11, 12, 1, 2],
        direction: "NE",
        degrees: 45,
        label: "NE winds (Oct-Feb)"
    },
    summer: {        // Mar - May
        months: [3, 4, 5],
        direction: "SW",
        degrees: 225,
        label: "SW winds (Mar-May)"
    },
    monsoon: {       // Jun - Sep
        months: [6, 7, 8, 9],
        direction: "SE",
        degrees: 135,
        label: "SE winds (Jun-Sep)"
    }
};

export function getCurrentSeason() {
    const month = new Date().getMonth() + 1;
    const seasons = Object.values(TIRUPATI_WINDS);
    const foundSeason = Object.keys(TIRUPATI_WINDS).find((key) => {
        const seasonObj = TIRUPATI_WINDS[key];
        return seasonObj.months.includes(month);
    });

    if (foundSeason) {
        return { id: foundSeason, ...TIRUPATI_WINDS[foundSeason] };
    }

    // Default fallback if logic errors out
    return { id: 'summer', ...TIRUPATI_WINDS['summer'] };
}
