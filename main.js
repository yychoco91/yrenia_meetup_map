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
        url: "./services/geoCoding.php",
        data: {zip:zipConcat},
        success: function (response) {
            if(response.status === 'OK')
            {
                var output = response.results[0].geometry.location;
                global_zip = output;
                $.ajax({
                    dataType: 'JSON',
                    method: 'GET',
                    url: "./services/reverseGeoCoding.php",
                    data: {lat: output.lat, lng: output.lng},
                    success: function (response2) {
                        if(response2.status === 'OK')
                        {
                            var lastAddressComponent = response2.results['0'].address_components.length -1;
                            // checks to make sure that last item in array is postal_code, not postal_code_suffix.
                            if (response2.results[0].address_components[lastAddressComponent].types[0] === 'postal_code') {
                                var reverseGeoZip = response2.results[0].address_components[lastAddressComponent].short_name;
                                getTopics(search, reverseGeoZip);
                            } else {
                                var reverseGeoZipNoSuffix = response2.results[0].address_components[lastAddressComponent-1].short_name;
                                getTopics(search, reverseGeoZipNoSuffix);
                            }
                        } else {
                            //console.warn('houston we have a problem', response2);
                        }
                    },
                    error: function (err) {
                        var $statusCode = $('<div>',{
                            html: 'Oops! Something went wrong!' + '<br>' + '(' + err.status + ' ' + err.statusText + ')'
                        });
                        $('.preloader-wrapper').hide();
                        $('.greyBG').append($statusCode);
                        //console.log('houston we have a problem: ', err);
                    }
                });
            } else {
                var header = "Oops!";
                var paragraph = "Either the city or zip code that you entered was not valid or we're having an issue. Try again later!";
                apiThrottled(header, paragraph);
                $('.preloader-wrapper').hide();
                $('.greyBG').hide();
            }

        },
        error: function (err) {
            var $statusCode = $('<div>',{
                html: 'Oops! Something went wrong!' + '<br>' + '(' + err.status + ' ' + err.statusText + ')'
            });
            var header = "Oops!";
            var paragraph = $statusCode;
            apiThrottled(header, paragraph);
            $('.preloader-wrapper').hide();
            $('.greyBG').hide();
            //console.log('houston we have a problem: ', err);
        }
    });
}

/**
 * function parseEventsForMaps
 *
 * This function loops through our events and parses out bad Open Events that have no venue property objects
 *
 * @param {object} eventObj - event object passed from Meetup Open Events API
 */
function parseEventsForMaps(eventObj) {

    var geocodeArray = [];
    $("#map_left").html("");
    var j = 1;
    var empty_card = $('<div>').addClass('card first-card');
    $("#map_left").append(empty_card);
    for (var i = 0; i < eventObj.length; i++) {

        if (eventObj[i].hasOwnProperty("venue")) {
            var eventLat = eventObj[i].venue.lat;
            var eventLon = eventObj[i].venue.lon;

            if (eventLat !== 0 || eventLon !== 0) {
                createEventCard(eventObj[i]);
                global_venue.push(j+") "+eventObj[i].venue.name);

                var addressText = eventObj[i].venue.address_1 + " " + eventObj[i].venue.city + ", " + eventObj[i].venue.state;

                geocodeArray.push({
                    lat: eventLat,
                    lng: eventLon,
                    title: eventObj[i].name,
                    address: addressText,
                    venue: eventObj[i].venue.name,
                    time: Date(eventObj[i].time)
                });

                j++;
            }
        }
    }
    return geocodeArray;
}


/**
 * Function inputConfirmed
 * ran when user press 'enter'/click go to search
 * calls geocode and clears input on front screen populates nav search
 */
function inputConfirmed(){
    var userSearch = $('#search').val() || $('#nav_search').val();
    var userZip = $('#zip').val() || $('#nav_zip').val();
    if (userSearch === '' || userZip === ''){
        Materialize.toast('Please fill in both', 2000, 'white red-text');
        return;
    }
    geoCoding(userSearch, userZip);
    $('#nav_search').val(userSearch);
    $('#nav_zip').val(userZip);
    $('#search').val('').blur();
    $('#zip').val('').blur();
    $('.greyBG').show();
    $('.preloader-wrapper').show();
}

