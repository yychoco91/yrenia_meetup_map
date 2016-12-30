/**
 * Meetup Map
 *
 * Created by:
 * Kevin Chau, Danh Le, Dan Riches, Yrenia Yang, and Taylor Sturtz
 *
 * 10/26/2016
 */

$(document).ready(click_handlers);
var global_event = [];
// Danh's Section
var global_zip = null;
var global_venue = [];
/**
 * function geoCoding
 *      converts zip code to longitude and latitude
 *      also calls the getTopics function after success response, if not, it calls our apiThrottled function
 *
 * @param {string} query - user zip code
 */
function geoCoding(search,zip) {
    var zipConcat = zip.split(' ').join('+');
    $.ajax({
        dataType: 'JSON',
        method: 'GET',
        url: "geoCoding.php",
        data: {zip:zipConcat},
        success: function (response) {
            if(response.status === 'OK')
            {
                var output = response.results[0].geometry.location;
                global_zip = output;
                console.log("param search is "+ search);
                $.ajax({
                    dataType: 'JSON',
                    method: 'GET',
                    url: "reverseGeoCoding.php",
                    data: {lat: output.lat, lng: output.lng},
                    success: function (response2) {
                        if(response2.status === 'OK')
                        {
                            var lastAddressComponent = response2.results['0'].address_components.length -1;
                            // checks to make sure that last item in array is postal_code, not postal_code_suffix.
                            if (response2.results[0].address_components[lastAddressComponent].types[0] === 'postal_code') {
                                var reverseGeoZip = response2.results[0].address_components[lastAddressComponent].short_name;
                                console.info('reverseGeoZip - postal code: ', reverseGeoZip);
                                getTopics(search, reverseGeoZip);
                            } else {
                                var reverseGeoZipNoSuffix = response2.results[0].address_components[lastAddressComponent-1].short_name;
                                console.info('reverseGeoZip - avoided postal code suffix: ', reverseGeoZipNoSuffix);
                                getTopics(search, reverseGeoZipNoSuffix);
                            }
                        } else {
                            console.warn('houston we have a problem', response2);
                        }
                    }
                });
            } else {
                var header = "API Error";
                var paragraph = "We cannot process the geocoding API at the moment. Please try again later";
                apiThrottled(header, paragraph);
            }

        }
    })
}
/**
 * function parseEventsForMaps
 *
 * This function loops through our events and parses out bad Open Events that have no venue property objects
 *
 * @param {object} eventObj - event object passed from Meetup Open Events API
 */
function parseEventsForMaps(eventObj) {
    console.log("Event Object is", eventObj);
    var geocodeArray = [];
    $("#map_left").html("");
    var j = 1;
    var empty_card = $('<div>').addClass('card first-card');
    $("#map_left").append(empty_card);
    for (var i = 0; i < eventObj.length; i++) {

        if (eventObj[i].hasOwnProperty("venue")) {
            //console.log("YES");
            var eventLat = eventObj[i].venue.lat;
            var eventLon = eventObj[i].venue.lon;

            if (eventLat != 0 || eventLon != 0) {
                createEventCard(eventObj[i]);
                global_venue.push(j+") "+eventObj[i].venue.name);

                var addressText = eventObj[i].venue.address_1 + " " + eventObj[i].venue.city + ", " + eventObj[i].venue.state;

                geocodeArray.push({
                    lat: eventLat,
                    lng: eventLon,
                    title: eventObj[i].name,
                    address: addressText,
                    venue: eventObj[i].venue.name
                });
                j++;
            }
        }
    }

    return geocodeArray;
}
// Danh's Section End
/**
 * function click_handlers
 */
