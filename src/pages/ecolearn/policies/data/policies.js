export const POLICIES = [
  {
    id: 'epa-1986',
    name: 'Environment Protection Act',
    year: 1986,
    authority: 'Ministry of Environment, Forest and Climate Change (MoEFCC), Government of India',
    category: 'All',
    summary: 'India\'s umbrella environmental law giving the central government sweeping power to protect and improve the environment.',
    everydayImpact: true,
    explanation: `The Environment Protection Act (EPA) 1986 was enacted in the wake of the Bhopal gas tragedy (December 1984) — the worst industrial disaster in history that killed over 15,000 people. The tragedy exposed the complete absence of a comprehensive legal framework to protect citizens from industrial pollution.

The Act gives the central government overarching authority to take measures for protecting and improving the quality of the environment. Critically, it delegates power to set environmental standards for emissions and effluents from industries and factories, restrict industrial activities in ecologically sensitive areas, close or shut down polluting industries, and collect samples for analysis.

The EPA is often called the "umbrella" environmental law because it empowers the government to issue specific notifications and rules under its framework — including the hazardous waste rules, biomedical waste rules, noise pollution rules, and the Coastal Regulation Zone notifications.`,
    whyItMatters: `This Act is the legal basis for virtually every environmental enforcement action in India. If a factory near your city is polluting a river, the EPA gives pollution control boards the power to shut it down and prosecute the owners. It also gives citizens the right to file complaints with authorities — and the courts have used it to force government action.

The National Green Tribunal (NGT), established in 2010, operates as a specialised court for environmental disputes and regularly exercises powers derived from the EPA framework to impose compensation and remediation orders on polluters.`,
    keyPoints: [
      'Enacted in 1986 after the Bhopal gas tragedy',
      'Gives central government power to set environmental standards for air, water, and noise',
      'Industries violating standards can be shut down or prosecuted',
      'Maximum penalty: imprisonment up to 5 years and fine up to ₹1 lakh',
      'Subsequent offences: fine of ₹5,000 per day of continued violation',
      'Foundation for 30+ more specific environmental rules and notifications',
      'Citizens can file complaints directly with the Pollution Control Board',
    ],
    relatedPolicies: ['air-act-1981', 'water-act-1974', 'crz-2019'],
  },
  {
    id: 'air-act-1981',
    name: 'Air (Prevention and Control of Pollution) Act',
    year: 1981,
    authority: 'Central Pollution Control Board (CPCB) / State Pollution Control Boards (SPCBs)',
    category: 'Air',
    summary: 'India\'s primary law for controlling air pollution from industries, vehicles, and other sources.',
    everydayImpact: true,
    explanation: `The Air Act 1981 was enacted to address India's rapidly deteriorating urban air quality caused by industrialisation and growing vehicular traffic. It established the Central Pollution Control Board (CPCB) and State Pollution Control Boards (SPCBs) as the main regulatory authorities for air quality.

The Act empowers CPCB to set national ambient air quality standards (NAAQS), establish emission standards for industries, and coordinate pollution control research. SPCBs implement these at the state level — they inspect industries, grant or refuse consent to operate ("No Objection Certificates"), and take enforcement action against violators.

Under this Act, every industry that could potentially pollute air must obtain a "Consent to Operate" from the state pollution control board before starting operations. Without this consent, the industry is illegal. Andhra Pradesh Pollution Control Board (APPCB) is the implementing authority for AP.`,
    whyItMatters: `This Act is why industrial stacks have emission limits and why auto-rickshaws must pass PUC (Pollution Under Control) tests. The Pollution Under Control (PUC) certificate that vehicles must carry under Motor Vehicles Act rules is directly linked to emission standards set under the Air Act framework.

The CPCB's National AQI monitoring network — from which apps like Sameer draw real-time data — operates under the authority of this Act. When AQI levels trigger "Graded Response Action Plans" (GRAP) in cities like Delhi, it is this Act that gives authorities the legal basis to ban construction, close schools, and restrict vehicle use.`,
    keyPoints: [
      'Established CPCB and SPCBs as the regulatory framework for air quality',
      'Requires all polluting industries to obtain "Consent to Operate"',
      'Sets National Ambient Air Quality Standards (NAAQS)',
      'Legal basis for vehicle PUC certificate requirements',
      'Amended in 1987 to include vehicles as a source of air pollution',
      'Penalty for violations: up to 3 months imprisonment and fine',
      'Andhra Pradesh Pollution Control Board (APPCB) enforces in AP',
    ],
    relatedPolicies: ['epa-1986', 'bs6-2020', 'ncap-2019'],
  },
  {
    id: 'bs6-2020',
    name: 'Bharat Stage VI (BS6) Emission Norms',
    year: 2020,
    authority: 'Ministry of Road Transport and Highways (MoRTH) / Supreme Court of India',
    category: 'Air',
    summary: 'India\'s strictest vehicle emission standards, equivalent to Euro 6, cutting PM and NOx emissions by up to 90%.',
    everydayImpact: true,
    explanation: `Bharat Stage (BS) norms are India's vehicle emission standards — analogous to Euro norms in Europe. India leapfrogged directly from BS4 to BS6 (skipping BS5), cutting the timeline from the originally planned 2024 to April 1, 2020, following a Supreme Court order. This happened because India's air quality crisis was causing hundreds of thousands of premature deaths each year.

BS6 norms are dramatically stricter than BS4. PM emissions from diesel vehicles dropped by 80%, and NOx emissions by 43% for petrol and 68% for diesel. A BS6 car effectively produces clean air compared to a BS4 diesel car of the same size. All new vehicles sold in India from April 1, 2020 must comply with BS6 standards.

The government invested nearly ₹30,000 crore in upgrading oil refineries to produce BS6-grade fuel (ultra-low sulphur diesel with only 10 ppm sulphur vs. 50 ppm in BS4). This was essential because BS6-compliant diesel particulate filters would be damaged by higher-sulphur fuel.`,
    whyItMatters: `If you bought or plan to buy a vehicle after 2020, it is mandatory that it meets BS6 standards — and that\'s actually a significant health benefit for everyone around you. Older BS4 and BS3 diesels are significantly dirtier.

When you see a PUC certificate requirement for vehicles, the emission limits have been updated to reflect BS6 standards. The transition to electric vehicles (EVs) is the next step — India\'s FAME II scheme subsidises EVs specifically to accelerate this shift. Buying or riding EVs in Tirupati directly reduces local PM2.5 and NOx levels.`,
    keyPoints: [
      'Implemented from April 1, 2020 — all new vehicles must comply',
      'PM emissions reduced by 80% compared to BS4 for diesel',
      'NOx reduced by 43% (petrol) and 68% (diesel) vs BS4',
      'India leapfrogged BS5, moving directly from BS4 to BS6 (Euro 6 equivalent)',
      'Required refineries to upgrade to 10 ppm ultra-low sulphur fuel — a ₹30,000 crore investment',
      'Supreme Court played a key role in accelerating the timeline',
      'Older BS4 vehicles are no longer being manufactured but remain on roads',
    ],
    relatedPolicies: ['air-act-1981', 'ncap-2019', 'epa-1986'],
  },
  {
    id: 'swachh-bharat-2014',
    name: 'Swachh Bharat Mission',
    year: 2014,
    authority: 'Ministry of Housing and Urban Affairs / Ministry of Jal Shakti',
    category: 'Waste',
    summary: 'India\'s largest sanitation programme targeting open defecation elimination and solid waste management in urban and rural areas.',
    everydayImpact: true,
    explanation: `Swachh Bharat (Clean India) Mission was launched on October 2, 2014 (Gandhi Jayanti) and represents India's most ambitious public health and sanitation programme. It has two components: Swachh Bharat Mission (Urban) for cities and towns, and SBM (Gramin/Rural) for villages.

The urban mission targets all 4,041 statutory towns in India and has three main goals: eliminate open defecation by building household and community toilets, achieve 100% scientific processing of solid waste, and ensure door-to-door waste collection in all wards.

SBM (Gramin) declared India Open Defecation Free (ODF) on October 2, 2019 — five years after launch — having built over 100 million household toilets. Independent surveys (RICE Institute, 2020) found that ODF villages had significantly higher toilet usage, though usage was not universal. Phase 2 (SBM-G Phase 2, 2020–2025) focuses on ODF Plus — achieving sustainable ODF status plus solid and liquid waste management in villages.`,
    whyItMatters: `Open defecation was one of India's most serious public health crises — it contributed to diarrhoeal disease, malnutrition, and infant mortality as well as a severe dignity issue, especially for women. The rapid toilet construction under SBM saved lives and reduced child stunting through reduced faecal contamination of water and soil.

For urban residents and college students, SBM Urban funds the waste collection trucks, community bins, and waste processing plants in your city. Tirupati Municipal Corporation receives SBM grants to improve solid waste management infrastructure. Segregating your waste into wet and dry bins — the core requirement of SBM Urban — directly supports this system.`,
    keyPoints: [
      'Launched October 2, 2014 — India\'s largest-ever sanitation drive',
      'Built over 100 million household toilets by 2019',
      'India declared Open Defecation Free on October 2, 2019',
      'SBM Phase 2 (2020–2025) focuses on ODF Plus — waste management and sustainability',
      'Cities rated annually on Swachh Survekshan — Indore is 7-time champion',
      'Funds door-to-door waste collection and processing plants in cities',
      'Performance linked to star ratings: ODF, ODF+, ODF++, Water+ certifications',
    ],
    relatedPolicies: ['swm-rules-2016', 'epa-1986'],
  },
  {
    id: 'swm-rules-2016',
    name: 'Solid Waste Management Rules',
    year: 2016,
    authority: 'MoEFCC / Urban Local Bodies',
    category: 'Waste',
    summary: 'Rules mandating source segregation, waste processing, and producer responsibility for packaging waste.',
    everydayImpact: true,
    explanation: `The Solid Waste Management (SWM) Rules 2016 replaced the older Municipal Solid Wastes Rules of 2000. They significantly expanded the scope and responsibility for waste management in India, moving the focus from just collection to the entire lifecycle of waste.

The rules mandate source segregation of waste into at least three streams: wet (biodegradable), dry (recyclable), and domestic hazardous waste. Households, commercial establishments, and institutions (including colleges and hostels) are all legally required to segregate. Urban local bodies must collect door-to-door and process wet waste into compost or biogas, and dry waste into recyclable materials.

A key innovation in the 2016 rules is Extended Producer Responsibility (EPR) — it makes manufacturers and brand owners responsible for collecting and managing their packaging waste. This means companies like Zomato, Amazon, and FMCG brands must set up take-back systems and report packaging recycled annually. EPR for plastic packaging was significantly strengthened by the Plastic Waste Management Rules amendments in 2022.`,
    whyItMatters: `If your hostel or campus mess is not segregating waste into bins, it is violating the SWM Rules 2016. You have the legal right to complaint to the local urban body or pollution control board. More importantly, non-segregated waste goes to overflowing landfills where it generates methane (a potent greenhouse gas) and leaches toxins into groundwater.

By composting your food waste at the hostel level, you reduce the city\'s waste burden, generate fertiliser for campus gardens, and reduce greenhouse gas emissions. Many IITs now run decentralised composting programmes — IIT Tirupati has the campus infrastructure to do the same.`,
    keyPoints: [
      'Mandates source segregation into wet, dry, and hazardous waste streams',
      'Applies to all generators — households, institutions, commercial establishments, colleges',
      'Bulk generators (500+ kg/day) must have on-site waste processing',
      'Introduces Extended Producer Responsibility (EPR) for packaging',
      'Urban Local Bodies responsible for processing, not just collection',
      'Littering and non-segregation can attract municipal fines',
      'Ragpickers formally recognised and must be integrated into collection systems',
    ],
    relatedPolicies: ['swachh-bharat-2014', 'plastic-2016', 'epa-1986'],
  },
  {
    id: 'water-act-1974',
    name: 'Water (Prevention and Control of Pollution) Act',
    year: 1974,
    authority: 'Central Pollution Control Board (CPCB) / State Pollution Control Boards',
    category: 'Water',
    summary: 'India\'s foundational law for preventing water pollution from industries and sewage, establishing water quality standards.',
    everydayImpact: false,
    explanation: `The Water Act 1974 was India's first major pollution control legislation — enacted well before the umbrella EPA 1986. It was prompted by the rapid industrialisation of the 1960s–70s and the resulting contamination of rivers, lakes, and groundwater that had long been sources of drinking water for Indian communities.

The Act prohibits any industry, local authority, or person from knowingly causing or permitting any poisonous, noxious, or polluting matter to enter a stream or river. It requires industries that discharge effluent into water bodies to obtain "Consent to Discharge" from the State Pollution Control Board before operating, similar to the Air Act's Consent to Operate for air pollution.

The CPCB is empowered to lay down standards for water quality and sewage treatment. It monitors 2,000+ water quality stations nationwide. Despite this law being 50 years old, water pollution remains serious — the Ganga, Yamuna, and many coastal rivers are severely polluted, indicating weak enforcement rather than a gap in law.`,
    whyItMatters: `The Water Act is why large factories cannot legally dump untreated effluent into rivers. When you see reports of a river turning red or fish dying near an industrial area, the Water Act is the tool citizens and authorities should use to prosecute the polluter.

In AP, the Swarnamukhi river — key water source for Tirupati — has faced periodic pollution from upstream tanneries and chemical units. The APPCB, acting under the Water Act, has issued several closure notices to polluters in this stretch. Public awareness of this law helps citizens hold polluters accountable through complaint mechanisms.`,
    keyPoints: [
      'India\'s first pollution control law, enacted 1974 — 12 years before EPA',
      'Prohibits discharge of polluting matter into streams, rivers, wells, or sewers',
      'Industries must get "Consent to Discharge" from SPCBs before operating',
      'CPCB sets water quality standards and effluent discharge standards',
      'Maximum penalty: fine of ₹10,000 per day of violation + imprisonment',
      '2,000+ CPCB water quality monitoring stations nationwide',
      'Amended in 1988 to strengthen enforcement powers',
    ],
    relatedPolicies: ['epa-1986', 'swm-rules-2016'],
  },
  {
    id: 'ncap-2019',
    name: 'National Clean Air Programme (NCAP)',
    year: 2019,
    authority: 'Ministry of Environment, Forest and Climate Change (MoEFCC)',
    category: 'Air',
    summary: 'India\'s national plan to reduce PM2.5 and PM10 concentrations by 20–30% in 131 non-attainment cities by 2024.',
    everydayImpact: true,
    explanation: `The National Clean Air Programme (NCAP) was launched in January 2019 as India's first national strategy specifically targeting ambient air quality improvement. It identified 131 "non-attainment cities" — cities that have consistently failed to meet NAAQS air quality standards for PM10 or PM2.5 over a 5-year average.

The original target was a 20–30% reduction in PM2.5 and PM10 concentrations by 2024 compared to 2017 baseline. In 2022, this was revised upward to a 40% reduction by 2026. The programme allocates funds (₹375 crore in 15th Finance Commission grants) to city authorities for implementing clean air action plans.

Key interventions funded under NCAP include upgrading real-time AQI monitoring infrastructure, dust suppression on roads and construction sites, promoting electric public transport, improving industrial waste handling, and implementing crop residue management (to address stubble burning in northern India — a major source of Delhi's severe winter pollution).`,
    whyItMatters: `If you live in one of the 131 non-attainment cities, your municipal corporation has a legally obligated City Action Plan under NCAP with specific timelines and budgets. In Andhra Pradesh, several cities including Visakhapatnam and Rajahmundry are on the non-attainment list.

The programme is also why you see more air quality monitoring stations being installed across Indian cities. More monitoring means better data — and better data means citizens, researchers, and journalists can hold governments accountable for progress (or lack thereof) on clean air commitments.`,
    keyPoints: [
      'Launched January 2019 — India\'s first dedicated national clean air programme',
      '131 "non-attainment cities" identified for targeted action',
      'Target: 40% reduction in PM2.5 and PM10 by 2026 (revised from 20–30% by 2024)',
      '₹375 crore allocated through 15th Finance Commission grants',
      'Each city must prepare and submit a City Action Plan',
      'Funds new AQI monitoring stations, e-buses, and dust suppression equipment',
      'Visakhapatnam and Rajahmundry (AP) are among non-attainment cities',
    ],
    relatedPolicies: ['air-act-1981', 'bs6-2020', 'epa-1986'],
  },
  {
    id: 'forest-act-1980',
    name: 'Forest Conservation Act',
    year: 1980,
    authority: 'Ministry of Environment, Forest and Climate Change (MoEFCC)',
    category: 'Forest',
    summary: 'Requires central government approval before any forest land can be diverted for non-forest use — the key legal check on deforestation.',
    everydayImpact: false,
    explanation: `The Forest Conservation Act (FCA) 1980 was enacted after India lost vast tracts of forest during the 1970s to agricultural expansion, dam construction, and mining without any central oversight. The law made it illegal for any state government to dereserve or use forest land for any non-forest purpose without prior approval from the central government.

"Non-forest purposes" include mining, laying roads and railways, building dams, agriculture, townships — essentially anything that requires removing trees. A state wanting to use 10 hectares of forest for a road project must apply to MoEFCC, which evaluates the ecological impact and requires compensatory afforestation of at least twice the diverted area.

The law significantly slowed India's rate of deforestation in the 1980s–2000s. However, critics point out that approval rates are very high (over 90% of applications) and compensatory afforestation is often on degraded or distant land that cannot replicate the lost ecosystem services. The FCA was amended in 2023 (Van Sanrakshan evam Samvardhan Adhiniyam) — a contentious update that relaxes some provisions for infrastructure projects near borders.`,
    whyItMatters: `In Tirupati district, the Seshachalam Hills forest (part of the Eastern Ghats) is protected under the FCA. Any infrastructure project — roads, buildings, transmission lines — within this forest requires MoEFCC clearance. Awareness of this law helps communities challenge illegal encroachments or forest land diversions without proper approval.

The 2023 amendment has been criticised by environmentalists for potentially weakening protections for forests that have not yet been officially notified as "forests" in government records — a loophole that could affect densely forested areas that lack formal legal recognition.`,
    keyPoints: [
      'Enacted in 1980 after rapid deforestation in the 1970s',
      'No state can divert forest land for non-forest use without central government approval',
      'Compensatory afforestation required — minimum 2× the diverted area',
      'Over 99,000 sq km of forest land approved for diversion since 1980 (Forest Survey of India)',
      'Amended controversially in 2023 to exclude certain areas and relax some requirements',
      'National Compensatory Afforestation Fund (CAMPA) has accumulated ₹55,000 crore',
      'Eastern Ghats forests near Tirupati are protected by this Act',
    ],
    relatedPolicies: ['epa-1986', 'crz-2019'],
  },
  {
    id: 'ewaste-2022',
    name: 'E-Waste Management Rules',
    year: 2022,
    authority: 'Ministry of Environment, Forest and Climate Change (MoEFCC)',
    category: 'Waste',
    summary: 'Updated rules holding electronics producers responsible for collecting and recycling e-waste through Extended Producer Responsibility (EPR).',
    everydayImpact: true,
    explanation: `The E-Waste Management Rules 2022 replaced the 2016 rules and introduced a significantly stronger Extended Producer Responsibility (EPR) framework. EPR means that electronics manufacturers and importers (like Samsung, Apple, HP, and thousands of smaller brands) are legally responsible for taking back their products at end-of-life and ensuring they are recycled properly.

Under the 2022 rules, producers must register on the EPR portal managed by CPCB, set annual EPR targets (starting at 60% of products sold in a given year, rising to 70% and then 80% in subsequent years), and can only fulfil EPR obligations through CPCB-registered dismantlers and recyclers. Buying and selling EPR "credits" (certificates proving recycling) is now permitted, creating a market mechanism.

The rules also cover "producers" of electronic equipment, "dealers" selling electronics, and "collection centres" that aggregate e-waste. Consumers are explicitly required to hand over e-waste only to authorised collection points or dealers — not to informal scrap dealers who use toxic recovery methods.`,
    whyItMatters: `As a college student, you generate e-waste regularly — old phones, laptops, chargers, earbuds, and batteries. Under these rules, the brand that sold you that phone is legally obligated to take it back for recycling. Many now run take-back programmes: flip-phone old devices when upgrading, use brand trade-in programmes, or use platform like Cashify which work with registered recyclers.

Improperly recycled e-waste — melted in open furnaces by informal recyclers in cities like Moradabad and Seelampur — releases lead, cadmium, dioxins, and mercury into the air and water. These chemicals bioaccumulate in food chains and cause serious neurological damage, especially in children. Using authorised channels is a public health action, not just a legal compliance.`,
    keyPoints: [
      'Replaced 2016 rules with a much stronger EPR framework',
      'Producers must achieve 60-70-80% collection targets over three years',
      'EPR certificates can be traded — creating a market for e-waste recycling',
      'Consumers must hand e-waste only to authorised collection centres',
      'Covers computers, phones, TV, fridges, ACs, and most electronics',
      'India generates 3.23 million tonnes of e-waste annually (MoEFCC 2023)',
      'Penalty for non-compliance: environmental compensation fine + legal action',
    ],
    relatedPolicies: ['swm-rules-2016', 'epa-1986'],
  },
  {
    id: 'plastic-2016',
    name: 'Plastic Waste Management Rules',
    year: 2016,
    authority: 'MoEFCC / Urban Local Bodies',
    category: 'Waste',
    summary: 'Regulates production, use, collection, and disposal of plastic, including the 2022 ban on specific single-use plastics.',
    everydayImpact: true,
    explanation: `The Plastic Waste Management Rules 2016 (amended multiple times through 2022) are India's main legal instrument for tackling plastic pollution. The core original rule set minimum thickness requirements for plastic carry bags (50 microns, later raised to 75 microns and then 120 microns) to prevent ultra-thin bags that are impossible to recycle. Thicker bags can be reused and collected.

The most significant recent development was the Plastic Waste Management (Amendment) Rules 2022, which banned manufacture, import, sale, and use of specific single-use plastic (SUP) items effective July 1, 2022. The banned items include: plastic sticks for ear buds, plastic flags, candy and ice cream sticks, polystyrene (thermocol) for decoration, plastic plates, cups, glasses, cutlery, wrapping films around sweet boxes, invitation cards, cigarette packets, PVC banners below 100 microns, and stirrers.

The rules also introduced the plastic EPR framework — requiring plastic packaging producers to work toward gradually increasing recycled content in their packaging (15% by 2025–26, rising to 60% by 2028–29).`,
    whyItMatters: `India generates about 9.4 million tonnes of plastic waste per year. Of this, roughly 60% is recycled (primarily PET bottles and HDPE containers), but 40% — about 3.7 million tonnes — enters the environment. India's rivers, coastal areas, and oceans are severely affected.

As a direct daily action: carry a reusable cloth bag when shopping, use a water bottle instead of buying plastic-bottled water, refuse plastic straws and cutlery at restaurants, and report sellers (especially street food vendors) still using banned single-use items to your local municipal office or through the CPCB complaint portal.`,
    keyPoints: [
      'Mandates minimum thickness of 120 microns for plastic carry bags (1mm-wide)',
      '2022 amendment banned specific single-use plastics from July 1, 2022',
      'Banned items: plastic cutlery, straws, plates, ear bud sticks, thermocol decoration pieces',
      'EPR rules require increasing recycled content in packaging over time',
      'Penalty: fines varying by state, ₹500–₹25,000 for commercial violators',
      '9.4 million tonnes of plastic waste generated in India per year',
      'India is among the top 10 contributors to ocean plastic pollution',
    ],
    relatedPolicies: ['swm-rules-2016', 'swachh-bharat-2014', 'epa-1986'],
  },
  {
    id: 'solar-mission-2010',
    name: 'National Solar Mission (Jawaharlal Nehru National Solar Mission)',
    year: 2010,
    authority: 'Ministry of New and Renewable Energy (MNRE)',
    category: 'Energy',
    summary: 'India\'s flagship solar energy programme that set ambitious targets and drove a 32× growth in solar capacity between 2014 and 2024.',
    everydayImpact: true,
    explanation: `The Jawaharlal Nehru National Solar Mission (JNNSM), part of the National Action Plan on Climate Change (NAPCC), was launched in 2010 with an initial target of 20,000 MW of solar capacity by 2022. This target was revised upward to 100,000 MW (100 GW) in 2015. As of March 2024, India's installed solar capacity has crossed 85 GW — a 32× increase from just 2.6 GW in 2014.

The Mission works through competitive bidding — developers bid for government contracts to sell solar power at a fixed tariff. This "reverse auction" mechanism drove solar tariffs down dramatically from ₹18/unit in 2010 to a record low of ₹1.99/unit in 2021. Solar electricity is now cheaper than coal in India.

The Mission also includes the PM KUSUM scheme (solar pumps for farmers), rooftop solar subsidies for households (PM Surya Ghar Muft Bijli Yojana 2024 — ₹78,000 crore for 1 crore rooftop solar installations), and solar parks in states like Rajasthan and Gujarat.`,
    whyItMatters: `Solar energy is the most scalable clean energy option in a sun-rich country like India, and policy driving its growth has real daily impacts. Lower-cost solar electricity reduces your electricity bills (via net metering on rooftop solar) and is gradually replacing coal-based electricity in the grid, reducing the carbon footprint of every appliance you use.

Andhra Pradesh is a solar leader — with over 5,000 MW of installed solar capacity and large solar parks near Kurnool and Anantapuramu. Electricity from these parks powers Tirupati's grid. If IIT Tirupati installed rooftop solar panels (as many IITs have), it would directly benefit from MNRE subsidies and become energy-self-sufficient for a significant share of its power.`,
    keyPoints: [
      'Launched 2010 — part of NAPCC\'s 8 national missions',
      'Original target: 20 GW by 2022; revised to 100 GW in 2015',
      'India\'s solar capacity crossed 85 GW by March 2024 — 32× growth since 2014',
      'Solar tariffs fell from ₹18/unit (2010) to ₹1.99/unit (2021 record low)',
      'PM KUSUM: solar pumps for 25 lakh farmers',
      'PM Surya Ghar (2024): ₹78,000 crore for 1 crore household rooftop installations',
      'Andhra Pradesh has 5,000+ MW of solar capacity, including Kurnool Solar Park',
    ],
    relatedPolicies: ['epa-1986', 'ncap-2019'],
  },
  {
    id: 'crz-2019',
    name: 'Coastal Regulation Zone (CRZ) Notification',
    year: 2019,
    authority: 'Ministry of Environment, Forest and Climate Change (MoEFCC)',
    category: 'Water',
    summary: 'Regulates what activities can occur in India\'s coastal zones to protect fragile coastal ecosystems and fishing communities.',
    everydayImpact: false,
    explanation: `The Coastal Regulation Zone (CRZ) Notification 2019 replaced the earlier 2011 notification and regulates land use and construction within India's coastal areas — including tidal water bodies, estuaries, backwaters, and creeks. India's coastline stretches 7,516 km and is home to some of the world's richest coastal ecosystems: mangroves, coral reefs, sea grass beds, and nesting beaches for Olive Ridley turtles.

The Notification divides coastal areas into 4 zones: CRZ-I (most sensitive — mangroves, coral reefs, turtle nesting beaches — almost no construction permitted), CRZ-II (urban areas already developed adjacent to the coast), CRZ-III (rural areas and beaches — limited development), and CRZ-IV (territorial waters and aquatic bodies).

The 2019 version controversially reduced the No Development Zone (NDZ) in many areas, made it easier to build in some coastal zones, and opened up beach tourism development. Environmentalists have raised concerns that these relaxations increase flood risk and damage coastal livelihoods of 250 million people who depend on fishing.`,
    whyItMatters: `For students from Andhra Pradesh's coastal cities (Visakhapatnam, Kakinada, Nellore, Machilipatnam), CRZ determines what can legally be built near your beach, which affects tourism development, coastal flood risk, and the health of fishing grounds that lakhs of families depend on.

Climate change is making CRZ even more critical — sea level rise, increasing storm surges, and cyclone intensification make coastal setback distances (how far development must be from the coast) more important, not less. The CRZ is the primary legal tool to maintain these buffers.`,
    keyPoints: [
      'Regulates construction and activity within India\'s 7,516 km coastline',
      'Four CRZ zones with different protection levels — CRZ-I most restrictive',
      'Protects mangroves, coral reefs, turtle nesting beaches, and fishing communities',
      '2019 version reduced No Development Zone in some areas — contentious among ecologists',
      '250 million coastal people — many fisherfolk — directly affected by CRZ rules',
      'Andhra Pradesh\'s 974 km coast (2nd longest in India) is regulated under CRZ',
      'Cyclone-prone areas of AP require strict adherence to CRZ setback distances',
    ],
    relatedPolicies: ['epa-1986', 'forest-act-1980', 'water-act-1974'],
  },
];

export const POLICY_CATEGORIES = ['All', 'Air', 'Water', 'Waste', 'Energy', 'Forest'];

export const getPolicyById = (id) => POLICIES.find(p => p.id === id);
export const getPoliciesByCategory = (category) =>
  category === 'All' ? POLICIES : POLICIES.filter(p => p.category === category || p.category === 'All');