/**
 * function click_handlers
 */
function click_handlers() {

    /*
     When the user presses ENTER, it will submit the inputs on the FRONT PAGE
     */
    $('.input-container input').keypress(function(event) {
        if (event.which == 13) {
            event.preventDefault();
            inputConfirmed();
        }
    });

    /*
     When the user clicks GO , it will submit the inputs on the FRONT PAGE
     */
    $('button#front-go').click(function () {
        inputConfirmed();
    });


    /*
     When the user presses ENTER, it will submit the inputs on the TOP NAV BAR
     */
    $('.input-nav-container input').keypress(function(event) {
        if (event.which == 13) {
            event.preventDefault();
            inputConfirmed();
            var windowWidth = $(window).width();
            if (windowWidth <= 600) {
                $('.back-one').trigger('click');
            }
        }
    });

    /*
     When the user clicks GO , it will submit the inputs on the TOP NAV BAR
     */
    $('button.nav-go').click(function () {
        inputConfirmed();
        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $('.back-one').trigger('click');
        }
    });

    /*
     When the user clicks on the LOGO it will take it to the first page
     */
    $('#top_search').on('click','.logo-nav',function () {
        //Clear inputs and lose focus so labels
        $('#top_search').removeClass('search-top');
        $('#map_left').removeClass('map-left');
        $('.intro-wrapper').animate({top: '0vh'}, 750, function(){});
        $('.back-one').fadeOut('slow','linear');
    });

    /*
     When the user clicks on the ROUND CIRCLE BUTTON on the top right off the
     Details Wrapper page, it will move up to the map (using event delegation)
     */
    $(".back-one").click(function () {
        $(".intro-wrapper").animate({top: '-100vh'}, 750);
        $('.back-one').fadeOut('slow','linear');
        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $('#map_left').animate({top: '12vh'}, 750);
        }
    });

    //Event delegation for card events. On click, dynamically adds specific event info to event description page
    $("#map_left").on("click",".card-content",function () {
        var title = $(this).find(".card-title").text();
        //Close all open info bubbles
        mapAndInfoBubbles.infoBubbles.forEach(function(bubble){
            bubble[0].close();
        });
        //Find info bubble matching card clicked
        var bubbleArr = mapAndInfoBubbles.infoBubbles.filter(function(bubble) {
            return bubble[0].bubbleTitle === title;
        });
        //Open the matching info bubble
        bubbleArr[0][0].setContent(bubbleArr[0][1].html);
        bubbleArr[0][0].open(mapAndInfoBubbles.map, bubbleArr[0][1]);
        $('.active-card').removeClass('active-card');
        $(this).addClass('active-card');
        createEventDescription(this);
        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $(".intro-wrapper").animate({top: '-200vh'}, 750);
            $('#map_left').animate({top: '-200vh'}, 750);
            $('.back-one').css('display','block');
        }
    });

    // Remove tooltips for mobile else initialize them
    (function() {
        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $('.tooltipped').tooltip('remove');
        } else {
            $('.tooltipped').tooltip({delay: 50});
        }
    }());

}

/**
 * Function Highlight - make matching event card active when its map marker is clicked
 * @param marker - the marker clicked (see script in index)
 */
function highlight(marker){
    var title = marker.title;
    var card = $('.card-title:contains("'+ title +'")').parent();
    $(".card-content").removeClass("active-card");
    $(card).addClass("active-card");
    //$("#map_left").scrollTo(card);
    var container = $('#map_left');
    container.animate({scrollTop: $(card).offset().top - container.offset().top + container.scrollTop() - (container.offset().top / 2)}, 800, "easeInOutQuart");
}

/**
 * seeDetailsFromBubble - shows more event detail when more detail requested from info bubble
 * @param button - the more details link on the info bubble
 */