function click_handlers() {


    $('#test').click(function(){

        // Demo
        // Multiple
        var cal = ics();
        cal.addEvent('Christmas', 'Christian holiday celebrating the birth of Jesus Christ', 'Bethlehem', '12/25/2016', '12/25/2016');
        cal.addEvent('New Years', 'Watch the ball drop!', 'New York', '01/01/2017', '01/01/2017');

        // Single
        var cal_single = ics();
        cal_single.addEvent('Meetup Event', 'This is the best day to demonstrate a single event.', 'New York', '12/30/2016', '12/30/2016');


        cal_single.download('Meetup'); // single
        //cal.download('Meetup');  // multiple
    });


    /*
    When the user presses ENTER, it will submit the inputs on the FRONT PAGE
     */

    $('.input-container input').keypress(function(event) {
        if (event.which == 13) {
            event.preventDefault();
            console.log('Front Page Search');
            var userSearch = $('#search').val();
            var userZip = $('#zip').val();
            if (userSearch == '' || userZip == ''){
                Materialize.toast('Please fill in both', 2000, 'white red-text');
                return;
            }
            geoCoding(userSearch, userZip);
            $('.greyBG').show();
            $('.preloader-wrapper').show();
        }
    });

    /*
     When the user presses ENTER, it will submit the inputs on the TOP NAV BAR
     */

    $('.input-nav-container input').keypress(function(event) {
        if (event.which == 13) {
            event.preventDefault();
            console.log('Nav Bar Search');
            var userSearch = $('#nav_search').val();
            var userZip = $('#nav_zip').val();
            if (userSearch == '' || userZip == ''){
                Materialize.toast('Please fill in both', 2000, 'red white-text');
                return;
            }
            geoCoding(userSearch, userZip);
            //youTubeApi(userSearch);
            $('.greyBG').show();
            $('.preloader-wrapper').show();

        }
    });
    /*
        When the user clicks GO , it will submit the inputs on the FRONT PAGE
    */
    $('button#front-go').click(function () {
        var userSearch = $('#search').val();
        var userZip = $('#zip').val();
        if (userSearch == '' || userZip == ''){
            Materialize.toast('Please fill in both', 2000, 'white red-text');
            return;
        }
        geoCoding(userSearch, userZip);
        $('.greyBG').show();
        $('.preloader-wrapper').show();
    });
    /*
     When the user clicks GO , it will submit the inputs on the TOP NAV BAR
     */
    $('button#nav-go').click(function () {
        var userSearch = $('#nav_search').val();
        var userZip = $('#nav_zip').val();
        if (userSearch == '' || userZip == ''){
            Materialize.toast('Please fill in both', 2000, 'red white-text');
            return;
        }
        geoCoding(userSearch, userZip);
        //youTubeApi(userSearch);
        $('.greyBG').show();
        $('.preloader-wrapper').show();
    });

    /*
     When the user clicks on the LOGO it will take it to the first page
     */

    $('#top_search').on('click','.logo-nav',function () {
        //Clear inputs and lose focus so labels
        $('#search').val('').blur();
        $('#nav_search').val('').blur();
        $('#zip').val('').blur();
        $('#nav_zip').val('').blur();
        $('#top_search').removeClass('search-top');
        $('#map_left').removeClass('map-left');
        $('.intro-wrapper').animate({top: '0vh'}, 750, function(){

        });
    });

    /*
     When the user clicks on the ROUND CIRCLE BUTTON on the top right off the
     Details Wrapper page, it will move up to the map (using event delegation)
     */

    $(".details-wrapper").on("click",".btn-floating",function () {
        //console.log("Button Up Clicked!");
        $(".intro-wrapper").animate({top: '-100vh'}, 750, function(){

        });
    });

    //Event delegation for card events. On click, dynamically adds specific event info to event description page
    $("#map_left").on("click",".card-content",function () {
        console.log("HI");
        $(".intro-wrapper").animate({top: '-200vh'}, 750);
        $('.active-card').removeClass('active-card');
        $(this).addClass('active-card');
        console.log(this);
        createEventDescription(this);
    });
}
/**
 * getTopics - using user-entered interest, generate topics and use first 2 url keys
 * @param {string} keyword - user-entered interest
 * @param {number} zipcode - user-entered zipcode
 */
function getTopics(keyword, zipcode) {
    var keyConcat = keyword.split(' ').join('%');
    console.info('keyword: ', keyConcat);
    var zip = zipcode;
    console.info('zipcode: ', zip);
    $.ajax({
        dataType: 'JSON',
        method: 'GET',
        url: 'meetupTopics.php',
        data: {keyword:keyConcat},
        success: function (response) {
            var topics = '';
            console.log('getTopics response: ', response);
            if (response['code'] === 'blocked') {
                getTopicsBackup(keyConcat, zip);
            } else {
                if (response.results.length > 0) { //if the array > 0, there are topics related to user's search term
                    for (var i = 0; i < response.results.length; i++) { //for the amount of results, add to string separated by commas
                        if (i !== response.results.length - 1) {
                            topics += response.results[i]['urlkey'] + ',';
                        } else {
                            topics += response.results[i]['urlkey'];
                        }
                    }
                }
                console.log('Topics', topics);
                getEvents(topics, zip); //pass the topics and zipcode to look for open events
            }
        },
        error: function (err) {
            console.log('houston we have a problem: ', err);
        }
    })
}

