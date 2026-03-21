export const TIPS = [
    // ── GENERAL TIPS (UNIVERSAL) ──
    { id: 'ro_bucket', icon: '🪣', text: 'Your RO filter wastes 3 litres for every litre purified. Put a bucket under the waste pipe and use that water for mopping or watering plants.', tags: ['above_benchmark', 'water_stress', 'general'] },
    { id: 'washing_machine_full', icon: '🫧', text: 'Running a washing machine half-full uses the same water as a full load. Fill it before running — that alone cuts laundry water by half.', tags: ['above_benchmark', 'general'] },
    { id: 'bucket_shower', icon: '🚿', text: 'A 5-minute shower uses 60-80 litres. A bucket bath uses 15-20 litres. Switching even 4 days a week saves ~200 litres a month.', tags: ['above_benchmark', 'water_stress'] },
    { id: 'tap_off_brushing', icon: '🦷', text: 'Leaving the tap on while brushing wastes 6 litres per minute. Turn it off — that is 180 litres saved per month per person.', tags: ['above_benchmark', 'water_stress', 'general'] },
    { id: 'plants_morning', icon: '🌿', text: 'Water plants in the morning or evening — watering at noon loses 30% to evaporation before it reaches the roots.', tags: ['general', 'water_stress'] },
    { id: 'vessel_washing', icon: '🍽️', text: 'Rinsing vessels under a running tap uses 10x more water than soaking them first. Soak for 2 minutes, then rinse quickly.', tags: ['above_benchmark', 'general'] },
    { id: 'below_streak', icon: '🏆', text: 'You are under the city benchmark — great discipline! Share your report to inspire your city mates.', tags: ['below_benchmark'] },
    { id: 'below_maintain', icon: '📊', text: 'You are using less than the city average. Keep tracking monthly — even small reductions add up to thousands of litres a year.', tags: ['below_benchmark'] },
    { id: 'check_leaks', icon: '🔧', text: 'A dripping tap wastes ~20 litres a day — 600 litres a month. Report leaky taps to the maintenance desk immediately.', tags: ['above_benchmark', 'water_stress', 'general'] },
    { id: 'grey_water', icon: '♻️', text: 'Water from washing vegetables or rinsing dal is perfectly safe for mopping or watering plants. Keep a small vessel nearby while cooking.', tags: ['general', 'water_stress'] },

    // ── TIRUPATI (Andhra Pradesh, Water-Critical) ──
    { id: 'tirupati_groundwater', icon: '⚠️', text: 'Tirupati\'s groundwater is 140-180m deep — one of India\'s deepest. Recharge is much slower than extraction. Every litre you save helps.', tags: ['above_benchmark', 'water_stress', 'tirupati'] },
    { id: 'tirupati_monsoon', icon: '☔', text: 'The monsoon (June-Sept) is when Tirupati recharges. Harvest rainwater on your hostel terrace during monsoon — many temples do this successfully.', tags: ['general', 'tirupati'] },
    { id: 'tirupati_temple_lakes', icon: '🕉️', text: 'Temple water bodies like Akasa Ganga are recharged by community care, not just rainfall. Respect these sources — don\'t waste water on landscaping.', tags: ['general', 'tirupati'] },
    { id: 'tirupati_irrigation', icon: '🌾', text: 'Check with hostel management: when are gardens watered? Early morning (5-6 AM) loses 40% less to evaporation than afternoon watering.', tags: ['above_benchmark', 'tirupati'] },
    { id: 'tirupati_summer_reality', icon: '🌞', text: 'Summer (March-May) is the hardest for Tirupati. Your monthly usage spike is expected, but reduce non-essentials: skip car washing, limit outdoor plants.', tags: ['above_benchmark', 'tirupati'] },

    // ── VIJAYAWADA (Andhra Pradesh, More Stable) ──
    { id: 'vijayawada_krishna', icon: '🌊', text: 'Vijayawada is fed by the Krishna river. While more stable than Tirupati, dams upstream affect your supply. Check Krishna Dam water levels online.', tags: ['general', 'vijayawada'] },
    { id: 'vijayawada_stormwater', icon: '🌧️', text: 'Monsoon (July-September) brings heavy rainfall. Set up collection tanks — even a 1000L tank on your hostel roof saves 30,000L annually.', tags: ['general', 'vijayawada'] },
    { id: 'vijayawada_lakes', icon: '🏞️', text: 'Vijayawada has several urban lakes. Water quality in these has improved. Respect them — they\'re natural buffers during dry season.', tags: ['general', 'vijayawada'] },
    { id: 'vijayawada_agriculture', icon: '🚜', text: 'Surrounding districts are agricultural. Water usage spikes during harvest months (Oct-Dec). Your hostel may have lower supply then — plan bathing times.', tags: ['above_benchmark', 'vijayawada'] },
    { id: 'vijayawada_cycle', icon: '🔄', text: 'Vijayawada has a more predictable water cycle than Tirupati. Track your monthly usage — you can spot seasonal patterns and plan conservation better.', tags: ['general', 'vijayawada'] },

    // ── VISAKHAPATNAM (Andhra Pradesh, Coastal) ──
    { id: 'visakhapatnam_coast', icon: '🌴', text: 'Visakhapatnam is coastal — your groundwater is a mix of freshwater & saline layers. Avoid deep borewell drilling; it draws up saltwater.', tags: ['general', 'visakhapatnam'] },
    { id: 'visakhapatnam_monsoon', icon: '💨', text: 'October-November monsoon is strong here. Install collection systems on hostel roofs — coastal monsoon brings reliable rainfall for 3 months.', tags: ['general', 'visakhapatnam'] },
    { id: 'visakhapatnam_recycling', icon: '♻️', text: 'Port city = industrial water recycling is common. Your tap water may contain recycled/treated water. This is safe but use it mindfully.', tags: ['general', 'visakhapatnam'] },
    { id: 'visakhapatnam_salt_intrusion', icon: '🧂', text: 'Sea-level proximity means salt intrusion risk. Report any salty tap water to authorities immediately — it signals groundwater contamination.', tags: ['general', 'visakhapatnam'] },
    { id: 'visakhapatnam_stable', icon: '✅', text: 'Visakhapatnam\'s supply is relatively stable year-round. If you\'re over benchmark, it\'s your usage that needs attention — not seasonal scarcity.', tags: ['above_benchmark', 'visakhapatnam'] },

    // ── KURNOOL (Andhra Pradesh, Water-Stressed) ──
    { id: 'kurnool_tungabhadra', icon: '⏳', text: 'Kurnool depends on the Tungabhadra river dam. When dam levels drop below 40%, water cuts are likely. Monitor Tungabhadra Dam levels online.', tags: ['water_stress', 'kurnool'] },
    { id: 'kurnool_semi_arid', icon: '🏜️', text: 'Kurnool is semi-arid — annual rainfall is only 500mm. You cannot rely on rainfall for water. Every drop from the tap is precious.', tags: ['above_benchmark', 'water_stress', 'kurnool'] },
    { id: 'kurnool_groundwater_deep', icon: '🔻', text: 'Groundwater is 180-250m deep here. Drilling new borewells is expensive & impacts aquifer. Use piped water, not private wells.', tags: ['water_stress', 'kurnool'] },
    { id: 'kurnool_community_wells', icon: '👥', text: 'Many villages around Kurnool rely on community wells. Your household tap water is likely diverted from these. Reduce, so they have enough.', tags: ['above_benchmark', 'water_stress', 'kurnool'] },
    { id: 'kurnool_drip_farming', icon: '💧', text: 'Kurnool has pioneered drip irrigation for farms. This uses 60% less water than flood irrigation. Support local drip-farming initiatives.', tags: ['general', 'kurnool'] },

    // ── CHENNAI (Tamil Nadu, Water-Critical) ──
    { id: 'chennai_crisis', icon: '🚨', text: 'Chennai faced severe water crisis (2019). Groundwater is now 80%+ saline at depths beyond 200m. Every litre you save helps the city recover.', tags: ['water_stress', 'above_benchmark', 'chennai'] },
    { id: 'chennai_monsoon_critical', icon: '☔', text: 'Northeast monsoon (Oct-Dec) is Chennai\'s lifeline. Reservoirs fill only during these months. If it\'s Nov-Dec, reduce usage — monsoon water is precious.', tags: ['general', 'chennai'] },
    { id: 'chennai_tanker_dependence', icon: '🚛', text: 'If taps run dry in your area, water tankers deliver. These consume fuel & money. Conserve so fewer tankers are needed.', tags: ['above_benchmark', 'water_stress', 'chennai'] },
    { id: 'chennai_desalination', icon: '🔬', text: 'Chennai is building desalination plants for coastal water. This is expensive & energy-intensive. Reduce usage so less desalination is needed.', tags: ['water_stress', 'chennai'] },
    { id: 'chennai_rain_harvesting', icon: '🌧️', text: 'Chennai gets 140cm rainfall in monsoon. Build a terrace tank — even collecting 50% of your roof\'s water saves 100L+ daily during rains.', tags: ['general', 'chennai'] },

    // ── HYDERABAD (Telangana, Relatively Stable) ──
    { id: 'hyderabad_osman_sagar', icon: '💧', text: 'Osman Sagar & Himayat Sagar fill during monsoon (July-October). Your supply is stable when these are full. Check their levels periodically.', tags: ['general', 'hyderabad'] },
    { id: 'hyderabad_musi_river', icon: '⚠️', text: 'The Musi river runs through Hyderabad but is polluted. Don\'t rely on it; stick to treated tap water which is cleaner.', tags: ['general', 'hyderabad'] },
    { id: 'hyderabad_tech_city', icon: '🏢', text: 'Hyderabad\'s IT boom has increased water demand. If you\'re over benchmark in T-Tech area, you\'re competing with office parks for supply.', tags: ['above_benchmark', 'hyderabad'] },
    { id: 'hyderabad_lake_preservation', icon: '🏞️', text: 'The 4-lake corridor project aims to restore urban lakes. Support this — restored lakes recharge groundwater & beautify the city.', tags: ['general', 'hyderabad'] },
    { id: 'hyderabad_monsoon_excess', icon: '☔', text: 'Monsoon (July-Oct): lakes fill rapidly. This is when groundwater recharges. Hostel gardens thrive without watering — use city\'s free monsoon gift.', tags: ['general', 'hyderabad'] },

    // ── BANGALORE (Karnataka, Water-Stressed) ──
    { id: 'bangalore_plateau', icon: '⛰️', text: 'Bangalore is at 900m elevation on the Deccan plateau. Groundwater recharge is slow here. Your one drop of water matters more than in coastal cities.', tags: ['water_stress', 'bangalore'] },
    { id: 'bangalore_cauvery_decline', icon: '📉', text: 'The Cauvery river — Bangalore\'s main source — is over-allocated between Karnataka & Tamil Nadu. Water disputes mean uncertain supply in May-June.', tags: ['water_stress', 'above_benchmark', 'bangalore'] },
    { id: 'bangalore_lakes_vanishing', icon: '🚫', text: 'Bangalore had 262 lakes in 1900 — now ~43 remain. Development & pollution destroyed them. Use water carefully so the remaining lakes survive.', tags: ['water_stress', 'bangalore'] },
    { id: 'bangalore_summer_cuts', icon: '🌞', text: 'April-May is peak summer. Bangalore often has water cuts. Hostel supply may drop 30-50%. Accumulate water in buckets during night-time supply.', tags: ['above_benchmark', 'bangalore'] },
    { id: 'bangalore_groundwater_depleting', icon: '📊', text: 'Bangalore\'s groundwater table drops ~3-5 ft annually. At this rate, borewells will dry up in 10 years if usage doesn\'t drop. Your reduction matters.', tags: ['water_stress', 'bangalore'] },

    // ── MUMBAI (Maharashtra, Better Supplied) ──
    { id: 'mumbai_dams', icon: '🏗️', text: 'Mumbai is supplied by 7 major dams: Tansa, Vaitarna, Tulsi, etc. Check their levels weekly — they dictate your water cuts. High levels = stable supply.', tags: ['general', 'mumbai'] },
    { id: 'mumbai_monsoon_timing', icon: '☔', text: 'Monsoon (June-Sept) is when dams fill. If it\'s monsoon month, water may be abundant. If it\'s March-May, supply might tighten. Plan accordingly.', tags: ['general', 'mumbai'] },
    { id: 'mumbai_industrial_demand', icon: '🏭', text: 'Mumbai has massive industrial water demand (refineries, mills). Hostel students compete with industry. Every litre you save balances supply.', tags: ['above_benchmark', 'mumbai'] },
    { id: 'mumbai_coastal_recycling', icon: '♻️', text: 'Mumbai recycles wastewater. Your used water becomes irrigation water for parks. Reduce usage so cleaner recycled water is available.', tags: ['general', 'mumbai'] },
    { id: 'mumbai_monsoon_floods', icon: '🌊', text: 'Mumbai floods in monsoon. While dams fill, surface flooding wastes water. Support city drainage improvements — wasted rain is wasted potential.', tags: ['general', 'mumbai'] },

    // ── DELHI (National Capital, Well-Supplied) ──
    { id: 'delhi_yamuna', icon: '🌊', text: 'Delhi relies on the Yamuna river (& transfers from other states). Yamuna is heavily polluted upstream. Your tap water is treated extensively.', tags: ['general', 'delhi'] },
    { id: 'delhi_recycled_water', icon: '♻️', text: 'Delhi recycles 60% of wastewater — the highest in India. Your tap water may contain recycled water. This is safe but precious — use mindfully.', tags: ['general', 'delhi'] },
    { id: 'delhi_pollution_alert', icon: '⚠️', text: 'Yamuna\'s pollution levels spike in Nov-Feb (post-monsoon thermal layer). Water treatment costs rise. Reduce usage during high-pollution months.', tags: ['above_benchmark', 'delhi'] },
    { id: 'delhi_inter_state_politics', icon: '⚡', text: 'Delhi gets water from Rajasthan, Himachal, & Punjab. Interstate water disputes mean supply can change unexpectedly. Build buffer storage (water drums) at hostel.', tags: ['above_benchmark', 'delhi'] },
    { id: 'delhi_winter_quality', icon: '❄️', text: 'Winter (Nov-Feb): water quality improves (cooler = more stable). Summer (May-June): supply can run tight. Hostel maintenance likely reduces supply then.', tags: ['general', 'delhi'] },

    // ── PUNE (Maharashtra, Semi-Arid) ──
    { id: 'pune_bhima', icon: '🏞️', text: 'Pune depends on the Bhima river (& Mutha tributary). Bhima levels drop 50% by May. Your daily usage compounds this — reduce in March-May.', tags: ['water_stress', 'above_benchmark', 'pune'] },
    { id: 'pune_agricultural_demand', icon: '🌾', text: 'Pune region is heavily agricultural (sugarcane!!!). Farms use 70% of water. If you\'re over benchmark, it\'s partly due to farm runoff affecting supply.', tags: ['above_benchmark', 'pune'] },
    { id: 'pune_monsoon_concentrated', icon: '☔', text: 'Pune gets most rainfall in July-August (concentrated 2 months). Build rooftop collection systems NOW for monsoon. 2-3 month buffer is critical.', tags: ['general', 'pune'] },
    { id: 'pune_water_quality', icon: '🧪', text: 'Agro-industrial runoff (pesticides, fertilizer) affects Bhima. Your tap water is treated but isn\'t pure — RO filters are necessary but wasteful.', tags: ['water_stress', 'pune'] },
    { id: 'pune_groundwater_moderate', icon: '📊', text: 'Pune\'s groundwater is more available than Bangalore but less than North India. If you\'re above benchmark, focus on non-negotiable uses only.', tags: ['above_benchmark', 'pune'] },
];