function seeDetailsFromBubble(button){
    var title = $(button).parent()["0"].childNodes["0"].innerText;
    var card = $('.card-title:contains("'+ title +'")').parent();
    createEventDescription(card);
    $(".intro-wrapper").animate({top: '-200vh'}, 750);
    $('.back-one').css('display','block');
}
/**
 * getTopics - using user-entered interest, generate topics and use first 2 url keys
 * @param {string} keyword - user-entered interest
 * @param {number} zipcode - user-entered zipcode
 */
function getTopics(keyword, zipcode) {
    var keyConcat = keyword.split(' ').join('%');
    var zip = zipcode;
    $.ajax({
        dataType: 'JSON',
        method: 'GET',
        url: './services/meetupTopics.php',
        data: {keyword:keyConcat},
        success: function (response) {
            var topics = '';
            if (response.code === 'blocked') {
                getTopicsBackup(keyConcat, zip);
            } else {
                if (response.results.length > 0) { //if the array > 0, there are topics related to user's search term
                    for (var i = 0; i < response.results.length; i++) { //for the amount of results, add to string separated by commas
                        if (i !== response.results.length - 1) {
                            topics += response.results[i].urlkey + ',';
                        } else {
                            topics += response.results[i].urlkey;
                        }
                    }
                }
                getEvents(topics, zip); //pass the topics and zipcode to look for open events
            }
        },
        error: function (err) {
            var $statusCode = $('<div>',{
                html: 'Oops! Something went wrong!' + '<br>' + '(' + err.status + ' ' + err.statusText + ')'
            });
            var header = "Oops!";
            var paragraph = $statusCode;
            apiThrottled(header, paragraph);
            $('.preloader-wrapper').hide();
            $('.greyBG').hide();
            //console.log('houston we have a problem: ', err);
        }
    });
}

//Get topics backup if meetup API limits on first key are reached TODO: THIS DOES NOT USE BACKUP API KEY YET
function getTopicsBackup(keyword, zipcode) {
    var zip = zipcode;
    $.ajax({
        dataType: 'JSON',
        method: 'GET',
        url: './services/meetupTopics.php',
        data: {keyword:keyword},
        success: function (response) {
            var topics = '';
            if (response.results.length > 0) { //if the array > 0, there are topics related to user's search term
                for (var i = 0; i < response.results.length; i++) { //for the amount of results, add to string separated by commas
                    if (i !== response.results.length - 1) {
                        topics += response.results[i].urlkey + ',';
                    } else {
                        topics += response.results[i].urlkey;
                    }
                }
            }
            getEvents(topics, zip); //pass the topics and zipcode to look for open events
        },
        error: function (err) {
            var $statusCode = $('<div>',{
                html: 'Oops! Something went wrong!' + '<br>' + '(' + err.status + ' ' + err.statusText + ')'
            });
            var header = "Oops!";
            var paragraph = $statusCode;
            apiThrottled(header, paragraph);
            $('.preloader-wrapper').hide();
            $('.greyBG').hide();
            //console.log('houston we have a problem: ', err);
        }
    });
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
        url: './services/meetupEvents.php',
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
            var $statusCode = $('<div>',{
                html: 'Oops! Something went wrong!' + '<br>' + '(' + err.status + ' ' + err.statusText + ')'
            });
            var header = "Oops!";
            var paragraph = $statusCode;
            apiThrottled(header, paragraph);
            $('.preloader-wrapper').hide();
            $('.greyBG').hide();
            //console.log('houston we have a problem: ', err);
        }
    });
}

//Get events backup if meetup API limits on first key are reached TODO: THIS DOES NOT USE BACKUP API KEY YET
function getEventsBackup(keyword, zip) {
    $.ajax({
        dataType: 'JSON',
        method: 'GET',
        url: './services/meetupEvents.php',
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
            var $statusCode = $('<div>',{
                html: 'Oops! Something went wrong!' + '<br>' + '(' + err.status + ' ' + err.statusText + ')'
            });
            var header = "Oops!";
            var paragraph = $statusCode;
            apiThrottled(header, paragraph);
            $('.preloader-wrapper').hide();
            $('.greyBG').hide();
            //console.log('houston we have a problem: ', err);
        }
    });
}

/**
 * createEventCard - dynamically create and append event info cards
 * @param {object} event - event containing necessary info
 */
