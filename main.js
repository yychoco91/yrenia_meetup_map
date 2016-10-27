/**
 * Created by LFZ C11 Hackathon TEAM 2 - Yrenia, Danh, Kevin, Dan, and Taylor on 10/26/2016.
 */

// Danh's Section

var global_zip = null;
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
                console.log("response", output);
                initMap(output);
                //$(".map-wrapper").slideDown(500);
                $(".intro-wrapper").slideDown(750);
                $(".intro-wrapper").animate({top: '-100vh'},750,function(){

                    $('#top_search').addClass('search-top');

                    $('#map_left').addClass('map-left'); // added this wed. night - taylor

                });
        }
    })
}
/**
 *
 * @param {object} eventObj - event object passed from Meetup Open Events API
 */
function parseEventsForMaps(eventObj) {
    console.log("Event Object is", eventObj);
    var geocodeArray = [];
    for(var i = 0;i<eventObj.length;i++) {

        if(eventObj[i].hasOwnProperty("venue")) {
            console.log("YES");
            var eventLat = eventObj[i].venue.lat;
            var eventLon = eventObj[i].venue.lon;

            geocodeArray.push({
                lat: eventLat,
                lng: eventLon
            });
        }
    }

    return geocodeArray;
}

// Danh's Section End



$(document).ready(click_handlers);

/**
 *
 */
function click_handlers() {

        $(".card-content").click(function () {
            //console.log("HI");
            $(".intro-wrapper").animate({top: '-200vh'},750);
        });


        $("button#front-go").click(function () { // merging this function with Kevin prototype
            var q = $("#zip").val();
            //console.log("front q is "+ q);

            var userSearch = $('#search').val();
            var userZip = $('#zip').val();
            console.log(userSearch, userZip);
            geoCoding(q);
            getTopics(userSearch, userZip);
            youTubeApi(userSearch);
        });

        $("button#nav-go").click(function () {
           var q = $("#nav_zip").val();
            console.log("nav q is "+ q);

            var userSearch = $('#nav_search').val();
            var userZip = $('#nav_zip').val();
            console.log(userSearch, userZip);
            geoCoding(q);
            getTopics(userSearch, userZip);
        });

    /**
     * getTopics - using user-entered interest, generate topics and use first 2 urlkeys
     * @param {string} keyword - user-entered interest
     * @param {number} zipcode - user-entered zipcode
     */
    function getTopics(keyword, zipcode) {
        //console.log('get stuff');
        var userKeyword = keyword;
        $.ajax({
            dataType: 'jsonp',
            url: 'https://api.meetup.com/topics?search=' + userKeyword + '&page=20&key=702403fb782d606165f7638a242a&sign=true',
            method: 'get',
            success: function (response) {
                console.log('UrlKeys:', response);
                var topic1 = response.results[0]['urlkey'];
                var topic2 = response.results[1]['urlkey'];
                var sumTopics = topic1 + ',' + topic2;
                console.log('Topics', sumTopics);
                getEvents(sumTopics, zipcode);
            }
        });
    }

    function getEvents(keyword, zip) {
        var userKeyword = keyword;
        var userZip = zip;
        $.ajax({
            dataType: 'jsonp',
            url: 'https://api.meetup.com/2/open_events?key=702403fb782d606165f7638a242a&zip=' + userZip + '&topic=' + userKeyword + '&page=20',
            method: 'get',
            success: function (response) {
                var eventList = response.results;
                //console.log('Event list', eventList);
                console.log('global zip', global_zip);
                var newEventList = parseEventsForMaps(eventList);
                console.log("new event list ",newEventList);
                initMap(global_zip,newEventList);

                $(".intro-wrapper").slideDown(750);
                $(".intro-wrapper").animate({top: '-100vh'},750,function(){
                    $('#top_search').addClass('search-top');
                    $('#map_left').addClass('map-left'); // added this wed. night - taylor
                });
            }
        });
    }

    console.log('in click handlers');
    $('button').click(function(){
        console.log('Clicked!');
        var userSearch = $('#search').val();
        var zipSearch = $('#zip').val();
        console.log(userSearch,zipSearch);
        getCategories(userSearch);
        getEvents(userSearch,zipSearch);
    });
}

function getCategories(keyword){
    console.log('get stuff');
    var userKeyword = keyword;
    $.ajax({
        dataType: 'jsonp',
        url: 'https://api.meetup.com/topics?search='+ userKeyword +'&page=20&key=702403fb782d606165f7638a242a&sign=true',
        method: 'get',
        success: function(response){
            console.log(response);
        }
    });
}

function getEvents(keyword,zip) {
    var userKeyword = keyword;
    var userZip = zip;
    $.ajax({
        dataType: 'jsonp',
        url: 'https://api.meetup.com/2/open_events?key=702403fb782d606165f7638a242a&zip=' + userZip + '&topic=' + userKeyword + '&page =20',
        method: 'get',
        success: function (response) {
            console.log(response);
        }
    });
}

//YOUTUBE SECTION -- DANs
    function youTubeApi(usersChoice) {
        console.log('In the youTubeApi function');
        //BEGINNING OF AJAX FUNCTION
        $.ajax({
            dataType: 'json',
            data: {
                q: usersChoice,
                maxResults: 4,
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
                         var iframeDiv = $('<div>').addClass('video-container');

                        //CREATION OF YOUTUBE VIDEO LINK
                        var iframe = $("<iframe>", {
                            /*width: 360, //originally 360, 260
                            height: 216, //originally 215, 155*/
                            src: "https://www.youtube.com/embed/" + response.video[i].id,
                            frameborder: 0,
                            allowfullscreen: true
                        });
                         iframe.appendTo(iframeDiv);
                        //ADDING TITLE AND VIDEO LINK TO THE DOM
                       // $('div.video-list').append(titleText);
                        $('div.video-list').append(iframeDiv);
                        console.log('This is the new div and class ' , iframeDiv);
                    }
                } else {
                    //CONSOLE LOG FOR TESTING PURPOSES
                    console.log('failure -- Unable to connect to YouTube api');

                }
            }
        });
    }
