# Running the Meetup Map Application

Based on my analysis of the codebase, here's a detailed plan for running the Meetup Map application in this environment.

## Project Overview

Meetup Map is a web application that allows users to search for upcoming meetup events based on location and interest. Results are displayed on a map and listed so that users can click to see detailed information, add the event to their calendar, and view YouTube videos related to the event.

### Key Technologies:
- **HTML5**
- **CSS3**
- **Materialize CSS**
- **JavaScript**
- **jQuery**
- **PHP** (for backend services)
- **External APIs**: Meetup API, Google Maps & Geocoding APIs, Youtube API

## Prerequisites

Before running the application, you'll need:

1. **API Keys**:
   - Meetup API Key
   - Google Maps API Key
   - YouTube API Key

2. **PHP Server**:
   - The application requires a PHP server to handle API requests
   - PHP version 5.6+ recommended

## Setup Instructions

### 1. Create the apikeys.php file

Create a file named `apikeys.php` in the root directory with the following content (replace placeholders with your actual API keys):

```php
<?php
/**
 * API Keys for Meetup Map Application
 */

// Meetup API Key
$meetupKey1 = "YOUR_MEETUP_API_KEY_HERE";

// Google Maps API Key
$googleKey = "YOUR_GOOGLE_MAPS_API_KEY_HERE";

// YouTube API Key
$youtubeKey = "YOUR_YOUTUBE_API_KEY_HERE";
```

### 2. Set up a PHP Server

You have several options for setting up a PHP server:

#### Option 1: Use PHP's built-in server (for development)

```bash
php -S localhost:8000
```

#### Option 2: Use a web server like Apache or Nginx

If you're using a Codespace or similar environment, you might already have Apache installed. You can check with:

```bash
apache2 -v
```

If it's installed, you can start it with:

```bash
sudo service apache2 start
```

#### Option 3: Use a Docker container

```bash
docker run -p 8000:80 -v $(pwd):/var/www/html php:apache
```

### 3. Access the Application

Once your server is running, access the application by navigating to:

- If using PHP's built-in server: `http://localhost:8000`
- If using Apache/Nginx: `http://localhost` or `http://localhost:80`
- If using Docker: `http://localhost:8000`

## Troubleshooting

### API Key Issues

If you encounter issues with the API keys:

1. **Meetup API**: Ensure your Meetup API key has the necessary permissions for accessing open events and topics.
2. **Google Maps API**: Make sure you've enabled the necessary Google APIs (Maps JavaScript API, Geocoding API).
3. **YouTube API**: Verify that the YouTube Data API v3 is enabled for your API key.

### CORS Issues

If you encounter Cross-Origin Resource Sharing (CORS) issues:

1. Check that the PHP services are properly setting the CORS headers (they should be, as seen in the code).
2. If using a different server setup, ensure it's configured to allow CORS.

### PHP Issues

If PHP services aren't working:

1. Check that PHP is properly installed and running.
2. Verify that the `apikeys.php` file is in the correct location and has the correct permissions.
3. Check PHP error logs for any specific error messages.

## Additional Notes

- The application uses client-side JavaScript to interact with PHP services, which in turn interact with external APIs.
- The PHP services are located in the `services/` directory and handle communication with external APIs.
- The main application logic is in `main.js`.
- The application uses Materialize CSS for styling and UI components.