# Meetup Map Architecture

This document provides a visual representation of the Meetup Map application architecture and data flow.

## Application Architecture

```mermaid
graph TD
    User[User] -->|Interacts with| Frontend
    
    subgraph Frontend
        HTML[index.html] -->|Loads| CSS[style.css]
        HTML -->|Loads| JS[main.js]
        JS -->|DOM Manipulation| HTML
    end
    
    Frontend -->|AJAX Requests| Backend
    
    subgraph Backend
        GeocodingService[geoCoding.php] -->|Requires| APIKeys[apikeys.php]
        ReverseGeocodingService[reverseGeoCoding.php] -->|Requires| APIKeys
        MeetupEventsService[meetupEvents.php] -->|Requires| APIKeys
        MeetupTopicsService[meetupTopics.php] -->|Requires| APIKeys
        YouTubeService[getVideos.php] -->|Requires| APIKeys
    end
    
    Backend -->|API Requests| ExternalAPIs
    
    subgraph ExternalAPIs
        GoogleMapsAPI[Google Maps API]
        MeetupAPI[Meetup API]
        YouTubeAPI[YouTube API]
    end
    
    GeocodingService -->|Requests| GoogleMapsAPI
    ReverseGeocodingService -->|Requests| GoogleMapsAPI
    MeetupEventsService -->|Requests| MeetupAPI
    MeetupTopicsService -->|Requests| MeetupAPI
    YouTubeService -->|Requests| YouTubeAPI
```

## User Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant ExternalAPIs
    
    User->>Frontend: Enter interest and location
    Frontend->>Backend: Request geocoding (geoCoding.php)
    Backend->>ExternalAPIs: Request to Google Maps API
    ExternalAPIs->>Backend: Return coordinates
    Backend->>Frontend: Return coordinates
    
    Frontend->>Backend: Request reverse geocoding (reverseGeoCoding.php)
    Backend->>ExternalAPIs: Request to Google Maps API
    ExternalAPIs->>Backend: Return location details
    Backend->>Frontend: Return location details
    
    Frontend->>Backend: Request meetup topics (meetupTopics.php)
    Backend->>ExternalAPIs: Request to Meetup API
    ExternalAPIs->>Backend: Return topics
    Backend->>Frontend: Return topics
    
    Frontend->>Backend: Request meetup events (meetupEvents.php)
    Backend->>ExternalAPIs: Request to Meetup API
    ExternalAPIs->>Backend: Return events
    Backend->>Frontend: Return events
    
    Frontend->>User: Display events on map and sidebar
    
    User->>Frontend: Click on event
    Frontend->>Backend: Request YouTube videos (getVideos.php)
    Backend->>ExternalAPIs: Request to YouTube API
    ExternalAPIs->>Backend: Return videos
    Backend->>Frontend: Return videos
    
    Frontend->>User: Display event details and videos
```

## Component Structure

```mermaid
classDiagram
    class Frontend {
        +HTML (index.html)
        +CSS (style.css)
        +JavaScript (main.js)
        +initMap()
        +geoCoding()
        +getTopics()
        +getEvents()
        +createEventCard()
        +createEventDescription()
        +youTubeApi()
    }
    
    class Backend {
        +geoCoding.php
        +reverseGeoCoding.php
        +meetupEvents.php
        +meetupTopics.php
        +getVideos.php
        +apikeys.php
    }
    
    class ExternalAPIs {
        +Google Maps API
        +Meetup API
        +YouTube API
    }
    
    Frontend --> Backend : AJAX Requests
    Backend --> ExternalAPIs : API Requests
```

## Data Flow

```mermaid
flowchart TD
    A[User Input] --> B[Geocoding]
    B --> C[Get Meetup Topics]
    C --> D[Get Meetup Events]
    D --> E[Parse Events for Maps]
    E --> F[Initialize Map]
    F --> G[Create Event Cards]
    
    H[User Clicks Event] --> I[Display Event Details]
    H --> J[Get YouTube Videos]
    J --> K[Display Videos]
    
    L[User Clicks Map Marker] --> M[Show Info Bubble]
    M --> N[Highlight Corresponding Card]