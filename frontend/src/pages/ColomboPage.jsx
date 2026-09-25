import React, { useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PlacesMap from "../components/PlacesMap";
import { Map, ChevronLeft, MapPin, Search, PlusCircle, RotateCcw } from "lucide-react";

// Categorized authentic Colombo places dataset (25 - 30 places per category)
export const COLOMBO_CATEGORIZED_PLACES = {
  tourism: [
    {
      id: "colombo-t1",
      name: "Colombo Lotus Tower",
      district: "Colombo",
      placeType: "Attraction",
      description: "Standing at 350 meters, the Lotus Tower is South Asia's tallest self-supported tower featuring a 360-degree observation deck.",
      imageUrl: "/images/colombo images/lotus-tower.jpeg",
      lat: 6.9272,
      lng: 79.8578
    },
    {
      id: "colombo-t2",
      name: "Gangaramaya Temple",
      district: "Colombo",
      placeType: "Temple",
      description: "Iconic Buddhist temple near Beira Lake featuring museum relics, sacred Bodhi tree, and lotus shrine architecture.",
      imageUrl: "/images/colombo images/gangaramaya.jpeg",
      lat: 6.9168,
      lng: 79.8564
    },
    {
      id: "colombo-t3",
      name: "Galle Face Green Promenade",
      district: "Colombo",
      placeType: "Attraction",
      description: "A 500-meter oceanfront urban park along the Indian Ocean, famous for evening sunsets and street food.",
      imageUrl: "/images/colombo images/galle-face.jpeg",
      lat: 6.9272,
      lng: 79.8428
    },
    {
      id: "colombo-t4",
      name: "Independence Memorial Hall",
      district: "Colombo",
      placeType: "Monument",
      description: "National monument celebrating Sri Lankan independence from British rule, surrounded by manicured lawns.",
      imageUrl: "/images/colombo images/independance.jpeg",
      lat: 6.9042,
      lng: 79.8678
    },
    {
      id: "colombo-t5",
      name: "National Museum of Colombo",
      district: "Colombo",
      placeType: "Museum",
      description: "Established in 1877, housing royal thrones, crowns, ancient jewelry, and Kandyan monarch relics.",
      imageUrl: "/images/colombo images/colombo museum.jpeg",
      lat: 6.9103,
      lng: 79.8608
    },
    {
      id: "colombo-t6",
      name: "Jami Ul-Alfar Mosque (Red Mosque)",
      district: "Colombo",
      placeType: "Mosque",
      description: "Famous candy-striped red-and-white brick mosque built in 1908 in the heart of Pettah bazaar.",
      imageUrl: "/images/colombo images/red.jpeg",
      lat: 6.9389,
      lng: 79.8519
    },
    {
      id: "colombo-t7",
      name: "Mount Lavinia Beach",
      district: "Colombo",
      placeType: "Beach",
      description: "The Golden Mile beach strip south of Colombo lined with seafood cafes and historic colonial hotels.",
      imageUrl: "/images/colombo images/gangaramaya.jpg",
      lat: 6.8344,
      lng: 79.8625
    },
    {
      id: "colombo-t8",
      name: "Viharamahadevi Park",
      district: "Colombo",
      placeType: "Park",
      description: "Central green urban park opposite Town Hall with flowering trees, fountains, and giant golden Buddha.",
      imageUrl: "/images/colombo images/galle-face.jpg",
      lat: 6.9139,
      lng: 79.8608
    },
    {
      id: "colombo-t9",
      name: "Seema Malaka Beira Lake",
      district: "Colombo",
      placeType: "Temple",
      description: "A peaceful floating meditation temple designed by Geoffrey Bawa, surrounded by bronze Buddha statues on Beira Lake.",
      imageUrl: "/images/colombo images/independence-memorial.jpg",
      lat: 6.9161,
      lng: 79.8544
    },
    {
      id: "colombo-t10",
      name: "Old Colombo Dutch Hospital",
      district: "Colombo",
      placeType: "Heritage",
      description: "Restored 17th-century colonial courtyard complex turned high-end shopping and dining hub in Fort Colombo.",
      imageUrl: "/images/colombo images/red-mosque.jpg",
      lat: 6.9331,
      lng: 79.8436
    },
    {
      id: "colombo-t11",
      name: "Pettah Floating Market",
      district: "Colombo",
      placeType: "Market",
      description: "Boardwalk marketplace constructed over Beira Lake featuring handicraft stalls, juice bars, and clothes.",
      imageUrl: "/images/colombo images/lotus-tower.jpg",
      lat: 6.9351,
      lng: 79.8542
    },
    {
      id: "colombo-t12",
      name: "Mount Lavinia Hotel & Heritage Wing",
      district: "Colombo",
      placeType: "Heritage Hotel",
      description: "200-year-old former Governor's residence built in 1806 overlooking the Indian Ocean coastline.",
      imageUrl: "/images/colombo images/gangaramaya.jpg",
      lat: 6.8306,
      lng: 79.8622
    },
    {
      id: "colombo-t13",
      name: "Old Parliament Building",
      district: "Colombo",
      placeType: "Monument",
      description: "Neo-Baroque style building constructed in 1930, currently housing the Presidential Secretariat.",
      imageUrl: "/images/colombo images/galle-face.jpg",
      lat: 6.9317,
      lng: 79.8428
    },
    {
      id: "colombo-t14",
      name: "Arcade Independence Square",
      district: "Colombo",
      placeType: "Shopping Precinct",
      description: "Colonial asylum building restored into an open-air luxury shopping precinct with lion sculpture fountains.",
      imageUrl: "/images/colombo images/independence-memorial.jpg",
      lat: 6.9039,
      lng: 79.8689
    },
    {
      id: "colombo-t15",
      name: "Crow Island Beach Park",
      district: "Colombo",
      placeType: "Beach Park",
      description: "Coastal green park at Kelani River mouth featuring walking tracks, mangrove lagoon, and children playground.",
      imageUrl: "/images/colombo images/red-mosque.jpg",
      lat: 6.9669,
      lng: 79.8678
    },
    {
      id: "colombo-t16",
      name: "Beddagana Wetland Park",
      district: "Colombo",
      placeType: "Wetland Park",
      description: "Protected urban biodiversity wetland sanctuary offering wooden boardwalk trails and birdwatching towers.",
      imageUrl: "/images/colombo images/lotus-tower.jpg",
      lat: 6.8911,
      lng: 79.9156
    },
    {
      id: "colombo-t17",
      name: "Diyatha Uyana Park",
      district: "Colombo",
      placeType: "Eco Park",
      description: "Picturesque park on Diyawanna Lake featuring floating restaurants, flower markets, and duck boats.",
      imageUrl: "/images/colombo images/gangaramaya.jpg",
      lat: 6.9031,
      lng: 79.9119
    },
    {
      id: "colombo-t18",
      name: "Bellanwila Rajamaha Viharaya",
      district: "Colombo",
      placeType: "Temple",
      description: "Venerable ancient temple famous for its sacred Bodhi tree linked to the Anuradhapura Jaya Sri Maha Bodhi.",
      imageUrl: "/images/colombo images/galle-face.jpg",
      lat: 6.8489,
      lng: 79.8906
    },
    {
      id: "colombo-t19",
      name: "Kelaniya Raja Maha Viharaya",
      district: "Colombo",
      placeType: "Temple",
      description: "Ancient sacred temple where Lord Buddha is believed to have visited on his third trip to Sri Lanka.",
      imageUrl: "/images/colombo images/independence-memorial.jpg",
      lat: 6.9556,
      lng: 79.9194
    },
    {
      id: "colombo-t20",
      name: "Khan Clock Tower Pettah",
      district: "Colombo",
      placeType: "Monument",
      description: "Historic 1857 Khan Clock Tower marking the bustling entrance to Pettah market.",
      imageUrl: "/images/colombo images/red-mosque.jpg",
      lat: 6.9381,
      lng: 79.8497
    },
    {
      id: "colombo-t21",
      name: "Kotte Rajamaha Viharaya",
      district: "Colombo",
      placeType: "Temple",
      description: "Historic temple dating back to the Kotte Kingdom era, housing ancient stone carvings and murals.",
      imageUrl: "/images/colombo images/lotus-tower.jpg",
      lat: 6.8894,
      lng: 79.9078
    },
    {
      id: "colombo-t22",
      name: "Attidiya Bird Sanctuary",
      district: "Colombo",
      placeType: "Sanctuary",
      description: "Urban wetland biodiversity reserve offering boardwalk trails for observing marsh birds and monitor lizards.",
      imageUrl: "/images/colombo images/gangaramaya.jpg",
      lat: 6.8436,
      lng: 79.8903
    },
    {
      id: "colombo-t23",
      name: "Seetawaka Botanical Garden",
      district: "Colombo",
      placeType: "Botanical Garden",
      description: "Rainforest botanical garden in Avissawella dedicated to conserving wet-zone plant species.",
      imageUrl: "/images/colombo images/galle-face.jpg",
      lat: 6.9531,
      lng: 80.2078
    },
    {
      id: "colombo-t24",
      name: "Athurugiriya Nature Reserve Trail",
      district: "Colombo",
      placeType: "Nature Trail",
      description: "Lesser-known lowland forest trail popular among local birdwatchers and trail runners.",
      imageUrl: "/images/colombo images/independence-memorial.jpg",
      lat: 6.8722,
      lng: 79.9889
    },
    {
      id: "colombo-t25",
      name: "Ape Gama Cultural Village",
      district: "Colombo",
      placeType: "Cultural Village",
      description: "Reconstructed traditional Sri Lankan village presenting ancient rural architecture, handicrafts, and blacksmith arts.",
      imageUrl: "/images/colombo images/red-mosque.jpg",
      lat: 6.8925,
      lng: 79.9181
    },
    {
      id: "colombo-t26",
      name: "Colombo Fort Railway Heritage Building",
      district: "Colombo",
      placeType: "Heritage",
      description: "Colonial-era railway terminus constructed in 1917, standing as Colombo's main transport milestone.",
      imageUrl: "/images/colombo images/lotus-tower.jpg",
      lat: 6.9344,
      lng: 79.8503
    },
    {
      id: "colombo-t27",
      name: "St. Lucia's Cathedral Kotahena",
      district: "Colombo",
      placeType: "Cathedral",
      description: "Gothic and Romanesque revival cathedral featuring a 46-meter dome and antique French stained glass windows.",
      imageUrl: "/images/colombo images/gangaramaya.jpg",
      lat: 6.9483,
      lng: 79.8592
    },
    {
      id: "colombo-t28",
      name: "Beira Lake West Promenade",
      district: "Colombo",
      placeType: "Lake Walkway",
      description: "Scenic urban lakefront walk with swan pedal boats, pelicans, and illuminated evening bridges.",
      imageUrl: "/images/colombo images/galle-face.jpg",
      lat: 6.9208,
      lng: 79.8519
    }
  ],
  food: [
    {
      id: "colombo-f1",
      name: "Ministry of Crab",
      district: "Colombo",
      placeType: "Seafood Fine Dining",
      description: "Asia's 50 Best landmark restaurant housed in the 400-year-old Dutch Hospital, world-famous for Sri Lankan mud crabs.",
      imageUrl: "/images/colombo images/ministry-of-crab.jpg",
      lat: 6.9333,
      lng: 79.8436
    },
    {
      id: "colombo-f2",
      name: "Upali's by Nawaloka",
      district: "Colombo",
      placeType: "Sri Lankan Cuisine",
      description: "Authentic traditional Sri Lankan restaurant near Viharamahadevi Park serving mutton varuval, hoppers, and fish head curry.",
      imageUrl: "/images/colombo images/upalis.jpg",
      lat: 6.9125,
      lng: 79.8589
    },
    {
      id: "colombo-f3",
      name: "Dutch Burgher Union (DBU) Lamprais",
      district: "Colombo",
      placeType: "Heritage Eats",
      description: "Famous heritage cafe in Bambalapitiya known for traditional Dutch Burgher Lamprais baked in banana leaf.",
      imageUrl: "/images/colombo images/dbu-lamprais.jpg",
      lat: 6.8953,
      lng: 79.8569
    },
    {
      id: "colombo-f4",
      name: "Nuga Gama at Cinnamon Grand",
      district: "Colombo",
      placeType: "Village Buffet",
      description: "Rustic Sri Lankan village restaurant set beneath a 200-year-old banyan tree with traditional open claypot cooking.",
      imageUrl: "/images/colombo images/ministry-of-crab.jpg",
      lat: 6.9178,
      lng: 79.8486
    },
    {
      id: "colombo-f5",
      name: "Paradise Road Gallery Cafe",
      district: "Colombo",
      placeType: "Boutique Cafe",
      description: "Stylish cafe housed in Geoffrey Bawa's former office, serving gourmet desserts, pastas, and passion fruit tarts.",
      imageUrl: "/images/colombo images/upalis.jpg",
      lat: 6.8967,
      lng: 79.8547
    },
    {
      id: "colombo-f6",
      name: "Ceylon Tea Trails Lounge Colombo",
      district: "Colombo",
      placeType: "Tea Lounge",
      description: "Premium high tea room serving single-origin Ceylon black tea, scones, finger sandwiches, and artisan tarts.",
      imageUrl: "/images/colombo images/dbu-lamprais.jpg",
      lat: 6.9158,
      lng: 79.8525
    },
    {
      id: "colombo-f7",
      name: "Beach Wadiya Seafood",
      district: "Colombo",
      placeType: "Beach Seafood",
      description: "Iconic oceanfront seafood restaurant in Marine Drive serving fresh butter garlic cuttlefish and grilled fish.",
      imageUrl: "/images/colombo images/ministry-of-crab.jpg",
      lat: 6.8772,
      lng: 79.8578
    },
    {
      id: "colombo-f8",
      name: "The Manhattan Fish Market Colombo",
      district: "Colombo",
      placeType: "Seafood Restaurant",
      description: "American seafood grill famous for flaming seafood platters, fried fish & chips, and garlic herb mussels.",
      imageUrl: "/images/colombo images/upalis.jpg",
      lat: 6.9039,
      lng: 79.8531
    },
    {
      id: "colombo-f9",
      name: "Shanmugas South Indian Restaurant",
      district: "Colombo",
      placeType: "Vegetarian Dining",
      description: "Renowned South Indian vegetarian dining in Wellawatte serving crispy paper masala dosa and vada.",
      imageUrl: "/images/colombo images/dbu-lamprais.jpg",
      lat: 6.8731,
      lng: 79.8603
    },
    {
      id: "colombo-f10",
      name: "Green Cabin Bakery & Cafe",
      district: "Colombo",
      placeType: "Heritage Bakery",
      description: "Colombo's oldest bakery chain serving famous mutton patties, egg hoppers, milk toffee, and Ceylon tea.",
      imageUrl: "/images/colombo images/ministry-of-crab.jpg",
      lat: 6.8928,
      lng: 79.8561
    },
    {
      id: "colombo-f11",
      name: "Perera & Sons (P&S) Kollupitiya",
      district: "Colombo",
      placeType: "Fast Food Bakery",
      description: "Popular local bakery serving Sri Lankan short eats, fish buns, cutlets, lamprais, and iced coffee.",
      imageUrl: "/images/colombo images/upalis.jpg",
      lat: 6.9075,
      lng: 79.8514
    },
    {
      id: "colombo-f12",
      name: "The Fab Pastry Shop Galle Road",
      district: "Colombo",
      placeType: "Pastry Shop",
      description: "High-quality bakery chain known for chicken rolls, eclair boxes, gateaux cakes, and savory pies.",
      imageUrl: "/images/colombo images/dbu-lamprais.jpg",
      lat: 6.8986,
      lng: 79.8553
    },
    {
      id: "colombo-f13",
      name: "Cricket Club Cafe",
      district: "Colombo",
      placeType: "Sports Bar & Diner",
      description: "Cricket-themed pub and diner decorated with international cricket memorabilia, serving steaks and burgers.",
      imageUrl: "/images/colombo images/ministry-of-crab.jpg",
      lat: 6.9056,
      lng: 79.8631
    },
    {
      id: "colombo-f14",
      name: "Raja Bojun Sri Lankan Buffet",
      district: "Colombo",
      placeType: "Traditional Buffet",
      description: "Panoramic sea-view Sri Lankan claypot buffet featuring crab curry, pol sambol, hoppers, and traditional sweets.",
      imageUrl: "/images/colombo images/upalis.jpg",
      lat: 6.9242,
      lng: 79.8458
    },
    {
      id: "colombo-f15",
      name: "Nana's Street Food Stalls Galle Face",
      district: "Colombo",
      placeType: "Street Food",
      description: "Famous open-air oceanfront street food stalls serving spicy kottu roti, fried prawns, and isso vadei.",
      imageUrl: "/images/colombo images/dbu-lamprais.jpg",
      lat: 6.9261,
      lng: 79.8431
    },
    {
      id: "colombo-f16",
      name: "Monsoon Colombo",
      district: "Colombo",
      placeType: "Pan-Asian Restaurant",
      description: "Trendy Asian restaurant in Park Street Mews serving Vietnamese pho, Thai curry, and Indonesian rendang.",
      imageUrl: "/images/colombo images/ministry-of-crab.jpg",
      lat: 6.9172,
      lng: 79.8569
    },
    {
      id: "colombo-f17",
      name: "Park Street Mews Trattoria",
      district: "Colombo",
      placeType: "Italian Dining",
      description: "Charming cobblestone alley restaurant serving wood-fired Italian pizza, handmade pasta, and espresso.",
      imageUrl: "/images/colombo images/upalis.jpg",
      lat: 6.9175,
      lng: 79.8572
    },
    {
      id: "colombo-f18",
      name: "Tintagel Colombo Fine Dining",
      district: "Colombo",
      placeType: "Fine Dining",
      description: "Exclusive heritage mansion restaurant in Rosmead Place serving international gourmet cuisine.",
      imageUrl: "/images/colombo images/dbu-lamprais.jpg",
      lat: 6.9114,
      lng: 79.8711
    },
    {
      id: "colombo-f19",
      name: "Whight & Co Specialty Coffee Roaster",
      district: "Colombo",
      placeType: "Specialty Cafe",
      description: "Ocean-view specialty cafe serving single-origin Sri Lankan hand-picked estate roasted coffee.",
      imageUrl: "/images/colombo images/ministry-of-crab.jpg",
      lat: 6.8922,
      lng: 79.8547
    },
    {
      id: "colombo-f20",
      name: "Palmyrah Restaurant at Renuka",
      district: "Colombo",
      placeType: "Jaffna Cuisine",
      description: "Renowned fine-dining restaurant specializing in authentic northern Sri Lankan Jaffna crab curry and mutton poriyal.",
      imageUrl: "/images/colombo images/upalis.jpg",
      lat: 6.9031,
      lng: 79.8522
    },
    {
      id: "colombo-f21",
      name: "Bowl'd Healthy Poke Bowls",
      district: "Colombo",
      placeType: "Healthy Cafe",
      description: "Modern health cafe serving custom tuna poke bowls, acai bowls, and cold-pressed fresh juices.",
      imageUrl: "/images/colombo images/dbu-lamprais.jpg",
      lat: 6.8994,
      lng: 79.8558
    },
    {
      id: "colombo-f22",
      name: "Caramel Pumpkin Cafe",
      district: "Colombo",
      placeType: "Brunch Spot",
      description: "Spacious contemporary cafe serving eggs benedict, fluffy waffles, matcha lattes, and artisan cakes.",
      imageUrl: "/images/colombo images/ministry-of-crab.jpg",
      lat: 6.9067,
      lng: 79.8661
    },
    {
      id: "colombo-f23",
      name: "Chutneys Indian Restaurant",
      district: "Colombo",
      placeType: "Indian Cuisine",
      description: "Award-winning restaurant representing authentic cuisine from 4 southern states of India.",
      imageUrl: "/images/colombo images/upalis.jpg",
      lat: 6.9175,
      lng: 79.8483
    },
    {
      id: "colombo-f24",
      name: "Giovanni's Wood-Fired Pizza",
      district: "Colombo",
      placeType: "Pizzeria",
      description: "Popular cozy pizzeria serving authentic Neapolitan wood-stove baked thin-crust pizzas.",
      imageUrl: "/images/colombo images/dbu-lamprais.jpg",
      lat: 6.8856,
      lng: 79.8653
    },
    {
      id: "colombo-f25",
      name: "TGI Fridays Colombo Fort",
      district: "Colombo",
      placeType: "American Bar & Grill",
      description: "Classic American restaurant serving glazed ribs, loaded burgers, and hand-crafted cocktails.",
      imageUrl: "/images/colombo images/ministry-of-crab.jpg",
      lat: 6.9325,
      lng: 79.8439
    },
    {
      id: "colombo-f26",
      name: "Cafe Ceylon Cinnamon Gardens",
      district: "Colombo",
      placeType: "Artisan Cafe",
      description: "Quiet green cafe terrace serving freshly baked croissants, Ceylon tea, and cold brew.",
      imageUrl: "/images/colombo images/upalis.jpg",
      lat: 6.9078,
      lng: 79.8672
    }
  ],
  stay: [
    {
      id: "colombo-s1",
      name: "Cinnamon Grand Colombo",
      district: "Colombo",
      placeType: "5-Star Hotel",
      description: "Premier 5-star hotel in heart of Colombo featuring 14 specialty dining venues, dual pools, and spa.",
      imageUrl: "/images/colombo images/shangri-la.jpg",
      lat: 6.9175,
      lng: 79.8483
    },
    {
      id: "colombo-s2",
      name: "Shangri-La Hotel Colombo",
      district: "Colombo",
      placeType: "Luxury Hotel",
      description: "Ultra-luxury 5-star hotel at One Galle Face offering ocean-view rooms, Chi Spa, and rooftop bar.",
      imageUrl: "/images/colombo images/nuga-gama.jpg",
      lat: 6.9286,
      lng: 79.8447
    },
    {
      id: "colombo-s3",
      name: "Galle Face Hotel",
      district: "Colombo",
      placeType: "Heritage Hotel",
      description: "Sri Lanka's iconic 1864 Victorian colonial hotel standing on the edge of the Indian Ocean.",
      imageUrl: "/images/colombo images/shangri-la.jpg",
      lat: 6.9228,
      lng: 79.8453
    },
    {
      id: "colombo-s4",
      name: "The Kingsbury Colombo",
      district: "Colombo",
      placeType: "Luxury Hotel",
      description: "Grand 5-star oceanfront hotel offering infinity pool, Sky Lounge rooftop, and international buffet.",
      imageUrl: "/images/colombo images/nuga-gama.jpg",
      lat: 6.9353,
      lng: 79.8419
    },
    {
      id: "colombo-s5",
      name: "Taj Samudra Colombo",
      district: "Colombo",
      placeType: "5-Star Hotel",
      description: "Luxury hotel set amidst 11 acres of landscaped gardens overlooking Galle Face promenade.",
      imageUrl: "/images/colombo images/shangri-la.jpg",
      lat: 6.9208,
      lng: 79.8464
    },
    {
      id: "colombo-s6",
      name: "Cinnamon Lakeside Colombo",
      district: "Colombo",
      placeType: "5-Star Resort",
      description: "City resort hotel sitting along Beira Lake featuring floating 7&Co dining venue and large pool.",
      imageUrl: "/images/colombo images/nuga-gama.jpg",
      lat: 6.9294,
      lng: 79.8519
    },
    {
      id: "colombo-s7",
      name: "Marino Beach Hotel",
      district: "Colombo",
      placeType: "Beach Resort Hotel",
      description: "Modern seaside hotel in Kollupitiya featuring a giant rooftop infinity pool overlooking the ocean.",
      imageUrl: "/images/colombo images/shangri-la.jpg",
      lat: 6.8981,
      lng: 79.8539
    },
    {
      id: "colombo-s8",
      name: "Jetwing Colombo Seven",
      district: "Colombo",
      placeType: "Boutique Hotel",
      description: "Trendy 5-star hotel in Cinnamon Gardens featuring rooftop infinity pool and Ward7 cocktail bar.",
      imageUrl: "/images/colombo images/nuga-gama.jpg",
      lat: 6.9119,
      lng: 79.8675
    },
    {
      id: "colombo-s9",
      name: "Hilton Colombo",
      district: "Colombo",
      placeType: "Luxury Hotel",
      description: "Established 5-star business hotel near Fort with outdoor pool, sports facilities, and lagoon views.",
      imageUrl: "/images/colombo images/shangri-la.jpg",
      lat: 6.9328,
      lng: 79.8458
    },
    {
      id: "colombo-s10",
      name: "Radisson Hotel Colombo",
      district: "Colombo",
      placeType: "City Hotel",
      description: "Contemporary high-rise hotel on Marine Drive with oceanfront rooftop bar and pool.",
      imageUrl: "/images/colombo images/nuga-gama.jpg",
      lat: 6.8872,
      lng: 79.8569
    },
    {
      id: "colombo-s11",
      name: "Mount Lavinia Hotel",
      district: "Colombo",
      placeType: "Heritage Resort",
      description: "Colonial 1806 Governor's mansion turned beachfront resort hotel with private sea terrace.",
      imageUrl: "/images/colombo images/shangri-la.jpg",
      lat: 6.8306,
      lng: 79.8622
    },
    {
      id: "colombo-s12",
      name: "OZO Colombo",
      district: "Colombo",
      placeType: "Design Hotel",
      description: "Sleek ocean-facing city hotel featuring ON15 rooftop bar and modern rooms.",
      imageUrl: "/images/colombo images/nuga-gama.jpg",
      lat: 6.8858,
      lng: 79.8572
    },
    {
      id: "colombo-s13",
      name: "Granbell Hotel Colombo",
      district: "Colombo",
      placeType: "Japanese Luxury Hotel",
      description: "Japanese luxury hotel on Marine Drive offering open-air rooftop infinity pool and Japanese dining.",
      imageUrl: "/images/colombo images/shangri-la.jpg",
      lat: 6.9078,
      lng: 79.8517
    },
    {
      id: "colombo-s14",
      name: "Cinnamon Red Colombo",
      district: "Colombo",
      placeType: "Express Hotel",
      description: "South Asia's first lean-luxury hotel featuring 26th floor rooftop infinity pool and bar.",
      imageUrl: "/images/colombo images/nuga-gama.jpg",
      lat: 6.9142,
      lng: 79.8558
    },
    {
      id: "colombo-s15",
      name: "The Steuart by Citrus",
      district: "Colombo",
      placeType: "Boutique Heritage",
      description: "Historic Scottish bank building in Fort converted into a Scottish-themed boutique hotel and pub.",
      imageUrl: "/images/colombo images/shangri-la.jpg",
      lat: 6.9347,
      lng: 79.8433
    },
    {
      id: "colombo-s16",
      name: "Taru Villas Lake Lodge",
      district: "Colombo",
      placeType: "Boutique Hotel",
      description: "Secluded boutique sanctuary hidden near Beira Lake offering curated interior design.",
      imageUrl: "/images/colombo images/nuga-gama.jpg",
      lat: 6.9147,
      lng: 79.8528
    },
    {
      id: "colombo-s17",
      name: "Unique Towers Luxury Apartments",
      district: "Colombo",
      placeType: "Serviced Apartments",
      description: "Modern serviced suites in central Colombo with fully equipped kitchens.",
      imageUrl: "/images/colombo images/shangri-la.jpg",
      lat: 6.9189,
      lng: 79.8550
    },
    {
      id: "colombo-s18",
      name: "City Beds The Fort",
      district: "Colombo",
      placeType: "Budget Hotel",
      description: "Clean, minimalist budget city hotel conveniently located near Fort Railway Station.",
      imageUrl: "/images/colombo images/nuga-gama.jpg",
      lat: 6.9339,
      lng: 79.8442
    },
    {
      id: "colombo-s19",
      name: "Zylan Luxury Villa",
      district: "Colombo",
      placeType: "Luxury Villa",
      description: "Private boutique villa with rooftop pool in quiet residential Cinnamon Gardens.",
      imageUrl: "/images/colombo images/shangri-la.jpg",
      lat: 6.9108,
      lng: 79.8731
    },
    {
      id: "colombo-s20",
      name: "Hotel Janaki Colombo",
      district: "Colombo",
      placeType: "City Hotel",
      description: "Established family city hotel in Havelock Town with outdoor pool and garden cafe.",
      imageUrl: "/images/colombo images/nuga-gama.jpg",
      lat: 6.8867,
      lng: 79.8661
    },
    {
      id: "colombo-s21",
      name: "Clock Inn Colombo",
      district: "Colombo",
      placeType: "Hostel & Hotel",
      description: "Modern boutique hostel and private room stay popular with international travellers.",
      imageUrl: "/images/colombo images/shangri-la.jpg",
      lat: 6.8961,
      lng: 79.8556
    },
    {
      id: "colombo-s22",
      name: "Mandarina Colombo",
      district: "Colombo",
      placeType: "Business Hotel",
      description: "Sleek business hotel on Galle Road with infinity rooftop pool overlooking the ocean.",
      imageUrl: "/images/colombo images/nuga-gama.jpg",
      lat: 6.9011,
      lng: 79.8533
    },
    {
      id: "colombo-s23",
      name: "Fairview Hotel Colombo",
      district: "Colombo",
      placeType: "Boutique Hotel",
      description: "Cozy boutique hotel located in Wellawatte close to the beach and shopping malls.",
      imageUrl: "/images/colombo images/shangri-la.jpg",
      lat: 6.8722,
      lng: 79.8608
    },
    {
      id: "colombo-s24",
      name: "Berjaya Hotel Mount Lavinia",
      district: "Colombo",
      placeType: "Beach Resort",
      description: "Beachfront resort hotel sitting between Mount Lavinia beach and coastal rail track.",
      imageUrl: "/images/colombo images/nuga-gama.jpg",
      lat: 6.8328,
      lng: 79.8631
    },
    {
      id: "colombo-s25",
      name: "Hotel Sapphire Wellawatte",
      district: "Colombo",
      placeType: "City Hotel",
      description: "Long-standing city hotel on Galle Road with outdoor pool and Chinese diner.",
      imageUrl: "/images/colombo images/shangri-la.jpg",
      lat: 6.8764,
      lng: 79.8594
    },
    {
      id: "colombo-s26",
      name: "Best Western Elyon Colombo",
      district: "Colombo",
      placeType: "Business Hotel",
      description: "Contemporary hotel in Kirulapone featuring rooftop lounge and fitness center.",
      imageUrl: "/images/colombo images/nuga-gama.jpg",
      lat: 6.8825,
      lng: 79.8756
    }
  ],
  fuel: [
    {
      id: "colombo-u1",
      name: "Ceypetco Main Filling Station Fort",
      district: "Colombo",
      placeType: "Fuel Station",
      description: "24/7 central auto petrol & super diesel station near Colombo Fort Railway Station.",
      imageUrl: "/images/colombo images/ceypetco-fuel.jpg",
      lat: 6.9356,
      lng: 79.8511
    },
    {
      id: "colombo-u2",
      name: "LIOC Filling Station Kollupitiya",
      district: "Colombo",
      placeType: "Fuel Station",
      description: "Major Lanka IOC fuel station on Galle Road with Nitrogen tire fill and car wash.",
      imageUrl: "/images/colombo images/lioc-fuel.jpg",
      lat: 6.9081,
      lng: 79.8519
    },
    {
      id: "colombo-u3",
      name: "Ceypetco Station Bambalapitiya",
      district: "Colombo",
      placeType: "Fuel Station",
      description: "Busy 24-hour petrol shed situated on Galle Road at Bambalapitiya junction.",
      imageUrl: "/images/colombo images/fuel-station-1.jpg",
      lat: 6.8944,
      lng: 79.8553
    },
    {
      id: "colombo-u4",
      name: "LIOC Mega Fuel Station Town Hall",
      district: "Colombo",
      placeType: "Fuel Station",
      description: "Lanka IOC fuel outlet opposite Viharamahadevi Park with convenience store.",
      imageUrl: "/images/colombo images/fuel-station-2.jpg",
      lat: 6.9142,
      lng: 79.8614
    },
    {
      id: "colombo-u5",
      name: "Ceypetco Filling Station Borella",
      district: "Colombo",
      placeType: "Fuel Station",
      description: "High-capacity fuel station at Borella junction serving commuters.",
      imageUrl: "/images/colombo images/ceypetco-fuel.jpg",
      lat: 6.9139,
      lng: 79.8786
    },
    {
      id: "colombo-u6",
      name: "LIOC Fuel Mart Union Place",
      district: "Colombo",
      placeType: "Fuel Station",
      description: "Central IOC fuel station near Slave Island with quick oil change bay.",
      imageUrl: "/images/colombo images/lioc-fuel.jpg",
      lat: 6.9214,
      lng: 79.8558
    },
    {
      id: "colombo-u7",
      name: "Ceypetco Shed Wellawatte",
      district: "Colombo",
      placeType: "Fuel Station",
      description: "Auto refuel shed serving Galle Road and Marine Drive traffic.",
      imageUrl: "/images/colombo images/fuel-station-1.jpg",
      lat: 6.8742,
      lng: 79.8606
    },
    {
      id: "colombo-u8",
      name: "LAUGFS Eco Fuel Station Dehiwala",
      district: "Colombo",
      placeType: "Fuel Station",
      description: "LAUGFS auto fuel station with auto wash and lube bay in Dehiwala.",
      imageUrl: "/images/colombo images/fuel-station-2.jpg",
      lat: 6.8514,
      lng: 79.8647
    },
    {
      id: "colombo-u9",
      name: "Ceypetco Station Nugegoda",
      district: "Colombo",
      placeType: "Fuel Station",
      description: "Key refueling point at Nugegoda High Level Road flyover.",
      imageUrl: "/images/colombo images/ceypetco-fuel.jpg",
      lat: 6.8728,
      lng: 79.8892
    },
    {
      id: "colombo-u10",
      name: "LIOC Fuel Point Maharagama",
      district: "Colombo",
      placeType: "Fuel Station",
      description: "24-hour petrol and diesel pump at Maharagama SLTB depot area.",
      imageUrl: "/images/colombo images/lioc-fuel.jpg",
      lat: 6.8486,
      lng: 79.9264
    },
    {
      id: "colombo-u11",
      name: "Ceypetco Filling Station Kottawa",
      district: "Colombo",
      placeType: "Fuel Station",
      description: "Fuel shed near Kottawa Southern Expressway interchange.",
      imageUrl: "/images/colombo images/fuel-station-1.jpg",
      lat: 6.8425,
      lng: 79.9658
    },
    {
      id: "colombo-u12",
      name: "Ceypetco Station Kaduwela",
      district: "Colombo",
      placeType: "Fuel Station",
      description: "Highway fuel station near Kaduwela expressway entry point.",
      imageUrl: "/images/colombo images/fuel-station-2.jpg",
      lat: 6.9367,
      lng: 79.9842
    },
    {
      id: "colombo-u13",
      name: "LIOC Station Malabe",
      district: "Colombo",
      placeType: "Fuel Station",
      description: "Refueling station in Malabe town center.",
      imageUrl: "/images/colombo images/ceypetco-fuel.jpg",
      lat: 6.9042,
      lng: 79.9547
    },
    {
      id: "colombo-u14",
      name: "Ceypetco Station Battaramulla",
      district: "Colombo",
      placeType: "Fuel Station",
      description: "Busy fuel station opposite Sethsiripaya administrative complex.",
      imageUrl: "/images/colombo images/lioc-fuel.jpg",
      lat: 6.8989,
      lng: 79.9242
    },
    {
      id: "colombo-u15",
      name: "LIOC Station Rajagiriya",
      district: "Colombo",
      placeType: "Fuel Station",
      description: "Refueling shed at Rajagiriya flyover junction.",
      imageUrl: "/images/colombo images/fuel-station-1.jpg",
      lat: 6.9089,
      lng: 79.8942
    },
    {
      id: "colombo-u16",
      name: "Ceypetco Shed Narahenpita",
      district: "Colombo",
      placeType: "Fuel Station",
      description: "24-hour petrol shed near Narahenpita government offices.",
      imageUrl: "/images/colombo images/fuel-station-2.jpg",
      lat: 6.8925,
      lng: 79.8789
    },
    {
      id: "colombo-u17",
      name: "Ceypetco Station Pettah",
      district: "Colombo",
      placeType: "Fuel Station",
      description: "Fuel station in Pettah commercial market hub.",
      imageUrl: "/images/colombo images/ceypetco-fuel.jpg",
      lat: 6.9383,
      lng: 79.8542
    },
    {
      id: "colombo-u18",
      name: "LIOC Station Kotahena",
      district: "Colombo",
      placeType: "Fuel Station",
      description: "Refueling station in Kotahena near port gate.",
      imageUrl: "/images/colombo images/lioc-fuel.jpg",
      lat: 6.9478,
      lng: 79.8586
    },
    {
      id: "colombo-u19",
      name: "Ceypetco Station Grandpass",
      district: "Colombo",
      placeType: "Fuel Station",
      description: "Fuel shed on Colombo North main exit road.",
      imageUrl: "/images/colombo images/fuel-station-1.jpg",
      lat: 6.9542,
      lng: 79.8694
    },
    {
      id: "colombo-u20",
      name: "Ceypetco Shed Mattakkuliya",
      district: "Colombo",
      placeType: "Fuel Station",
      description: "Refueling shed near Kelani River estuary.",
      imageUrl: "/images/colombo images/fuel-station-2.jpg",
      lat: 6.9681,
      lng: 79.8661
    },
    {
      id: "colombo-u21",
      name: "LIOC Station Dematagoda",
      district: "Colombo",
      placeType: "Fuel Station",
      description: "24-hour petrol shed near Dematagoda railway junction.",
      imageUrl: "/images/colombo images/ceypetco-fuel.jpg",
      lat: 6.9289,
      lng: 79.8767
    },
    {
      id: "colombo-u22",
      name: "Ceypetco Station Kirulapone",
      district: "Colombo",
      placeType: "Fuel Station",
      description: "Fuel pump at Kirulapone High Level Road junction.",
      imageUrl: "/images/colombo images/lioc-fuel.jpg",
      lat: 6.8831,
      lng: 79.8761
    },
    {
      id: "colombo-u23",
      name: "LIOC Station Havelock Road",
      district: "Colombo",
      placeType: "Fuel Station",
      description: "Refueling station on Havelock Road.",
      imageUrl: "/images/colombo images/fuel-station-1.jpg",
      lat: 6.8908,
      lng: 79.8642
    },
    {
      id: "colombo-u24",
      name: "Ceypetco Shed Nawala",
      district: "Colombo",
      placeType: "Fuel Station",
      description: "Fuel station in Nawala wetland corridor.",
      imageUrl: "/images/colombo images/fuel-station-2.jpg",
      lat: 6.8883,
      lng: 79.8872
    },
    {
      id: "colombo-u25",
      name: "LIOC Station Kohuwala",
      district: "Colombo",
      placeType: "Fuel Station",
      description: "Auto refuel shed at Kohuwala cross junction.",
      imageUrl: "/images/colombo images/ceypetco-fuel.jpg",
      lat: 6.8631,
      lng: 79.8836
    }
  ],
  transport: [
    {
      id: "colombo-tr1",
      name: "Colombo Fort Railway Station",
      district: "Colombo",
      placeType: "Main Railway Hub",
      description: "Sri Lanka's central railway hub connecting Colombo Fort to Kandy, Galle, Jaffna, and Badulla.",
      imageUrl: "/images/colombo images/pettah-bus-stand.jpg",
      lat: 6.9344,
      lng: 79.8503
    },
    {
      id: "colombo-tr2",
      name: "Pettah Central Bus Stand",
      district: "Colombo",
      placeType: "Intercity Bus Stand",
      description: "Bustling main intercity bus terminal connecting all 9 provinces across Sri Lanka.",
      imageUrl: "/images/colombo images/makumbura-center.jpg",
      lat: 6.9367,
      lng: 79.8539
    },
    {
      id: "colombo-tr3",
      name: "Maradana Railway Junction",
      district: "Colombo",
      placeType: "Railway Junction",
      description: "Major suburban railway junction handling heavy daily commuter train traffic.",
      imageUrl: "/images/colombo images/pettah-bus-stand.jpg",
      lat: 6.9272,
      lng: 79.8653
    },
    {
      id: "colombo-tr4",
      name: "Makumbura Multimodal Center Kottawa",
      district: "Colombo",
      placeType: "Multimodal Hub",
      description: "Sri Lanka's modern integrated transport hub connecting Southern Expressway buses, suburban buses, and coastal train lines.",
      imageUrl: "/images/colombo images/makumbura-center.jpg",
      lat: 6.8408,
      lng: 79.9678
    },
    {
      id: "colombo-tr5",
      name: "Mount Lavinia Railway Station",
      district: "Colombo",
      placeType: "Coastal Train Station",
      description: "Picturesque coastal railway station located right along the Indian Ocean beach line.",
      imageUrl: "/images/colombo images/pettah-bus-stand.jpg",
      lat: 6.8331,
      lng: 79.8622
    },
    {
      id: "colombo-tr6",
      name: "Bambalapitiya Railway Station",
      district: "Colombo",
      placeType: "Coastal Train Halt",
      description: "Busy commuter railway station on Marine Drive connecting Colombo 4 to southern routes.",
      imageUrl: "/images/colombo images/makumbura-center.jpg",
      lat: 6.8947,
      lng: 79.8542
    },
    {
      id: "colombo-tr7",
      name: "Dehiwala Railway Station",
      district: "Colombo",
      placeType: "Railway Station",
      description: "Coastal train station serving the suburban population of Dehiwala.",
      imageUrl: "/images/colombo images/pettah-bus-stand.jpg",
      lat: 6.8525,
      lng: 79.8631
    },
    {
      id: "colombo-tr8",
      name: "Kollupitiya Railway Station",
      district: "Colombo",
      placeType: "Railway Station",
      description: "Oceanfront train halt serving the financial offices of Colombo 3.",
      imageUrl: "/images/colombo images/makumbura-center.jpg",
      lat: 6.9089,
      lng: 79.8506
    },
    {
      id: "colombo-tr9",
      name: "Wellawatte Railway Station",
      district: "Colombo",
      placeType: "Railway Station",
      description: "Coastal train stop situated next to Marine Drive promenade.",
      imageUrl: "/images/colombo images/pettah-bus-stand.jpg",
      lat: 6.8744,
      lng: 79.8589
    },
    {
      id: "colombo-tr10",
      name: "Nugegoda Central Bus Stand",
      district: "Colombo",
      placeType: "Bus Stand",
      description: "High-volume suburban bus station connecting Nugegoda to Kottawa, Maharagama, and Fort.",
      imageUrl: "/images/colombo images/makumbura-center.jpg",
      lat: 6.8719,
      lng: 79.8889
    },
    {
      id: "colombo-tr11",
      name: "Maharagama SLTB Bus Depot",
      district: "Colombo",
      placeType: "Bus Depot",
      description: "Regional state bus depot operating expressway and intercity bus fleets.",
      imageUrl: "/images/colombo images/pettah-bus-stand.jpg",
      lat: 6.8483,
      lng: 79.9258
    },
    {
      id: "colombo-tr12",
      name: "Kottawa Railway Station",
      district: "Colombo",
      placeType: "Railway Station",
      description: "Commuter train station on the Kelani Valley rail line.",
      imageUrl: "/images/colombo images/makumbura-center.jpg",
      lat: 6.8419,
      lng: 79.9650
    },
    {
      id: "colombo-tr13",
      name: "Kaduwela Expressway Terminal",
      district: "Colombo",
      placeType: "Expressway Terminal",
      description: "Highway passenger terminal linking Outer Circular Expressway to Kandy Road.",
      imageUrl: "/images/colombo images/pettah-bus-stand.jpg",
      lat: 6.9361,
      lng: 79.9839
    },
    {
      id: "colombo-tr14",
      name: "Rajagiriya Bus Station",
      district: "Colombo",
      placeType: "Bus Stop",
      description: "Suburban bus stop located near Sri Jayawardenepura parliamentary corridor.",
      imageUrl: "/images/colombo images/makumbura-center.jpg",
      lat: 6.9086,
      lng: 79.8939
    },
    {
      id: "colombo-tr15",
      name: "Battaramulla Bus Terminal",
      district: "Colombo",
      placeType: "Bus Stand",
      description: "Bus terminal serving administrative ministry headquarters.",
      imageUrl: "/images/colombo images/pettah-bus-stand.jpg",
      lat: 6.8986,
      lng: 79.9239
    },
    {
      id: "colombo-tr16",
      name: "Peliyagoda Transport Hub",
      district: "Colombo",
      placeType: "Transport Hub",
      description: "Major transport node connecting fish market, wholesale markets, and Colombo entrance.",
      imageUrl: "/images/colombo images/makumbura-center.jpg",
      lat: 6.9606,
      lng: 79.8889
    },
    {
      id: "colombo-tr17",
      name: "Bastian Mawatha Private Bus Depot",
      district: "Colombo",
      placeType: "Private Bus Stand",
      description: "Main private long-distance intercity bus stand near Fort station.",
      imageUrl: "/images/colombo images/pettah-bus-stand.jpg",
      lat: 6.9331,
      lng: 79.8519
    },
    {
      id: "colombo-tr18",
      name: "Galle Face TukTuk Stand",
      district: "Colombo",
      placeType: "TukTuk Stand",
      description: "Licensed local three-wheeler stand providing city tours and short rides along Galle Face.",
      imageUrl: "/images/colombo images/makumbura-center.jpg",
      lat: 6.9269,
      lng: 79.8436
    },
    {
      id: "colombo-tr19",
      name: "Port of Colombo Passenger Jetty",
      district: "Colombo",
      placeType: "Passenger Jetty",
      description: "Harbor passenger dock for cruise ships and ocean vessels.",
      imageUrl: "/images/colombo images/pettah-bus-stand.jpg",
      lat: 6.9442,
      lng: 79.8469
    },
    {
      id: "colombo-tr20",
      name: "Beira Lake Boat Passenger Dock",
      district: "Colombo",
      placeType: "Boat Dock",
      description: "Passenger ferry dock on Beira Lake for urban water transport.",
      imageUrl: "/images/colombo images/makumbura-center.jpg",
      lat: 6.9189,
      lng: 79.8525
    },
    {
      id: "colombo-tr21",
      name: "Dematagoda Railway Station",
      district: "Colombo",
      placeType: "Railway Station",
      description: "Important suburban train junction between Main Line and Kelani Valley line.",
      imageUrl: "/images/colombo images/pettah-bus-stand.jpg",
      lat: 6.9286,
      lng: 79.8764
    },
    {
      id: "colombo-tr22",
      name: "Narahenpita Railway Station",
      district: "Colombo",
      placeType: "Railway Station",
      description: "Kelani Valley railway station serving Narahenpita institutional zone.",
      imageUrl: "/images/colombo images/makumbura-center.jpg",
      lat: 6.8922,
      lng: 79.8786
    },
    {
      id: "colombo-tr23",
      name: "Nugegoda Railway Station",
      district: "Colombo",
      placeType: "Railway Station",
      description: "Commuter train station in the commercial heart of Nugegoda.",
      imageUrl: "/images/colombo images/pettah-bus-stand.jpg",
      lat: 6.8725,
      lng: 79.8897
    },
    {
      id: "colombo-tr24",
      name: "Homagama Central Bus Depot",
      district: "Colombo",
      placeType: "Bus Depot",
      description: "Outer suburban bus depot serving eastern Colombo routes.",
      imageUrl: "/images/colombo images/makumbura-center.jpg",
      lat: 6.8436,
      lng: 80.0028
    },
    {
      id: "colombo-tr25",
      name: "Malabe Bus Terminal",
      district: "Colombo",
      placeType: "Bus Stand",
      description: "Modern passenger bus terminal in Malabe IT zone.",
      imageUrl: "/images/colombo images/pettah-bus-stand.jpg",
      lat: 6.9039,
      lng: 79.9544
    }
  ],
  repairsAndRentals: [
    {
      id: "colombo-r1",
      name: "Toyota Lanka Service Centre Colombo",
      district: "Colombo",
      placeType: "Authorized Auto Care",
      description: "Official Toyota authorized service workshop providing maintenance, engine diagnostics, and genuine spare parts.",
      imageUrl: "/images/colombo images/toyota-lanka.jpg",
      lat: 6.9286,
      lng: 79.8658
    },
    {
      id: "colombo-r2",
      name: "David Pieris Motor Co (Bajaj) Service",
      district: "Colombo",
      placeType: "TukTuk & Bike Repair",
      description: "Official Bajaj service center for three-wheelers and Pulsar motorcycles.",
      imageUrl: "/images/colombo images/toyota-lanka.jpg",
      lat: 6.9214,
      lng: 79.8611
    },
    {
      id: "colombo-r3",
      name: "AMW Pitstop Borella",
      district: "Colombo",
      placeType: "Auto Service",
      description: "Quick lube oil change, tire balancing, and battery diagnostics facility on Bauddhaloka Mawatha.",
      imageUrl: "/images/colombo images/toyota-lanka.jpg",
      lat: 6.9119,
      lng: 79.8781
    },
    {
      id: "colombo-r4",
      name: "Auto Miraj Car Care Kollupitiya",
      district: "Colombo",
      placeType: "Car Detailing",
      description: "Full body car washing, interior vacuuming, wax polish, and ceramic coating detailing center.",
      imageUrl: "/images/colombo images/toyota-lanka.jpg",
      lat: 6.9083,
      lng: 79.8522
    },
    {
      id: "colombo-r5",
      name: "United Motors Hyde Park Service",
      district: "Colombo",
      placeType: "Auto Repair",
      description: "Authorized Mitsubishi service garage for engine overhauls, brake maintenance, and vehicle inspections.",
      imageUrl: "/images/colombo images/toyota-lanka.jpg",
      lat: 6.9189,
      lng: 79.8589
    },
    {
      id: "colombo-r6",
      name: "TVS Lanka Service Centre",
      district: "Colombo",
      placeType: "Motorcycle Service",
      description: "Official TVS scooter and motorcycle maintenance and repair workshop.",
      imageUrl: "/images/colombo images/toyota-lanka.jpg",
      lat: 6.9247,
      lng: 79.8694
    },
    {
      id: "colombo-r7",
      name: "Colombo Scooter & Bike Rentals",
      district: "Colombo",
      placeType: "Vehicle Rental",
      description: "Popular scooter, motorcycle, and bicycle rental shop for city exploration.",
      imageUrl: "/images/colombo images/toyota-lanka.jpg",
      lat: 6.9069,
      lng: 79.8519
    },
    {
      id: "colombo-r8",
      name: "Car Care Dehiwala Garage",
      district: "Colombo",
      placeType: "Garage",
      description: "General vehicle mechanical repair, oil change, and brake replacement workshop.",
      imageUrl: "/images/colombo images/toyota-lanka.jpg",
      lat: 6.8519,
      lng: 79.8642
    },
    {
      id: "colombo-r9",
      name: "Hybrid Hub Narahenpita",
      district: "Colombo",
      placeType: "Hybrid Care",
      description: "Specialized high-voltage hybrid battery testing and conditioning workshop.",
      imageUrl: "/images/colombo images/toyota-lanka.jpg",
      lat: 6.8928,
      lng: 79.8794
    },
    {
      id: "colombo-r10",
      name: "Nugegoda Tyre House & Alignment",
      district: "Colombo",
      placeType: "Tyre Shop",
      description: "Computerized wheel alignment, wheel balancing, and new tyre fitting.",
      imageUrl: "/images/colombo images/toyota-lanka.jpg",
      lat: 6.8722,
      lng: 79.8894
    },
    {
      id: "colombo-r11",
      name: "Maharagama Battery Centre",
      district: "Colombo",
      placeType: "Auto Electrician",
      description: "Vehicle battery sales, charging, alternator diagnostics, and wiring repairs.",
      imageUrl: "/images/colombo images/toyota-lanka.jpg",
      lat: 6.8489,
      lng: 79.9261
    },
    {
      id: "colombo-r12",
      name: "Ceylon Auto Care Kollupitiya",
      district: "Colombo",
      placeType: "Auto Detailing",
      description: "Express car wash, undercarriage wash, and windshield cleaning.",
      imageUrl: "/images/colombo images/toyota-lanka.jpg",
      lat: 6.9075,
      lng: 79.8525
    },
    {
      id: "colombo-r13",
      name: "SR Rent-a-Car Colombo Fort",
      district: "Colombo",
      placeType: "Car Rental",
      description: "Self-drive and luxury chauffeur vehicle hire for business and travel.",
      imageUrl: "/images/colombo images/toyota-lanka.jpg",
      lat: 6.9336,
      lng: 79.8436
    },
    {
      id: "colombo-r14",
      name: "Auto Air Conditioning Repair Borella",
      district: "Colombo",
      placeType: "Auto AC Repair",
      description: "Car air conditioning gas refilling, compressor repair, and leak fixing.",
      imageUrl: "/images/colombo images/toyota-lanka.jpg",
      lat: 6.9144,
      lng: 79.8789
    },
    {
      id: "colombo-r15",
      name: "Wellawatte Motor Garage",
      district: "Colombo",
      placeType: "General Mechanic",
      description: "Engine overhauling, clutch repair, and suspension garage.",
      imageUrl: "/images/colombo images/toyota-lanka.jpg",
      lat: 6.8744,
      lng: 79.8608
    },
    {
      id: "colombo-r16",
      name: "Kaduwela Auto Mechanicals",
      district: "Colombo",
      placeType: "Garage",
      description: "General vehicle repair workshop near highway exit.",
      imageUrl: "/images/colombo images/toyota-lanka.jpg",
      lat: 6.9364,
      lng: 79.9844
    },
    {
      id: "colombo-r17",
      name: "Battaramulla Motor Garage",
      district: "Colombo",
      placeType: "Garage",
      description: "Auto repair shop specializing in Japanese car brands.",
      imageUrl: "/images/colombo images/toyota-lanka.jpg",
      lat: 6.8992,
      lng: 79.9244
    },
    {
      id: "colombo-r18",
      name: "Rajagiriya Tinkering & Paint Workshop",
      district: "Colombo",
      placeType: "Auto Painting",
      description: "Vehicle body tinkering, dent removal, and 2K paint booth service.",
      imageUrl: "/images/colombo images/toyota-lanka.jpg",
      lat: 6.9092,
      lng: 79.8944
    },
    {
      id: "colombo-r19",
      name: "Homagama Tyre Service & Vulcanizing",
      district: "Colombo",
      placeType: "Tyre Shop",
      description: "Tyre vulcanizing, puncture repair, and new tyre sales.",
      imageUrl: "/images/colombo images/toyota-lanka.jpg",
      lat: 6.8439,
      lng: 80.0031
    },
    {
      id: "colombo-r20",
      name: "Kotahena Bike Mechanics",
      district: "Colombo",
      placeType: "Bike Mechanic",
      description: "Motorcycle and scooter tune-up garage.",
      imageUrl: "/images/colombo images/toyota-lanka.jpg",
      lat: 6.9481,
      lng: 79.8589
    },
    {
      id: "colombo-r21",
      name: "Dematagoda Garage",
      district: "Colombo",
      placeType: "General Mechanic",
      description: "Lorry, van, and car repair workshop.",
      imageUrl: "/images/colombo images/toyota-lanka.jpg",
      lat: 6.9292,
      lng: 79.8772
    },
    {
      id: "colombo-r22",
      name: "Kohuwala Auto Care",
      district: "Colombo",
      placeType: "Car Wash",
      description: "Underwash, engine degreasing, and car wax.",
      imageUrl: "/images/colombo images/toyota-lanka.jpg",
      lat: 6.8633,
      lng: 79.8839
    },
    {
      id: "colombo-r23",
      name: "Malabe Motor Workshop",
      district: "Colombo",
      placeType: "Garage",
      description: "General vehicle maintenance garage.",
      imageUrl: "/images/colombo images/toyota-lanka.jpg",
      lat: 6.9044,
      lng: 79.9550
    },
    {
      id: "colombo-r24",
      name: "Pelawatte Vehicle Detailing Studio",
      district: "Colombo",
      placeType: "Car Detailing",
      description: "Interior leather conditioning and ceramic coating.",
      imageUrl: "/images/colombo images/toyota-lanka.jpg",
      lat: 6.8953,
      lng: 79.9322
    },
    {
      id: "colombo-r25",
      name: "Mount Lavinia Scooter Rent & Repair",
      district: "Colombo",
      placeType: "Vehicle Hire",
      description: "Beachfront scooter rental and tourist bicycle shop.",
      imageUrl: "/images/colombo images/toyota-lanka.jpg",
      lat: 6.8336,
      lng: 79.8628
    }
  ],
  emergencyServices: [
    {
      id: "colombo-e1",
      name: "National Hospital of Sri Lanka (NHSL)",
      district: "Colombo",
      placeType: "Government Hospital",
      description: "Sri Lanka's premier tertiary referral government hospital featuring a 24-hour accident ward and ICU.",
      imageUrl: "/images/colombo images/independence-memorial.jpg",
      lat: 6.9175,
      lng: 79.8683
    },
    {
      id: "colombo-e2",
      name: "Asiri Central Hospital",
      district: "Colombo",
      placeType: "Private Hospital",
      description: "14-story modern private hospital in Norris Canal Road offering emergency, stroke center, and cardiac ICU.",
      imageUrl: "/images/colombo images/toyota-lanka.jpg",
      lat: 6.9211,
      lng: 79.8656
    },
    {
      id: "colombo-e3",
      name: "Durdans Hospital Kollupitiya",
      district: "Colombo",
      placeType: "Private Hospital",
      description: "JCI-accredited tertiary private hospital known for Alfred Place Heart Centre and 24/7 ER.",
      imageUrl: "/images/colombo images/pettah-bus-stand.jpg",
      lat: 6.8972,
      lng: 79.8542
    },
    {
      id: "colombo-e4",
      name: "Lanka Hospitals Narahenpita",
      district: "Colombo",
      placeType: "Private Hospital",
      description: "Multi-specialty private hospital offering emergency, kidney care, and advanced surgical theatres.",
      imageUrl: "/images/colombo images/independence-memorial.jpg",
      lat: 6.8931,
      lng: 79.8778
    },
    {
      id: "colombo-e5",
      name: "Nawaloka Hospital Colombo Fort",
      district: "Colombo",
      placeType: "Private Hospital",
      description: "Established private hospital near Beira Lake featuring 24-hour MRI, CT scan, and emergency unit.",
      imageUrl: "/images/colombo images/toyota-lanka.jpg",
      lat: 6.9247,
      lng: 79.8517
    },
    {
      id: "colombo-e6",
      name: "Ninewells Hospital Narahenpita",
      district: "Colombo",
      placeType: "Women & Children Hospital",
      description: "Leading private maternity, women's health, and pediatric hospital in Sri Lanka.",
      imageUrl: "/images/colombo images/pettah-bus-stand.jpg",
      lat: 6.8906,
      lng: 79.8806
    },
    {
      id: "colombo-e7",
      name: "Colombo Fort Police Station",
      district: "Colombo",
      placeType: "Police Station",
      description: "Central police headquarters division providing security and emergency tourist assistance.",
      imageUrl: "/images/colombo images/independence-memorial.jpg",
      lat: 6.9358,
      lng: 79.8453
    },
    {
      id: "colombo-e8",
      name: "Kollupitiya Police Station",
      district: "Colombo",
      placeType: "Police Station",
      description: "Division police station serving Galle Road embassy and commercial zone.",
      imageUrl: "/images/colombo images/toyota-lanka.jpg",
      lat: 6.9086,
      lng: 79.8514
    },
    {
      id: "colombo-e9",
      name: "Bambalapitiya Police Station",
      district: "Colombo",
      placeType: "Police Station",
      description: "Local law enforcement station serving Colombo 4.",
      imageUrl: "/images/colombo images/pettah-bus-stand.jpg",
      lat: 6.8942,
      lng: 79.8547
    },
    {
      id: "colombo-e10",
      name: "1990 Suwa Seriya Emergency Hub",
      district: "Colombo",
      placeType: "Ambulance Service",
      description: "Free island-wide emergency paramedic ambulance dispatch center for Colombo.",
      imageUrl: "/images/colombo images/independence-memorial.jpg",
      lat: 6.9167,
      lng: 79.8672
    },
    {
      id: "colombo-e11",
      name: "Castle Street Hospital for Women",
      district: "Colombo",
      placeType: "Government Hospital",
      description: "Government specialized maternity and neonatal hospital.",
      imageUrl: "/images/colombo images/toyota-lanka.jpg",
      lat: 6.9094,
      lng: 79.8825
    },
    {
      id: "colombo-e12",
      name: "Lady Ridgeway Hospital for Children (LRH)",
      district: "Colombo",
      placeType: "Children Hospital",
      description: "Largest tertiary pediatric government hospital in Sri Lanka.",
      imageUrl: "/images/colombo images/pettah-bus-stand.jpg",
      lat: 6.9172,
      lng: 79.8736
    },
    {
      id: "colombo-e13",
      name: "National Eye Hospital Borella",
      district: "Colombo",
      placeType: "Specialized Hospital",
      description: "National government hospital dedicated to ophthalmic care and eye surgery.",
      imageUrl: "/images/colombo images/independence-memorial.jpg",
      lat: 6.9186,
      lng: 79.8722
    },
    {
      id: "colombo-e14",
      name: "SPC Rajya Osu Sala Town Hall",
      district: "Colombo",
      placeType: "State Pharmacy",
      description: "State Pharmaceuticals Corporation 24-hour pharmacy for quality medicines.",
      imageUrl: "/images/colombo images/toyota-lanka.jpg",
      lat: 6.9147,
      lng: 79.8603
    },
    {
      id: "colombo-e15",
      name: "Borella Police Station",
      district: "Colombo",
      placeType: "Police Station",
      description: "Police station serving Borella junction and hospital square.",
      imageUrl: "/images/colombo images/pettah-bus-stand.jpg",
      lat: 6.9142,
      lng: 79.8778
    },
    {
      id: "colombo-e16",
      name: "Dehiwala Police Station",
      district: "Colombo",
      placeType: "Police Station",
      description: "Suburban law enforcement station.",
      imageUrl: "/images/colombo images/independence-memorial.jpg",
      lat: 6.8517,
      lng: 79.8644
    },
    {
      id: "colombo-e17",
      name: "Union Chemists 24/7 Pharmacy Town Hall",
      district: "Colombo",
      placeType: "24/7 Pharmacy",
      description: "Round-the-clock pharmacy for prescription drugs and surgical items.",
      imageUrl: "/images/colombo images/toyota-lanka.jpg",
      lat: 6.9150,
      lng: 79.8608
    },
    {
      id: "colombo-e18",
      name: "Fire & Rescue Headquarters Fort",
      district: "Colombo",
      placeType: "Fire Station",
      description: "Colombo Municipal Council emergency fire brigade and rescue headquarters.",
      imageUrl: "/images/colombo images/pettah-bus-stand.jpg",
      lat: 6.9367,
      lng: 79.8525
    },
    {
      id: "colombo-e19",
      name: "Colombo South Teaching Hospital Kalubowila",
      district: "Colombo",
      placeType: "Teaching Hospital",
      description: "Second largest government hospital in Colombo district.",
      imageUrl: "/images/colombo images/independence-memorial.jpg",
      lat: 6.8647,
      lng: 79.8764
    },
    {
      id: "colombo-e20",
      name: "Apeksha Hospital Maharagama",
      district: "Colombo",
      placeType: "Cancer Hospital",
      description: "National Cancer Institute of Sri Lanka offering specialized oncology care.",
      imageUrl: "/images/colombo images/toyota-lanka.jpg",
      lat: 6.8447,
      lng: 79.9239
    },
    {
      id: "colombo-e21",
      name: "Sri Jayewardenepura General Hospital",
      district: "Colombo",
      placeType: "Government Hospital",
      description: "Tertiary multi-specialty government hospital near Sri Jayawardenepura Kotte.",
      imageUrl: "/images/colombo images/pettah-bus-stand.jpg",
      lat: 6.8786,
      lng: 79.9222
    },
    {
      id: "colombo-e22",
      name: "Homagama Base Hospital",
      district: "Colombo",
      placeType: "Base Hospital",
      description: "Government base hospital serving eastern Colombo district.",
      imageUrl: "/images/colombo images/independence-memorial.jpg",
      lat: 6.8428,
      lng: 80.0033
    },
    {
      id: "colombo-e23",
      name: "Wellawatte Police Station",
      district: "Colombo",
      placeType: "Police Station",
      description: "Suburban police station serving Colombo 6.",
      imageUrl: "/images/colombo images/toyota-lanka.jpg",
      lat: 6.8739,
      lng: 79.8611
    },
    {
      id: "colombo-e24",
      name: "Nugegoda Police Station",
      district: "Colombo",
      placeType: "Police Station",
      description: "Suburban police station serving Nugegoda junction.",
      imageUrl: "/images/colombo images/pettah-bus-stand.jpg",
      lat: 6.8714,
      lng: 79.8892
    },
    {
      id: "colombo-e25",
      name: "Healthguard Pharmacy Kollupitiya",
      district: "Colombo",
      placeType: "Pharmacy",
      description: "Modern retail pharmacy for prescription and wellness products.",
      imageUrl: "/images/colombo images/independence-memorial.jpg",
      lat: 6.9072,
      lng: 79.8519
    }
  ]
};

function getPlaceImage(place) {
  return place.imageUrl || "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=800&q=80";
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
          e.currentTarget.src = "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=800&q=80";
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

export default function ColomboPage() {
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

  // Master list of all places across categories in Colombo
  const allColomboPlaces = useMemo(() => {
    return [
      ...COLOMBO_CATEGORIZED_PLACES.tourism,
      ...COLOMBO_CATEGORIZED_PLACES.food,
      ...COLOMBO_CATEGORIZED_PLACES.stay,
      ...COLOMBO_CATEGORIZED_PLACES.fuel,
      ...COLOMBO_CATEGORIZED_PLACES.transport,
      ...COLOMBO_CATEGORIZED_PLACES.repairsAndRentals,
      ...COLOMBO_CATEGORIZED_PLACES.emergencyServices
    ];
  }, []);

  // Filtered master list for top map based on search query
  const filteredAllPlaces = useMemo(() => {
    if (!searchQuery.trim()) return allColomboPlaces;
    const query = searchQuery.toLowerCase().trim();
    return allColomboPlaces.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        (p.placeType && p.placeType.toLowerCase().includes(query)) ||
        (p.description && p.description.toLowerCase().includes(query))
    );
  }, [allColomboPlaces, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-16">
      {/* 1. HERO IMAGE BOX */}
      <header className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-4">
        <div className="relative overflow-hidden rounded-3xl shadow-xl">
          <img
            src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=1200&q=80"
            alt="Colombo City"
            className="w-full h-[260px] sm:h-[320px] object-cover"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1200&q=80";
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
              Colombo
            </h1>
            <p className="mt-3 text-sm sm:text-base md:text-lg max-w-2xl text-white/90 font-light leading-relaxed">
              Explore urban attractions, food, transport hubs, city services, and travel spots across Colombo.
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
            Welcome to Colombo District
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed font-normal">
            Colombo is the bustling commercial capital and financial heart of Sri Lanka. From historic colonial architecture and sacred seaside temples to world-class dining, luxury shopping malls, coastal train routes, and comprehensive medical facilities, explore everything Colombo has to offer.
          </p>
        </div>

        {/* 3. SEARCH BAR */}
        <div className="bg-white rounded-2xl shadow-xs border border-gray-200/80 p-4 sm:p-5 mb-6 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search places, restaurants, transport, or services in Colombo..."
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
            title="Colombo District Map"
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
            places={COLOMBO_CATEGORIZED_PLACES.tourism}
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
            places={COLOMBO_CATEGORIZED_PLACES.food}
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
            places={COLOMBO_CATEGORIZED_PLACES.stay}
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
            places={COLOMBO_CATEGORIZED_PLACES.fuel}
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
            places={COLOMBO_CATEGORIZED_PLACES.transport}
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
            places={COLOMBO_CATEGORIZED_PLACES.repairsAndRentals}
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
            places={COLOMBO_CATEGORIZED_PLACES.emergencyServices}
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
            Welcome to Colombo
          </p>
          <p className="text-gray-600 text-sm mt-1 max-w-xl mx-auto leading-relaxed">
            Discover places, food, transport, services, and local experiences across Colombo District.
          </p>
        </div>
      </footer>
    </div>
  );
}
