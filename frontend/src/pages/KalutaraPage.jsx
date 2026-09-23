import React, { useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PlacesMap from "../components/PlacesMap";
import { Map, ChevronLeft, MapPin, Search, PlusCircle, RotateCcw } from "lucide-react";

// Categorized authentic Kalutara places dataset (25 - 30 places per category)
export const KALUTARA_CATEGORIZED_PLACES = {
  tourism: [
    {
      id: "kalutara-t1",
      name: "Kalutara Bodhiya & Sacred Stupa",
      district: "Kalutara",
      placeType: "Sacred Shrine",
      description: "Sacred Buddhist complex featuring an ancient sacred Bo tree and the world's only hollow stupa with interior murals.",
      imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80",
      lat: 6.5867,
      lng: 79.9603
    },
    {
      id: "kalutara-t2",
      name: "Richmond Castle",
      district: "Kalutara",
      placeType: "Historic Castle",
      description: "Grand Edwardian mansion built in 1900 with 99 doors, teak carvings, and surrounding fruit orchards.",
      imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80",
      lat: 6.5989,
      lng: 79.9881
    },
    {
      id: "kalutara-t3",
      name: "Bentota Golden Beach Strip",
      district: "Kalutara",
      placeType: "Beach Coast",
      description: "Famous coastal beach peninsula flanked by the Indian Ocean and Bentota River lagoon, popular for water sports.",
      imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      lat: 6.4258,
      lng: 79.9972
    },
    {
      id: "kalutara-t4",
      name: "Brief Garden by Bevis Bawa",
      district: "Kalutara",
      placeType: "Landscape Garden",
      description: "Enchanting 5-acre tropical estate and sculpture garden created by artist and landscape architect Bevis Bawa.",
      imageUrl: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80",
      lat: 6.4447,
      lng: 80.0528
    },
    {
      id: "kalutara-t5",
      name: "Kande Viharaya Temple Aluthgama",
      district: "Kalutara",
      placeType: "Temple",
      description: "Historic 18th-century mountain temple featuring one of the tallest seated Buddha statues in the world.",
      imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
      lat: 6.4419,
      lng: 80.0078
    },
    {
      id: "kalutara-t6",
      name: "Barberyn Island Lighthouse",
      district: "Kalutara",
      placeType: "Lighthouse",
      description: "Colonial 1889 granite lighthouse built on Barberyn island off the coast of Beruwala fishing port.",
      imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
      lat: 6.4633,
      lng: 79.9639
    },
    {
      id: "kalutara-t7",
      name: "Pahiyangala (Fa Hien) Cave",
      district: "Kalutara",
      placeType: "Prehistoric Cave",
      description: "Massive natural rock cave site where 37,000-year-old human fossils and microlithic tools were excavated.",
      imageUrl: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80",
      lat: 6.6219,
      lng: 80.2197
    },
    {
      id: "kalutara-t8",
      name: "Calido Beach Spit",
      district: "Kalutara",
      placeType: "Beach Spit",
      description: "Scenic sand spit separating the Kalu Ganga river estuary from the crashing Indian Ocean waves.",
      imageUrl: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80",
      lat: 6.5819,
      lng: 79.9547
    },
    {
      id: "kalutara-t9",
      name: "Kechchimalai Mosque Beruwala",
      district: "Kalutara",
      placeType: "Historic Mosque",
      description: "Ancient Islamic shrine built on a rocky headland by early 10th-century Arab traders arriving in Ceylon.",
      imageUrl: "https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=800&q=80",
      lat: 6.4808,
      lng: 79.9794
    },
    {
      id: "kalutara-t10",
      name: "Thotupola Kanda Forest Peak",
      district: "Kalutara",
      placeType: "Mountain Peak",
      description: "High mountain forest peak in Yagirala offering hiking trails through lowland rainforest biodiversity.",
      imageUrl: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80",
      lat: 6.5414,
      lng: 80.1283
    },
    {
      id: "kalutara-t11",
      name: "Bentota River Mangrove Safari",
      district: "Kalutara",
      placeType: "River Safari",
      description: "Boat excursion winding through mangrove tunnels for spotting crocodiles, water monitors, and kingfishers.",
      imageUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
      lat: 6.4283,
      lng: 80.0056
    },
    {
      id: "kalutara-t12",
      name: "Asokaramaya Temple Kalutara North",
      district: "Kalutara",
      placeType: "Temple",
      description: "Historic temple featuring colorful wall murals and quiet meditation halls near Kalutara coast.",
      imageUrl: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=800&q=80",
      lat: 6.5972,
      lng: 79.9619
    },
    {
      id: "kalutara-t13",
      name: "Wadduwa Coconut Beach",
      district: "Kalutara",
      placeType: "Beach",
      description: "Peaceful coastal strip lined with tall coconut palms, traditional toddy tappers, and Ayurvedic resorts.",
      imageUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80",
      lat: 6.6667,
      lng: 79.9272
    },
    {
      id: "kalutara-t14",
      name: "Kosgoda Sea Turtle Hatchery",
      district: "Kalutara",
      placeType: "Turtle Sanctuary",
      description: "Conservation project dedicated to protecting sea turtle nests and releasing baby hatchlings into the ocean.",
      imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80",
      lat: 6.3314,
      lng: 80.0347
    },
    {
      id: "kalutara-t15",
      name: "Yagirala Forest Reserve",
      district: "Kalutara",
      placeType: "Rainforest Reserve",
      description: "Lowland tropical rainforest ecosystem managed for ecological research and nature walks.",
      imageUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80",
      lat: 6.3778,
      lng: 80.1772
    },
    {
      id: "kalutara-t16",
      name: "Magala Tank Reservoir",
      district: "Kalutara",
      placeType: "Ancient Reservoir",
      description: "Historic irrigation reservoir built by ancient Sinhalese kings, covered in purple water lilies.",
      imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
      lat: 6.4672,
      lng: 80.0039
    },
    {
      id: "kalutara-t17",
      name: "Katukurunda Beach Cove",
      district: "Kalutara",
      placeType: "Beach",
      description: "Tranquil sandy beach cove ideal for quiet evening strolls away from resort crowds.",
      imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      lat: 6.5658,
      lng: 79.9589
    },
    {
      id: "kalutara-t18",
      name: "Bodhinagala Forest Hermitage",
      district: "Kalutara",
      placeType: "Forest Hermitage",
      description: "Secluded rainforest monastery in Ingiriya surrounded by flowing mountain streams.",
      imageUrl: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=800&q=80",
      lat: 6.7417,
      lng: 80.1719
    },
    {
      id: "kalutara-t19",
      name: "Nachchimale Waterfall Cascade",
      district: "Kalutara",
      placeType: "Waterfall",
      description: "Refreshing natural river waterfall and rock pools nestled in the lush greenery of Ingiriya.",
      imageUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
      lat: 6.7478,
      lng: 80.1803
    },
    {
      id: "kalutara-t20",
      name: "Gangatilaka Island Temple",
      district: "Kalutara",
      placeType: "Island Temple",
      description: "Serene Buddhist shrine island surrounded by the tranquil waters of Kalu Ganga river.",
      imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80",
      lat: 6.5878,
      lng: 79.9631
    },
    {
      id: "kalutara-t21",
      name: "Beruwala Deep-Sea Fishing Harbor",
      district: "Kalutara",
      placeType: "Fishing Harbor",
      description: "Vibrant coastal harbor where hundreds of colorful multi-day fishing trawlers dock daily.",
      imageUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80",
      lat: 6.4794,
      lng: 79.9786
    },
    {
      id: "kalutara-t22",
      name: "Diyagala Sanasuma Meditation Centre",
      district: "Kalutara",
      placeType: "Meditation Centre",
      description: "Hillside Buddhist retreat surrounded by green rubber and tea plantations near Horana.",
      imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
      lat: 6.7125,
      lng: 80.0639
    },
    {
      id: "kalutara-t23",
      name: "Horana Royal Botanical Park",
      district: "Kalutara",
      placeType: "Urban Park",
      description: "Shaded green park in Horana with ancient mahogany trees, lotus ponds, and walking tracks.",
      imageUrl: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80",
      lat: 6.7161,
      lng: 80.0617
    },
    {
      id: "kalutara-t24",
      name: "Payagala Fishing Village Beach",
      district: "Kalutara",
      placeType: "Beach",
      description: "Quiet fishing village shoreline with traditional wooden outrigger canoes.",
      imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      lat: 6.5317,
      lng: 79.9658
    },
    {
      id: "kalutara-t25",
      name: "Moragalla Beach Reef Cove",
      district: "Kalutara",
      placeType: "Reef Lagoon",
      description: "Shallow, calm sea lagoon protected by coral reef, ideal for safe swimming and snorkeling.",
      imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      lat: 6.4528,
      lng: 79.9861
    },
    {
      id: "kalutara-t26",
      name: "Kalu Ganga Bridge Viewpoint",
      district: "Kalutara",
      placeType: "Bridge Viewpoint",
      description: "Iconic twin bridges across Kalu Ganga river offering picturesque views of Kalutara Stupa.",
      imageUrl: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80",
      lat: 6.5889,
      lng: 79.9606
    },
    {
      id: "kalutara-t27",
      name: "Pokunuwita Rajamaha Viharaya",
      district: "Kalutara",
      placeType: "Temple",
      description: "Ancient stone temple featuring sacred bathing ponds and historic stone carved pillars.",
      imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80",
      lat: 6.7608,
      lng: 80.0211
    },
    {
      id: "kalutara-t28",
      name: "Bandaragama Lake Promenade",
      district: "Kalutara",
      placeType: "Lake Park",
      description: "Scenic lakeside park with paved walking paths and evening sunset seating.",
      imageUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
      lat: 6.7119,
      lng: 79.9875
    }
  ],
  food: [
    {
      id: "kalutara-f1",
      name: "The Mallige Seafood Restaurant",
      district: "Kalutara",
      placeType: "Seafood Restaurant",
      description: "Oceanfront restaurant in Kalutara serving freshly grilled jumbo prawns, calamari, and butter crab.",
      imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
      lat: 6.5861,
      lng: 79.9611
    },
    {
      id: "kalutara-f2",
      name: "Kalu Ganga Riverside Diner",
      district: "Kalutara",
      placeType: "Riverside Dining",
      description: "Authentic Sri Lankan buffet served on open wooden decks overlooking Kalu Ganga river.",
      imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
      lat: 6.5883,
      lng: 79.9622
    },
    {
      id: "kalutara-f3",
      name: "Diya Sisila Floating Restaurant",
      district: "Kalutara",
      placeType: "Floating Dining",
      description: "Romantic boat dinner cruise along Bentota river serving seafood curries and devilled dishes.",
      imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
      lat: 6.4294,
      lng: 80.0039
    },
    {
      id: "kalutara-f4",
      name: "Cinnamon Bey Ice Cream & Grill",
      district: "Kalutara",
      placeType: "Grill & Gelato",
      description: "Beachfront dining venue in Beruwala serving artisan wood-fired pizza and homemade gelato.",
      imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
      lat: 6.4639,
      lng: 79.9819
    },
    {
      id: "kalutara-f5",
      name: "Geoffrey's Restaurant at Avani",
      district: "Kalutara",
      placeType: "Fine Dining",
      description: "Upscale beachfront restaurant serving Sri Lankan fusion, lobster platters, and fine wines.",
      imageUrl: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80",
      lat: 6.4264,
      lng: 79.9975
    },
    {
      id: "kalutara-f6",
      name: "Sea View Restaurant Wadduwa",
      district: "Kalutara",
      placeType: "Seafood Diner",
      description: "Fresh seafood restaurant right on Wadduwa beach serving grilled cuttlefish and cold beverages.",
      imageUrl: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80",
      lat: 6.6669,
      lng: 79.9269
    },
    {
      id: "kalutara-f7",
      name: "P&S (Perera & Sons) Kalutara",
      district: "Kalutara",
      placeType: "Bakery",
      description: "Classic bakery chain offering short eats, fish buns, chicken kottu, and iced coffee.",
      imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
      lat: 6.5856,
      lng: 79.9614
    },
    {
      id: "kalutara-f8",
      name: "Hela Bojun Hala Horana",
      district: "Kalutara",
      placeType: "Traditional Eats",
      description: "Government-supported traditional eatery serving healthy herbal porridge, hoppers, and rotti.",
      imageUrl: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80",
      lat: 6.7164,
      lng: 80.0625
    },
    {
      id: "kalutara-f9",
      name: "Fab Pastry Shop Kalutara",
      district: "Kalutara",
      placeType: "Bakery & Cafe",
      description: "Popular pastry shop known for chicken rolls, lamprais, eclairs, and birthday cakes.",
      imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
      lat: 6.5869,
      lng: 79.9628
    },
    {
      id: "kalutara-f10",
      name: "The Crab Factory Bentota",
      district: "Kalutara",
      placeType: "Seafood Restaurant",
      description: "Specialized seafood eatery serving Sri Lankan black pepper crab and chilli garlic prawns.",
      imageUrl: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80",
      lat: 6.4250,
      lng: 79.9967
    },
    {
      id: "kalutara-f11",
      name: "Wave Beach Restaurant Beruwala",
      district: "Kalutara",
      placeType: "Beach Cafe",
      description: "Casual oceanfront diner offering wood-fired pizzas, fresh smoothies, and seafood pasta.",
      imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
      lat: 6.4644,
      lng: 79.9825
    },
    {
      id: "kalutara-f12",
      name: "Bambu Hut Asian Diner",
      district: "Kalutara",
      placeType: "Asian Diner",
      description: "Thai green curry, hot butter cuttlefish, and seafood fried rice served in Wadduwa.",
      imageUrl: "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=800&q=80",
      lat: 6.6675,
      lng: 79.9275
    },
    {
      id: "kalutara-f13",
      name: "Green Apple Family Restaurant",
      district: "Kalutara",
      placeType: "Family Restaurant",
      description: "Popular local dining spot in Horana serving rice & curry, biryani, and fresh fruit juices.",
      imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
      lat: 6.7153,
      lng: 80.0619
    },
    {
      id: "kalutara-f14",
      name: "Subway Aluthgama Junction",
      district: "Kalutara",
      placeType: "Fast Food",
      description: "Fresh submarine sandwiches, wraps, and cookies for coastal highway travelers.",
      imageUrl: "https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=800&q=80",
      lat: 6.4392,
      lng: 79.9992
    },
    {
      id: "kalutara-f15",
      name: "Pizza Hut Kalutara Town",
      district: "Kalutara",
      placeType: "Pizzeria",
      description: "Pan pizza, garlic bread, wings, and pasta for dine-in and fast delivery.",
      imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
      lat: 6.5864,
      lng: 79.9617
    },
    {
      id: "kalutara-f16",
      name: "KFC Kalutara Highway Outlet",
      district: "Kalutara",
      placeType: "Fast Food",
      description: "Crispy fried chicken, zinger burgers, and twister wraps on Galle Road.",
      imageUrl: "https://images.unsplash.com/photo-1513185158878-8d8c2a2a3da3?auto=format&fit=crop&w=800&q=80",
      lat: 6.5878,
      lng: 79.9636
    },
    {
      id: "kalutara-f17",
      name: "Burger King Wadduwa",
      district: "Kalutara",
      placeType: "Fast Food",
      description: "Flame-grilled Whopper burgers, fries, and thick shakes on coastal highway.",
      imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
      lat: 6.6681,
      lng: 79.9281
    },
    {
      id: "kalutara-f18",
      name: "Ran Arana Village Restaurant",
      district: "Kalutara",
      placeType: "Village Restaurant",
      description: "Traditional village buffet served in clay pots under palm thatch roofs near Bulathsinhala.",
      imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
      lat: 6.6225,
      lng: 80.1703
    },
    {
      id: "kalutara-f19",
      name: "Lotus Lagoon Diner Bentota",
      district: "Kalutara",
      placeType: "Lagoon Diner",
      description: "Relaxed lagoon diner serving fresh king coconut water, devilled chicken, and fried rice.",
      imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
      lat: 6.4286,
      lng: 80.0044
    },
    {
      id: "kalutara-f20",
      name: "Fisherman's Wharf Beruwala",
      district: "Kalutara",
      placeType: "Seafood Grill",
      description: "Freshly landed tuna steaks, sailfish, and fried calamari served near Beruwala fishing port.",
      imageUrl: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80",
      lat: 6.4789,
      lng: 79.9789
    },
    {
      id: "kalutara-f21",
      name: "Spicy Hut Restaurant Matugama",
      district: "Kalutara",
      placeType: "Local Diner",
      description: "Popular local spot for spicy chicken kottu, string hopper kottu, and devilled pork.",
      imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
      lat: 6.5236,
      lng: 80.1133
    },
    {
      id: "kalutara-f22",
      name: "The Palm Breeze Cafe Katukurunda",
      district: "Kalutara",
      placeType: "Cafe",
      description: "Cozy cafe offering espresso coffee, fresh sandwiches, and coconut smoothies.",
      imageUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80",
      lat: 6.5661,
      lng: 79.9592
    },
    {
      id: "kalutara-f23",
      name: "Rajarata Heritage Foods Bandaragama",
      district: "Kalutara",
      placeType: "Traditional Dining",
      description: "Authentic Sri Lankan rice and curry served on fresh lotus leaves.",
      imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
      lat: 6.7117,
      lng: 79.9883
    },
    {
      id: "kalutara-f24",
      name: "Araliya Seafood Grill Payagala",
      district: "Kalutara",
      placeType: "Seafood Shack",
      description: "Beachside grilled cuttlefish, pepper prawns, and fried fish platters.",
      imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
      lat: 6.5319,
      lng: 79.9661
    },
    {
      id: "kalutara-f25",
      name: "Captain's Deck Bentota",
      district: "Kalutara",
      placeType: "Riverside Bar & Grill",
      description: "Sunset cocktails, grilled snapper, and international fusion dining on Bentota river.",
      imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
      lat: 6.4281,
      lng: 80.0031
    },
    {
      id: "kalutara-f26",
      name: "Ceylon Tea & Pastry House Horana",
      district: "Kalutara",
      placeType: "Tea Room",
      description: "Freshly brewed Ceylon black tea, egg hoppers, and traditional Sri Lankan short eats.",
      imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
      lat: 6.7156,
      lng: 80.0625
    }
  ],
  stay: [
    {
      id: "kalutara-s1",
      name: "Anantara Kalutara Resort",
      district: "Kalutara",
      placeType: "5-Star Resort",
      description: "Luxury 5-star Geoffrey Bawa-designed resort situated where Kalu Ganga river meets the ocean.",
      imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      lat: 6.5817,
      lng: 79.9553
    },
    {
      id: "kalutara-s2",
      name: "Avani Bentota Resort",
      district: "Kalutara",
      placeType: "Luxury Resort",
      description: "Dutch colonial-style beachfront resort featuring dual outdoor pools, spa, and water sports.",
      imageUrl: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
      lat: 6.4261,
      lng: 79.9972
    },
    {
      id: "kalutara-s3",
      name: "Taj Bentota Resort & Spa",
      district: "Kalutara",
      placeType: "5-Star Resort",
      description: "Iconic luxury oceanfront resort perched on Bentota cliff with ocean view suites and spa.",
      imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
      lat: 6.4239,
      lng: 79.9964
    },
    {
      id: "kalutara-s4",
      name: "Cinnamon Bey Beruwala",
      district: "Kalutara",
      placeType: "Beach Resort",
      description: "Expansive 5-star resort in Beruwala offering multiple dining options and palm gardens.",
      imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
      lat: 6.4633,
      lng: 79.9814
    },
    {
      id: "kalutara-s5",
      name: "The Blue Water Resort Wadduwa",
      district: "Kalutara",
      placeType: "Luxury Hotel",
      description: "Geoffrey Bawa-designed luxury beach resort set amidst acres of coconut tree lawns.",
      imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      lat: 6.6661,
      lng: 79.9264
    },
    {
      id: "kalutara-s6",
      name: "Mermaid Hotel & Club Kalutara",
      district: "Kalutara",
      placeType: "All-Inclusive Resort",
      description: "All-inclusive beach resort offering wellness spa, pools, and water sports in Kalutara South.",
      imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
      lat: 6.5728,
      lng: 79.9575
    },
    {
      id: "kalutara-s7",
      name: "Royal Palms Beach Hotel",
      district: "Kalutara",
      placeType: "Beach Resort",
      description: "Elegant beach hotel featuring large lagoon pool, squash courts, and oceanfront suites.",
      imageUrl: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
      lat: 6.5703,
      lng: 79.9572
    },
    {
      id: "kalutara-s8",
      name: "Tangerine Beach Hotel",
      district: "Kalutara",
      placeType: "Beach Hotel",
      description: "Vibrant beach resort with tropical gardens, outdoor pool, and seafood buffet.",
      imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
      lat: 6.5689,
      lng: 79.9570
    },
    {
      id: "kalutara-s9",
      name: "Turyaa Kalutara",
      district: "Kalutara",
      placeType: "Beach Resort",
      description: "Modern oceanfront resort offering spacious sea-view balconies, spa, and tennis.",
      imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
      lat: 6.6436,
      lng: 79.9367
    },
    {
      id: "kalutara-s10",
      name: "Occidental Eden Beruwala",
      district: "Kalutara",
      placeType: "Ayurvedic Resort",
      description: "Luxury wellness resort offering authentic Ayurvedic treatments and golden beach access.",
      imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      lat: 6.4539,
      lng: 79.9856
    },
    {
      id: "kalutara-s11",
      name: "Bentota Beach by Cinnamon",
      district: "Kalutara",
      placeType: "Heritage Resort",
      description: "Iconic hotel built on Bentota river sand spit, featuring local batik art and watersports.",
      imageUrl: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
      lat: 6.4253,
      lng: 79.9981
    },
    {
      id: "kalutara-s12",
      name: "Villa Ocean View Hotel Wadduwa",
      district: "Kalutara",
      placeType: "Beach Chalets",
      description: "Relaxed chalet resort surrounded by coconut groves right on Wadduwa sands.",
      imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
      lat: 6.6644,
      lng: 79.9278
    },
    {
      id: "kalutara-s13",
      name: "Kalu Ganga Riverside Villa",
      district: "Kalutara",
      placeType: "Boutique Villa",
      description: "Peaceful boutique riverfront villa offering private boat safaris on Kalu Ganga.",
      imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
      lat: 6.5911,
      lng: 79.9681
    },
    {
      id: "kalutara-s14",
      name: "Samitha Hotel Horana",
      district: "Kalutara",
      placeType: "City Hotel",
      description: "Comfortable city hotel with conference facilities and central access to Horana.",
      imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      lat: 6.7161,
      lng: 80.0633
    },
    {
      id: "kalutara-s15",
      name: "Kamili Beach Hotel Wadduwa",
      district: "Kalutara",
      placeType: "Eco Beach Hotel",
      description: "Peaceful eco-friendly resort featuring infinity pool and direct beach frontage.",
      imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
      lat: 6.6611,
      lng: 79.9292
    },
    {
      id: "kalutara-s16",
      name: "Palms Hotel Beruwala",
      district: "Kalutara",
      placeType: "Beach Resort",
      description: "Family-friendly resort located on Moragalla golden beach.",
      imageUrl: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
      lat: 6.4522,
      lng: 79.9864
    },
    {
      id: "kalutara-s17",
      name: "LSR Water Sports Resort Bentota",
      district: "Kalutara",
      placeType: "Activity Resort",
      description: "Water sports resort offering jet skiing, windsurfing, diving, and river boat tours.",
      imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
      lat: 6.4278,
      lng: 80.0019
    },
    {
      id: "kalutara-s18",
      name: "Hibiscus Beach Hotel Kalutara",
      district: "Kalutara",
      placeType: "Beach Hotel",
      description: "Cozy beach resort set amidst manicured gardens near ocean waves.",
      imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      lat: 6.5744,
      lng: 79.9581
    },
    {
      id: "kalutara-s19",
      name: "Rock Villa Bentota",
      district: "Kalutara",
      placeType: "Boutique Villa",
      description: "Heritage 170-year-old boutique villa set in acres of tropical coconut groves.",
      imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
      lat: 6.4217,
      lng: 79.9986
    },
    {
      id: "kalutara-s20",
      name: "Taru Villas Bentota",
      district: "Kalutara",
      placeType: "Luxury Villa",
      description: "Intimate luxury beach villa providing personalized butler service and gourmet dining.",
      imageUrl: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
      lat: 6.4208,
      lng: 79.9989
    },
    {
      id: "kalutara-s21",
      name: "Siddhalepa Ayurveda Resort",
      district: "Kalutara",
      placeType: "Ayurvedic Resort",
      description: "Famous traditional Ayurvedic healing resort offering Panchakarma treatments.",
      imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
      lat: 6.6711,
      lng: 79.9247
    },
    {
      id: "kalutara-s22",
      name: "Club Villa Bentota",
      district: "Kalutara",
      placeType: "Boutique Hotel",
      description: "Charming boutique hotel with Geoffrey Bawa design details and quiet garden pool.",
      imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
      lat: 6.4225,
      lng: 79.9983
    },
    {
      id: "kalutara-s23",
      name: "Green Shadow Villa Katukurunda",
      district: "Kalutara",
      placeType: "Guest House",
      description: "Budget guest house close to Katukurunda railway station and beach.",
      imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      lat: 6.5653,
      lng: 79.9597
    },
    {
      id: "kalutara-s24",
      name: "Sun & Sea Guest House Beruwala",
      district: "Kalutara",
      placeType: "Backpacker Stay",
      description: "Budget stay popular with backpackers steps away from Beruwala beach.",
      imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
      lat: 6.4744,
      lng: 79.9811
    },
    {
      id: "kalutara-s25",
      name: "Riverbank Retreat Matugama",
      district: "Kalutara",
      placeType: "Riverside Bungalow",
      description: "Secluded riverside bungalow nestled amidst rubber plantations near Neboda.",
      imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
      lat: 6.5806,
      lng: 80.0789
    },
    {
      id: "kalutara-s26",
      name: "Vivanta by Taj Bentota",
      district: "Kalutara",
      placeType: "5-Star Hotel",
      description: "Luxury hotel overlooking Bentota bay with ocean suites and spa.",
      imageUrl: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
      lat: 6.4244,
      lng: 79.9967
    }
  ],
  fuel: [
    {
      id: "kalutara-u1",
      name: "Ceypetco Main Filling Station",
      district: "Kalutara",
      placeType: "Fuel Station",
      description: "24/7 petrol & diesel filling station located near Kalutara Bodhiya.",
      imageUrl: "https://images.unsplash.com/photo-1527018601619-a508a2be00ce?auto=format&fit=crop&w=800&q=80",
      lat: 6.5864,
      lng: 79.9608
    },
    {
      id: "kalutara-u2",
      name: "LIOC Fuel Mart Kalutara North",
      district: "Kalutara",
      placeType: "Fuel Station",
      description: "Auto petrol, super diesel, and nitrogen tyre air station on Galle Road.",
      imageUrl: "https://images.unsplash.com/photo-1527018601619-a508a2be00ce?auto=format&fit=crop&w=800&q=80",
      lat: 6.5986,
      lng: 79.9625
    },
    {
      id: "kalutara-u3",
      name: "Ceypetco Shed Bentota Highway",
      district: "Kalutara",
      placeType: "Fuel Station",
      description: "Refueling station for coastal route travelers on A2 road in Bentota.",
      imageUrl: "https://images.unsplash.com/photo-1527018601619-a508a2be00ce?auto=format&fit=crop&w=800&q=80",
      lat: 6.4272,
      lng: 79.9994
    },
    {
      id: "kalutara-u4",
      name: "LIOC Station Beruwala",
      district: "Kalutara",
      placeType: "Fuel Station",
      description: "Fuel shed serving Beruwala fishing port trawlers and vehicles.",
      imageUrl: "https://images.unsplash.com/photo-1527018601619-a508a2be00ce?auto=format&fit=crop&w=800&q=80",
      lat: 6.4775,
      lng: 79.9819
    },
    {
      id: "kalutara-u5",
      name: "Ceypetco Station Wadduwa",
      district: "Kalutara",
      placeType: "Fuel Station",
      description: "24-hour petrol and diesel filling station in Wadduwa town.",
      imageUrl: "https://images.unsplash.com/photo-1527018601619-a508a2be00ce?auto=format&fit=crop&w=800&q=80",
      lat: 6.6664,
      lng: 79.9281
    },
    {
      id: "kalutara-u6",
      name: "LAUGFS Eco Fuel Horana",
      district: "Kalutara",
      placeType: "Fuel Station",
      description: "LAUGFS auto fuel station with quick lube service on Horana main road.",
      imageUrl: "https://images.unsplash.com/photo-1527018601619-a508a2be00ce?auto=format&fit=crop&w=800&q=80",
      lat: 6.7161,
      lng: 80.0628
    },
    {
      id: "kalutara-u7",
      name: "Ceypetco Station Aluthgama",
      district: "Kalutara",
      placeType: "Fuel Station",
      description: "Refueling station at Aluthgama town junction.",
      imageUrl: "https://images.unsplash.com/photo-1527018601619-a508a2be00ce?auto=format&fit=crop&w=800&q=80",
      lat: 6.4386,
      lng: 79.9989
    },
    {
      id: "kalutara-u8",
      name: "LIOC Fuel Station Matugama",
      district: "Kalutara",
      placeType: "Fuel Station",
      description: "Auto refuel shed in Matugama town center.",
      imageUrl: "https://images.unsplash.com/photo-1527018601619-a508a2be00ce?auto=format&fit=crop&w=800&q=80",
      lat: 6.5233,
      lng: 80.1139
    },
    {
      id: "kalutara-u9",
      name: "Ceypetco Station Bandaragama",
      district: "Kalutara",
      placeType: "Fuel Station",
      description: "Key refueling point in Bandaragama town.",
      imageUrl: "https://images.unsplash.com/photo-1527018601619-a508a2be00ce?auto=format&fit=crop&w=800&q=80",
      lat: 6.7117,
      lng: 79.9886
    },
    {
      id: "kalutara-u10",
      name: "Ceypetco Shed Katukurunda",
      district: "Kalutara",
      placeType: "Fuel Station",
      description: "Fuel station at Katukurunda junction.",
      imageUrl: "https://images.unsplash.com/photo-1527018601619-a508a2be00ce?auto=format&fit=crop&w=800&q=80",
      lat: 6.5656,
      lng: 79.9592
    },
    {
      id: "kalutara-u11",
      name: "LIOC Station Payagala",
      district: "Kalutara",
      placeType: "Fuel Station",
      description: "Petrol shed on coastal road at Payagala.",
      imageUrl: "https://images.unsplash.com/photo-1527018601619-a508a2be00ce?auto=format&fit=crop&w=800&q=80",
      lat: 6.5314,
      lng: 79.9664
    },
    {
      id: "kalutara-u12",
      name: "Ceypetco Station Ingiriya",
      district: "Kalutara",
      placeType: "Fuel Station",
      description: "Fuel shed on Ratnapura-Panadura road at Ingiriya.",
      imageUrl: "https://images.unsplash.com/photo-1527018601619-a508a2be00ce?auto=format&fit=crop&w=800&q=80",
      lat: 6.7456,
      lng: 80.1703
    },
    {
      id: "kalutara-u13",
      name: "LAUGFS Station Bulathsinhala",
      district: "Kalutara",
      placeType: "Fuel Station",
      description: "Fuel station serving Pahiyangala cave route.",
      imageUrl: "https://images.unsplash.com/photo-1527018601619-a508a2be00ce?auto=format&fit=crop&w=800&q=80",
      lat: 6.6231,
      lng: 80.1703
    },
    {
      id: "kalutara-u14",
      name: "Ceypetco Dodangoda Interchange",
      district: "Kalutara",
      placeType: "Fuel Station",
      description: "Highway fuel station near Southern Expressway exit at Dodangoda.",
      imageUrl: "https://images.unsplash.com/photo-1527018601619-a508a2be00ce?auto=format&fit=crop&w=800&q=80",
      lat: 6.5650,
      lng: 80.0481
    },
    {
      id: "kalutara-u15",
      name: "LIOC Fuel Point Neboda",
      district: "Kalutara",
      placeType: "Fuel Station",
      description: "Fuel shed in Neboda rubber plantation area.",
      imageUrl: "https://images.unsplash.com/photo-1527018601619-a508a2be00ce?auto=format&fit=crop&w=800&q=80",
      lat: 6.6078,
      lng: 80.0442
    },
    {
      id: "kalutara-u16",
      name: "Ceypetco Station Agalawatta",
      district: "Kalutara",
      placeType: "Fuel Station",
      description: "Refueling shed in Agalawatta town.",
      imageUrl: "https://images.unsplash.com/photo-1527018601619-a508a2be00ce?auto=format&fit=crop&w=800&q=80",
      lat: 6.5386,
      lng: 80.1561
    },
    {
      id: "kalutara-u17",
      name: "Ceypetco Station Nagoda",
      district: "Kalutara",
      placeType: "Fuel Station",
      description: "Fuel filling station near Kalutara General Hospital.",
      imageUrl: "https://images.unsplash.com/photo-1527018601619-a508a2be00ce?auto=format&fit=crop&w=800&q=80",
      lat: 6.5772,
      lng: 79.9761
    },
    {
      id: "kalutara-u18",
      name: "LIOC Station Maggona",
      district: "Kalutara",
      placeType: "Fuel Station",
      description: "Refueling station on Galle Road at Maggona.",
      imageUrl: "https://images.unsplash.com/photo-1527018601619-a508a2be00ce?auto=format&fit=crop&w=800&q=80",
      lat: 6.5053,
      lng: 79.9728
    },
    {
      id: "kalutara-u19",
      name: "Ceypetco Shed Ittapana",
      district: "Kalutara",
      placeType: "Fuel Station",
      description: "Highway fuel station near Ittapana expressway entrance.",
      imageUrl: "https://images.unsplash.com/photo-1527018601619-a508a2be00ce?auto=format&fit=crop&w=800&q=80",
      lat: 6.4378,
      lng: 80.0914
    },
    {
      id: "kalutara-u20",
      name: "LAUGFS Fuel Station Millewa",
      district: "Kalutara",
      placeType: "Fuel Station",
      description: "Fuel shed serving Horana industrial zone.",
      imageUrl: "https://images.unsplash.com/photo-1527018601619-a508a2be00ce?auto=format&fit=crop&w=800&q=80",
      lat: 6.7419,
      lng: 80.0489
    },
    {
      id: "kalutara-u21",
      name: "Ceypetco Station Pokunuwita",
      district: "Kalutara",
      placeType: "Fuel Station",
      description: "Fuel pump at Pokunuwita cross junction.",
      imageUrl: "https://images.unsplash.com/photo-1527018601619-a508a2be00ce?auto=format&fit=crop&w=800&q=80",
      lat: 6.7606,
      lng: 80.0214
    },
    {
      id: "kalutara-u22",
      name: "LIOC Station Walallawita",
      district: "Kalutara",
      placeType: "Fuel Station",
      description: "Refueling station in Walallawita.",
      imageUrl: "https://images.unsplash.com/photo-1527018601619-a508a2be00ce?auto=format&fit=crop&w=800&q=80",
      lat: 6.4314,
      lng: 80.1881
    },
    {
      id: "kalutara-u23",
      name: "Ceypetco Shed Govinna",
      district: "Kalutara",
      placeType: "Fuel Station",
      description: "Fuel shed serving rural inland transport.",
      imageUrl: "https://images.unsplash.com/photo-1527018601619-a508a2be00ce?auto=format&fit=crop&w=800&q=80",
      lat: 6.6714,
      lng: 80.1258
    },
    {
      id: "kalutara-u24",
      name: "Ceypetco Station Horana North",
      district: "Kalutara",
      placeType: "Fuel Station",
      description: "24-hour petrol and diesel pump on Horana bypass.",
      imageUrl: "https://images.unsplash.com/photo-1527018601619-a508a2be00ce?auto=format&fit=crop&w=800&q=80",
      lat: 6.7214,
      lng: 80.0639
    },
    {
      id: "kalutara-u25",
      name: "LIOC Point Bentota River Bridge",
      district: "Kalutara",
      placeType: "Fuel Station",
      description: "Convenient refuel stop next to Bentota river bridge.",
      imageUrl: "https://images.unsplash.com/photo-1527018601619-a508a2be00ce?auto=format&fit=crop&w=800&q=80",
      lat: 6.4308,
      lng: 79.9997
    }
  ],
  transport: [
    {
      id: "kalutara-tr1",
      name: "Kalutara South Railway Station",
      district: "Kalutara",
      placeType: "Railway Station",
      description: "Major railway station on coastal line with express train connections to Colombo and Matara.",
      imageUrl: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=800&q=80",
      lat: 6.5839,
      lng: 79.9611
    },
    {
      id: "kalutara-tr2",
      name: "Kalutara Central Bus Terminal",
      district: "Kalutara",
      placeType: "Bus Terminal",
      description: "Main intercity bus stand connecting Kalutara to Colombo, Galle, Matara, and Horana.",
      imageUrl: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80",
      lat: 6.5861,
      lng: 79.9608
    },
    {
      id: "kalutara-tr3",
      name: "Kalutara North Railway Station",
      district: "Kalutara",
      placeType: "Railway Station",
      description: "Commuter railway station serving northern Kalutara and industrial zone.",
      imageUrl: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=800&q=80",
      lat: 6.5989,
      lng: 79.9622
    },
    {
      id: "kalutara-tr4",
      name: "Bentota Railway Station",
      district: "Kalutara",
      placeType: "Railway Station",
      description: "Coastal train station located next to Bentota beach peninsula and luxury resorts.",
      imageUrl: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=800&q=80",
      lat: 6.4253,
      lng: 79.9989
    },
    {
      id: "kalutara-tr5",
      name: "Aluthgama Central Bus Stand",
      district: "Kalutara",
      placeType: "Bus Stand",
      description: "Busy bus depot for Aluthgama, Beruwala, Bentota, and inland Kande Viharaya routes.",
      imageUrl: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80",
      lat: 6.4389,
      lng: 79.9994
    },
    {
      id: "kalutara-tr6",
      name: "Beruwala Railway Station",
      district: "Kalutara",
      placeType: "Railway Station",
      description: "Train station serving Beruwala town, fishing port, and beachfront resorts.",
      imageUrl: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=800&q=80",
      lat: 6.4764,
      lng: 79.9822
    },
    {
      id: "kalutara-tr7",
      name: "Wadduwa Railway Station",
      district: "Kalutara",
      placeType: "Railway Station",
      description: "Commuter train station on the coastal line near Wadduwa resorts.",
      imageUrl: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=800&q=80",
      lat: 6.6661,
      lng: 79.9286
    },
    {
      id: "kalutara-tr8",
      name: "Horana Central Bus Terminal",
      district: "Kalutara",
      placeType: "Bus Terminal",
      description: "Major inland transport hub connecting Kalutara to Ratnapura, Avissawella, and Panadura.",
      imageUrl: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80",
      lat: 6.7158,
      lng: 80.0628
    },
    {
      id: "kalutara-tr9",
      name: "Matugama Central Bus Depot",
      district: "Kalutara",
      placeType: "Bus Depot",
      description: "Regional SLTB bus depot and passenger stand for southern Kalutara district.",
      imageUrl: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80",
      lat: 6.5239,
      lng: 80.1136
    },
    {
      id: "kalutara-tr10",
      name: "Dodangoda Expressway Terminal",
      district: "Kalutara",
      placeType: "Expressway Hub",
      description: "Southern Expressway interchange passenger stop for rapid transport to Galle and Matara.",
      imageUrl: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80",
      lat: 6.5647,
      lng: 80.0478
    },
    {
      id: "kalutara-tr11",
      name: "Katukurunda Railway Station",
      district: "Kalutara",
      placeType: "Railway Station",
      description: "Local coastal train halt near Katukurunda beach.",
      imageUrl: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=800&q=80",
      lat: 6.5653,
      lng: 79.9594
    },
    {
      id: "kalutara-tr12",
      name: "Payagala South Train Halt",
      district: "Kalutara",
      placeType: "Train Halt",
      description: "Commuter rail halt on the coastal line.",
      imageUrl: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=800&q=80",
      lat: 6.5286,
      lng: 79.9667
    },
    {
      id: "kalutara-tr13",
      name: "Maggona Railway Station",
      district: "Kalutara",
      placeType: "Railway Station",
      description: "Train stop between Payagala and Beruwala.",
      imageUrl: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=800&q=80",
      lat: 6.5058,
      lng: 79.9725
    },
    {
      id: "kalutara-tr14",
      name: "Bandaragama Bus Stand",
      district: "Kalutara",
      placeType: "Bus Stand",
      description: "Bus terminal connecting Kesbewa, Horana, and Kalutara routes.",
      imageUrl: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80",
      lat: 6.7114,
      lng: 79.9881
    },
    {
      id: "kalutara-tr15",
      name: "Ingiriya Bus Terminal",
      district: "Kalutara",
      placeType: "Bus Stand",
      description: "Inland bus stop serving Ratnapura border routes.",
      imageUrl: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80",
      lat: 6.7458,
      lng: 80.1708
    },
    {
      id: "kalutara-tr16",
      name: "Bulathsinhala Bus Stand",
      district: "Kalutara",
      placeType: "Bus Stand",
      description: "Bus stop near Pahiyangala cave route.",
      imageUrl: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80",
      lat: 6.6236,
      lng: 80.1706
    },
    {
      id: "kalutara-tr17",
      name: "Agalawatta Bus Terminal",
      district: "Kalutara",
      placeType: "Bus Stand",
      description: "Regional transport stop serving rubber estate routes.",
      imageUrl: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80",
      lat: 6.5389,
      lng: 80.1558
    },
    {
      id: "kalutara-tr18",
      name: "Ittapana Expressway Interchange",
      district: "Kalutara",
      placeType: "Expressway Terminal",
      description: "Highway exit and bus interchange.",
      imageUrl: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80",
      lat: 6.4381,
      lng: 80.0911
    },
    {
      id: "kalutara-tr19",
      name: "Neboda Bus Stop",
      district: "Kalutara",
      placeType: "Bus Stop",
      description: "Bus stop serving Neboda village.",
      imageUrl: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80",
      lat: 6.6083,
      lng: 80.0447
    },
    {
      id: "kalutara-tr20",
      name: "Hettimulla Train Halt",
      district: "Kalutara",
      placeType: "Train Halt",
      description: "Local commuter rail halt near Beruwala.",
      imageUrl: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=800&q=80",
      lat: 6.4608,
      lng: 79.9889
    },
    {
      id: "kalutara-tr21",
      name: "Induruwa Railway Station",
      district: "Kalutara",
      placeType: "Railway Station",
      description: "Coastal train station near Induruwa beach.",
      imageUrl: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=800&q=80",
      lat: 6.3803,
      lng: 80.0153
    },
    {
      id: "kalutara-tr22",
      name: "Pokunuwita Bus Stop",
      district: "Kalutara",
      placeType: "Bus Stop",
      description: "Bypass bus stop on Horana road.",
      imageUrl: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80",
      lat: 6.7603,
      lng: 80.0217
    },
    {
      id: "kalutara-tr23",
      name: "Walallawita Bus Depot",
      district: "Kalutara",
      placeType: "Bus Terminus",
      description: "Rural bus terminus.",
      imageUrl: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80",
      lat: 6.4319,
      lng: 80.1878
    },
    {
      id: "kalutara-tr24",
      name: "Kalutara North Bus Stand",
      district: "Kalutara",
      placeType: "Bus Stop",
      description: "Suburban bus stop on Galle Road.",
      imageUrl: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80",
      lat: 6.5981,
      lng: 79.9617
    },
    {
      id: "kalutara-tr25",
      name: "Bentota River Aerodrome Port",
      district: "Kalutara",
      placeType: "Seaplane Port",
      description: "Seaplane landing dock on Bentota river for domestic air charters.",
      imageUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80",
      lat: 6.4278,
      lng: 80.0028
    }
  ],
  repairsAndRentals: [
    {
      id: "kalutara-r1",
      name: "Kalutara Auto Care & Service Station",
      district: "Kalutara",
      placeType: "Auto Service",
      description: "Vehicle washing, lube oil change, and computer wheel alignment.",
      imageUrl: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80",
      lat: 6.5858,
      lng: 79.9614
    },
    {
      id: "kalutara-r2",
      name: "David Pieris Motor Co (Bajaj) Kalutara",
      district: "Kalutara",
      placeType: "TukTuk & Bike Repair",
      description: "Authorized Bajaj three-wheeler and Pulsar motorcycle service.",
      imageUrl: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80",
      lat: 6.5867,
      lng: 79.9619
    },
    {
      id: "kalutara-r3",
      name: "Bentota Scooter & Bike Rental Hub",
      district: "Kalutara",
      placeType: "Vehicle Rental",
      description: "Scooter, motorcycle, and bicycle rentals for tourists.",
      imageUrl: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80",
      lat: 6.4269,
      lng: 79.9986
    },
    {
      id: "kalutara-r4",
      name: "Wadduwa Auto Mechanic Garage",
      district: "Kalutara",
      placeType: "Garage",
      description: "Engine repair, brake replacement, and suspension work.",
      imageUrl: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80",
      lat: 6.6667,
      lng: 79.9283
    },
    {
      id: "kalutara-r5",
      name: "Horana Tyre House & Alignment",
      district: "Kalutara",
      placeType: "Tyre Shop",
      description: "Computer wheel alignment and tyre fitting.",
      imageUrl: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=800&q=80",
      lat: 6.7164,
      lng: 80.0631
    },
    {
      id: "kalutara-r6",
      name: "Auto Miraj Car Care Kalutara",
      district: "Kalutara",
      placeType: "Car Detailing",
      description: "Full body car wash, interior shampooing, and ceramic coating.",
      imageUrl: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=800&q=80",
      lat: 6.5878,
      lng: 79.9631
    },
    {
      id: "kalutara-r7",
      name: "TVS Lanka Service Centre Beruwala",
      district: "Kalutara",
      placeType: "Motorcycle Service",
      description: "Official TVS scooter repair workshop.",
      imageUrl: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80",
      lat: 6.4772,
      lng: 79.9814
    },
    {
      id: "kalutara-r8",
      name: "Matugama Auto Electricals",
      district: "Kalutara",
      placeType: "Auto Electrician",
      description: "Alternator repair, battery charging, and wiring.",
      imageUrl: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80",
      lat: 6.5242,
      lng: 80.1144
    },
    {
      id: "kalutara-r9",
      name: "Aluthgama Car Rental & Taxi Desk",
      district: "Kalutara",
      placeType: "Car Rental",
      description: "Self-drive cars and chauffeur van hire.",
      imageUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
      lat: 6.4394,
      lng: 79.9994
    },
    {
      id: "kalutara-r10",
      name: "Katukurunda Motor Workshop",
      district: "Kalutara",
      placeType: "Garage",
      description: "General mechanical repairs and oil changes.",
      imageUrl: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80",
      lat: 6.5658,
      lng: 79.9597
    },
    {
      id: "kalutara-r11",
      name: "Bandaragama Hybrid Care Garage",
      district: "Kalutara",
      placeType: "Hybrid Care",
      description: "Specialized hybrid battery diagnostics.",
      imageUrl: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80",
      lat: 6.7119,
      lng: 79.9889
    },
    {
      id: "kalutara-r12",
      name: "Beruwala Boat & Engine Repairs",
      district: "Kalutara",
      placeType: "Marine Repairs",
      description: "Marine outboard motor mechanic and boat hull painting.",
      imageUrl: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80",
      lat: 6.4792,
      lng: 79.9789
    },
    {
      id: "kalutara-r13",
      name: "Ingiriya Auto Repair Centre",
      district: "Kalutara",
      placeType: "Garage",
      description: "Tractor, truck, and car mechanics.",
      imageUrl: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80",
      lat: 6.7461,
      lng: 80.1700
    },
    {
      id: "kalutara-r14",
      name: "Nagoda Auto AC Service",
      district: "Kalutara",
      placeType: "Auto AC Repair",
      description: "Car air conditioner gas refilling and compressor fixing.",
      imageUrl: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80",
      lat: 6.5775,
      lng: 79.9764
    },
    {
      id: "kalutara-r15",
      name: "Payagala Tyre Service & Vulcanizing",
      district: "Kalutara",
      placeType: "Tyre Repair",
      description: "Puncture repair and tire replacement.",
      imageUrl: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=800&q=80",
      lat: 6.5319,
      lng: 79.9667
    },
    {
      id: "kalutara-r16",
      name: "Bulathsinhala Bike Works",
      district: "Kalutara",
      placeType: "Motorcycle Service",
      description: "Motorcycle repair and spare parts.",
      imageUrl: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80",
      lat: 6.6233,
      lng: 80.1708
    },
    {
      id: "kalutara-r17",
      name: "Dodangoda Expressway Towing Service",
      district: "Kalutara",
      placeType: "Roadside Assistance",
      description: "24/7 highway towing and emergency assistance.",
      imageUrl: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80",
      lat: 6.5650,
      lng: 80.0483
    },
    {
      id: "kalutara-r18",
      name: "Agalawatta Garage",
      district: "Kalutara",
      placeType: "Garage",
      description: "Auto mechanic for estate vehicles and jeeps.",
      imageUrl: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80",
      lat: 6.5392,
      lng: 80.1567
    },
    {
      id: "kalutara-r19",
      name: "Maggona Auto Service",
      district: "Kalutara",
      placeType: "Car Wash",
      description: "Car wash and lube station.",
      imageUrl: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=800&q=80",
      lat: 6.5056,
      lng: 79.9731
    },
    {
      id: "kalutara-r20",
      name: "Neboda Motor Workshop",
      district: "Kalutara",
      placeType: "General Mechanic",
      description: "General mechanic shop.",
      imageUrl: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80",
      lat: 6.6086,
      lng: 80.0450
    },
    {
      id: "kalutara-r21",
      name: "Ittapana Auto Repair",
      district: "Kalutara",
      placeType: "Garage",
      description: "Vehicle repair garage near highway.",
      imageUrl: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80",
      lat: 6.4383,
      lng: 80.0917
    },
    {
      id: "kalutara-r22",
      name: "Pokunuwita Auto Care",
      district: "Kalutara",
      placeType: "Garage",
      description: "Brake and clutch service garage.",
      imageUrl: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80",
      lat: 6.7608,
      lng: 80.0219
    },
    {
      id: "kalutara-r23",
      name: "Wadduwa Scooter Rentals",
      district: "Kalutara",
      placeType: "Vehicle Rental",
      description: "Tourist bike and scooter rental.",
      imageUrl: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80",
      lat: 6.6672,
      lng: 79.9286
    },
    {
      id: "kalutara-r24",
      name: "Kalutara Auto Tinkering & Paint Shop",
      district: "Kalutara",
      placeType: "Auto Paint Shop",
      description: "Body tinkering, dent removal, and paint booth.",
      imageUrl: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80",
      lat: 6.5986,
      lng: 79.9628
    },
    {
      id: "kalutara-r25",
      name: "Bentota JetSki & Boat Mechanics",
      district: "Kalutara",
      placeType: "Marine Repair",
      description: "Water sports equipment and motor boat service.",
      imageUrl: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80",
      lat: 6.4272,
      lng: 80.0033
    }
  ],
  emergencyServices: [
    {
      id: "kalutara-e1",
      name: "District General Hospital Kalutara (Nagoda)",
      district: "Kalutara",
      placeType: "Government Hospital",
      description: "Primary tertiary government hospital in Kalutara District with 24-hour emergency accident ward and ICU.",
      imageUrl: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80",
      lat: 6.5778,
      lng: 79.9767
    },
    {
      id: "kalutara-e2",
      name: "Base Hospital Horana",
      district: "Kalutara",
      placeType: "Government Hospital",
      description: "Major government base hospital serving Horana and inland Kalutara district.",
      imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
      lat: 6.7164,
      lng: 80.0631
    },
    {
      id: "kalutara-e3",
      name: "Base Hospital Beruwala",
      district: "Kalutara",
      placeType: "Government Hospital",
      description: "Public hospital offering emergency casualty and outpatient medical care.",
      imageUrl: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80",
      lat: 6.4758,
      lng: 79.9817
    },
    {
      id: "kalutara-e4",
      name: "Base Hospital Matugama",
      district: "Kalutara",
      placeType: "Government Hospital",
      description: "Government base hospital serving southern Kalutara region.",
      imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
      lat: 6.5225,
      lng: 80.1147
    },
    {
      id: "kalutara-e5",
      name: "Suwasewana Private Hospital Kalutara",
      district: "Kalutara",
      placeType: "Private Hospital",
      description: "Private medical hospital offering specialist consultations, diagnostic lab, and pharmacy.",
      imageUrl: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80",
      lat: 6.5872,
      lng: 79.9625
    },
    {
      id: "kalutara-e6",
      name: "Kalutara South Police HQ",
      district: "Kalutara",
      placeType: "Police Station",
      description: "District headquarters for Sri Lanka Police providing public security and emergency response.",
      imageUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80",
      lat: 6.5847,
      lng: 79.9606
    },
    {
      id: "kalutara-e7",
      name: "Bentota Police Station",
      district: "Kalutara",
      placeType: "Police Station",
      description: "Police station serving Bentota beach and tourist resorts.",
      imageUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80",
      lat: 6.4261,
      lng: 79.9983
    },
    {
      id: "kalutara-e8",
      name: "Beruwala Police Station",
      district: "Kalutara",
      placeType: "Police Station",
      description: "Local law enforcement station for Beruwala and fishing harbor.",
      imageUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80",
      lat: 6.4783,
      lng: 79.9806
    },
    {
      id: "kalutara-e9",
      name: "Horana Police Station",
      district: "Kalutara",
      placeType: "Police Station",
      description: "Inland division police station in Horana town.",
      imageUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80",
      lat: 6.7153,
      lng: 80.0622
    },
    {
      id: "kalutara-e10",
      name: "1990 Suwa Seriya Ambulance Hub Kalutara",
      district: "Kalutara",
      placeType: "Ambulance Service",
      description: "Free emergency paramedic ambulance dispatch hub.",
      imageUrl: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80",
      lat: 6.5783,
      lng: 79.9758
    },
    {
      id: "kalutara-e11",
      name: "Base Hospital Ingiriya",
      district: "Kalutara",
      placeType: "Government Hospital",
      description: "Government community hospital in Ingiriya.",
      imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
      lat: 6.7464,
      lng: 80.1694
    },
    {
      id: "kalutara-e12",
      name: "Base Hospital Bulathsinhala",
      district: "Kalutara",
      placeType: "Government Hospital",
      description: "Public hospital serving Bulathsinhala community.",
      imageUrl: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80",
      lat: 6.6228,
      lng: 80.1697
    },
    {
      id: "kalutara-e13",
      name: "SPC Rajya Osu Sala Kalutara",
      district: "Kalutara",
      placeType: "State Pharmacy",
      description: "Government State Pharmaceuticals pharmacy for essential medicines.",
      imageUrl: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=800&q=80",
      lat: 6.5856,
      lng: 79.9614
    },
    {
      id: "kalutara-e14",
      name: "Aluthgama Police Station",
      district: "Kalutara",
      placeType: "Police Station",
      description: "Police station along A2 coastal highway.",
      imageUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80",
      lat: 6.4394,
      lng: 79.9989
    },
    {
      id: "kalutara-e15",
      name: "Wadduwa Police Station",
      district: "Kalutara",
      placeType: "Police Station",
      description: "Suburban coastal police department.",
      imageUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80",
      lat: 6.6672,
      lng: 79.9278
    },
    {
      id: "kalutara-e16",
      name: "Bandaragama Police Station",
      district: "Kalutara",
      placeType: "Police Station",
      description: "Police station serving Bandaragama town.",
      imageUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80",
      lat: 6.7122,
      lng: 79.9878
    },
    {
      id: "kalutara-e17",
      name: "Matugama Police Station",
      district: "Kalutara",
      placeType: "Police Station",
      description: "Southern division police station.",
      imageUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80",
      lat: 6.5244,
      lng: 80.1142
    },
    {
      id: "kalutara-e18",
      name: "Fire & Rescue Station Kalutara",
      district: "Kalutara",
      placeType: "Fire Station",
      description: "Municipal emergency fire brigade.",
      imageUrl: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80",
      lat: 6.5869,
      lng: 79.9619
    },
    {
      id: "kalutara-e19",
      name: "Lanka Hospitals Diagnostics Kalutara",
      district: "Kalutara",
      placeType: "Diagnostic Center",
      description: "Modern diagnostic lab testing center.",
      imageUrl: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80",
      lat: 6.5881,
      lng: 79.9633
    },
    {
      id: "kalutara-e20",
      name: "Union Chemists 24/7 Aluthgama",
      district: "Kalutara",
      placeType: "24/7 Pharmacy",
      description: "Round-the-clock pharmacy for medical supplies.",
      imageUrl: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=800&q=80",
      lat: 6.4403,
      lng: 79.9997
    },
    {
      id: "kalutara-e21",
      name: "Agalawatta Government Hospital",
      district: "Kalutara",
      placeType: "Government Hospital",
      description: "Rural government hospital unit.",
      imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
      lat: 6.5394,
      lng: 80.1564
    },
    {
      id: "kalutara-e22",
      name: "Payagala Police Station",
      district: "Kalutara",
      placeType: "Police Station",
      description: "Coastal highway police post.",
      imageUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80",
      lat: 6.5322,
      lng: 79.9661
    },
    {
      id: "kalutara-e23",
      name: "Dodangoda Highway Medical Unit",
      district: "Kalutara",
      placeType: "Medical Unit",
      description: "Expressway emergency medical unit.",
      imageUrl: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80",
      lat: 6.5653,
      lng: 80.0483
    },
    {
      id: "kalutara-e24",
      name: "Health Link Pharmacy Horana",
      district: "Kalutara",
      placeType: "24/7 Pharmacy",
      description: "24-hour pharmacy for prescription drugs.",
      imageUrl: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=800&q=80",
      lat: 6.7147,
      lng: 80.0636
    },
    {
      id: "kalutara-e25",
      name: "Wadduwa Medical Clinic & Emergency",
      district: "Kalutara",
      placeType: "Medical Clinic",
      description: "Outpatient medical clinic and doctor consultation.",
      imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
      lat: 6.6669,
      lng: 79.9286
    }
  ]
};

function getPlaceImage(place) {
  return place.imageUrl || "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80";
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
          e.currentTarget.src = "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80";
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

export default function KalutaraPage() {
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

  // Master list of all places across categories in Kalutara
  const allKalutaraPlaces = useMemo(() => {
    return [
      ...KALUTARA_CATEGORIZED_PLACES.tourism,
      ...KALUTARA_CATEGORIZED_PLACES.food,
      ...KALUTARA_CATEGORIZED_PLACES.stay,
      ...KALUTARA_CATEGORIZED_PLACES.fuel,
      ...KALUTARA_CATEGORIZED_PLACES.transport,
      ...KALUTARA_CATEGORIZED_PLACES.repairsAndRentals,
      ...KALUTARA_CATEGORIZED_PLACES.emergencyServices
    ];
  }, []);

  // Filtered master list for top map based on search query
  const filteredAllPlaces = useMemo(() => {
    if (!searchQuery.trim()) return allKalutaraPlaces;
    const query = searchQuery.toLowerCase().trim();
    return allKalutaraPlaces.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        (p.placeType && p.placeType.toLowerCase().includes(query)) ||
        (p.description && p.description.toLowerCase().includes(query))
    );
  }, [allKalutaraPlaces, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-16">
      {/* 1. HERO IMAGE BOX */}
      <header className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-4">
        <div className="relative overflow-hidden rounded-3xl shadow-xl">
          <img
            src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80"
            alt="Kalutara Bodhiya Stupa"
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
              Kalutara
            </h1>
            <p className="mt-3 text-sm sm:text-base md:text-lg max-w-2xl text-white/90 font-light leading-relaxed">
              Explore Kalutara Bodhiya, Richmond Castle, Bentota river & beach coast, transit hubs, dining, and essential services across Kalutara District.
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
            Welcome to Kalutara District
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed font-normal">
            Kalutara is a historic coastal district in Sri Lanka's Western Province, famous for the sacred Kalutara Bodhiya and its unique hollow stupa spanning the Kalu Ganga river mouth. From golden beach resorts in Bentota, Wadduwa, and Beruwala to colonial estates like Richmond Castle and Brief Garden, ancient cave temples like Pahiyangala (Fa Hien Cave), and vibrant rubber and coconut plantations, explore everything Kalutara has to offer.
          </p>
        </div>

        {/* 3. SEARCH BAR */}
        <div className="bg-white rounded-2xl shadow-xs border border-gray-200/80 p-4 sm:p-5 mb-6 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search places, restaurants, transport, or services in Kalutara..."
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
            title="Kalutara District Map"
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
            places={KALUTARA_CATEGORIZED_PLACES.tourism}
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
            places={KALUTARA_CATEGORIZED_PLACES.food}
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
            places={KALUTARA_CATEGORIZED_PLACES.stay}
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
            places={KALUTARA_CATEGORIZED_PLACES.fuel}
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
            places={KALUTARA_CATEGORIZED_PLACES.transport}
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
            places={KALUTARA_CATEGORIZED_PLACES.repairsAndRentals}
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
            places={KALUTARA_CATEGORIZED_PLACES.emergencyServices}
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
            Welcome to Kalutara
          </p>
          <p className="text-gray-600 text-sm mt-1 max-w-xl mx-auto leading-relaxed">
            Discover places, food, transport, services, and local experiences across Kalutara District.
          </p>
        </div>
      </footer>
    </div>
  );
}
