/**
 * Created by LFZ C11 Hackathon TEAM 2 - Yrenia, Danh, Kevin, Dan, and Taylor on 10/26/2016.
 */
$(document).ready(click_handlers);
var global_event = [];
// Danh's Section
var global_zip = null;
var global_venue = [];
/**
 * function geoCoding converts zip code to longitude and latitude
 *
 * @param {string} query - user zip code
 */
function geoCoding(query) {
    $.ajax({
        dataType: 'JSON',
        method: 'GET',
        url: "https://maps.googleapis.com/maps/api/geocode/json?address=" + query + "&key=AIzaSyDa6lkpC-bOxXWEbrWaPlw_FneCpQhlgNE",
        success: function (response) {
            var output = response.results[0].geometry.location;
            global_zip = output;
            //console.log("response", output);
        }
    })
}
/**
 * function parseEventsForMaps
 *
 * @param {object} eventObj - event object passed from Meetup Open Events API
 */
function parseEventsForMaps(eventObj) {
    //console.log("Event Object is", eventObj);
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

                geocodeArray.push({
                    lat: eventLat,
                    lng: eventLon,
                    title: eventObj[i].venue.name
                });
                j++;
            }

        }
    }

    return geocodeArray;
}
// Danh's Section End
function click_handlers() {

    $(".input-container input").keypress(function(event) {
        if (event.which == 13) {
            event.preventDefault();
            console.log("HI");
            var userSearch = $('#search').val();
            var userZip = $("#zip").val();
            geoCoding(userZip);
            getTopics(userSearch, userZip);
        }
    });

    $(".input-nav-container input").keypress(function(event) {
        if (event.which == 13) {
            event.preventDefault();
            console.log("HI");
            var userSearch = $('#search').val();
            var userZip = $("#nav_zip").val();
            geoCoding(userZip);
            getTopics(userSearch, userZip);
            youTubeApi(userSearch);
        }
    });

    $("#top_search").on("click",".logo-nav, .btn-floating",function () {
        console.log("HI");
        //$(".intro-wrapper").slideUp(750);
        $('#top_search').removeClass('search-top');
        $('#map_left').removeClass('map-left');
        $(".intro-wrapper").animate({top: '0vh'}, 750, function(){

        });
    });

    $("#map_left").on("click",".card-content",function () {
        console.log("HI");
        $(".intro-wrapper").animate({top: '-200vh'}, 750);
    });

    $("button#front-go").click(function () {
        var userSearch = $('#search').val();
        var userZip = $("#zip").val();
        geoCoding(userZip);
        getTopics(userSearch, userZip);
        //youTubeApi(userSearch);
    });
    $("button#nav-go").click(function () {
        var userSearch = $('#search').val();
        var userZip = $("#nav_zip").val();
        geoCoding(userZip);
        getTopics(userSearch, userZip);
        youTubeApi(userSearch);
    });
}
/**
 * getTopics - using user-entered interest, generate topics and use first 2 urlkeys
 * @param {string} keyword - user-entered interest
 * @param {number} zipcode - user-entered zipcode
 */
function getTopics(keyword, zipcode) {
    var meetUpLink;
    if(keyword === undefined){ //if no topic is passed, do generic search for topics at meetup
        meetUpLink = 'https://api.meetup.com/topics?&page=5&key=702403fb782d606165f7638a242a&sign=true';
    }else{ //other use user entered word to search for urlkeys of topics
        meetUpLink = 'https://api.meetup.com/topics?search=' + keyword + '&page=5&key=702403fb782d606165f7638a242a&sign=true';
    }
    $.ajax({
        dataType: 'jsonp',
        url: meetUpLink,
        method: 'get',
        success: function (response) {
            console.log('UrlKeys:', response.results);
            var topics = '';
            if (response.results.length > 0) { //check the array > 0; is there related topics to user search
                console.log('Result is true');
                for (var i = 0; i < response.results.length; i++) { //for the amount of results, add to string separted by commas
                    console.log('in for loop');
                    if (i !== response.results.length - 1) { //current topic is not the last in the array of topic returned
                        topics += response.results[i]['urlkey'] + ',';
                    } else {
                        topics += response.results[i]['urlkey']; //last topic, do not add comma
                    }
                }
            }
            //console.log('Topics', topics);
            getEvents(topics, zipcode); //pass the urlkey and zipcode to look for open events
        }
    });
}
/**
 * getEvents - ajax call to meetup api and using urlkey from getTopics gets open events
 * @param {string} keyword - urlkeys from meetup separated by commas
 * @param {string} zip - user-entered zipcode
 */