//Get topics backup if meetup API limits on first key are reached TODO: THIS DOES NOT USE BACKUP API KEY YET
function getTopicsBackup(keyword, zipcode) {
    var zip = zipcode;
    $.ajax({
        dataType: 'JSON',
        method: 'GET',
        url: 'meetupTopics.php',
        data: {keyword:keyword},
        success: function (response) {
            var topics = '';
            if (response.results.length > 0) { //if the array > 0, there are topics related to user's search term
                for (var i = 0; i < response.results.length; i++) { //for the amount of results, add to string separated by commas
                    if (i !== response.results.length - 1) {
                        topics += response.results[i]['urlkey'] + ',';
                    } else {
                        topics += response.results[i]['urlkey'];
                    }
                }
            }
            console.log('Topics', topics);
            getEvents(topics, zip); //pass the topics and zipcode to look for open events
        },
        error: function (err) {
            console.log('houston we have a problem: ', err);
        }
    })
}

/**
 * getEvents - ajax call to meetup api and using urlkey from getTopics gets open events
 * @param {string} keyword - urlkeys from meetup separated by commas
 * @param {string} zip - user-entered zipcode
 */
function getEvents(keyword, zip) {
    $.ajax({
        dataType: 'JSON',
        method: 'GET',
        url: 'meetupEvents.php',
        data: {keyword:keyword, zip:zip},
        success: function (response) {
            var eventList = response.results;
            if(response.results.length > 1) {
                var newEventList = parseEventsForMaps(eventList); //gets latitude and longitude for map
                initMap(global_zip, newEventList);
                $(".intro-wrapper").slideDown(750);
                $(".intro-wrapper").animate({top: '-100vh'}, 750, function () {
                    $('#top_search').addClass('search-top');
                    $('#map_left').addClass('map-left');
                    youTubeApi(keyword);
                    $(".greyBG").hide();
                    $('.preloader-wrapper').hide();
                });
            }else{
                $(".greyBG").hide();
                $('.preloader-wrapper').hide();
                Materialize.toast('No open events found in your area', 2000, 'red white-text');
            }
        },
        error: function (err) {
            console.log('houston we have a problem: ', err);
        }
    })
}

//Get events backup if meetup API limits on first key are reached TODO: THIS DOES NOT USE BACKUP API KEY YET
function getEventsBackup(keyword, zip) {
    $.ajax({
        dataType: 'JSON',
        method: 'GET',
        url: 'meetupEvents.php',
        data: {keyword:keyword, zip:zip},
        success: function (response) {
            var eventList = response.results;
            if(response.results.length > 1) {
                var newEventList = parseEventsForMaps(eventList); //gets latitude and longitude for map
                initMap(global_zip, newEventList);
                $(".intro-wrapper").slideDown(750);
                $(".intro-wrapper").animate({top: '-100vh'}, 750, function () {
                    $('#top_search').addClass('search-top');
                    $('#map_left').addClass('map-left');
                    youTubeApi(keyword);
                    $(".greyBG").hide();
                    $('.preloader-wrapper').hide();
                });
            }else{
                $(".greyBG").hide();
                $('.preloader-wrapper').hide();
                Materialize.toast('No open events found in your area', 2000, 'red white-text');
            }
        },
        error: function (err) {
            console.log('houston we have a problem: ', err);
        }
    })
}

/**
 * createEventCard - dynamically create and append event info cards
 * @param {object} event - event containing necessary info
 */
function createEventCard(event){
    //console.log('Event card', event);
    var eventId = global_event.length;
    global_event.push(event); //push events used for cards to array for use on event description page
    var eventName = event['name'];
    var date = new Date(event['time']);
    date = parseTime(date);
    var venueName = event.venue.name;
    /*Comment to see if git contribution will show up */
    var address = event.venue.address_1;
    var city = event.venue.city;
    //create html elements with classes

    var $title = $('<span>', {
        class: 'card-title',
        text: eventName
    });

    var $date = $('<p>', {
        text: date
    });
    var $venue = $('<p>', {
        text: venueName
    });
    var $address = $('<p>', {
        text: address + ' ' + ' ' + city
    });
    //append elements to the dom
    var $cardContent = $('<div>', {
        class: 'card-content white-text',
        id: eventId
    }).append($title, $date, $venue, $address);
    var $card = $('<div>', {
        class: 'card red lighten-1'
    }).append($cardContent);
    $('#map_left').append($card);
}
/**
 * parseTime - change date into more readable format
 * @param {object} date - event's date object
 * @returns {string|*} - contains event's date and time
 */
