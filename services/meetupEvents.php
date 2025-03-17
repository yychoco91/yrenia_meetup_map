<?php
header('Content-type: application/json');
header("Access-Control-Allow-Origin: *");

// No longer requiring API keys since we're using hardcoded data
// require_once ('../apikeys.php');

$zip = filter_var($_GET['zip'], FILTER_SANITIZE_STRING);
$keyword = filter_var($_GET['keyword'], FILTER_SANITIZE_STRING);

// Hardcoded events data for Los Angeles - matches Meetup API response format
$hardcodedEvents = '{
    "results": [
        {
            "name": "Silicon Beach Tech Talks",
            "time": ' . (time() + 86400 * 3) * 1000 . ',
            "venue": {
                "name": "Downtown LA Tech Hub",
                "address_1": "123 Main St",
                "city": "Los Angeles",
                "state": "CA",
                "lat": 34.052235,
                "lon": -118.243683
            },
            "group": {
                "name": "Tech Innovators Collective"
            },
            "how_to_find_us": "We\'ll be in the main conference room on the 3rd floor",
            "description": "Join us for an evening of tech talks and networking with fellow developers and tech enthusiasts in the Los Angeles area. We\'ll have speakers discussing the latest trends in web development, AI, and more.",
            "event_url": "https://example.com/la-tech-meetup"
        },
        {
            "name": "ReactJS & Tacos",
            "time": ' . (time() + 86400 * 5) * 1000 . ',
            "venue": {
                "name": "Westside Coworking Space",
                "address_1": "456 Ocean Ave",
                "city": "Santa Monica",
                "state": "CA",
                "lat": 34.019454,
                "lon": -118.491191
            },
            "group": {
                "name": "Frontend Foodies"
            },
            "how_to_find_us": "Look for our group in the main lobby",
            "description": "Monthly meetup for web developers in the Los Angeles area. This month\'s topic: Modern Frontend Frameworks. Bring your laptop and questions! Tacos will be provided by our sponsor.",
            "event_url": "https://example.com/la-webdev-meetup"
        },
        {
            "name": "Venture Capital & Vino",
            "time": ' . (time() + 86400 * 7) * 1000 . ',
            "venue": {
                "name": "Silicon Beach Hub",
                "address_1": "789 Venice Blvd",
                "city": "Venice",
                "state": "CA",
                "lat": 33.985347,
                "lon": -118.469170
            },
            "group": {
                "name": "Founders & Funders Alliance"
            },
            "how_to_find_us": "We\'ll be on the rooftop patio",
            "description": "Connect with fellow entrepreneurs, investors, and startup enthusiasts in the Los Angeles area. Great opportunity to pitch your ideas, find co-founders, or just network with like-minded individuals.",
            "event_url": "https://example.com/la-startup-networking"
        },
        {
            "name": "Trail Blazers: Sunset Hike",
            "time": ' . (time() + 86400 * 2) * 1000 . ',
            "venue": {
                "name": "Griffith Park",
                "address_1": "4730 Crystal Springs Dr",
                "city": "Los Angeles",
                "state": "CA",
                "lat": 34.136379,
                "lon": -118.294525
            },
            "group": {
                "name": "Urban Adventurers"
            },
            "how_to_find_us": "Meet at the Observatory parking lot",
            "description": "Join us for a moderate 5-mile hike in Griffith Park with beautiful views of the city. Bring water, snacks, and wear appropriate hiking shoes. All skill levels welcome!",
            "event_url": "https://example.com/la-hiking-group"
        },
        {
            "name": "Frame & Focus: Street Photography Workshop",
            "time": ' . (time() + 86400 * 10) * 1000 . ',
            "venue": {
                "name": "LA Center for Photography",
                "address_1": "567 Arts District",
                "city": "Los Angeles",
                "state": "CA",
                "lat": 34.040713,
                "lon": -118.234569
            },
            "group": {
                "name": "Shutterbugs Collective"
            },
            "how_to_find_us": "Enter through the main gallery entrance",
            "description": "Monthly photography workshop focusing on urban landscape photography. Bring your camera and learn techniques from professional photographers. We\'ll start with a presentation and then go out for a photo walk in the Arts District.",
            "event_url": "https://example.com/la-photography-workshop"
        },
        {
            "name": "Culinary Crawl: DTLA Edition",
            "time": ' . (time() + 86400 * 14) * 1000 . ',
            "venue": {
                "name": "Downtown Food Hall",
                "address_1": "317 S Broadway",
                "city": "Los Angeles",
                "state": "CA",
                "lat": 34.050922,
                "lon": -118.248405
            },
            "group": {
                "name": "Epicurean Explorers"
            },
            "how_to_find_us": "We\'ll be at the central tables near the wine bar",
            "description": "Join fellow food enthusiasts for an evening of culinary exploration at the Downtown Food Hall. We\'ll sample dishes from various vendors and enjoy a curated wine tasting. Ticket price includes all food and drink samples.",
            "event_url": "https://example.com/la-food-wine-tasting"
        },
        {
            "name": "Brushstrokes & Beverages",
            "time": ' . (time() + 86400 * 9) * 1000 . ',
            "venue": {
                "name": "Arts District",
                "address_1": "Arts District",
                "city": "Los Angeles",
                "state": "CA",
                "lat": 34.040713,
                "lon": -118.234569
            },
            "group": {
                "name": "Creative Canvas Collective"
            },
            "how_to_find_us": "Meet at the Blue Bottle Coffee on the corner",
            "description": "Join us for a guided tour of galleries in the Arts District. We\'ll visit 5-6 galleries and discuss the current exhibitions. No art background required - just curiosity and an open mind!",
            "event_url": "https://example.com/la-art-gallery-tour"
        },
        {
            "name": "Beats & Bytes: Music Production Showcase",
            "time": ' . (time() + 86400 * 6) * 1000 . ',
            "venue": {
                "name": "Ace Hotel",
                "address_1": "929 S Broadway",
                "city": "Los Angeles",
                "state": "CA",
                "lat": 34.044224,
                "lon": -118.255507
            },
            "group": {
                "name": "Digital Audio Collective"
            },
            "how_to_find_us": "We\'ll be in the upstairs lounge area",
            "description": "Monthly networking event for music industry professionals in Los Angeles. Connect with artists, producers, managers, and other industry pros in a relaxed setting. First drink is on us!",
            "event_url": "https://example.com/la-music-networking"
        },
        {
            "name": "Mindful Monday Meditation",
            "time": ' . (time() + 86400 * 1) * 1000 . ',
            "venue": {
                "name": "Echo Park Lake",
                "address_1": "751 Echo Park Ave",
                "city": "Los Angeles",
                "state": "CA",
                "lat": 34.072723,
                "lon": -118.260475
            },
            "group": {
                "name": "Zen in the City"
            },
            "how_to_find_us": "Look for our group near the lotus beds",
            "description": "Start your week with intention and clarity. Join us for a guided meditation session in the peaceful surroundings of Echo Park Lake. All levels welcome, from beginners to experienced practitioners.",
            "event_url": "https://example.com/mindful-monday"
        },
        {
            "name": "Crypto & Cocktails",
            "time": ' . (time() + 86400 * 4) * 1000 . ',
            "venue": {
                "name": "The Edison",
                "address_1": "108 W 2nd St",
                "city": "Los Angeles",
                "state": "CA",
                "lat": 34.050926,
                "lon": -118.247681
            },
            "group": {
                "name": "Blockchain Believers"
            },
            "how_to_find_us": "We\'ll be in the private room at the back",
            "description": "Discuss the latest in cryptocurrency, blockchain technology, and decentralized finance while enjoying craft cocktails. Whether you\'re a crypto novice or a seasoned trader, all are welcome to join the conversation.",
            "event_url": "https://example.com/crypto-cocktails"
        },
        {
            "name": "Salsa Under the Stars",
            "time": ' . (time() + 86400 * 8) * 1000 . ',
            "venue": {
                "name": "Grand Park",
                "address_1": "200 N Grand Ave",
                "city": "Los Angeles",
                "state": "CA",
                "lat": 34.056219,
                "lon": -118.246771
            },
            "group": {
                "name": "LA Dance Collective"
            },
            "how_to_find_us": "Near the fountain area",
            "description": "Join us for an evening of salsa dancing under the stars! We\'ll start with a 30-minute beginner lesson, followed by open dancing. No partner or experience necessary - just bring your enthusiasm and comfortable shoes!",
            "event_url": "https://example.com/salsa-stars"
        },
        {
            "name": "Plant Parents Club: Succulent Swap",
            "time": ' . (time() + 86400 * 12) * 1000 . ',
            "venue": {
                "name": "The Sill",
                "address_1": "8125 W 3rd St",
                "city": "Los Angeles",
                "state": "CA",
                "lat": 34.072498,
                "lon": -118.366508
            },
            "group": {
                "name": "Green Thumb Gang"
            },
            "how_to_find_us": "Inside the shop, look for our group with plants",
            "description": "Calling all plant enthusiasts! Bring a succulent or cutting to swap and expand your collection. We\'ll also have a mini-workshop on succulent care and propagation. Light refreshments provided.",
            "event_url": "https://example.com/succulent-swap"
        },
        {
            "name": "Screenwriters Anonymous",
            "time": ' . (time() + 86400 * 11) * 1000 . ',
            "venue": {
                "name": "Stories Books & Cafe",
                "address_1": "1716 Sunset Blvd",
                "city": "Los Angeles",
                "state": "CA",
                "lat": 34.076469,
                "lon": -118.258349
            },
            "group": {
                "name": "LA Script Doctors"
            },
            "how_to_find_us": "We\'ll be in the back patio area",
            "description": "A supportive workshop for screenwriters of all levels. Bring 5-10 pages of your work for constructive feedback, or just come to listen and learn. We focus on structure, dialogue, and character development in a friendly, collaborative environment.",
            "event_url": "https://example.com/screenwriters-anonymous"
        },
        {
            "name": "Vintage Vinyl Listening Party",
            "time": ' . (time() + 86400 * 15) * 1000 . ',
            "venue": {
                "name": "Amoeba Music",
                "address_1": "6200 Hollywood Blvd",
                "city": "Los Angeles",
                "state": "CA",
                "lat": 34.101558,
                "lon": -118.324760
            },
            "group": {
                "name": "Analog Audio Aficionados"
            },
            "how_to_find_us": "Meet at the jazz section",
            "description": "Bring your favorite vinyl records to share with fellow music lovers. We\'ll listen to selections from everyone\'s collection, discuss the albums, and enjoy the warm sound of analog audio. All genres welcome!",
            "event_url": "https://example.com/vinyl-listening"
        },
        {
            "name": "Sunset Yoga on the Beach",
            "time": ' . (time() + 86400 * 13) * 1000 . ',
            "venue": {
                "name": "Venice Beach",
                "address_1": "Ocean Front Walk",
                "city": "Venice",
                "state": "CA",
                "lat": 33.985347,
                "lon": -118.469170
            },
            "group": {
                "name": "Coastal Flow Collective"
            },
            "how_to_find_us": "Look for our group with yoga mats near lifeguard tower 26",
            "description": "End your day with a rejuvenating yoga flow as the sun sets over the Pacific. This all-levels class combines gentle movement, breathwork, and meditation. Bring your own mat and water. Suggested donation: $10-15.",
            "event_url": "https://example.com/sunset-yoga"
        },
        {
            "name": "Board Game Bonanza",
            "time": ' . (time() + 86400 * 16) * 1000 . ',
            "venue": {
                "name": "Game Haus Cafe",
                "address_1": "1800 S Brand Blvd",
                "city": "Glendale",
                "state": "CA",
                "lat": 34.124260,
                "lon": -118.254940
            },
            "group": {
                "name": "Meeple Meetup"
            },
            "how_to_find_us": "We\'ll have tables reserved under \'Meeple Meetup\'",
            "description": "Join fellow board game enthusiasts for an afternoon of strategy, luck, and fun! We\'ll have a variety of games available, from quick card games to epic strategy boards. Newcomers always welcome - we\'ll teach you how to play!",
            "event_url": "https://example.com/board-game-bonanza"
        }
    ]
}';

// Simply print the hardcoded data as the original code did with the API response
print_r($hardcodedEvents);
