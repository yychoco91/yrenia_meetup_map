<?php
header('Content-type: application/json');
header("Access-Control-Allow-Origin: *");

// No longer requiring API keys since we're using hardcoded data
// require_once ('../apikeys.php');

$keyword = filter_var($_GET['keyword'], FILTER_SANITIZE_STRING);

// Hardcoded topics data for Los Angeles - matches Meetup API response format
$hardcodedTopics = '{
    "results": [
        {
            "id": 1,
            "name": "Technology",
            "urlkey": "tech",
            "description": "Technology enthusiasts and professionals"
        },
        {
            "id": 2,
            "name": "Web Development",
            "urlkey": "web-development",
            "description": "Web developers and designers"
        },
        {
            "id": 3,
            "name": "Entrepreneurship",
            "urlkey": "entrepreneurship",
            "description": "Entrepreneurs and startup enthusiasts"
        },
        {
            "id": 4,
            "name": "Hiking",
            "urlkey": "hiking",
            "description": "Hiking and outdoor activities"
        },
        {
            "id": 5,
            "name": "Photography",
            "urlkey": "photography",
            "description": "Photography enthusiasts"
        },
        {
            "id": 6,
            "name": "Food & Drink",
            "urlkey": "food-and-drink",
            "description": "Food and drink enthusiasts"
        },
        {
            "id": 7,
            "name": "Art",
            "urlkey": "art",
            "description": "Art enthusiasts and creators"
        },
        {
            "id": 8,
            "name": "Music",
            "urlkey": "music",
            "description": "Music enthusiasts and professionals"
        },
        {
            "id": 9,
            "name": "Fitness",
            "urlkey": "fitness",
            "description": "Fitness enthusiasts"
        },
        {
            "id": 10,
            "name": "Language Exchange",
            "urlkey": "language-exchange",
            "description": "Language exchange and learning"
        }
    ]
}';

// Simply print the hardcoded data as the original code did with the API response
print_r($hardcodedTopics);
