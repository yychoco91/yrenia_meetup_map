# Meetup Map Project Summary

## Project Overview

Meetup Map is a web application that allows users to search for upcoming meetup events based on location and interest. Results are displayed on a map and listed so that users can click to see detailed information, add the event to their calendar, and view YouTube videos related to the event.

![Meetup Map](http://taylorsturtz.com/images/MeetupMap-WebMock-sm.jpg)

## Key Features

1. **Search by Interest and Location**: Users can search for meetup events by entering an interest and a location (city or zip code).
2. **Map Visualization**: Events are displayed on a Google Map with custom markers.
3. **Event Cards**: Events are also displayed as cards in a sidebar for easy browsing.
4. **Detailed Event Information**: Users can view detailed information about each event, including the name, date, time, location, and description.
5. **Calendar Integration**: Users can add events to their calendar (Google Calendar or download ICS file).
6. **Related YouTube Videos**: The application displays YouTube videos related to the event's topic.

## Technical Architecture

The application follows a client-server architecture:

### Frontend
- HTML5, CSS3, JavaScript
- jQuery for DOM manipulation and AJAX requests
- Materialize CSS for UI components
- Google Maps JavaScript API for map visualization

### Backend
- PHP services that act as proxies to external APIs
- Services handle API key management and data formatting

### External APIs
- Meetup API for event data
- Google Maps & Geocoding APIs for location services
- YouTube API for related videos

## Running the Application

To run the application in this environment, you'll need:

1. **API Keys**:
   - Create an `apikeys.php` file based on the template in `apikeys_template.md`
   - Obtain API keys for Meetup, Google Maps, and YouTube

2. **PHP Server**:
   - Set up a PHP server to handle the backend services
   - Options include PHP's built-in server, Apache, Nginx, or Docker

3. **Access the Application**:
   - Navigate to the appropriate URL based on your server setup

For detailed instructions, refer to `running_instructions.md`.

## Project Structure

```
yrenia_meetup_map/
├── index.html           # Main HTML file
├── main.js              # Main JavaScript file
├── style.css            # CSS styles
├── apikeys.php          # API keys (not included in repo)
├── assets/              # Static assets
│   ├── images/          # Image files
│   ├── js/              # Additional JavaScript libraries
│   └── video/           # Video files
├── prototype/           # Prototype files
└── services/            # PHP services
    ├── geoCoding.php            # Google Geocoding service
    ├── getVideos.php            # YouTube API service
    ├── infobubble-compiled.js   # InfoBubble library for Google Maps
    ├── meetupEvents.php         # Meetup Events API service
    ├── meetupTopics.php         # Meetup Topics API service
    └── reverseGeoCoding.php     # Google Reverse Geocoding service
```

## Development Workflow

The typical workflow for this application is:

1. User enters an interest and location
2. Application geocodes the location using Google's Geocoding API
3. Application searches for meetup topics related to the interest
4. Application searches for meetup events based on the topics and location
5. Events are displayed on the map and as cards in the sidebar
6. User can click on an event card or map marker to view details
7. Application fetches related YouTube videos for the selected event
8. User can add the event to their calendar or download an ICS file

## Potential Improvements

1. **API Key Management**: Implement a more secure way to manage API keys
2. **Error Handling**: Improve error handling and user feedback
3. **Responsive Design**: Enhance mobile responsiveness
4. **Performance Optimization**: Optimize JavaScript and reduce API calls
5. **Pagination**: Add pagination for large result sets
6. **User Authentication**: Add user accounts to save favorite events
7. **Offline Support**: Implement service workers for offline capabilities

## Conclusion

Meetup Map is a feature-rich web application that combines multiple APIs to provide a seamless experience for finding and managing meetup events. With the proper setup and API keys, it can be run in this environment to provide users with a powerful tool for discovering events based on their interests and location.