function parseTime(date){
    var day = date.toDateString();
    var hour = date.getHours();
    var minutes = date.getMinutes();
    var newDate;
    var amOrPm;
    //console.log('day ', day);
    //24hr format to 12hr format
    if(hour > 12){
        hour -= 12;
        amOrPm = 'pm';
    }else{
        amOrPm = 'am'
    }
    if(minutes === 0){
        minutes = '00';
    }
    //creates date string
    newDate = hour + ':' + minutes + amOrPm + ' ' + day;
    //console.log(newDate);
    return newDate;
}


$('#map_left').on('click','.card', function(){
    var $eventName=$('<h1>',{
        text:event[i]['name']
    });
    var $groupName=$('<h5>',{
        text:event[i].group.name
    });
    var $eventDate= $('<h4>',{
        text: new Date(event[i]['time'])
    });
    var $eventAddress= $('<h4>',{
        text:event[i].venue.address_1 + ' ' + event[i].venue.city + ', ' + event[i].venue.state
    });
    var $eventDescription=$('<p>',{
        text:event[i]['description']
    });
    var $eventDetail=$('<div>',{
        class:"event-details"
    }).append($eventName,$groupName,$eventDate,$eventAddress,$eventDescription);

    var $eventPage=$('<div>',{
        class:'details-wrapper white'
    }).append($eventDetail);

});

function missingPropertyValues(objName) {
    for(var i=0 in event) {
        console.log(objName[i]);
    }
}


//API IS BEING THROTTLED FUNCTION
function apiThrottled(heading,message) {
    $('#error_modal .modal-content h4').text(heading);
    $('#error_modal .modal-content p').text(message);
    $('#error_modal').openModal();
}


//YOUTUBE SECTION -- DANs
function youTubeApi(usersChoice) {
    var splitUsersChoice = usersChoice.split(',');
    console.log('Here is the splitUsersChoice : ', splitUsersChoice);
    var len = splitUsersChoice.length;
    var concatUsersChoice;
    var arrayConcatUsersChoice = [];
    var splitarrayConcatUsersChoiceToString;
    for(var i = 0; i < len; i++ ){
        concatUsersChoice = splitUsersChoice[i] + ' tips';
        arrayConcatUsersChoice.push(concatUsersChoice);
    }
    console.log('Here is the arrayConcatUsersChoice : ',arrayConcatUsersChoice);
    splitarrayConcatUsersChoiceToString = arrayConcatUsersChoice.toString();
    console.log('Here is the splitarrayConcatUsersChoiceToString : ',splitarrayConcatUsersChoiceToString);
    var videoSearch = splitarrayConcatUsersChoiceToString;
    missingPropertyValues(event);
    //usersChoice = usersChoice + ' Meetup';
    console.log('In the youTubeApi function');
    $('div.video-list').html('');
    //BEGINNING OF AJAX FUNCTION
    $.ajax({
        dataType: 'json',
        data: {
            q: videoSearch,  // this is used as the parameter for the function
            maxResults: 5
        },
        method: 'POST',
        url: "https://s-apis.learningfuze.com/hackathon/youtube/search.php",
        //BEGIN SUCCESS'S ANONYMOUS FUNCTION
        success: function (response) {
            var relatedVideos = $('<h4>Related Videos</h4>');
            var videoList = $('div.video-list').append(relatedVideos);
            if (response.success === true) {
                //CONSOLE LOGS FOR TESTING PURPOSES
                console.log('successful connection to YouTube API');
               if(response.video) {
                //LOOP FOR VIDEO ID AND TITLE
                for (var i = 0; i < response.video.length; i++) {
                    //THE BELOW CODE
                    var iframeDiv = $('<div>').addClass('video-container card');

                    //CREATION OF YOUTUBE VIDEO LINK
                    var iframe = $("<iframe>", {
                        src: "https://www.youtube.com/embed/" + response.video[i].id,
                        frameborder: 0,
                        allowfullscreen: true
                    });
                    iframe.appendTo(iframeDiv);
                    //ADDING VIDEO LINK TO THE DOM
                    //var videoList = $('div.video-list').append(relatedVideos);
                    videoList.append(iframe);
                    console.log('This is the new div and class ', iframeDiv);
                }

                } else {
                    var noVideoMessage = $('<p>Currently, there are no videos in our search results.</p>');
                    relatedVideos.append(noVideoMessage);
               }
            } else {
                //CONSOLE LOG FOR TESTING PURPOSES
                console.log('failure -- Unable to connect to YouTube api');
                //CALLING A FUNCTION FOR IF THE API IS DOWN
                var youTubeFailHeading = 'Oh no!';
                var youTubeFailMessage = 'This is rare, but we are unable to pull any videos at this time.' +
                    'Please, try again later.';
                apiThrottled(youTubeFailHeading,youTubeFailMessage);
            }
        }
    });
}
/**
 * createEventDescription - dynamically add event info to more event info page'
 * @param {object} eventCard - contains event information
 */
