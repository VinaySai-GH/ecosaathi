// All 6 EcoLearn modules with India-specific content
// Correct quiz answer indices match QUIZ_ANSWERS in ecolearn.controller.js

export const MODULES = [
  {
    id: 'air-quality',
    title: 'Air Quality',
    icon: '📘',
    color: '#3b82f6',
    description: 'AQI, PM2.5, health effects, and India\'s air pollution crisis',
    pointsReward: 30,
    lessons: [
      {
        id: 'air-1',
        title: 'Understanding the Air Quality Index',
        content: [
          {
            type: 'paragraph',
            text: 'The Air Quality Index (AQI) is a number used by governments worldwide to communicate how polluted the air currently is. In India, the Central Pollution Control Board (CPCB) follows the National AQI, which runs from 0 to 500. The higher the AQI, the greater the level of air pollution and the greater the health concern.'
          },
          {
            type: 'callout',
            label: '📊 India AQI Scale',
            text: '0–50 Good | 51–100 Satisfactory | 101–200 Moderate | 201–300 Poor | 301–400 Very Poor | 401–500 Severe'
          },
          {
            type: 'paragraph',
            text: 'AQI is calculated using 8 pollutants: PM10, PM2.5, NO₂, SO₂, CO, O₃, NH₃, and Pb. The highest individual pollutant value becomes the final AQI score. This "worst case" method ensures the reported number always reflects the most dangerous condition present.'
          },
          {
            type: 'fact',
            text: 'In 2023, Delhi recorded AQI above 400 ("Severe") on 26 days during the post-monsoon season — primarily due to stubble burning in Punjab and Haryana combined with low wind speeds.'
          },
          {
            type: 'paragraph',
            text: 'Cities like Tirupati typically see AQI between 60–120, classified as Satisfactory to Moderate. However, episodes of high PM10 linked to construction dust and vehicular emissions push it higher, especially during dry months (November–February).'
          }
        ]
      },
      {
        id: 'air-2',
        title: 'PM2.5 and PM10 — The Invisible Killers',
        content: [
          {
            type: 'paragraph',
            text: 'Particulate Matter (PM) refers to a mixture of solid particles and liquid droplets suspended in the air. PM10 refers to particles with a diameter of 10 micrometres or less. PM2.5 refers to particles 2.5 micrometres or less — roughly 30 times smaller than a human hair.'
          },
          {
            type: 'callout',
            label: '🫁 Why Size Matters',
            text: 'PM10 gets trapped in the nose and throat. PM2.5 penetrates deep into lung tissue and enters the bloodstream, causing heart disease, stroke, and lung cancer.'
          },
          {
            type: 'paragraph',
            text: 'India\'s National Ambient Air Quality Standards (NAAQS) set an annual PM2.5 limit of 40 µg/m³. The WHO recommends just 5 µg/m³. Seventeen of the world\'s twenty most polluted cities in 2023 were in India, based on PM2.5 annual averages (IQAir World Air Quality Report, 2023).'
          },
          {
            type: 'fact',
            text: 'Long-term exposure to PM2.5 at India\'s average levels reduces life expectancy by 5.3 years, according to the Air Quality Life Index from the University of Chicago.'
          },
          {
            type: 'paragraph',
            text: 'Major sources of PM2.5 in Indian cities include vehicular exhaust (especially older diesel engines), construction dust, industrial emissions, crop burning, and domestic burning of biomass for cooking. Two-wheelers alone contribute nearly 40% of vehicular PM2.5 emissions in some cities.'
          }
        ]
      },
      {
        id: 'air-3',
        title: 'Health Effects and What You Can Do',
        content: [
          {
            type: 'paragraph',
            text: 'Air pollution is the largest environmental health risk in India. According to the Global Burden of Disease Study 2019, outdoor PM2.5 pollution was associated with 980,000 premature deaths in India in a single year, making it the second-largest risk factor for mortality after malnutrition.'
          },
          {
            type: 'callout',
            label: '⚠️ Vulnerable Groups',
            text: 'Children under 5, elderly above 65, pregnant women, and people with pre-existing asthma or heart disease face the highest risk from air pollution.'
          },
          {
            type: 'paragraph',
            text: 'Short-term effects include eye irritation, coughing, aggravated asthma, and reduced lung function. Long-term effects include chronic obstructive pulmonary disease (COPD), reduced cognitive development in children, and increased risk of cardiovascular events.'
          },
          {
            type: 'fact',
            text: 'Wearing any mask is better than none. N95 respirators filter 95% of PM2.5. Surgical masks filter about 60–80%. Cloth masks filter 10–40% depending on fabric.'
          },
          {
            type: 'paragraph',
            text: 'Practical steps you can take: check AQI daily via the Sameer app (CPCB\'s official app), avoid outdoor exercise when AQI > 200, use public transport or cycle instead of driving, avoid burning waste or leaves, improve indoor air quality with houseplants like spider plants and peace lilies.'
          }
        ]
      }
    ],
    quiz: [
      {
        id: 'aq-q1',
        question: 'On India\'s National AQI scale, what range is classified as "Very Poor"?',
        options: ['201–300', '301–350', '301–400', '401–500'],
        correctIndex: 2,
        explanation: 'India\'s CPCB AQI uses 301–400 for "Very Poor" and 401–500 for "Severe". Both categories require people to avoid outdoor activity.'
      },
      {
        id: 'aq-q2',
        question: 'PM2.5 is dangerous primarily because it:',
        options: ['Is visible to the naked eye', 'Penetrates deep into lungs and enters the bloodstream', 'Only affects outdoor workers', 'Can be completely blocked by cloth masks'],
        correctIndex: 1,
        explanation: 'PM2.5 particles are tiny enough to bypass the respiratory tract\'s natural filters, entering the alveoli and even the bloodstream — causing systemic health effects including heart disease.'
      },
      {
        id: 'aq-q3',
        question: 'What percentage of premature deaths in India in 2019 were associated with PM2.5 according to the Global Burden of Disease study?',
        options: ['Roughly 1 million', 'Less than 100,000', 'Exactly 500,000', 'Over 2 million'],
        correctIndex: 0,
        explanation: 'The GBD 2019 study attributed approximately 980,000 premature deaths in India annually to outdoor PM2.5 pollution — close to 1 million.'
      },
      {
        id: 'aq-q4',
        question: 'Which official Indian government app lets you check real-time AQI?',
        options: ['AQI India', 'SAFAR', 'Sameer', 'AirWatch'],
        correctIndex: 2,
        explanation: 'Sameer is the official CPCB app for real-time AQI monitoring across Indian cities. SAFAR is a separate system run by MoES focused on weather + AQI in metro cities.'
      },
      {
        id: 'aq-q5',
        question: 'What is the WHO\'s recommended annual PM2.5 limit (µg/m³)?',
        options: ['40', '25', '10', '5'],
        correctIndex: 3,
        explanation: 'The WHO 2021 Air Quality Guidelines recommend PM2.5 annual mean ≤ 5 µg/m³. India\'s national standard is 40 µg/m³ — 8× higher than WHO guidance.'
      }
    ]
  },

  {
    id: 'carbon-footprint',
    title: 'Carbon Footprint',
    icon: '🌱',
    color: '#22c55e',
    description: 'Emissions, daily choices, and India\'s climate commitments',
    pointsReward: 30,
    lessons: [
      {
        id: 'cf-1',
        title: 'What Is a Carbon Footprint?',
        content: [
          {
            type: 'paragraph',
            text: 'A carbon footprint is the total amount of greenhouse gases (GHGs) — expressed as CO₂ equivalent — released into the atmosphere as a direct or indirect result of human activities. The major GHGs are carbon dioxide (CO₂), methane (CH₄), and nitrous oxide (N₂O). Methane is 21× more potent than CO₂ over 100 years.'
          },
          {
            type: 'callout',
            label: '🌍 India at a Glance',
            text: 'India is the world\'s third-largest emitter of CO₂ (after China and the USA), contributing about 7% of global emissions. But per capita, India emits only 1.9 tonnes CO₂e/year — far below the global average of 4.7 tonnes and the US figure of 14.4 tonnes.'
          },
          {
            type: 'paragraph',
            text: 'The biggest contributors to India\'s national emissions are electricity generation (coal-based power plants, ~40%), agriculture (~14%), industry (~22%), and transport (~9%). At the household level, the mix shifts: food choices, electricity use, and transport dominate individual footprints.'
          },
          {
            type: 'fact',
            text: 'India\'s electricity grid has an emission factor of approximately 0.82 kg CO₂/kWh. Charging your phone uses ~0.01 kWh — that\'s just 8g CO₂. Running a 1-ton AC for 8 hours emits roughly 6.5 kg CO₂.'
          }
        ]
      },
      {
        id: 'cf-2',
        title: 'Food, Transport & Home Energy',
        content: [
          {
            type: 'paragraph',
            text: 'Food accounts for 20–35% of the average Indian urban household\'s carbon footprint. Producing 1 kg of beef emits about 60 kg CO₂e. 1 kg of rice emits 2.7 kg CO₂e (methane from flooded paddy fields). 1 kg of vegetables emits just 0.4 kg CO₂e. India\'s predominantly vegetarian diet makes it one of the lowest per-capita food emission footprints globally.'
          },
          {
            type: 'callout',
            label: '🚗 Transport Comparisons',
            text: 'Car (petrol): 192g CO₂/km | Bus: 89g CO₂/km | Train: 41g CO₂/km | Bicycle: 0g CO₂/km | Flight (domestic): ~255g CO₂/km'
          },
          {
            type: 'paragraph',
            text: 'A single domestic flight from Tirupati to Delhi (≈1,250 km) produces about 318 kg CO₂e per passenger — roughly 5 months of cycling. Switching from a daily car commute of 10 km to a bus saves approximately 370 kg CO₂e per year.'
          },
          {
            type: 'fact',
            text: 'India\'s railways are the fourth largest in the world by routes yet produce only 41g CO₂ per passenger-km — making it one of the greenest mass-transit systems globally. Indian Railways has committed to net-zero by 2030.'
          }
        ]
      },
      {
        id: 'cf-3',
        title: 'India\'s Climate Commitments and Your Role',
        content: [
          {
            type: 'paragraph',
            text: 'Under the Paris Agreement, India submitted its Nationally Determined Contributions (NDCs). Key commitments include: reducing emissions intensity of GDP by 45% by 2030 (from 2005 levels), achieving 50% of cumulative electric power capacity from non-fossil sources by 2030, and creating an additional carbon sink of 2.5–3 billion tonnes through forests and trees by 2030.'
          },
          {
            type: 'callout',
            label: '☀️ India\'s Renewable Push',
            text: 'India\'s installed renewable energy capacity crossed 200 GW in 2024, making it the 4th largest globally. Solar capacity grew from 2.6 GW in 2014 to over 85 GW in 2024 — a 32× increase in a decade.'
          },
          {
            type: 'paragraph',
            text: 'Individual action matters too. The three highest-impact personal changes are: eating less meat and dairy (especially avoiding beef), cutting air travel, and reducing private car use. For Indian college students specifically, switching to e-vehicles or cycles, minimising AC usage, and reducing food waste are the most effective steps.'
          },
          {
            type: 'fact',
            text: 'Food waste in India generates 68 million tonnes of CO₂-equivalent annually (FAO). Roughly one-third of all food produced is wasted before reaching the consumer.'
          }
        ]
      }
    ],
    quiz: [
      {
        id: 'cf-q1',
        question: 'What is India\'s approximate per-capita CO₂ emission per year?',
        options: ['4.7 tonnes', '1.9 tonnes', '8.2 tonnes', '14.4 tonnes'],
        correctIndex: 1,
        explanation: 'India\'s per-capita emissions are roughly 1.9 tonnes CO₂e/year — well below the global average of 4.7 tonnes. The USA emits 14.4 tonnes per person.'
      },
      {
        id: 'cf-q2',
        question: 'Which food item has the highest carbon footprint per kilogram?',
        options: ['Rice', 'Beef', 'Vegetables', 'Chicken'],
        correctIndex: 1,
        explanation: 'Beef produces approximately 60 kg CO₂e per kg — far higher than rice (2.7 kg), chicken (6.9 kg), or vegetables (0.4 kg).'
      },
      {
        id: 'cf-q3',
        question: 'India\'s NDC target is to achieve what percentage of electric power capacity from non-fossil sources by 2030?',
        options: ['30%', '40%', '50%', '60%'],
        correctIndex: 2,
        explanation: 'India\'s updated NDC commits to achieving 50% cumulative electric power capacity from non-fossil sources by 2030.'
      },
      {
        id: 'cf-q4',
        question: 'Which transport mode emits the least CO₂ per passenger-km in India?',
        options: ['Electric car', 'Train', 'Bus', 'Bicycle'],
        correctIndex: 3,
        explanation: 'Bicycles produce 0g CO₂ in operation. Trains emit ~41g CO₂/km, buses ~89g/km. Even electric cars have embedded emissions from electricity generation.'
      },
      {
        id: 'cf-q5',
        question: 'India\'s electricity grid emission factor is approximately:',
        options: ['0.82 kg CO₂/kWh', '0.20 kg CO₂/kWh', '1.5 kg CO₂/kWh', '0.50 kg CO₂/kWh'],
        correctIndex: 0,
        explanation: 'India\'s grid emission factor is approximately 0.82 kg CO₂/kWh, reflecting the heavy reliance on coal-based thermal power plants, though this is decreasing as renewables grow.'
      }
    ]
  },

  {
    id: 'waste-management',
    title: 'Waste Management',
    icon: '♻️',
    color: '#f97316',
    description: 'Segregation, recycling, and India\'s waste challenge',
    pointsReward: 30,
    lessons: [
      {
        id: 'wm-1',
        title: 'India\'s Waste Crisis — The Numbers',
        content: [
          {
            type: 'paragraph',
            text: 'India generates approximately 62 million tonnes of municipal solid waste (MSW) annually, of which only 23% is processed or treated. The rest ends up in open dumpsites or is burned — releasing toxic dioxins and furans into the air. India has over 3,000 open dumpsites, most of which are overflowing.'
          },
          {
            type: 'callout',
            label: '📦 What\'s in Your Trash?',
            text: 'Indian MSW composition: Organic/food waste ~50% | Plastic ~9% | Paper ~6% | Metal ~4% | Glass ~2% | Others ~29%'
          },
          {
            type: 'paragraph',
            text: 'India produces about 9.4 million tonnes of plastic waste per year. Rivers carry much of this to the ocean — India is among the world\'s top 10 ocean plastic polluters. The Ganga alone carries 3 billion pieces of plastic per day into the Bay of Bengal according to the Central Water Commission.'
          },
          {
            type: 'fact',
            text: 'Andhra Pradesh generates approximately 3,300 tonnes of MSW per day. Tirupati city generates around 350 tonnes per day, of which roughly 60% is organic waste suitable for composting.'
          }
        ]
      },
      {
        id: 'wm-2',
        title: 'Segregation — The First and Most Important Step',
        content: [
          {
            type: 'paragraph',
            text: 'The Solid Waste Management Rules 2016 mandate source segregation into three bins: Green (wet/biodegradable), Blue (dry/recyclable), and Black (sanitary/domestic hazardous). Segregation at source is critical because once different waste types mix, recycling becomes economically unviable and contamination reduces compost quality.'
          },
          {
            type: 'callout',
            label: '🟢🔵⚫ Three-Bin System',
            text: 'Green: food scraps, vegetable peels, garden waste | Blue: paper, cardboard, metal, glass, clean plastic | Black: sanitary napkins, diapers, medicine strips, broken crockery'
          },
          {
            type: 'paragraph',
            text: 'At IIT Tirupati, organic waste from the mess and hostels can be converted to biogas or compost using anaerobic digesters or composting pits. Just 1 tonne of organic waste produces 100–300 kg of compost, which can replace chemical fertilisers in campus gardens and reduce CO₂ emissions from trucking waste to distant landfills.'
          },
          {
            type: 'fact',
            text: 'Recycling one aluminium can saves enough energy to run a 100W light bulb for nearly 4 hours. India only recycles about 40% of its aluminium packaging. Collecting cans and selling them to scrap dealers generates real income for ragpickers.'
          }
        ]
      },
      {
        id: 'wm-3',
        title: 'E-Waste and Plastic — Special Concerns',
        content: [
          {
            type: 'paragraph',
            text: 'India is the third-largest generator of e-waste in the world, producing about 3.23 million tonnes per year (MoEFCC, 2023). E-waste includes old phones, computers, batteries, chargers, and appliances. These contain toxic substances like lead, cadmium, and mercury — and also valuable recoverable materials like gold, silver, and palladium.'
          },
          {
            type: 'callout',
            label: '⚠️ Never do this with e-waste',
            text: 'Never throw phones, batteries or chargers in regular bins. Never give to unorganised scrap dealers who use acid-burning or open burning to extract metals — this releases toxic fumes.'
          },
          {
            type: 'paragraph',
            text: 'Under the E-Waste Management Rules 2022, producers (brands) are legally required to take back their products at end of life through Extended Producer Responsibility (EPR). Look for brand take-back schemes — Samsung, Apple, HP and most major brands have programmes in India. Tirupati has two authorised e-waste dismantlers registered with the AP Pollution Control Board.'
          },
          {
            type: 'fact',
            text: 'India banned single-use plastics (SUPs) below certain thickness in July 2022. The list includes straws, plates, cutlery, and candy sticks. Violations carry fines of ₹500 to ₹1 lakh depending on the state.'
          }
        ]
      }
    ],
    quiz: [
      {
        id: 'wm-q1',
        question: 'Which colour bin is for dry recyclable waste (paper, plastic, metal) under the SWM Rules 2016?',
        options: ['Blue', 'Green', 'Black', 'Yellow'],
        correctIndex: 0,
        explanation: 'The SWM Rules 2016 specify: Green for wet/biodegradable waste, Blue for dry recyclables (paper, cardboard, metal, glass, plastic), and Black for domestic hazardous waste.'
      },
      {
        id: 'wm-q2',
        question: 'What percentage of India\'s 62 million tonnes of MSW is actually processed?',
        options: ['55%', '40%', '23%', '70%'],
        correctIndex: 2,
        explanation: 'Only about 23% of India\'s municipal solid waste is processed or treated. The rest goes to open dumpsites, is burned, or ends up in water bodies.'
      },
      {
        id: 'wm-q3',
        question: 'India ranks ___ globally in e-waste generation.',
        options: ['5th', '1st', '3rd', '2nd'],
        correctIndex: 2,
        explanation: 'India is the third-largest generator of e-waste globally, producing about 3.23 million tonnes per year (MoEFCC 2023).'
      },
      {
        id: 'wm-q4',
        question: 'When was India\'s nationwide ban on certain single-use plastics implemented?',
        options: ['January 2022', 'July 2022', 'January 2020', 'July 2020'],
        correctIndex: 1,
        explanation: 'India\'s ban on specified single-use plastics came into effect on July 1, 2022. This included items like ear buds with plastic sticks, plastic straws, plates, cups, and cutlery.'
      },
      {
        id: 'wm-q5',
        question: 'What is the approximate daily MSW generation of Tirupati city?',
        options: ['100 tonnes', '350 tonnes', '1,000 tonnes', '50 tonnes'],
        correctIndex: 1,
        explanation: 'Tirupati city generates approximately 350 tonnes per day. Andhra Pradesh as a whole generates about 3,300 tonnes per day.'
      }
    ]
  },

  {
    id: 'water-conservation',
    title: 'Water Conservation',
    icon: '💧',
    color: '#06b6d4',
    description: 'India\'s water crisis, usage patterns, and conservation strategies',
    pointsReward: 30,
    lessons: [
      {
        id: 'wc-1',
        title: 'India\'s Water Crisis',
        content: [
          {
            type: 'paragraph',
            text: 'India is home to 18% of the world\'s population but has only 4% of its fresh water. The country faces a severe water stress challenge — the NITI Aayog Water Index (2021) found that 40% of India\'s population will have no access to drinking water by 2030 if current trends continue. 21 major cities — including Delhi, Bangalore, and Chennai — could run out of groundwater.'
          },
          {
            type: 'callout',
            label: '💡 Tirupati Water Context',
            text: 'Tirupati depends primarily on the Swarnamukhi River and Kalyani Dam. During 2017–2019, severe drought reduced water supply by 40%, with tanker water selling at ₹500–800 per load in residential areas.'
          },
          {
            type: 'paragraph',
            text: 'Agriculture consumes about 78% of India\'s freshwater through irrigation. Industry uses 12%, and domestic use accounts for the remaining 10%. Inefficient flood irrigation in paddy and sugarcane fields wastes enormous quantities — drip and sprinkler irrigation can cut agricultural water use by 30–50%.'
          },
          {
            type: 'fact',
            text: 'The CGWB (Central Ground Water Board) reports that India extracts 253 billion cubic metres of groundwater annually — the highest in the world — more than China and the USA combined.'
          }
        ]
      },
      {
        id: 'wc-2',
        title: 'How Much Water Do You Actually Use?',
        content: [
          {
            type: 'paragraph',
            text: 'The average Indian urban resident uses 135 litres per capita per day (LPCD) — the Bureau of Indian Standards minimum for Class-1 cities. However, surveys show actual household consumption in Andhra Pradesh cities averages 80–100 LPCD, much of which is non-essential use: long showers, lawn watering, and car washing.'
          },
          {
            type: 'callout',
            label: '🚿 Water Use Breakdown',
            text: 'Toilet flushing: 30–35L | Bathing/shower: 20–30L | Clothes washing: 15–20L | Cooking & drinking: 10–15L | Cleaning/other: 10–20L'
          },
          {
            type: 'paragraph',
            text: 'The "hidden" water in products is called virtual water or water footprint. Producing 1 kg of rice requires 2,500 litres. A cotton T-shirt requires 2,700 litres. A beef burger requires 2,400 litres. Being conscious of food choices is one of the highest-leverage water conservation actions.'
          },
          {
            type: 'fact',
            text: 'A dripping tap wastes up to 20 litres per day. A running tap during brushing wastes 6 litres per minute. Switching to a bucket bath instead of a shower saves 60–100 litres per person per day.'
          }
        ]
      },
      {
        id: 'wc-3',
        title: 'Rainwater Harvesting and Water Policy',
        content: [
          {
            type: 'paragraph',
            text: 'Rainwater Harvesting (RWH) is the collection and storage of rain from rooftops or land surfaces to recharge groundwater or store for later use. Andhra Pradesh makes RWH mandatory for all new buildings above 300 sq. m in urban areas. IIT Tirupati\'s campus, located in the rain-shadow region of Andhra Pradesh, receives roughly 600–700 mm of annual rainfall, most of which falls between October and December during the northeast monsoon.'
          },
          {
            type: 'callout',
            label: '🌧️ How RWH Works',
            text: 'Collection: rooftop catchment area × rainfall depth | Storage: sump, tank, or recharge well | Typical yield: 1,000 sq.m roof × 600mm rainfall = 6,00,000 litres per year'
          },
          {
            type: 'paragraph',
            text: 'The Jal Jeevan Mission (2019) aims to provide tap water connections to all 191 million rural households by 2024, with a budget of ₹3.6 lakh crore. By December 2023, over 140 million connections had been made. The mission emphasises greywater management and locally maintained village-level water treatment.'
          },
          {
            type: 'fact',
            text: 'India\'s traditional water conservation structures — stepwells (vav), tanks (eri), and check dams — can recharge groundwater by 10–25% in their watershed areas. Rajasthan\'s johad system helped bring back the Arvari river after it had run dry for decades.'
          }
        ]
      }
    ],
    quiz: [
      {
        id: 'wc-q1',
        question: 'What percentage of India\'s freshwater is used by agriculture?',
        options: ['50%', '65%', '78%', '90%'],
        correctIndex: 2,
        explanation: 'Agriculture consumes approximately 78% of India\'s freshwater, primarily for irrigation of paddy, sugarcane, and wheat fields.'
      },
      {
        id: 'wc-q2',
        question: 'How much water does India extract from groundwater annually, compared to other nations?',
        options: ['Second highest globally', 'Highest globally — more than China and USA combined', 'Third highest globally', 'Same as China'],
        correctIndex: 1,
        explanation: 'India extracts 253 billion cubic metres of groundwater annually — the highest in the world, and more than China and the USA combined (CGWB data).'
      },
      {
        id: 'wc-q3',
        question: 'Which government scheme aims to provide piped drinking water to all Indian rural households?',
        options: ['Jal Shakti Abhiyan', 'AMRUT', 'Jal Jeevan Mission', 'National Water Mission'],
        correctIndex: 2,
        explanation: 'The Jal Jeevan Mission (launched 2019) targets functional household tap connections to all ~191 million rural households with a budget of ₹3.6 lakh crore.'
      },
      {
        id: 'wc-q4',
        question: 'Producing 1 kg of rice requires approximately how many litres of water?',
        options: ['500L', '1,000L', '1,800L', '2,500L'],
        correctIndex: 3,
        explanation: 'Producing 1 kg of rice requires approximately 2,500 litres of water — this is called the "water footprint" or "virtual water" embedded in agriculture.'
      },
      {
        id: 'wc-q5',
        question: 'A standard Indian Class-1 city minimum water supply as per BIS standards is:',
        options: ['90 LPCD', '135 LPCD', '200 LPCD', '70 LPCD'],
        correctIndex: 1,
        explanation: 'The Bureau of Indian Standards (BIS IS:1172) recommends 135 litres per capita per day (LPCD) as the minimum water supply standard for Class-1 cities in India.'
      }
    ]
  },

  {
    id: 'biodiversity',
    title: 'Biodiversity',
    icon: '🦋',
    color: '#a855f7',
    description: 'Ecosystems, endangered species, and India\'s biodiversity heritage',
    pointsReward: 30,
    lessons: [
      {
        id: 'bio-1',
        title: 'India\'s Biodiversity Wealth',
        content: [
          {
            type: 'paragraph',
            text: 'India is one of the world\'s 17 mega-diverse countries, representing only 2.4% of the world\'s land area but hosting about 7–8% of all recorded species globally. This includes over 45,500 plant species, 91,000 animal species, 1,200 bird species, and 390 mammal species. India has four globally recognised biodiversity hotspots: the Himalayas, Western Ghats, the Indo-Burma region, and Sundaland (Nicobar Islands).'
          },
          {
            type: 'callout',
            label: '🌿 Andhra Pradesh Biodiversity',
            text: 'AP is home to 13 wildlife sanctuaries and 3 national parks. The Eastern Ghats — running through Tirupati\'s district (Chittoor) — host over 3,000 plant species, hundreds of endemic orchids, and the critically endangered Jerdon\'s Courser bird.'
          },
          {
            type: 'paragraph',
            text: 'A species is considered "endemic" when it is found nowhere else on earth. The Western Ghats have over 5,000 endemic species — making it one of the richest and most threatened biodiversity hotspots globally. The forests of the Eastern Ghats near Tirupati-Seshachalam Hills shelter tigers, leopards, sloth bears, and rare medicinal plants used in Ayurvedic practice for centuries.'
          },
          {
            type: 'fact',
            text: 'The Seshachalam Biosphere Reserve, just 30 km from IIT Tirupati, is a UNESCO-proposed biosphere reserve covering 4,755 sq. km of shola forests, scrub, and dry thorny forests — one of the only habitats of the red sanders tree.'
          }
        ]
      },
      {
        id: 'bio-2',
        title: 'Threats and Endangered Species',
        content: [
          {
            type: 'paragraph',
            text: 'The IUCN Red List (2023) classifies species into: Least Concern, Near Threatened, Vulnerable, Endangered, Critically Endangered, Extinct in Wild, and Extinct. As of 2023, over 44,000 species globally are threatened with extinction, the highest number ever recorded. India has 70 critically endangered animal species and 62 critically endangered plant species.'
          },
          {
            type: 'callout',
            label: '🐯 India\'s Flagship Conservation Wins',
            text: 'Project Tiger (1973): Tiger population grew from 1,827 (2002) to 3,167 (2022). Project Elephant: Over 30,000 Asian elephants in India. Project Snow Leopard: ~700 individuals in Himalayas.'
          },
          {
            type: 'paragraph',
            text: 'The primary threats to India\'s biodiversity are: habitat loss (deforestation, agricultural expansion, urbanisation), overexploitation (poaching, overfishing), invasive species (Lantana camara, Prosopis juliflora, and parthenium weed have invaded millions of hectares), and climate change (coral bleaching in Lakshadweep, shifts in migratory bird routes).'
          },
          {
            type: 'fact',
            text: 'The Red Sanders tree (Pterocarpus santalinus), found exclusively in the Seshachalam Hills near Tirupati, is listed as Endangered on the IUCN Red List. Its wood is worth ₹30,000–50,000 per kg on international black markets, making it a target for organised smuggling syndicates.'
          }
        ]
      },
      {
        id: 'bio-3',
        title: 'Why Biodiversity Matters to You',
        content: [
          {
            type: 'paragraph',
            text: 'Biodiversity provides ecosystem services worth an estimated $125 trillion per year globally — including pollination (70% of global food crops depend on bees and other pollinators), water purification (wetlands filter pollutants), climate regulation (forests absorb CO₂), and medicine (25% of modern drugs are derived from rainforest plants).'
          },
          {
            type: 'callout',
            label: '🐝 Pollinator Crisis',
            text: 'India\'s bee populations have declined by 25–35% over the past two decades due to pesticide use and habitat loss. Without pollinators, India\'s ₹2 lakh crore horticulture industry is at risk.'
          },
          {
            type: 'paragraph',
            text: 'India\'s Biological Diversity Act 2002 requires any entity accessing Indian biodiversity for commercial purposes to share benefits with local communities. The law also mandates Biodiversity Management Committees (BMCs) in every local body to maintain "People\'s Biodiversity Registers" documenting local flora, fauna, and traditional knowledge.'
          },
          {
            type: 'fact',
            text: 'A single large tree in an urban area provides ecosystem services worth ₹15,000–₹75,000 per year (energy savings through shade, air filtering, stormwater absorption) — yet we often remove trees for construction worth far less per square metre.'
          }
        ]
      }
    ],
    quiz: [
      {
        id: 'bio-q1',
        question: 'India hosts approximately what percentage of all recorded species despite covering only 2.4% of global land?',
        options: ['2–3%', '7–8%', '12–15%', '1–2%'],
        correctIndex: 1,
        explanation: 'India hosts approximately 7–8% of all recorded species globally despite covering only 2.4% of the world\'s land area, making it one of 17 "mega-diverse" countries.'
      },
      {
        id: 'bio-q2',
        question: 'Which of these is NOT one of India\'s four recognised Biodiversity Hotspots?',
        options: ['Western Ghats', 'Himalayas', 'Thar Desert', 'Indo-Burma region'],
        correctIndex: 2,
        explanation: 'The Thar Desert is NOT a biodiversity hotspot. India\'s four hotspots are the Himalayas, Western Ghats, Indo-Burma region, and Sundaland (Nicobar Islands).'
      },
      {
        id: 'bio-q3',
        question: 'According to the 2022 tiger census, India\'s tiger population is approximately:',
        options: ['1,200', '3,167', '500', '5,000'],
        correctIndex: 1,
        explanation: 'India\'s 2022 Tiger Census recorded 3,167 tigers — up from 1,827 in 2002, representing one of conservation\'s greatest success stories globally.'
      },
      {
        id: 'bio-q4',
        question: 'Which tree, found exclusively near Tirupati\'s Seshachalam Hills, is classified as Endangered by IUCN?',
        options: ['Red Sanders (Pterocarpus santalinus)', 'Sandalwood', 'Teak', 'Neem'],
        correctIndex: 0,
        explanation: 'Red Sanders (Pterocarpus santalinus) is classified as Endangered on the IUCN Red List. It grows exclusively in the Seshachalam Hills and is illegally smuggled for its extremely valuable wood.'
      },
      {
        id: 'bio-q5',
        question: 'What Indian law requires Biodiversity Management Committees in each local government body?',
        options: ['Wildlife Protection Act 1972', 'Forest Conservation Act 1980', 'Biological Diversity Act 2002', 'National Biodiversity Policy 2014'],
        correctIndex: 2,
        explanation: 'The Biological Diversity Act 2002 mandates Biodiversity Management Committees (BMCs) at the local body level and requires the maintenance of People\'s Biodiversity Registers.'
      }
    ]
  },

  {
    id: 'climate-change',
    title: 'Climate Change',
    icon: '🌡️',
    color: '#ef4444',
    description: 'India-specific impacts, extreme events, and adaptation strategies',
    pointsReward: 30,
    lessons: [
      {
        id: 'cc-1',
        title: 'Climate Science and India\'s Vulnerability',
        content: [
          {
            type: 'paragraph',
            text: 'Climate change refers to long-term shifts in global temperatures and weather patterns, primarily driven since the 1850s by human activities that release greenhouse gases. The Earth\'s average surface temperature has risen by approximately 1.1°C since the pre-industrial era. India is among the world\'s most climate-vulnerable nations due to its dependence on monsoon rainfall, long coastlines, and large agricultural economy.'
          },
          {
            type: 'callout',
            label: '🌡️ India Temperature Trend',
            text: 'India has warmed 0.7°C since 1901 (IMD Climate Report 2020). The rate of warming has accelerated — the 2010s were the warmest decade on record for India. 2023 was India\'s second-warmest year in recorded history.'
          },
          {
            type: 'paragraph',
            text: 'The Indian Ocean is warming faster than the global average — by about 1°C over the past century. This is intensifying cyclones (higher wind speeds, more rainfall) and disrupting the Indian Ocean Dipole, which regulates monsoon rainfall patterns. The 2021 IPCC report concluded it is "virtually certain" that the Indian Ocean will continue warming throughout the 21st century regardless of emissions reductions.'
          },
          {
            type: 'fact',
            text: 'The 2023 El Niño caused below-normal monsoon rainfall in southern India, including Andhra Pradesh, triggering drought conditions in Chittoor, Kurnool, and Anantapuramu districts. Tirupati received 38% below-normal rainfall in August 2023.'
          }
        ]
      },
      {
        id: 'cc-2',
        title: 'Extreme Events — What\'s Changing',
        content: [
          {
            type: 'paragraph',
            text: 'Climate change is amplifying the frequency and intensity of extreme weather events in India. Cyclones: The Bay of Bengal now sees more Very Severe Cyclonic Storms per decade — 8 in the 2010s vs. 3 in the 1990s. Flood-drought swings: Southern India is experiencing sharper transitions from drought to flood, as when Andhra Pradesh had a severe drought in August 2023 followed by record flooding in December 2023 from Cyclone Michaung.'
          },
          {
            type: 'callout',
            label: '🌊 Coastal Risk for Andhra Pradesh',
            text: 'AP has India\'s second-longest coastline at 974 km. Sea level rise of 3–4mm/year in the Bay of Bengal threatens 40 of AP\'s 175 coastal mandals. Cities like Kakinada and Machilipatnam face severe inundation risk by 2050.'
          },
          {
            type: 'paragraph',
            text: 'Glacier retreat in the Himalayas threatens the long-term water security of rivers like the Ganga and Brahmaputra, which 500 million Indians depend on. The Gangotri Glacier, source of the Ganga, retreated 22 metres in 2022 alone. While glacier melt initially increases river flow, the long-term prospect as glaciers disappear is dramatic seasonal water scarcity.'
          },
          {
            type: 'fact',
            text: 'India\'s economic losses from climate-related disasters averaged $87 billion per year in 2018–2022 (Aon Global Risk Report 2023) — equivalent to roughly 3% of GDP annually, and this figure is rising every year.'
          }
        ]
      },
      {
        id: 'cc-3',
        title: 'Adaptation and What Students Can Do',
        content: [
          {
            type: 'paragraph',
            text: 'Climate adaptation means adjusting to the current and future effects of climate change. India\'s National Action Plan on Climate Change (NAPCC, 2008) includes 8 national missions: Solar Mission, Enhanced Energy Efficiency, Sustainable Habitat, Water Mission, Sustaining the Himalayan Ecosystem, Green India, Sustainable Agriculture, and Strategic Knowledge for Climate Change.'
          },
          {
            type: 'callout',
            label: '🧑‍🎓 What You Can Do at College',
            text: 'Reduce electricity use (especially AC) | Use reusable bottles and bags | Plant trees in campus green drives | Walk or cycle instead of cabs | Eat less meat on mess days | Minimise single-use plastic'
          },
          {
            type: 'paragraph',
            text: 'India\'s Climate Action targets under the Paris Agreement are among the more ambitious of major economies relative to historical emissions. India is on track to exceed its 2030 renewable energy targets, with solar capacity growing exponentially. Young engineers and technologists from institutions like IIT Tirupati will play a critical role in developing clean energy solutions, climate-smart agriculture, and resilient urban infrastructure.'
          },
          {
            type: 'fact',
            text: 'A study by McKinsey (2022) estimated that India will need ₹300 lakh crore ($3.5 trillion) in investment by 2030 to put itself on a net-zero pathway. This represents a massive career opportunity for students in clean energy, sustainable infrastructure, and climate finance.'
          }
        ]
      }
    ],
    quiz: [
      {
        id: 'cc-q1',
        question: 'By how much has Earth\'s average surface temperature risen since the pre-industrial era?',
        options: ['0.5°C', '0.8°C', '1.1°C', '2.0°C'],
        correctIndex: 2,
        explanation: 'Earth\'s average surface temperature has risen approximately 1.1°C since the pre-industrial era (1850–1900), according to the IPCC Sixth Assessment Report (2021).'
      },
      {
        id: 'cc-q2',
        question: 'Which of these is NOT one of India\'s 8 National Missions under the NAPCC?',
        options: ['Solar Mission', 'Green India Mission', 'Clean Ganga Mission', 'Sustainable Habitat Mission'],
        correctIndex: 2,
        explanation: 'The Clean Ganga Mission (now Namami Gange) is a separate programme, not part of the 8 missions under NAPCC (2008). The 8 NAPCC missions focus on solar energy, energy efficiency, sustainable habitat, water, Himalayan ecosystem, afforestation, sustainable agriculture, and strategic knowledge.'
      },
      {
        id: 'cc-q3',
        question: 'The Gangotri Glacier (source of the Ganga) retreated how much in 2022?',
        options: ['5 metres', '10 metres', '22 metres', '50 metres'],
        correctIndex: 2,
        explanation: 'The Gangotri Glacier retreated approximately 22 metres in 2022 alone, continuing a long-term trend that threatens the long-term water security of the Ganga basin.'
      },
      {
        id: 'cc-q4',
        question: 'India\'s average annual economic losses from climate-related disasters in 2018–2022 were approximately:',
        options: ['$10 billion', '$87 billion', '$200 billion', '$30 billion'],
        correctIndex: 1,
        explanation: 'According to the Aon Global Risk Report 2023, India\'s climate-related disaster losses averaged $87 billion per year during 2018–2022 — roughly 3% of GDP annually.'
      },
      {
        id: 'cc-q5',
        question: 'Andhra Pradesh below received what percentage of below-normal rainfall in August 2023 due to El Niño?',
        options: ['10%', '20%', '38%', '55%'],
        correctIndex: 2,
        explanation: 'Tirupati and much of southern Andhra Pradesh received approximately 38% below-normal rainfall in August 2023 due to El Niño-induced suppression of the southwest monsoon.'
      }
    ]
  }
];

export const getModuleById = (id) => MODULES.find(m => m.id === id);
export const getLessonById = (moduleId, lessonId) => {
  const mod = getModuleById(moduleId);
  return mod ? mod.lessons.find(l => l.id === lessonId) : null;
};