export function pickTips(status, isWaterStressed, cityLabel = null) {
    // Determine primary tag based on water usage status
    const primaryTag = status === 'over' ? 'above_benchmark' : 'below_benchmark';
    
    // Normalize city label to lowercase & remove spaces for tag matching
    const cityTag = cityLabel ? cityLabel.toLowerCase() : null;
    
    // Priority 1: City-specific tips (if city is provided & has matching tips)
    const cityTips = cityTag ? TIPS.filter(t => t.tags.includes(cityTag)) : [];
    
    // Priority 2: Status-based tips (above/below benchmark)
    const statusTips = TIPS.filter(t => t.tags.includes(primaryTag) && !t.tags.includes('tirupati') && !t.tags.includes('vijayawada') && !t.tags.includes('visakhapatnam') && !t.tags.includes('kurnool') && !t.tags.includes('chennai') && !t.tags.includes('hyderabad') && !t.tags.includes('bangalore') && !t.tags.includes('mumbai') && !t.tags.includes('delhi') && !t.tags.includes('pune'));
    
    // Priority 3: Water stress tips (if applicable)
    const stressTips = isWaterStressed ? TIPS.filter(t => t.tags.includes('water_stress')) : [];
    
    // Priority 4: General tips
    const generalTips = TIPS.filter(t => t.tags.includes('general'));
    
    // Build selection pool: prefer city tips, then status-based, then stress/general
    const seen = new Set();
    const result = [];
    
    // Add city tips first
    for (const tip of cityTips) {
        if (!seen.has(tip.id) && result.length < 3) {
            seen.add(tip.id);
            result.push(tip);
        }
    }
    
    // If we need more, add status-based tips
    if (result.length < 3) {
        for (const tip of statusTips) {
            if (!seen.has(tip.id) && result.length < 3) {
                seen.add(tip.id);
                result.push(tip);
            }
        }
    }
    
    // If still need more, add stress or general tips
    if (result.length < 3) {
        const remaining = isWaterStressed ? [...stressTips, ...generalTips] : [...generalTips, ...stressTips];
        for (const tip of remaining) {
            if (!seen.has(tip.id) && result.length < 3) {
                seen.add(tip.id);
                result.push(tip);
            }
        }
    }
    
    return result.length > 0 ? result : TIPS.slice(0, 3); // Fallback to first 3 tips if nothing matched
}