function getEvents(keyword, zip) {
    var userKeyword = keyword;
    var userZip = zip;
    $.ajax({
        dataType: 'jsonp',
        url: 'https://api.meetup.com/2/open_events?key=702403fb782d606165f7638a242a&zip=' + userZip + '&topic=' + userKeyword + '&page=20',
        method: 'get',
        success: function (response) {
            var eventList = response.results;
            if(response.results.length > 1) { //check that array containing open events is greater than 1
                //console.log('Event list', eventList);
                //console.log('global zip', global_zip);
                var newEventList = parseEventsForMaps(eventList); //gets latitude and longitude for map
                //console.log("new event list ", newEventList);
                initMap(global_zip, newEventList);
                $(".intro-wrapper").slideDown(750);
                $(".intro-wrapper").animate({top: '-100vh'}, 750, function () {
                    $('#top_search').addClass('search-top');
                    $('#map_left').addClass('map-left'); // added this wed. night - taylor
                });
            }else{ //if event is 1 or less, generic topic search urlkey for generic open events
                getTopics();
            }
        }
    });
}
function createEventCard(event){
    console.log('Event card', event);
    global_event.push(event);
    var eventName = event['name'];
    var groupName = event.group.name;
    var date = new Date(event['time']);
    date = parseTime(date);
    var venueName = event.venue.name;
    var address = event.venue.address_1;
    var city = event.venue.city;

    var $title = $('<span>', {
        class: 'card-title',
        text: eventName
    });
    var $group = $('<h5>', {
        text:groupName
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
    var $cardContent = $('<div>', {
        class: 'card-content white-text'
    }).append($title,$group, $date, $venue, $address);
    var $card = $('<div>', {
        class: 'card red lighten-1'
    }).append($cardContent);
    $('#map_left').append($card);
}
function parseTime(date){
    var day = date.toDateString();
    var hour = date.getHours();
    var minutes = date.getMinutes();
    var newDate;
    var amOrPm;
    //console.log('day ', day);
    if(hour > 12){
        hour -= 12;
        amOrPm = 'pm';
    }else{
        amOrPm = 'am'
    }
    if(minutes === 0){
        minutes = '00';
    }
    newDate = day + ' ' + hour + ':' + minutes + ' ' + amOrPm;
    //console.log(newDate);
    return newDate;
}

$('#map_left').on('click','.card', function(){
    var $eventName=$('<h1>',{
        text:event[i]['name']
    });
    var $groupName=$('<h5>',{
        text:event[i].group.name
    })
    var $eventDate= $('<h4>',{
        text: new Date(event[i]['time'])
    });
    var $eventAddress= $('<h4>',{
        text:event[i].venue.address_1 +event[i].venue.city +event[i].venue.state
    });
    var $eventDescription=$('<p>',{
        text:event[i]['description']
    });
    var $eventDetail=$('<div>',{
        class:"event-details"
    }).append($eventName,$groupName,$eventDate,$eventAddress,$eventDescription);

    var $eventPage=$('<div>',{
        class:'details-wrapper white',
    }).append($eventDetail);

});

//YOUTUBE SECTION -- DANs
function youTubeApi(usersChoice) {
    console.log('In the youTubeApi function');
    //BEGINNING OF AJAX FUNCTION
    $.ajax({
        dataType: 'json',
        data: {
            q: usersChoice,
            maxResults: 3
        },
        method: 'POST',
        url: "https://s-apis.learningfuze.com/hackathon/youtube/search.php",
        //BEGIN SUCCESS'S ANONYMOUS FUNCTION
        success: function (response) {
            if (response) {
                //CONSOLE LOGS FOR TESTING PURPOSES
                console.log('successful connection to YouTube API');

                //LOOP FOR VIDEO ID AND TITLE
                for (var i = 0; i < response.video.length; i++) {
                    var iframeDiv = $('<div>').addClass('video-container card');

                    //CREATION OF YOUTUBE VIDEO LINK
                    var iframe = $("<iframe>", {
                        src: "https://www.youtube.com/embed/" + response.video[i].id,
                        frameborder: 0,
                        allowfullscreen: true
                    });
                    iframe.appendTo(iframeDiv);
                    //ADDING TITLE AND VIDEO LINK TO THE DOM
                    // $('div.video-list').append(titleText);
                    $('div.video-list').append(iframeDiv);
                    console.log('This is the new div and class ', iframeDiv);
                }
            } else {
                //CONSOLE LOG FOR TESTING PURPOSES
                console.log('failure -- Unable to connect to YouTube api');
            }
        }
    });
}