function createEventDescription(eventCard) {
    $('.event-details').html('');
    var cardClicked = eventCard;
    var cardId = $(cardClicked).attr('id'); //finds card id to look for matching event
    console.log('Card Clicked', cardId);
    cardEvent = global_event[cardId];
    console.log('This Event ', cardEvent);
    var date = new Date(cardEvent['time']);
    var eventMonth = date.getMonth() + 1;
    var eventDay = date.getDate();
    var eventYear = date.getFullYear();

    date = parseTime(date); //get readable date format
    //create elements with event information and classes for styling

    var state = cardEvent.venue.state || '';
    var $eventName=$('<h3>',{
        class: 'red-text',
        text: cardEvent['name']
    });
    var $groupName=$('<h6>',{
        text: cardEvent.group.name
    });
    var $eventDate= $('<h5>',{
        class: 'red-text',
        text: date
    });
    var $eventAddress= $('<h6>',{
        class: 'red-text',
        text: cardEvent.venue.address_1 + " " + cardEvent.venue.city + " " + state
    });
    var $lineBreak=$('<br>',{});
    var $lineBreak2=$('<br>',{});
    var $eventURL=$('<a/>',{
        href: cardEvent['event_url'],
        html: "<i class='tiny material-icons light-blue-text darken-1'>open_in_new</i> View Event on Meetup.com"
    });
    var $eventGoogleCal=$('<a/>',{
        //title format: text=TEST%20TITLE
        //date format: dates=YYYYMMDDToHHMMSSZ/YYYYMMDDToHHMMSSZ
        //details format: details=(url encoded event description/details)
        //location format: location=(url encoded location of the event - make sure it's an address google maps can read easily)
        href: 'http://www.google.com/calendar/event?action=TEMPLATE&text=' + 'TEST%20TITLE' + '&dates=' + '20161230T063000Z/20161231T080000Z' + '&location=' + 'Irvine' + '&details=' + 'TEST%20DETAILS',
        html: "<i class='tiny material-icons light-blue-text darken-1'>open_in_new</i> Add to Google Calendar"
    });
    var $eventCalendarICS=$('<a/>',{
        class: 'details-link',
        html: "<i class='tiny material-icons light-blue-text darken-1'>file_download</i> Download ICS (Calendar) File",
        click: function() {
            var cal = ics();
            cal.addEvent('Meetup: ' + cardEvent['name'], 'Hosted by: ' + cardEvent.group.name + '<br><br>' + 'Description: ' + cardEvent['description'] + '<br>' + 'How to find us: ' + cardEvent['how_to_find_us'] + '<br><br><br>' + 'Brought to you by MeetupMap.', cardEvent.venue.address_1 + " " + cardEvent.venue.city + " " + state, eventMonth + '/' + eventDay + '/' + eventYear, eventMonth + '/' + eventDay + '/' + eventYear);
            cal.download('MeetupMap: ' + cardEvent['name']);
        }
    });
    var $eventDescription=$('<p>',{
        html: cardEvent['description']
    });
    //attach elements to dom
    $('.event-details').append($eventName,$groupName,$eventURL,$eventDate,$eventAddress,$lineBreak,$eventGoogleCal,$lineBreak2,$eventCalendarICS,$eventDescription);
}