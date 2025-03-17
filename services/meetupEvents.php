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
            "name": "Los Angeles Tech Meetup",
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
                "name": "LA Tech Enthusiasts"
            },
            "how_to_find_us": "We\'ll be in the main conference room on the 3rd floor",
            "description": "Join us for an evening of tech talks and networking with fellow developers and tech enthusiasts in the Los Angeles area. We\'ll have speakers discussing the latest trends in web development, AI, and more.",
            "event_url": "https://example.com/la-tech-meetup"
        },
        {
            "name": "Los Angeles Web Developers Meetup",
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
                "name": "LA Web Dev Group"
            },
            "how_to_find_us": "Look for our group in the main lobby",
            "description": "Monthly meetup for web developers in the Los Angeles area. This month\'s topic: Modern Frontend Frameworks. Bring your laptop and questions!",
            "event_url": "https://example.com/la-webdev-meetup"
        },
        {
            "name": "Los Angeles Startup Networking",
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
                "name": "LA Startup Network"
            },
            "how_to_find_us": "We\'ll be on the rooftop patio",
            "description": "Connect with fellow entrepreneurs, investors, and startup enthusiasts in the Los Angeles area. Great opportunity to pitch your ideas, find co-founders, or just network with like-minded individuals.",
            "event_url": "https://example.com/la-startup-networking"
        },
        {
            "name": "Los Angeles Hiking Group",
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
                "name": "LA Hikers"
            },
            "how_to_find_us": "Meet at the Observatory parking lot",
            "description": "Join us for a moderate 5-mile hike in Griffith Park with beautiful views of the city. Bring water, snacks, and wear appropriate hiking shoes. All skill levels welcome!",
            "event_url": "https://example.com/la-hiking-group"
        },
        {
            "name": "Los Angeles Photography Workshop",
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
                "name": "LA Photography Club"
            },
            "how_to_find_us": "Enter through the main gallery entrance",
            "description": "Monthly photography workshop focusing on urban landscape photography. Bring your camera and learn techniques from professional photographers. We\'ll start with a presentation and then go out for a photo walk in the Arts District.",
            "event_url": "https://example.com/la-photography-workshop"
        },
        {
            "name": "Los Angeles Food & Wine Tasting",
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
                "name": "LA Foodies"
            },
            "how_to_find_us": "We\'ll be at the central tables near the wine bar",
            "description": "Join fellow food enthusiasts for an evening of culinary exploration at the Downtown Food Hall. We\'ll sample dishes from various vendors and enjoy a curated wine tasting. Ticket price includes all food and drink samples.",
            "event_url": "https://example.com/la-food-wine-tasting"
        },
        {
            "name": "Los Angeles Art Gallery Tour",
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
                "name": "LA Art Enthusiasts"
            },
            "how_to_find_us": "Meet at the Blue Bottle Coffee on the corner",
            "description": "Join us for a guided tour of galleries in the Arts District. We\'ll visit 5-6 galleries and discuss the current exhibitions. No art background required - just curiosity and an open mind!",
            "event_url": "https://example.com/la-art-gallery-tour"
        },
        {
            "name": "Los Angeles Music Industry Networking",
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
                "name": "LA Music Industry Professionals"
            },
            "how_to_find_us": "We\'ll be in the upstairs lounge area",
            "description": "Monthly networking event for music industry professionals in Los Angeles. Connect with artists, producers, managers, and other industry pros in a relaxed setting. First drink is on us!",
            "event_url": "https://example.com/la-music-networking"
        }
    ]
}';

// Simply print the hardcoded data as the original code did with the API response
print_r($hardcodedEvents);
