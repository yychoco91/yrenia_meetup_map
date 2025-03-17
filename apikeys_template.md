# API Keys Template for Meetup Map Application

This is a template for the `apikeys.php` file that is required to run the Meetup Map application. You'll need to create this file in the root directory of the project with your own API keys.

```php
<?php
/**
 * API Keys for Meetup Map Application
 * 
 * This file contains the API keys required for the Meetup Map application.
 * It is excluded from version control for security reasons.
 */

// Meetup API Key
// Used in meetupEvents.php and meetupTopics.php
$meetupKey1 = "YOUR_MEETUP_API_KEY_HERE";

// Google Maps API Key
// Used in geoCoding.php and reverseGeoCoding.php
$googleKey = "YOUR_GOOGLE_MAPS_API_KEY_HERE";

// YouTube API Key
// Used in getVideos.php
$youtubeKey = "YOUR_YOUTUBE_API_KEY_HERE";
```

## How to obtain the API keys

### Meetup API Key
1. Go to https://www.meetup.com/api/
2. Sign in or create a Meetup account
3. Create a new OAuth Consumer and get your API key

### Google Maps API Key
1. Go to https://console.cloud.google.com/
2. Create a new project
3. Enable the Google Maps JavaScript API, Geocoding API, and any other required APIs
4. Create an API key in the Credentials section

### YouTube API Key
1. Go to https://console.cloud.google.com/
2. Create a new project (or use the same one as for Google Maps)
3. Enable the YouTube Data API v3
4. Create an API key in the Credentials section