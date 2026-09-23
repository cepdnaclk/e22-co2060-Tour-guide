import React, { useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PlacesMap from "../components/PlacesMap";
import { Map, ChevronLeft, MapPin, Search, PlusCircle, RotateCcw } from "lucide-react";

// Categorized authentic Gampaha places dataset (25 - 30 places per category)
export const GAMPAHA_CATEGORIZED_PLACES = {
  tourism: [
    {
      id: "gampaha-t1",
      name: "Henarathgoda Botanical Garden",
      district: "Gampaha",
      placeType: "Botanical Garden",
      description: "Historic 1876 botanical garden in Gampaha famous as the location where the first rubber tree was planted in Asia.",
      imageUrl: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80",
      lat: 7.0906,
      lng: 79.9989
    },
    {
      id: "gampaha-t2",
      name: "Negombo Beach Park",
      district: "Gampaha",
      placeType: "Beach Park",
      description: "Popular golden sandy beach lined with palm trees, seafood restaurants, and ocean sunset vistas.",
      imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      lat: 7.2272,
      lng: 79.8406
    },
    {
      id: "gampaha-t3",
      name: "Muthurajawela Marsh & Sanctuary",
      district: "Gampaha",
      placeType: "Wetland Sanctuary",
      description: "Vast coastal wetland marsh habitat home to water birds, monitor lizards, and boat safari tours.",
      imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80",
      lat: 7.0378,
      lng: 79.8667
    },
    {
      id: "gampaha-t4",
      name: "Hamilton Dutch Canal",
      district: "Gampaha",
      placeType: "Historic Canal",
      description: "Colonial-era 18th century Dutch waterway constructed for transporting goods between Negombo Lagoon and Colombo.",
      imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
      lat: 7.2081,
      lng: 79.8432
    },
    {
      id: "gampaha-t5",
      name: "Negombo Fish Market (Lellama)",
      district: "Gampaha",
      placeType: "Cultural Market",
      description: "Bustling open-air fish market by the lagoon where fishermen land daily catches of tuna, crab, and prawns.",
      imageUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80",
      lat: 7.2039,
      lng: 79.8336
    },
    {
      id: "gampaha-t6",
      name: "Guruge Nature Park",
      district: "Gampaha",
      placeType: "Theme Park",
      description: "First theme park in Sri Lanka combining recreation, water rides, and historic village life replicas.",
      imageUrl: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80",
      lat: 7.0864,
      lng: 79.9142
    },
    {
      id: "gampaha-t7",
      name: "Pilikuttuwa Royal Cave Temple",
      district: "Gampaha",
      placeType: "Cave Temple",
      description: "Ancient forest monastery featuring 99 natural rock caves with pre-Christian drip-ledge inscriptions.",
      imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80",
      lat: 7.0736,
      lng: 80.0381
    },
    {
      id: "gampaha-t8",
      name: "Warana Rajamaha Viharaya",
      district: "Gampaha",
      placeType: "Temple",
      description: "Historic rock temple complex built among granite boulder outcrops, dating back to King Valagamba's era.",
      imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80",
      lat: 7.0983,
      lng: 80.0811
    },
    {
      id: "gampaha-t9",
      name: "Attanagalla Raja Maha Viharaya",
      district: "Gampaha",
      placeType: "Temple",
      description: "Sacred ancient temple associated with King Sri Sangabo, featuring a circular vatadage shrine.",
      imageUrl: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=800&q=80",
      lat: 7.1081,
      lng: 80.1286
    },
    {
      id: "gampaha-t10",
      name: "Maligatenna Rajamaha Viharaya",
      district: "Gampaha",
      placeType: "Temple",
      description: "High mountain temple peak offering panoramic views of Gampaha District, forest ponds, and rock stupa.",
      imageUrl: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80",
      lat: 7.0381,
      lng: 80.0711
    },
    {
      id: "gampaha-t11",
      name: "St. Mary's Church Negombo",
      district: "Gampaha",
      placeType: "Church",
      description: "Grand colonial Catholic church featuring neoclassical architecture and vibrant ceiling oil paintings.",
      imageUrl: "https://images.unsplash.com/photo-1548625361-180b555755e6?auto=format&fit=crop&w=800&q=80",
      lat: 7.2114,
      lng: 79.8378
    },
    {
      id: "gampaha-t12",
      name: "Angurukaramulla Dragon Temple",
      district: "Gampaha",
      placeType: "Temple",
      description: "Famous Buddhist temple featuring a giant 6-meter dragon mouth entrance and reclining Buddha statue.",
      imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
      lat: 7.2131,
      lng: 79.8497
    },
    {
      id: "gampaha-t13",
      name: "Wet Water Park Resort",
      district: "Gampaha",
      placeType: "Water Park",
      description: "Recreational water resort featuring swimming pools, water slides, and landscaped picnic gardens.",
      imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      lat: 7.0925,
      lng: 80.0114
    },
    {
      id: "gampaha-t14",
      name: "Negombo Dutch Fort Ruins",
      district: "Gampaha",
      placeType: "Historic Site",
      description: "Ruinous stone ramparts and gate of 17th century Dutch colonial fort built by the Portuguese and Dutch.",
      imageUrl: "https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=800&q=80",
      lat: 7.2056,
      lng: 79.8339
    },
    {
      id: "gampaha-t15",
      name: "Agra Shravasti Meditation Centre",
      district: "Gampaha",
      placeType: "Meditation Centre",
      description: "Serene spiritual retreat center surrounded by herbal groves near Kiribathgoda.",
      imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
      lat: 6.9744,
      lng: 79.9167
    },
    {
      id: "gampaha-t16",
      name: "Kelani River Estuary Park",
      district: "Gampaha",
      placeType: "River Park",
      description: "Peaceful riverside park in Biyagama offering walking trails along the Kelani River banks.",
      imageUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
      lat: 6.9481,
      lng: 79.9803
    },
    {
      id: "gampaha-t17",
      name: "Sapugaskanda Hilltop Temple",
      district: "Gampaha",
      placeType: "Temple",
      description: "Elevated temple shrine overlooking green rubber trees and Sapugaskanda countryside.",
      imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80",
      lat: 6.9631,
      lng: 79.9542
    },
    {
      id: "gampaha-t18",
      name: "Uruwala Valagamba Temple",
      district: "Gampaha",
      placeType: "Temple",
      description: "Ancient cave temple complex with stone drip ledges located near Wathupitiwala.",
      imageUrl: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=800&q=80",
      lat: 7.1147,
      lng: 80.1039
    },
    {
      id: "gampaha-t19",
      name: "Maradaluwa Forest Reserve",
      district: "Gampaha",
      placeType: "Forest Reserve",
      description: "Protected green forest patch near Minuwangoda with nature walking paths.",
      imageUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80",
      lat: 7.1708,
      lng: 79.9606
    },
    {
      id: "gampaha-t20",
      name: "Talgasmote Heritage Cave",
      district: "Gampaha",
      placeType: "Cave Hermitage",
      description: "Secluded cave monastery surrounded by native Sri Lankan medicinal trees.",
      imageUrl: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80",
      lat: 7.1539,
      lng: 80.0531
    },
    {
      id: "gampaha-t21",
      name: "Dungalpitiya Lagoon Viewpoint",
      district: "Gampaha",
      placeType: "Lagoon Viewpoint",
      description: "Quiet coastal wetland spot along Pamunugama ideal for evening sunset viewing.",
      imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      lat: 7.1328,
      lng: 79.8447
    },
    {
      id: "gampaha-t22",
      name: "Horagolla National Park",
      district: "Gampaha",
      placeType: "National Park",
      description: "Lowland rainforest park protecting indigenous dipterocarp trees and native wildlife.",
      imageUrl: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=800&q=80",
      lat: 7.1494,
      lng: 80.0911
    },
    {
      id: "gampaha-t23",
      name: "Nittambuwa Bandaranaike Memorial",
      district: "Gampaha",
      placeType: "Memorial Park",
      description: "Landmarked memorial garden honoring former prime minister Sir S.W.R.D. Bandaranaike.",
      imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
      lat: 7.1436,
      lng: 80.1008
    },
    {
      id: "gampaha-t24",
      name: "Kimbulapitiya Firework Craft Village",
      district: "Gampaha",
      placeType: "Craft Village",
      description: "Traditional village famous throughout Sri Lanka for handcrafting festive pyrotechnics and fireworks.",
      imageUrl: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80",
      lat: 7.1856,
      lng: 79.8878
    },
    {
      id: "gampaha-t25",
      name: "Talahena Coastal Dune Strip",
      district: "Gampaha",
      placeType: "Coastal Beach",
      description: "Peaceful stretch of sandy dunes south of Negombo, away from busy commercial resorts.",
      imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      lat: 7.1639,
      lng: 79.8419
    },
    {
      id: "gampaha-t26",
      name: "Kiribathgoda Town Square",
      district: "Gampaha",
      placeType: "Urban Square",
      description: "Lively suburban hub with shopping centers, textile outlets, and street food.",
      imageUrl: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80",
      lat: 6.9806,
      lng: 79.9297
    },
    {
      id: "gampaha-t27",
      name: "Aluthgama Bogamuwa Eco Park",
      district: "Gampaha",
      placeType: "Eco Park",
      description: "Community park featuring lotus flower ponds, outdoor fitness tracks, and resting pavilions.",
      imageUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
      lat: 7.0928,
      lng: 80.0389
    },
    {
      id: "gampaha-t28",
      name: "Karuwalagaswewa Stream Nature Trail",
      district: "Gampaha",
      placeType: "Nature Trail",
      description: "Eco-walking path along freshwater streams popular for observing endemic butterflies.",
      imageUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80",
      lat: 7.0789,
      lng: 79.8972
    }
  ],
  food: [
    {
      id: "gampaha-f1",
      name: "Lords Restaurant Complex",
      district: "Gampaha",
      placeType: "Restaurant",
      description: "Top-rated multi-cuisine restaurant complex in Negombo offering seafood, Asian, and European fare.",
      imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
      lat: 7.2289,
      lng: 79.8408
    },
    {
      id: "gampaha-f2",
      name: "The King Coconut Restaurant",
      district: "Gampaha",
      placeType: "Seafood Restaurant",
      description: "Beachfront dining on Negombo sands serving fresh grilled jumbo prawns, calamari, and devilled crab.",
      imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
      lat: 7.2261,
      lng: 79.8406
    },
    {
      id: "gampaha-f3",
      name: "Bua Thai Restaurant",
      district: "Gampaha",
      placeType: "Thai Restaurant",
      description: "Authentic Thai green curry, tom yum soup, and pad thai served in oceanfront settings.",
      imageUrl: "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=800&q=80",
      lat: 7.2278,
      lng: 79.8409
    },
    {
      id: "gampaha-f4",
      name: "Savour Family Restaurant",
      district: "Gampaha",
      placeType: "Family Restaurant",
      description: "Popular local buffet serving rice and curry, string hoppers, fried rice, and fresh fruit juices.",
      imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
      lat: 7.0897,
      lng: 79.9964
    },
    {
      id: "gampaha-f5",
      name: "Hela Bojun Hala Gampaha",
      district: "Gampaha",
      placeType: "Traditional Eats",
      description: "Government-supported eatery serving healthy Sri Lankan herbal porridge, hopper, and authentic snacks.",
      imageUrl: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80",
      lat: 7.0911,
      lng: 79.9981
    },
    {
      id: "gampaha-f6",
      name: "Fab Pastry Shop Kiribathgoda",
      district: "Gampaha",
      placeType: "Bakery & Cafe",
      description: "Famous bakery chain known for chicken rolls, fish buns, lamprais, and gateaux cakes.",
      imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
      lat: 6.9803,
      lng: 79.9289
    },
    {
      id: "gampaha-f7",
      name: "Perera & Sons (P&S) Gampaha",
      district: "Gampaha",
      placeType: "Fast Food Bakery",
      description: "Classic Sri Lankan bakery chain offering short eats, eclairs, rice plates, and iced coffee.",
      imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
      lat: 7.0917,
      lng: 79.9953
    },
    {
      id: "gampaha-f8",
      name: "Dolce Vita Negombo",
      district: "Gampaha",
      placeType: "Italian Cafe",
      description: "Authentic Italian wood-fired pizza, espresso coffee, and homemade gelato on Lewis Place.",
      imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
      lat: 7.2247,
      lng: 79.8403
    },
    {
      id: "gampaha-f9",
      name: "Prego Italian Restaurant",
      district: "Gampaha",
      placeType: "Italian Fine Dining",
      description: "Cozy Italian bistro serving gourmet pasta, wine, and wood-stove baked artisan bread.",
      imageUrl: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80",
      lat: 7.2258,
      lng: 79.8405
    },
    {
      id: "gampaha-f10",
      name: "Seafood Cove at Goldi Sands",
      district: "Gampaha",
      placeType: "Seafood Grill",
      description: "Open-air beach cove dining serving grilled butter garlic cuttlefish and lobster platters.",
      imageUrl: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80",
      lat: 7.2306,
      lng: 79.8411
    },
    {
      id: "gampaha-f11",
      name: "Jaya Srilankan Restaurant",
      district: "Gampaha",
      placeType: "Traditional Dining",
      description: "Authentic clay pot Sri Lankan buffet served on fresh banana leaves in Ja-Ela.",
      imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
      lat: 7.0758,
      lng: 79.8925
    },
    {
      id: "gampaha-f12",
      name: "Dynamic Cafe & Diner",
      district: "Gampaha",
      placeType: "Modern Cafe",
      description: "Modern espresso bar serving gourmet burgers, artisan sandwiches, and thick milkshakes.",
      imageUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80",
      lat: 7.0014,
      lng: 79.9519
    },
    {
      id: "gampaha-f13",
      name: "Subway Katunayake Airport",
      district: "Gampaha",
      placeType: "Fast Food",
      description: "Fresh custom submarine sandwiches, wraps, and cookies for travelers near airport hub.",
      imageUrl: "https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=800&q=80",
      lat: 7.1803,
      lng: 79.8856
    },
    {
      id: "gampaha-f14",
      name: "Wasana Bakers & Restaurant",
      district: "Gampaha",
      placeType: "Bakery",
      description: "Freshly baked artisan bread, rolls, kottu roti, and hot Chinese fried rice.",
      imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
      lat: 7.2142,
      lng: 79.8458
    },
    {
      id: "gampaha-f15",
      name: "Steam Boat Restaurant Peliyagoda",
      district: "Gampaha",
      placeType: "Chinese Restaurant",
      description: "Family Chinese restaurant famous for fried rice, hot butter cuttlefish, and sweet & sour pork.",
      imageUrl: "https://images.unsplash.com/photo-1525610553991-2bede1a236e2?auto=format&fit=crop&w=800&q=80",
      lat: 6.9608,
      lng: 79.8892
    },
    {
      id: "gampaha-f16",
      name: "Green Cabin Cafe Gampaha",
      district: "Gampaha",
      placeType: "Heritage Cafe",
      description: "Historic Sri Lankan tearoom offering traditional egg hoppers, pol sambol, and Ceylon tea.",
      imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
      lat: 7.0903,
      lng: 79.9978
    },
    {
      id: "gampaha-f17",
      name: "Kamatha Village Dining",
      district: "Gampaha",
      placeType: "Village Restaurant",
      description: "Rustic dining pavilion overlooking green paddy fields in Minuwangoda serving organic village curries.",
      imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
      lat: 7.1722,
      lng: 79.9589
    },
    {
      id: "gampaha-f18",
      name: "Kavasi Kade Lamprais",
      district: "Gampaha",
      placeType: "Lamprais Spot",
      description: "Authentic Dutch Burgher lamprais baked in banana leaf with mixed meat curry and blachan.",
      imageUrl: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80",
      lat: 6.9811,
      lng: 79.9306
    },
    {
      id: "gampaha-f19",
      name: "Spicy Crab Shack Pamunugama",
      district: "Gampaha",
      placeType: "Seafood Shack",
      description: "Lagoon-side rustic seafood shack specializing in black pepper crab and chilli garlic prawns.",
      imageUrl: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80",
      lat: 7.1289,
      lng: 79.8436
    },
    {
      id: "gampaha-f20",
      name: "Burger King Wattala",
      district: "Gampaha",
      placeType: "Fast Food",
      description: "Flame-grilled Whopper burgers, chicken tenders, and french fries on Negombo Road.",
      imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
      lat: 6.9836,
      lng: 79.8911
    },
    {
      id: "gampaha-f21",
      name: "Pizza Hut Gampaha Town",
      district: "Gampaha",
      placeType: "Pizzeria",
      description: "Pan pizza, garlic bread, wings, and pasta for dine-in and quick delivery.",
      imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
      lat: 7.0914,
      lng: 79.9967
    },
    {
      id: "gampaha-f22",
      name: "KFC Kadawatha Highway Hub",
      district: "Gampaha",
      placeType: "Fast Food",
      description: "Crispy fried chicken, zinger burgers, and twister wraps near expressway entrance.",
      imageUrl: "https://images.unsplash.com/photo-1513185158878-8d8c2a2a3da3?auto=format&fit=crop&w=800&q=80",
      lat: 7.0022,
      lng: 79.9506
    },
    {
      id: "gampaha-f23",
      name: "Serendib Seafood Grill",
      district: "Gampaha",
      placeType: "Seafood Restaurant",
      description: "Catch of the day fish and cuttlefish grilled over coconut husks right on Negombo beach.",
      imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
      lat: 7.2269,
      lng: 79.8407
    },
    {
      id: "gampaha-f24",
      name: "Ranweli Eco Restaurant",
      district: "Gampaha",
      placeType: "Eco Buffet",
      description: "Organic buffet served in a mangrove estuary peninsula accessible by river ferry.",
      imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
      lat: 7.2611,
      lng: 79.8425
    },
    {
      id: "gampaha-f25",
      name: "Cafe Mojo Wattala",
      district: "Gampaha",
      placeType: "Cafe",
      description: "Trendy espresso bar serving iced lattes, avocado poached eggs, and cheesecake.",
      imageUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80",
      lat: 6.9861,
      lng: 79.8933
    },
    {
      id: "gampaha-f26",
      name: "Grand Thai Negombo",
      district: "Gampaha",
      placeType: "Asian Restaurant",
      description: "Elegant fine-dining Asian restaurant known for papaya salad and coconut curries.",
      imageUrl: "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=800&q=80",
      lat: 7.2281,
      lng: 79.8408
    }
  ],
  stay: [
    {
      id: "gampaha-s1",
      name: "Heritance Negombo",
      district: "Gampaha",
      placeType: "5-Star Resort",
      description: "Luxury 5-star beachfront resort featuring expansive swimming pool, spa, and ocean view suites.",
      imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      lat: 7.2267,
      lng: 79.8403
    },
    {
      id: "gampaha-s2",
      name: "Jetwing Beach Negombo",
      district: "Gampaha",
      placeType: "Luxury Hotel",
      description: "Geoffrey Bawa-designed luxury beachfront sanctuary offering fine dining and wellness spa.",
      imageUrl: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
      lat: 7.2294,
      lng: 79.8408
    },
    {
      id: "gampaha-s3",
      name: "Jetwing Blue",
      district: "Gampaha",
      placeType: "Beach Resort",
      description: "Contemporary seaside resort with palm tree lawns, dual swimming pools, and oceanfront suites.",
      imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
      lat: 7.2283,
      lng: 79.8406
    },
    {
      id: "gampaha-s4",
      name: "Goldi Sands Hotel",
      district: "Gampaha",
      placeType: "Beach Resort",
      description: "Classic beachfront hotel on Ethukala sand strip with cultural shows and seafood buffet.",
      imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
      lat: 7.2308,
      lng: 79.8411
    },
    {
      id: "gampaha-s5",
      name: "Amagi Aria Negombo Lagoon",
      district: "Gampaha",
      placeType: "Lagoon Resort",
      description: "Peaceful lagoon-front resort offering boardwalk dining and water sunset views.",
      imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      lat: 7.2028,
      lng: 79.8514
    },
    {
      id: "gampaha-s6",
      name: "The Wallawwa Kotugoda",
      district: "Gampaha",
      placeType: "Boutique Villa",
      description: "Restored 200-year-old colonial manor house set amidst acres of manicured tropical gardens near airport.",
      imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
      lat: 7.1264,
      lng: 79.9372
    },
    {
      id: "gampaha-s7",
      name: "Regenta Hotel Katunayake",
      district: "Gampaha",
      placeType: "Airport Hotel",
      description: "Modern business transit hotel 5 minutes from Bandaranaike International Airport terminals.",
      imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      lat: 7.1783,
      lng: 79.8828
    },
    {
      id: "gampaha-s8",
      name: "Averena Hotel Gampaha",
      district: "Gampaha",
      placeType: "City Hotel",
      description: "Comfortable city hotel with banquet facilities, restaurant, and central access to Gampaha town.",
      imageUrl: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
      lat: 7.0911,
      lng: 79.9986
    },
    {
      id: "gampaha-s9",
      name: "Wet Water Resort Gampaha",
      district: "Gampaha",
      placeType: "Eco Resort",
      description: "Family-friendly garden resort with water park, chalets, and swimming pools.",
      imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
      lat: 7.0925,
      lng: 80.0114
    },
    {
      id: "gampaha-s10",
      name: "Saninro Hotel Ragama",
      district: "Gampaha",
      placeType: "Boutique Hotel",
      description: "Convenient boutique hotel in Ragama close to medical hubs and rail stations.",
      imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
      lat: 7.0289,
      lng: 79.9244
    },
    {
      id: "gampaha-s11",
      name: "Camelot Beach Hotel",
      district: "Gampaha",
      placeType: "Beach Hotel",
      description: "Lively beach hotel on Negombo coast with sun loungers, outdoor pool, and entertainment.",
      imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      lat: 7.2253,
      lng: 79.8403
    },
    {
      id: "gampaha-s12",
      name: "Airport Transit Hotel Katunayake",
      district: "Gampaha",
      placeType: "Transit Hotel",
      description: "Short-stay transit hotel offering 24-hour check-in and airport shuttle service.",
      imageUrl: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
      lat: 7.1811,
      lng: 79.8839
    },
    {
      id: "gampaha-s13",
      name: "Hotel Clarion Kiribathgoda",
      district: "Gampaha",
      placeType: "Business Hotel",
      description: "Established business hotel with multi-cuisine dining, conference halls, and pool on Kandy Road.",
      imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
      lat: 6.9794,
      lng: 79.9281
    },
    {
      id: "gampaha-s14",
      name: "Tamarind Tree Resort Minuwangoda",
      district: "Gampaha",
      placeType: "Villa Resort",
      description: "Private garden bungalows set amidst peaceful tamarind tree groves.",
      imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
      lat: 7.1683,
      lng: 79.9567
    },
    {
      id: "gampaha-s15",
      name: "Suriya Luxury Resort Waikkal",
      district: "Gampaha",
      placeType: "Eco Luxury Resort",
      description: "Secluded coastal luxury resort surrounded by mangroves and private beach access.",
      imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      lat: 7.2639,
      lng: 79.8417
    },
    {
      id: "gampaha-s16",
      name: "Ramada by Wyndham Katunayake",
      district: "Gampaha",
      placeType: "Airport Resort",
      description: "Upscale international airport hotel with poolside bar, spa, and fitness center.",
      imageUrl: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
      lat: 7.1631,
      lng: 79.8789
    },
    {
      id: "gampaha-s17",
      name: "Beacon Beach Hotel Negombo",
      district: "Gampaha",
      placeType: "Beachfront Hotel",
      description: "Modern seaside stay featuring rooftop infinity pool overlooking the Indian Ocean.",
      imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
      lat: 7.2275,
      lng: 79.8407
    },
    {
      id: "gampaha-s18",
      name: "Pegasus Reef Hotel Wattala",
      district: "Gampaha",
      placeType: "Beach Resort",
      description: "Historic coastal hotel surrounded by palm gardens close to Colombo city boundary.",
      imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
      lat: 6.9725,
      lng: 79.8719
    },
    {
      id: "gampaha-s19",
      name: "Paradise Holiday Village",
      district: "Gampaha",
      placeType: "Apartment Hotel",
      description: "Budget apartments and swimming pool villas steps away from Negombo beach strip.",
      imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      lat: 7.2239,
      lng: 79.8401
    },
    {
      id: "gampaha-s20",
      name: "Ronaka Eco Lodge Ja-Ela",
      district: "Gampaha",
      placeType: "Eco Lodge",
      description: "Lakeside eco-villas surrounded by marsh bird sanctuary wetlands.",
      imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
      lat: 7.0781,
      lng: 79.8964
    },
    {
      id: "gampaha-s21",
      name: "Nature Breeze Resort Yakkala",
      district: "Gampaha",
      placeType: "Country Resort",
      description: "Peaceful countryside resort surrounded by green rubber plantations.",
      imageUrl: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
      lat: 7.0944,
      lng: 80.0361
    },
    {
      id: "gampaha-s22",
      name: "Villa Araliya Negombo",
      district: "Gampaha",
      placeType: "Boutique Guest House",
      description: "Charming boutique guest house with outdoor swimming pool and tropical courtyard.",
      imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
      lat: 7.2286,
      lng: 79.8414
    },
    {
      id: "gampaha-s23",
      name: "Blue Horizon Guest House",
      district: "Gampaha",
      placeType: "Guest House",
      description: "Budget-friendly backpacker stay on Lewis Place near coastal cafes.",
      imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
      lat: 7.2228,
      lng: 79.8398
    },
    {
      id: "gampaha-s24",
      name: "Airport City Hub Hotel Seeduwa",
      district: "Gampaha",
      placeType: "Transit Hotel",
      description: "Modern hotel providing air-conditioned rooms and airport pickup service.",
      imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      lat: 7.1247,
      lng: 79.8781
    },
    {
      id: "gampaha-s25",
      name: "Ranweli Holiday Village Pamunugama",
      district: "Gampaha",
      placeType: "Eco Resort",
      description: "Bungalow resort situated on a mangrove peninsula accessed by river boat ferry.",
      imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
      lat: 7.2608,
      lng: 79.8422
    },
    {
      id: "gampaha-s26",
      name: "Melvik Residence Gampaha",
      district: "Gampaha",
      placeType: "Homestay",
      description: "Homely residence with private garden rooms near Henarathgoda botanical garden.",
      imageUrl: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
      lat: 7.0892,
      lng: 79.9972
    }
  ],
  fuel: [
    {
      id: "gampaha-u1",
      name: "Ceypetco Main Station Gampaha",
      district: "Gampaha",
      placeType: "Fuel Station",
      description: "24/7 petrol & diesel filling station located in Gampaha town centre.",
      imageUrl: "https://images.unsplash.com/photo-1527018601619-a508a2be00ce?auto=format&fit=crop&w=800&q=80",
      lat: 7.0917,
      lng: 79.9961
    },
    {
      id: "gampaha-u2",
      name: "LIOC Fuel Station Kadawatha",
      district: "Gampaha",
      placeType: "Fuel Station",
      description: "Major fuel station located near Kadawatha expressway interchange.",
      imageUrl: "https://images.unsplash.com/photo-1527018601619-a508a2be00ce?auto=format&fit=crop&w=800&q=80",
      lat: 7.0019,
      lng: 79.9514
    },
    {
      id: "gampaha-u3",
      name: "Ceypetco Filling Station Negombo",
      district: "Gampaha",
      placeType: "Fuel Station",
      description: "Convenient petrol shed on Negombo Beach Road serving motorists and coastal tourists.",
      imageUrl: "https://images.unsplash.com/photo-1527018601619-a508a2be00ce?auto=format&fit=crop&w=800&q=80",
      lat: 7.2147,
      lng: 79.8453
    },
    {
      id: "gampaha-u4",
      name: "LIOC Mega Station Katunayake",
      district: "Gampaha",
      placeType: "Fuel Station",
      description: "Mega fuel station at airport highway entrance with convenience store and air pumps.",
      imageUrl: "https://images.unsplash.com/photo-1527018601619-a508a2be00ce?auto=format&fit=crop&w=800&q=80",
      lat: 7.1772,
      lng: 79.8833
    },
    {
      id: "gampaha-u5",
      name: "Ceypetco Station Ja-Ela",
      district: "Gampaha",
      placeType: "Fuel Station",
      description: "24-hour petrol and auto diesel station on Colombo-Negombo main road.",
      imageUrl: "https://images.unsplash.com/photo-1527018601619-a508a2be00ce?auto=format&fit=crop&w=800&q=80",
      lat: 7.0753,
      lng: 79.8928
    },
    {
      id: "gampaha-u6",
      name: "LAUGFS Eco Fuel Station Wattala",
      district: "Gampaha",
      placeType: "Fuel Station",
      description: "LAUGFS auto fuel station with quick lube service on A1 road.",
      imageUrl: "https://images.unsplash.com/photo-1527018601619-a508a2be00ce?auto=format&fit=crop&w=800&q=80",
      lat: 6.9844,
      lng: 79.8922
    },
    {
      id: "gampaha-u7",
      name: "LIOC Fuel Mart Kiribathgoda",
      district: "Gampaha",
      placeType: "Fuel Station",
      description: "Busy fuel station at Kiribathgoda town junction with Nitrogen tire fill.",
      imageUrl: "https://images.unsplash.com/photo-1527018601619-a508a2be00ce?auto=format&fit=crop&w=800&q=80",
      lat: 6.9808,
      lng: 79.9294
    },
    {
      id: "gampaha-u8",
      name: "Ceypetco Shed Ragama",
      district: "Gampaha",
      placeType: "Fuel Station",
      description: "Fuel shed near Ragama teaching hospital and rail station.",
      imageUrl: "https://images.unsplash.com/photo-1527018601619-a508a2be00ce?auto=format&fit=crop&w=800&q=80",
      lat: 7.0281,
      lng: 79.9239
    },
    {
      id: "gampaha-u9",
      name: "Ceypetco Station Nittambuwa",
      district: "Gampaha",
      placeType: "Fuel Station",
      description: "Key refueling point on Kandy main highway at Nittambuwa junction.",
      imageUrl: "https://images.unsplash.com/photo-1527018601619-a508a2be00ce?auto=format&fit=crop&w=800&q=80",
      lat: 7.1442,
      lng: 80.1011
    },
    {
      id: "gampaha-u10",
      name: "LIOC Fuel Point Minuwangoda",
      district: "Gampaha",
      placeType: "Fuel Station",
      description: "Petrol and super diesel refuel stop in Minuwangoda town center.",
      imageUrl: "https://images.unsplash.com/photo-1527018601619-a508a2be00ce?auto=format&fit=crop&w=800&q=80",
      lat: 7.1694,
      lng: 79.9547
    },
    {
      id: "gampaha-u11",
      name: "Ceypetco Filling Station Yakkala",
      district: "Gampaha",
      placeType: "Fuel Station",
      description: "Fuel shed at Yakkala highway junction.",
      imageUrl: "https://images.unsplash.com/photo-1527018601619-a508a2be00ce?auto=format&fit=crop&w=800&q=80",
      lat: 7.0936,
      lng: 80.0375
    },
    {
      id: "gampaha-u12",
      name: "LAUGFS Fuel Peliyagoda Interchange",
      district: "Gampaha",
      placeType: "Fuel Station",
      description: "Major Expressway interchange fuel station serving heavy transport and cars.",
      imageUrl: "https://images.unsplash.com/photo-1527018601619-a508a2be00ce?auto=format&fit=crop&w=800&q=80",
      lat: 6.9614,
      lng: 79.8886
    },
    {
      id: "gampaha-u13",
      name: "Ceypetco Station Veyangoda",
      district: "Gampaha",
      placeType: "Fuel Station",
      description: "Fuel station near Veyangoda railway gate.",
      imageUrl: "https://images.unsplash.com/photo-1527018601619-a508a2be00ce?auto=format&fit=crop&w=800&q=80",
      lat: 7.1558,
      lng: 80.0542
    },
    {
      id: "gampaha-u14",
      name: "LIOC Station Seeduwa",
      district: "Gampaha",
      placeType: "Fuel Station",
      description: "Convenient petrol pump along Colombo-Katunayake highway.",
      imageUrl: "https://images.unsplash.com/photo-1527018601619-a508a2be00ce?auto=format&fit=crop&w=800&q=80",
      lat: 7.1239,
      lng: 79.8778
    },
    {
      id: "gampaha-u15",
      name: "Ceypetco Shed Kelaniya",
      district: "Gampaha",
      placeType: "Fuel Station",
      description: "Fuel filling station near Kelaniya Rajamaha Viharaya access road.",
      imageUrl: "https://images.unsplash.com/photo-1527018601619-a508a2be00ce?auto=format&fit=crop&w=800&q=80",
      lat: 6.9567,
      lng: 79.9194
    },
    {
      id: "gampaha-u16",
      name: "Ceypetco Station Biyagama Zone",
      district: "Gampaha",
      placeType: "Fuel Station",
      description: "High-capacity fuel station serving Biyagama industrial zone.",
      imageUrl: "https://images.unsplash.com/photo-1527018601619-a508a2be00ce?auto=format&fit=crop&w=800&q=80",
      lat: 6.9467,
      lng: 79.9781
    },
    {
      id: "gampaha-u17",
      name: "LIOC Station Mahara Junction",
      district: "Gampaha",
      placeType: "Fuel Station",
      description: "Refueling station on Kandy Road at Mahara.",
      imageUrl: "https://images.unsplash.com/photo-1527018601619-a508a2be00ce?auto=format&fit=crop&w=800&q=80",
      lat: 7.0139,
      lng: 79.9611
    },
    {
      id: "gampaha-u18",
      name: "Ceypetco Miriswatta Shed",
      district: "Gampaha",
      placeType: "Fuel Station",
      description: "24-hour petrol shed at Miriswatta cross junction.",
      imageUrl: "https://images.unsplash.com/photo-1527018601619-a508a2be00ce?auto=format&fit=crop&w=800&q=80",
      lat: 7.0872,
      lng: 80.0125
    },
    {
      id: "gampaha-u19",
      name: "LAUGFS Fuel Kandana",
      district: "Gampaha",
      placeType: "Fuel Station",
      description: "Modern fuel station with car wash service in Kandana town.",
      imageUrl: "https://images.unsplash.com/photo-1527018601619-a508a2be00ce?auto=format&fit=crop&w=800&q=80",
      lat: 7.0469,
      lng: 79.8975
    },
    {
      id: "gampaha-u20",
      name: "Ceypetco Station Pamunugama",
      district: "Gampaha",
      placeType: "Fuel Station",
      description: "Coastal fuel stop along Pamunugama lagoon road.",
      imageUrl: "https://images.unsplash.com/photo-1527018601619-a508a2be00ce?auto=format&fit=crop&w=800&q=80",
      lat: 7.1311,
      lng: 79.8439
    },
    {
      id: "gampaha-u21",
      name: "LIOC Station Divulapitiya",
      district: "Gampaha",
      placeType: "Fuel Station",
      description: "Fuel point serving agricultural and rural transport in Divulapitiya.",
      imageUrl: "https://images.unsplash.com/photo-1527018601619-a508a2be00ce?auto=format&fit=crop&w=800&q=80",
      lat: 7.2189,
      lng: 80.0167
    },
    {
      id: "gampaha-u22",
      name: "Ceypetco Station Attanagalla",
      district: "Gampaha",
      placeType: "Fuel Station",
      description: "Fuel shed near Attanagalla temple junction.",
      imageUrl: "https://images.unsplash.com/photo-1527018601619-a508a2be00ce?auto=format&fit=crop&w=800&q=80",
      lat: 7.1075,
      lng: 80.1272
    },
    {
      id: "gampaha-u23",
      name: "Ceypetco Station Mirigama",
      district: "Gampaha",
      placeType: "Fuel Station",
      description: "Refueling station in Mirigama town near Central Expressway.",
      imageUrl: "https://images.unsplash.com/photo-1527018601619-a508a2be00ce?auto=format&fit=crop&w=800&q=80",
      lat: 7.2425,
      lng: 80.1294
    },
    {
      id: "gampaha-u24",
      name: "LIOC Station Ganemulla",
      district: "Gampaha",
      placeType: "Fuel Station",
      description: "Auto refuel shed near Ganemulla railway station.",
      imageUrl: "https://images.unsplash.com/photo-1527018601619-a508a2be00ce?auto=format&fit=crop&w=800&q=80",
      lat: 7.0608,
      lng: 79.9592
    },
    {
      id: "gampaha-u25",
      name: "Ceypetco Express Kotugoda",
      district: "Gampaha",
      placeType: "Fuel Station",
      description: "Express petrol and diesel refuel hub on Minuwangoda highway.",
      imageUrl: "https://images.unsplash.com/photo-1527018601619-a508a2be00ce?auto=format&fit=crop&w=800&q=80",
      lat: 7.1278,
      lng: 79.9389
    }
  ],
  transport: [
    {
      id: "gampaha-tr1",
      name: "Bandaranaike International Airport (BIA)",
      district: "Gampaha",
      placeType: "International Airport",
      description: "Sri Lanka's primary international airport terminal situated in Katunayake.",
      imageUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80",
      lat: 7.1808,
      lng: 79.8842
    },
    {
      id: "gampaha-tr2",
      name: "Gampaha Central Bus Stand",
      district: "Gampaha",
      placeType: "Bus Terminal",
      description: "Main intercity bus stand connecting Gampaha to Colombo, Kandy, and Negombo.",
      imageUrl: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80",
      lat: 7.0919,
      lng: 79.9972
    },
    {
      id: "gampaha-tr3",
      name: "Gampaha Railway Station",
      district: "Gampaha",
      placeType: "Railway Station",
      description: "Major railway junction on Sri Lanka's Main Line connecting Colombo Fort to Kandy.",
      imageUrl: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=800&q=80",
      lat: 7.0908,
      lng: 79.9958
    },
    {
      id: "gampaha-tr4",
      name: "Ragama Railway Junction",
      district: "Gampaha",
      placeType: "Railway Station",
      description: "Crucial rail junction splitting the Main Line to Upcountry and Puttalam Line to Negombo.",
      imageUrl: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=800&q=80",
      lat: 7.0283,
      lng: 79.9236
    },
    {
      id: "gampaha-tr5",
      name: "Negombo Railway Station",
      district: "Gampaha",
      placeType: "Railway Station",
      description: "Coastal train terminal linking Negombo town to Colombo and northern Puttalam route.",
      imageUrl: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=800&q=80",
      lat: 7.2128,
      lng: 79.8475
    },
    {
      id: "gampaha-tr6",
      name: "Katunayake Railway Station",
      district: "Gampaha",
      placeType: "Railway Station",
      description: "Railway station serving Katunayake Export Processing Zone and Airport access.",
      imageUrl: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=800&q=80",
      lat: 7.1736,
      lng: 79.8803
    },
    {
      id: "gampaha-tr7",
      name: "Kadawatha Expressway Terminal",
      district: "Gampaha",
      placeType: "Multimodal Terminal",
      description: "Major expressway bus terminal connecting Southern, Central, and Outer Circular expressways.",
      imageUrl: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80",
      lat: 7.0014,
      lng: 79.9511
    },
    {
      id: "gampaha-tr8",
      name: "Veyangoda Railway Station",
      district: "Gampaha",
      placeType: "Railway Station",
      description: "Historic main line station serving major regional passenger connections.",
      imageUrl: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=800&q=80",
      lat: 7.1553,
      lng: 80.0536
    },
    {
      id: "gampaha-tr9",
      name: "Ja-Ela Bus Stand",
      district: "Gampaha",
      placeType: "Bus Stand",
      description: "High-volume bus stop connecting A3 highway coastal routes and expressway buses.",
      imageUrl: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80",
      lat: 7.0747,
      lng: 79.8919
    },
    {
      id: "gampaha-tr10",
      name: "Peliyagoda Integrated Transport Hub",
      district: "Gampaha",
      placeType: "Transport Hub",
      description: "Major transport node connecting fish market, wholesale markets, and Colombo entrance.",
      imageUrl: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80",
      lat: 6.9606,
      lng: 79.8889
    },
    {
      id: "gampaha-tr11",
      name: "Wattala Bus Terminal",
      district: "Gampaha",
      placeType: "Bus Stop",
      description: "Major suburban bus stop along the Colombo-Negombo main road.",
      imageUrl: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80",
      lat: 6.9839,
      lng: 79.8914
    },
    {
      id: "gampaha-tr12",
      name: "Kiribathgoda Bus Depot Stand",
      district: "Gampaha",
      placeType: "Bus Depot",
      description: "Busy passenger terminal on A1 road for Colombo-Kandy route buses.",
      imageUrl: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80",
      lat: 6.9803,
      lng: 79.9289
    },
    {
      id: "gampaha-tr13",
      name: "Nittambuwa Central Bus Stand",
      district: "Gampaha",
      placeType: "Bus Stand",
      description: "SLTB bus depot and passenger station serving eastern Gampaha.",
      imageUrl: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80",
      lat: 7.1439,
      lng: 80.1006
    },
    {
      id: "gampaha-tr14",
      name: "Minuwangoda Central Bus Stand",
      district: "Gampaha",
      placeType: "Bus Stand",
      description: "Key regional bus station connecting Gampaha to Divulapitiya and Negombo.",
      imageUrl: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80",
      lat: 7.1689,
      lng: 79.9542
    },
    {
      id: "gampaha-tr15",
      name: "Ganemulla Railway Station",
      district: "Gampaha",
      placeType: "Railway Station",
      description: "Commuter rail stop on main line between Ragama and Gampaha.",
      imageUrl: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=800&q=80",
      lat: 7.0603,
      lng: 79.9586
    },
    {
      id: "gampaha-tr16",
      name: "Mirigama Railway Station",
      district: "Gampaha",
      placeType: "Railway Station",
      description: "Railway station serving northern Gampaha district commuters.",
      imageUrl: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=800&q=80",
      lat: 7.2419,
      lng: 80.1286
    },
    {
      id: "gampaha-tr17",
      name: "Seeduwa Bus Stop",
      district: "Gampaha",
      placeType: "Bus Stop",
      description: "High-frequency bus stop serving Katunayake free trade zone workers.",
      imageUrl: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80",
      lat: 7.1242,
      lng: 79.8772
    },
    {
      id: "gampaha-tr18",
      name: "Kandana Railway Station",
      district: "Gampaha",
      placeType: "Railway Station",
      description: "Railway stop on Puttalam line serving Kandana town.",
      imageUrl: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=800&q=80",
      lat: 7.0461,
      lng: 79.8969
    },
    {
      id: "gampaha-tr19",
      name: "Biyagama Bus Stand",
      district: "Gampaha",
      placeType: "Bus Stand",
      description: "Transport terminal serving Biyagama Export Processing Zone.",
      imageUrl: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80",
      lat: 6.9461,
      lng: 79.9775
    },
    {
      id: "gampaha-tr20",
      name: "Kelaniya Railway Station",
      district: "Gampaha",
      placeType: "Railway Station",
      description: "Suburban railway station close to Kelani river and temple grounds.",
      imageUrl: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=800&q=80",
      lat: 6.9558,
      lng: 79.9186
    },
    {
      id: "gampaha-tr21",
      name: "Kudahakapola Railway Halt",
      district: "Gampaha",
      placeType: "Train Halt",
      description: "Commuter train halt on the Puttalam railway line.",
      imageUrl: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=800&q=80",
      lat: 7.0878,
      lng: 79.8889
    },
    {
      id: "gampaha-tr22",
      name: "Enderamulla Train Halt",
      district: "Gampaha",
      placeType: "Train Halt",
      description: "Local train halt between Ragama and Kelaniya.",
      imageUrl: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=800&q=80",
      lat: 7.0011,
      lng: 79.9281
    },
    {
      id: "gampaha-tr23",
      name: "Walpola Railway Station",
      district: "Gampaha",
      placeType: "Railway Station",
      description: "Suburban train station near Batuwatta on Main Line.",
      imageUrl: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=800&q=80",
      lat: 7.0425,
      lng: 79.9439
    },
    {
      id: "gampaha-tr24",
      name: "Negombo Central Bus Depot",
      district: "Gampaha",
      placeType: "Bus Depot",
      description: "Main bus depot serving coastal Negombo, Chilaw, and Colombo routes.",
      imageUrl: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80",
      lat: 7.2117,
      lng: 79.8450
    },
    {
      id: "gampaha-tr25",
      name: "Katunayake Airport Shuttle Terminal",
      district: "Gampaha",
      placeType: "Shuttle Station",
      description: "Express passenger shuttle terminal linking BIA Katunayake to Colombo Expressway.",
      imageUrl: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80",
      lat: 7.1794,
      lng: 79.8853
    }
  ],
  repairsAndRentals: [
    {
      id: "gampaha-r1",
      name: "Toyota Lanka Service Centre Wattala",
      district: "Gampaha",
      placeType: "Authorized Auto Care",
      description: "Authorized Toyota service facility for maintenance, spare parts, and engine diagnostics.",
      imageUrl: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80",
      lat: 6.9850,
      lng: 79.8928
    },
    {
      id: "gampaha-r2",
      name: "David Pieris Motor Co (Bajaj) Gampaha",
      district: "Gampaha",
      placeType: "TukTuk & Bike Service",
      description: "Official Bajaj service center for three-wheelers and Pulsar motorcycles.",
      imageUrl: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80",
      lat: 7.0908,
      lng: 79.9969
    },
    {
      id: "gampaha-r3",
      name: "AMW Pitstop Kadawatha",
      district: "Gampaha",
      placeType: "Auto Service",
      description: "Quick lube, battery replace, and hybrid car checkup facility on Kandy Road.",
      imageUrl: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80",
      lat: 7.0017,
      lng: 79.9517
    },
    {
      id: "gampaha-r4",
      name: "Negombo Scooter & Bike Rentals",
      district: "Gampaha",
      placeType: "Vehicle Rental",
      description: "Popular scooter, motorcycle, and bicycle rental shop for tourists on Lewis Place.",
      imageUrl: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80",
      lat: 7.2256,
      lng: 79.8404
    },
    {
      id: "gampaha-r5",
      name: "Auto Miraj Car Care Gampaha",
      district: "Gampaha",
      placeType: "Car Detailing",
      description: "Full body car wash, interior shampooing, and ceramic coating detailing center.",
      imageUrl: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=800&q=80",
      lat: 7.0914,
      lng: 79.9978
    },
    {
      id: "gampaha-r6",
      name: "United Motors Service Hub Peliyagoda",
      district: "Gampaha",
      placeType: "Auto Repair",
      description: "Authorized Mitsubishi and Valvoline care facility near highway interchange.",
      imageUrl: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80",
      lat: 6.9611,
      lng: 79.8894
    },
    {
      id: "gampaha-r7",
      name: "TVS Lanka Service Centre Kiribathgoda",
      district: "Gampaha",
      placeType: "Motorcycle Service",
      description: "Official TVS scooter and motorcycle maintenance workshop.",
      imageUrl: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80",
      lat: 6.9806,
      lng: 79.9292
    },
    {
      id: "gampaha-r8",
      name: "Ja-Ela Car Rental & Chauffeur",
      district: "Gampaha",
      placeType: "Car Hire",
      description: "Self-drive and luxury chauffeur vehicle rentals near expressway entrance.",
      imageUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
      lat: 7.0753,
      lng: 79.8922
    },
    {
      id: "gampaha-r9",
      name: "Sathira Auto Care Nittambuwa",
      district: "Gampaha",
      placeType: "Garage",
      description: "Engine overhauling, brake repair, and auto electrical garage on Kandy Road.",
      imageUrl: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80",
      lat: 7.1444,
      lng: 80.1014
    },
    {
      id: "gampaha-r10",
      name: "Rangana Motors TukTuk Repair",
      district: "Gampaha",
      placeType: "Mechanic Workshop",
      description: "Specialized three-wheeler engine tune-up and clutch repair in Minuwangoda.",
      imageUrl: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80",
      lat: 7.1691,
      lng: 79.9550
    },
    {
      id: "gampaha-r11",
      name: "Kandana Auto Electricals",
      district: "Gampaha",
      placeType: "Auto Electrician",
      description: "Battery replacement, alternator repairs, and vehicle wiring diagnostics.",
      imageUrl: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80",
      lat: 7.0464,
      lng: 79.8972
    },
    {
      id: "gampaha-r12",
      name: "Wattala Tyre House & Alignment",
      district: "Gampaha",
      placeType: "Tyre Shop",
      description: "Wheel balancing, computer alignment, and brand new tyres for cars and SUVs.",
      imageUrl: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=800&q=80",
      lat: 6.9842,
      lng: 79.8919
    },
    {
      id: "gampaha-r13",
      name: "Katunayake Airport Car Rental Desk",
      district: "Gampaha",
      placeType: "Car Rental",
      description: "International car rental counters (Avis, Malkey, SR Rent-a-Car) in BIA arrivals hall.",
      imageUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
      lat: 7.1806,
      lng: 79.8845
    },
    {
      id: "gampaha-r14",
      name: "Lanka Auto Hybrid Care Kadawatha",
      district: "Gampaha",
      placeType: "Hybrid Care",
      description: "Specialized high-voltage battery service for Prius, Grace, and Vezel hybrids.",
      imageUrl: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80",
      lat: 7.0025,
      lng: 79.9511
    },
    {
      id: "gampaha-r15",
      name: "Gampaha Scooter & Vehicle Hire",
      district: "Gampaha",
      placeType: "Vehicle Hire",
      description: "Daily and weekly scooter hire shop near Gampaha railway station.",
      imageUrl: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80",
      lat: 7.0911,
      lng: 79.9961
    },
    {
      id: "gampaha-r16",
      name: "Mahara Motor Garage",
      district: "Gampaha",
      placeType: "General Mechanic",
      description: "Suspension repair, oil change, and engine overhaul garage.",
      imageUrl: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80",
      lat: 7.0142,
      lng: 79.9614
    },
    {
      id: "gampaha-r17",
      name: "Negombo Auto AC Repairs",
      district: "Gampaha",
      placeType: "Auto AC Repair",
      description: "Air conditioner gas refilling, compressor repair, and leak fixing for vehicles.",
      imageUrl: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80",
      lat: 7.2136,
      lng: 79.8456
    },
    {
      id: "gampaha-r18",
      name: "Biyagama Industrial Garage",
      district: "Gampaha",
      placeType: "Heavy Vehicle Garage",
      description: "Lorry, van, and bus mechanical repair workshop near export zone.",
      imageUrl: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80",
      lat: 6.9464,
      lng: 79.9778
    },
    {
      id: "gampaha-r19",
      name: "Ragama Auto Service Centre",
      district: "Gampaha",
      placeType: "Auto Service",
      description: "Underwash, oil filter change, and lube station.",
      imageUrl: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=800&q=80",
      lat: 7.0286,
      lng: 79.9242
    },
    {
      id: "gampaha-r20",
      name: "Peliyagoda Heavy Vehicle Workshop",
      district: "Gampaha",
      placeType: "Lorry Repair",
      description: "Heavy truck maintenance and hydraulic trailer repairs.",
      imageUrl: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80",
      lat: 6.9617,
      lng: 79.8897
    },
    {
      id: "gampaha-r21",
      name: "Mirigama Motor Repair Works",
      district: "Gampaha",
      placeType: "Garage",
      description: "Local auto mechanic for diesel pumps and brake repairs.",
      imageUrl: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80",
      lat: 7.2422,
      lng: 80.1297
    },
    {
      id: "gampaha-r22",
      name: "Seeduwa Vehicle Care Hub",
      district: "Gampaha",
      placeType: "Car Wash",
      description: "Express vehicle washing and interior cleaning near airport road.",
      imageUrl: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=800&q=80",
      lat: 7.1244,
      lng: 79.8775
    },
    {
      id: "gampaha-r23",
      name: "Veyangoda Auto Service Garage",
      district: "Gampaha",
      placeType: "Garage",
      description: "General vehicle repair workshop near rail gate.",
      imageUrl: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80",
      lat: 7.1561,
      lng: 80.0539
    },
    {
      id: "gampaha-r24",
      name: "Kiribathgoda Bike Rent & Service",
      district: "Gampaha",
      placeType: "Bike Shop",
      description: "Bicycle rental and sports bike gear shop.",
      imageUrl: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80",
      lat: 6.9814,
      lng: 79.9297
    },
    {
      id: "gampaha-r25",
      name: "Kelaniya Auto Painting Workshop",
      district: "Gampaha",
      placeType: "Tinkering & Paint",
      description: "Tinkering, crash repair, and 2K paint booth service.",
      imageUrl: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80",
      lat: 6.9575,
      lng: 79.9192
    }
  ],
  emergencyServices: [
    {
      id: "gampaha-e1",
      name: "District General Hospital Gampaha",
      district: "Gampaha",
      placeType: "Government Hospital",
      description: "Primary tertiary government hospital in Gampaha with 24-hour emergency trauma unit and ICU.",
      imageUrl: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80",
      lat: 7.0894,
      lng: 79.9939
    },
    {
      id: "gampaha-e2",
      name: "District General Hospital Negombo",
      district: "Gampaha",
      placeType: "Government Hospital",
      description: "Major regional government hospital in Negombo offering emergency casualty care and surgical units.",
      imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
      lat: 7.2158,
      lng: 79.8436
    },
    {
      id: "gampaha-e3",
      name: "Colombo North Teaching Hospital Ragama",
      district: "Gampaha",
      placeType: "Teaching Hospital",
      description: "Premier university medical teaching hospital with specialized cardiology and neurology facilities.",
      imageUrl: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80",
      lat: 7.0278,
      lng: 79.9231
    },
    {
      id: "gampaha-e4",
      name: "Hemas Hospital Wattala",
      district: "Gampaha",
      placeType: "Private Hospital",
      description: "Leading private multi-specialty hospital with 24/7 emergency room, laboratory, and pharmacy.",
      imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
      lat: 6.9856,
      lng: 79.8925
    },
    {
      id: "gampaha-e5",
      name: "Nawaloka Hospital Negombo",
      district: "Gampaha",
      placeType: "Private Hospital",
      description: "Modern private hospital on Negombo Road offering emergency care, CT scans, and specialist clinics.",
      imageUrl: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80",
      lat: 7.2103,
      lng: 79.8472
    },
    {
      id: "gampaha-e6",
      name: "Gampaha Police Station HQ",
      district: "Gampaha",
      placeType: "Police Station",
      description: "District headquarters for Sri Lanka Police providing public security and emergency response.",
      imageUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80",
      lat: 7.0911,
      lng: 79.9961
    },
    {
      id: "gampaha-e7",
      name: "Negombo Police Station",
      district: "Gampaha",
      placeType: "Police Station",
      description: "Division police station serving Negombo town and coastal tourist belt.",
      imageUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80",
      lat: 7.2078,
      lng: 79.8361
    },
    {
      id: "gampaha-e8",
      name: "Katunayake Airport Police Station",
      district: "Gampaha",
      placeType: "Airport Police",
      description: "Dedicated airport police force providing 24/7 security at BIA Katunayake.",
      imageUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80",
      lat: 7.1814,
      lng: 79.8847
    },
    {
      id: "gampaha-e9",
      name: "1990 Suwa Seriya Ambulance Hub",
      district: "Gampaha",
      placeType: "Ambulance Service",
      description: "Free emergency paramedic ambulance dispatch hub for Gampaha region.",
      imageUrl: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80",
      lat: 7.0881,
      lng: 79.9914
    },
    {
      id: "gampaha-e10",
      name: "Arogya Hospital Gampaha",
      district: "Gampaha",
      placeType: "Private Hospital",
      description: "Private hospital and diagnostic center in Gampaha town.",
      imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
      lat: 7.0933,
      lng: 80.0011
    },
    {
      id: "gampaha-e11",
      name: "Base Hospital Wathupitiwala",
      district: "Gampaha",
      placeType: "Government Hospital",
      description: "Government base hospital serving Nittambuwa and Veyangoda region.",
      imageUrl: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80",
      lat: 7.1261,
      lng: 80.1114
    },
    {
      id: "gampaha-e12",
      name: "Base Hospital Kiribathgoda",
      district: "Gampaha",
      placeType: "Government Hospital",
      description: "Public base hospital providing emergency outpatient and maternity services.",
      imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
      lat: 6.9819,
      lng: 79.9272
    },
    {
      id: "gampaha-e13",
      name: "Base Hospital Mirigama",
      district: "Gampaha",
      placeType: "Government Hospital",
      description: "Government hospital unit serving northern Gampaha community.",
      imageUrl: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80",
      lat: 7.2417,
      lng: 80.1283
    },
    {
      id: "gampaha-e14",
      name: "Ja-Ela Health Emergency Unit",
      district: "Gampaha",
      placeType: "Medical Clinic",
      description: "Emergency medical center and outpatient facility in Ja-Ela.",
      imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
      lat: 7.0758,
      lng: 79.8911
    },
    {
      id: "gampaha-e15",
      name: "Ja-Ela Police Station",
      district: "Gampaha",
      placeType: "Police Station",
      description: "Local police department station along A3 highway.",
      imageUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80",
      lat: 7.0742,
      lng: 79.8931
    },
    {
      id: "gampaha-e16",
      name: "Kadawatha Police Station",
      district: "Gampaha",
      placeType: "Police Station",
      description: "Police division station serving Kadawatha expressway hub.",
      imageUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80",
      lat: 7.0019,
      lng: 79.9511
    },
    {
      id: "gampaha-e17",
      name: "Kelaniya Police Station",
      district: "Gampaha",
      placeType: "Police Station",
      description: "Police station near sacred temple zone and Kelaniya university.",
      imageUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80",
      lat: 6.9572,
      lng: 79.9189
    },
    {
      id: "gampaha-e18",
      name: "SPC Rajya Osu Sala Gampaha",
      district: "Gampaha",
      placeType: "State Pharmacy",
      description: "Government State Pharmaceuticals Corporation pharmacy for essential medicines.",
      imageUrl: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=800&q=80",
      lat: 7.0903,
      lng: 79.9950
    },
    {
      id: "gampaha-e19",
      name: "Union Chemists 24/7 Negombo",
      district: "Gampaha",
      placeType: "24/7 Pharmacy",
      description: "Round-the-clock pharmacy for emergency medical supplies.",
      imageUrl: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=800&q=80",
      lat: 7.2125,
      lng: 79.8417
    },
    {
      id: "gampaha-e20",
      name: "Lanka Hospitals Diagnostics Wattala",
      district: "Gampaha",
      placeType: "Diagnostic Center",
      description: "Advanced medical laboratory and blood testing facility.",
      imageUrl: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80",
      lat: 6.9889,
      lng: 79.8944
    },
    {
      id: "gampaha-e21",
      name: "Wattala Police Station",
      district: "Gampaha",
      placeType: "Police Station",
      description: "Suburban law enforcement station.",
      imageUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80",
      lat: 6.9839,
      lng: 79.8917
    },
    {
      id: "gampaha-e22",
      name: "Fire & Rescue Station Gampaha",
      district: "Gampaha",
      placeType: "Fire Station",
      description: "Municipal emergency fire and rescue unit for Gampaha town.",
      imageUrl: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80",
      lat: 7.0922,
      lng: 79.9975
    },
    {
      id: "gampaha-e23",
      name: "Fire & Rescue Station Negombo",
      district: "Gampaha",
      placeType: "Fire Station",
      description: "Coastal fire brigade and sea rescue dispatch center.",
      imageUrl: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80",
      lat: 7.2089,
      lng: 79.8392
    },
    {
      id: "gampaha-e24",
      name: "Biyagama Industrial Health Clinic",
      district: "Gampaha",
      placeType: "Industrial Clinic",
      description: "Medical emergency clinic serving the export zone community.",
      imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
      lat: 6.9458,
      lng: 79.9772
    },
    {
      id: "gampaha-e25",
      name: "Health Link Pharmacy Kiribathgoda",
      district: "Gampaha",
      placeType: "24/7 Pharmacy",
      description: "24-hour pharmacy for prescription and over-the-counter medicine.",
      imageUrl: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=800&q=80",
      lat: 6.9794,
      lng: 79.9311
    }
  ]
};

function getPlaceImage(place) {
  return place.imageUrl || "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80";
}

function PlaceCard({ place }) {
  const openDirections = () => {
    if (!place?.lat || !place?.lng) return;
    const url = `https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-w-[250px] max-w-[250px] h-[340px] rounded-2xl border border-gray-200 bg-white shadow-xs overflow-hidden flex-shrink-0 flex flex-col transition-transform duration-200 hover:-translate-y-1 hover:shadow-md">
      <img
        src={getPlaceImage(place)}
        alt={place.name}
        onError={(e) => {
          e.currentTarget.src = "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80";
        }}
        className="w-full h-[140px] object-cover flex-shrink-0"
      />

      <div className="p-4 relative flex-1 flex flex-col justify-between overflow-hidden">
        <div>
          <h3 className="font-bold text-sm text-gray-900 leading-snug line-clamp-2 pr-6">{place.name}</h3>

          <p className="text-xs text-teal-700 font-medium mt-1 capitalize">
            {(place.placeType || "place").replaceAll("_", " ")}
          </p>

          {place.description && (
            <p className="text-xs text-gray-500 mt-1.5 line-clamp-3 leading-relaxed">
              {place.description}
            </p>
          )}
        </div>

        <button
          onClick={openDirections}
          title="View on Google Maps"
          className="absolute bottom-3 right-3 w-9 h-9 rounded-xl bg-teal-50 text-teal-600 border border-teal-100 shadow-2xs hover:bg-teal-600 hover:text-white transition flex items-center justify-center cursor-pointer"
        >
          <Map size={18} />
        </button>
      </div>
    </div>
  );
}

function CategorySection({
  title,
  icon,
  places,
  categoryKey,
  mapTitle,
  showMap,
  onToggleMap,
  searchQuery
}) {
  // Filter places based on search query
  const filteredPlaces = useMemo(() => {
    if (!searchQuery.trim()) return places;
    const query = searchQuery.toLowerCase().trim();
    return places.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        (p.placeType && p.placeType.toLowerCase().includes(query)) ||
        (p.description && p.description.toLowerCase().includes(query))
    );
  }, [places, searchQuery]);

  // Paginated visible count state (10 at a time)
  const [visibleLimit, setVisibleLimit] = useState(10);

  if (!filteredPlaces || filteredPlaces.length === 0) return null;

  const visiblePlaces = filteredPlaces.slice(0, visibleLimit);
  const hasMore = filteredPlaces.length > visibleLimit;
  const remainingCount = filteredPlaces.length - visibleLimit;

  const handleShowMore = () => {
    setVisibleLimit((prev) => prev + 10);
  };

  const handleResetLimit = () => {
    setVisibleLimit(10);
  };

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          <h2 className="text-2xl font-bold text-gray-900">
            {title}{" "}
            <span className="text-gray-500 text-lg font-normal">
              ({filteredPlaces.length})
            </span>
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {visibleLimit > 10 && (
            <button
              onClick={handleResetLimit}
              className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset to 10
            </button>
          )}
          <button
            onClick={onToggleMap}
            className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-semibold transition cursor-pointer"
          >
            {showMap ? "Hide Map" : `Show ${title} Map`}
          </button>
        </div>
      </div>

      {/* Horizontal Scrolling Card Row */}
      <div className="flex gap-4 overflow-x-auto pb-3 no-scrollbar items-stretch">
        {visiblePlaces.map((place, index) => (
          <PlaceCard key={place.id || index} place={place} />
        ))}

        {/* Paginated "Next 10" Action Card */}
        {hasMore && (
          <button
            onClick={handleShowMore}
            className="min-w-[250px] max-w-[250px] h-[340px] rounded-2xl border-2 border-dashed border-teal-300 bg-teal-50/60 hover:bg-teal-100/80 text-teal-800 font-bold transition flex flex-col items-center justify-center p-4 text-center gap-2 flex-shrink-0 cursor-pointer shadow-2xs group"
          >
            <PlusCircle className="h-10 w-10 text-teal-600 group-hover:scale-110 transition-transform" />
            <span className="text-base font-bold">Show Next 10</span>
            <span className="text-xs font-medium text-teal-700">
              +{Math.min(10, remainingCount)} more places ({remainingCount} left)
            </span>
          </button>
        )}
      </div>

      {showMap && (
        <div className="mt-4 rounded-2xl overflow-hidden shadow-sm border border-gray-200">
          <PlacesMap title={mapTitle} places={filteredPlaces} height="420px" />
        </div>
      )}
    </section>
  );
}

export default function GampahaPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const [openMaps, setOpenMaps] = useState({
    tourism: false,
    food: false,
    stay: false,
    fuel: false,
    transport: false,
    repairs: false,
    emergency: false,
    districtMap: true
  });

  const districtMapRef = useRef(null);
  const tourismRef = useRef(null);
  const foodRef = useRef(null);
  const stayRef = useRef(null);
  const fuelRef = useRef(null);
  const transportRef = useRef(null);
  const repairRef = useRef(null);
  const emergencyRef = useRef(null);

  const chips = [
    { label: "District Map", ref: districtMapRef },
    { label: "Tourism", ref: tourismRef },
    { label: "Food", ref: foodRef },
    { label: "Stay", ref: stayRef },
    { label: "Fuel", ref: fuelRef },
    { label: "Transport", ref: transportRef },
    { label: "Repairs", ref: repairRef },
    { label: "Services", ref: emergencyRef },
  ];

  const scrollToRef = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const toggleMap = (key) => {
    setOpenMaps((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Master list of all places across categories in Gampaha
  const allGampahaPlaces = useMemo(() => {
    return [
      ...GAMPAHA_CATEGORIZED_PLACES.tourism,
      ...GAMPAHA_CATEGORIZED_PLACES.food,
      ...GAMPAHA_CATEGORIZED_PLACES.stay,
      ...GAMPAHA_CATEGORIZED_PLACES.fuel,
      ...GAMPAHA_CATEGORIZED_PLACES.transport,
      ...GAMPAHA_CATEGORIZED_PLACES.repairsAndRentals,
      ...GAMPAHA_CATEGORIZED_PLACES.emergencyServices
    ];
  }, []);

  // Filtered master list for top map based on search query
  const filteredAllPlaces = useMemo(() => {
    if (!searchQuery.trim()) return allGampahaPlaces;
    const query = searchQuery.toLowerCase().trim();
    return allGampahaPlaces.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        (p.placeType && p.placeType.toLowerCase().includes(query)) ||
        (p.description && p.description.toLowerCase().includes(query))
    );
  }, [allGampahaPlaces, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-16">
      {/* 1. HERO IMAGE BOX */}
      <header className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-4">
        <div className="relative overflow-hidden rounded-3xl shadow-xl">
          <img
            src="https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80"
            alt="Gampaha Botanical Garden"
            className="w-full h-[260px] sm:h-[320px] object-cover"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80";
            }}
          />
          <div className="absolute inset-0 bg-black/45" />

          {/* Top Floating Back Button */}
          <div className="absolute top-6 left-6 z-10">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black/55 hover:bg-black/80 backdrop-blur-md text-white font-semibold text-sm border border-white/20 shadow transition cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>
          </div>

          <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-10 text-white">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
              Gampaha
            </h1>
            <p className="mt-3 text-sm sm:text-base md:text-lg max-w-2xl text-white/90 font-light leading-relaxed">
              Explore Henarathgoda Botanical Garden, Negombo beach coast, transit hubs, local dining, and essential services across Gampaha District.
            </p>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-2">
        
        {/* 2. LITTLE DESCRIPTION INTRO BOX */}
        <div className="bg-white rounded-2xl shadow-xs border border-gray-200/80 p-5 sm:p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-teal-600" />
            Welcome to Gampaha District
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed font-normal">
            Gampaha is an influential coastal and inland district in Sri Lanka's Western Province. Home to Bandaranaike International Airport in Katunayake, the historic Henarathgoda Botanical Garden (where the first rubber tree was planted in Asia), vibrant Negombo Beach and Dutch Canals, ancient rock cave temples like Pilikuttuwa and Warana, major industrial zones, and key railway junctions like Ragama.
          </p>
        </div>

        {/* 3. SEARCH BAR */}
        <div className="bg-white rounded-2xl shadow-xs border border-gray-200/80 p-4 sm:p-5 mb-6 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search places, restaurants, transport, or services in Gampaha..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition"
            />
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition cursor-pointer"
            >
              Clear Search
            </button>
          )}
        </div>

        {/* 4. QUICK CHIPS & JUMP BUTTONS */}
        <div className="bg-white rounded-2xl shadow-xs border border-gray-200/80 p-4 sm:p-5 mb-8">
          <div className="flex flex-wrap gap-2.5">
            {chips.map((chip) => (
              <button
                key={chip.label}
                onClick={() => scrollToRef(chip.ref)}
                className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-semibold transition cursor-pointer"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* 5. MASTER DISTRICT MAP */}
        <div ref={districtMapRef} className="mb-10">
          <PlacesMap
            title="Gampaha District Map"
            places={filteredAllPlaces}
            height="480px"
          />
        </div>

        {/* 6. CATEGORY HORIZONTAL SECTIONS WITH SHOW NEXT 10 PAGINATION */}
        
        {/* 6.1 TOURISM */}
        <div ref={tourismRef}>
          <CategorySection
            title="Tourism"
            icon="🏞️"
            places={GAMPAHA_CATEGORIZED_PLACES.tourism}
            categoryKey="tourism"
            mapTitle="Tourism Map"
            showMap={openMaps.tourism}
            onToggleMap={() => toggleMap("tourism")}
            searchQuery={searchQuery}
          />
        </div>

        {/* 6.2 FOOD & RESTAURANTS */}
        <div ref={foodRef}>
          <CategorySection
            title="Food & Restaurants"
            icon="🍔"
            places={GAMPAHA_CATEGORIZED_PLACES.food}
            categoryKey="food"
            mapTitle="Food & Restaurants Map"
            showMap={openMaps.food}
            onToggleMap={() => toggleMap("food")}
            searchQuery={searchQuery}
          />
        </div>

        {/* 6.3 STAY */}
        <div ref={stayRef}>
          <CategorySection
            title="Stay"
            icon="🏨"
            places={GAMPAHA_CATEGORIZED_PLACES.stay}
            categoryKey="stay"
            mapTitle="Stay Map"
            showMap={openMaps.stay}
            onToggleMap={() => toggleMap("stay")}
            searchQuery={searchQuery}
          />
        </div>

        {/* 6.4 FUEL STATIONS */}
        <div ref={fuelRef}>
          <CategorySection
            title="Fuel Stations"
            icon="⛽"
            places={GAMPAHA_CATEGORIZED_PLACES.fuel}
            categoryKey="fuel"
            mapTitle="Fuel Stations Map"
            showMap={openMaps.fuel}
            onToggleMap={() => toggleMap("fuel")}
            searchQuery={searchQuery}
          />
        </div>

        {/* 6.5 TRANSPORT */}
        <div ref={transportRef}>
          <CategorySection
            title="Transport"
            icon="🚍"
            places={GAMPAHA_CATEGORIZED_PLACES.transport}
            categoryKey="transport"
            mapTitle="Transport Map"
            showMap={openMaps.transport}
            onToggleMap={() => toggleMap("transport")}
            searchQuery={searchQuery}
          />
        </div>

        {/* 6.6 REPAIR & RENTALS */}
        <div ref={repairRef}>
          <CategorySection
            title="Repair & Rentals"
            icon="🔧"
            places={GAMPAHA_CATEGORIZED_PLACES.repairsAndRentals}
            categoryKey="repairs"
            mapTitle="Repair & Rentals Map"
            showMap={openMaps.repairs}
            onToggleMap={() => toggleMap("repairs")}
            searchQuery={searchQuery}
          />
        </div>

        {/* 6.7 EMERGENCY & SERVICES */}
        <div ref={emergencyRef}>
          <CategorySection
            title="Emergency & Services"
            icon="🏥"
            places={GAMPAHA_CATEGORIZED_PLACES.emergencyServices}
            categoryKey="emergency"
            mapTitle="Emergency & Services Map"
            showMap={openMaps.emergency}
            onToggleMap={() => toggleMap("emergency")}
            searchQuery={searchQuery}
          />
        </div>
      </main>

      {/* 7. FOOTER CALLOUT */}
      <footer className="max-w-6xl mx-auto px-4 sm:px-6 pb-10 pt-4">
        <div className="bg-white rounded-2xl shadow-xs border border-gray-200/80 px-6 py-5 text-center">
          <p className="text-lg font-bold text-gray-800">
            Welcome to Gampaha
          </p>
          <p className="text-gray-600 text-sm mt-1 max-w-xl mx-auto leading-relaxed">
            Discover places, food, transport, services, and local experiences across Gampaha District.
          </p>
        </div>
      </footer>
    </div>
  );
}