function createEventCard(event){
    var eventId = global_event.length;
    global_event.push(event); //push events used for cards to array for use on event description page
    var eventName = event.name;
    var date = new Date(event.time);
    date = parseTime(date);
    var venueName = event.venue.name;
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
    var day = date.getDay();
    day = day === 0 ? 'Monday'
        : day === 1 ? 'Tuesday'
        : day === 2 ? 'Wednesday'
        : day === 3 ? 'Thursday'
        : day === 4 ? 'Friday'
        : day === 5 ? 'Saturday'
        : 'Sunday';
    var dateDay = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    var hour = date.getHours();
    var minutes = date.getMinutes();
    var amOrPm = null;
    //24hr format to 12hr format
    if(hour > 12){
        hour -= 12;
        amOrPm = 'pm';
    }else{
        amOrPm = 'am';
    }
    if(minutes === 0){
        minutes = '00';
    }
    return hour + ':' + minutes + amOrPm + ', ' + day + ' - ' + month + '/' + dateDay + '/' + year;
}

/**
 * parseICSDate - format date for ICS file
 * @param {object} date - event's date object
 * @returns {string} - contains event's formatted date
 */
function parseICSDate(date) {
    var dateDay = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    return month + '/' + dateDay + '/' + year;
}

/**
 * parseGoogleDate - format date for Google calendar query
 * @param {object} date - event's date object
 * @returns {string} - contains event's formatted date
 */
function parseGoogleDate(date) {
    var dateDay = date.getDate();
    if (dateDay < 10) {
        dateDay = '0' + dateDay;
    }
    var month = date.getMonth() + 1;
    if (month < 10) {
        month = '0' + month;
    }
    var year = date.getFullYear();
    var hour = date.getHours();
    if (hour < 10) {
        hour = '0' + hour;
    }
    var minutes = date.getMinutes();
    if (minutes < 10) {
        minutes += '0';
    }
    return year + '' + month + '' + dateDay + 'T' + hour + '' + minutes + '' + '00';
}

$('#map_left').on('click','.card', function(){
    var $eventName=$('<h1>',{
        text:event[i].name
    });
    var $groupName=$('<h5>',{
        text:event[i].group.name
    });
    var $eventDate= $('<h4>',{
        text: new Date(event[i].time)
    });
    var $eventAddress= $('<h4>',{
        text:event[i].venue.address_1 + ' ' + event[i].venue.city + ', ' + event[i].venue.state
    });
    var $eventDescription=$('<p>',{
        text:event[i].description
    });
    var $eventDetail=$('<div>',{
        class:"event-details"
    }).append($eventName,$groupName,$eventDate,$eventAddress,$eventDescription);
    var $eventPage=$('<div>',{
        class:'details-wrapper white'
    }).append($eventDetail);

});


//API IS BEING THROTTLED FUNCTION
function apiThrottled(heading,message) {
    $('#error_modal .modal-content h4').text(heading);
    $('#error_modal .modal-content p').text(message);
    $('#error_modal').openModal();
}

//YOUTUBE SECTION -- DANs
function youTubeApi(usersChoice) {
    //this first part is to add the word "tips" to the search term to get better results
    var splitUsersChoice = usersChoice.split(',');
    var len = splitUsersChoice.length;
    var concatUsersChoice;
    var arrayConcatUsersChoice = [];
    var splitarrayConcatUsersChoiceToString;
    for(var i = 0; i < len; i++ ){
        concatUsersChoice = splitUsersChoice[i] + "+tips";
        arrayConcatUsersChoice.push(concatUsersChoice);
    }
    splitarrayConcatUsersChoiceToString = arrayConcatUsersChoice.toString();
    var videoSearch = splitarrayConcatUsersChoiceToString;
    //usersChoice = usersChoice + ' Meetup';
    $('div.video-list').html('');
    //BEGINNING OF AJAX FUNCTION
    $.ajax({
        dataType: 'json',
        data: {
            q: videoSearch,  // this is used as the parameter for the function
            maxResults: 5
        },
        method: 'POST',
        //url: "https://s-apis.learningfuze.com/hackathon/youtube/search.php",
        url: "./services/getVideos.php",
        //BEGIN SUCCESS'S ANONYMOUS FUNCTION
        success: function (response) {
            var relatedVideos = $('<h4>Related Videos</h4>');
            var videoList = $('div.video-list').append(relatedVideos);
            if (response.success === true) {
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
                        }
                } else {
                    var noVideoMessage = $('<p>Currently, there are no videos in our search results.</p>');
                    relatedVideos.append(noVideoMessage);
               }
            } else {
                //CALLING A FUNCTION FOR IF THE API IS DOWN
                var youTubeFailHeading = 'Oh no!';
                var youTubeFailMessage = 'This is rare, but we are unable to pull any videos at this time.' +
                    'Please, try again later.';
                apiThrottled(youTubeFailHeading,youTubeFailMessage);
            }
        },
        error: function (err) {
            var $statusCode = $('<div>',{
                html: 'Oops! Something went wrong!' + '<br>' + '(' + err.status + ' ' + err.statusText + ')'
            });
            var header = "Oops!";
            var paragraph = $statusCode;
            apiThrottled(header, paragraph);
            $('.preloader-wrapper').hide();
            $('.greyBG').hide();
            //console.log('houston we have a problem: ', err);
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
    cardEvent = global_event[cardId];
    var dateForICS = parseICSDate(new Date(cardEvent.time));
    var dateForGoogleCal = parseGoogleDate(new Date(cardEvent.time));
    var date = new Date(cardEvent.time);
    date = parseTime(date); //get readable date format
    var state = cardEvent.venue.state || '';
    var eventName = cardEvent.name;
    var eventLocation = (cardEvent.venue.address_1 + " " + cardEvent.venue.city + " " + state);
    var eventHowToFindUs = cardEvent.how_to_find_us;
    eventHowToFindUs = eventHowToFindUs === undefined ? '' : 'How to find us: ' + eventHowToFindUs;
    var $eventName=$('<h3>',{
        class: 'red-text event-title',
        text: cardEvent.name
    });
    var $groupName=$('<h6>',{
        html: '<em>' + cardEvent.group.name + '</em>'
    });
    var $eventDate= $('<h5>',{
        class: 'red-text',
        text: date
    });
    var $eventAddress= $('<h6>',{
        text: cardEvent.venue.address_1 + " " + cardEvent.venue.city + " " + state
    });
    var $eventURL=$('<a/>',{
        target: "_blank",
        href: cardEvent.event_url,
        html: "<i class='tiny material-icons light-blue-text darken-1'>open_in_new</i> View Event on Meetup.com"
    });
    var $eventGoogleCal=$('<a/>',{
        href: 'http://www.google.com/calendar/event?action=TEMPLATE&text=' + 'Meetup:%20' + encodeURIComponent(eventName) + '&dates=' + dateForGoogleCal + '/' + dateForGoogleCal + '&details=' + encodeURIComponent(eventHowToFindUs) + '&location=' + encodeURIComponent(eventLocation),
        target: '_blank',
        html: "<i class='tiny material-icons light-blue-text darken-1'>open_in_new</i> Add to Google Calendar"
    });
    var $eventCalendarICS=$('<a/>',{
        class: 'details-link',
        html: "<i class='tiny material-icons light-blue-text darken-1'>file_download</i> Download ICS (Calendar) File",
        click: function() {
            var cal = ics();
            cal.addEvent('Meetup: ' + cardEvent.name, 'Hosted by: ' + cardEvent.group.name + '<br><br>' + 'Description: ' + cardEvent.description + '<br>' + 'How to find us: ' + cardEvent.how_to_find_us + '<br><br><br>' + 'Brought to you by MeetupMap.', cardEvent.venue.address_1 + " " + cardEvent.venue.city + " " + state, dateForICS, dateForICS);
            cal.download();
        }
    });
    var $eventDescription=$('<p>',{
        html: cardEvent.description
    });
    //attach elements to dom
    $('.event-details').append($groupName,$eventName,$eventAddress,$eventDate,$('<hr>'),$eventURL,$('<br>'),$eventGoogleCal,$('<br>'),$eventCalendarICS,$('<hr>'),$eventDescription);
}
