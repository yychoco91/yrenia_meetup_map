/**
 * Created by LFZ C11 Hackathon TEAM 2 - Yrenia, Danh, Kevin, Dan, and Taylor on 10/26/2016.
 */
$(document).ready(click_handlers);

// Danh's Section
function geoCoding(query) {
    $.ajax({
        dataType: 'JSON',
        method: 'GET',
        url: "https://maps.googleapis.com/maps/api/geocode/json?address=" + query + "&key=AIzaSyDa6lkpC-bOxXWEbrWaPlw_FneCpQhlgNE",
        success: function (response) {
            var output = response.results[0].geometry.location;
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
// Danh's Section End
function click_handlers() {

    $(".card-content").click(function () {
        console.log("HI");
        $(".intro-wrapper").animate({top: '-200vh'},750);
    });
    $("button#front-go").click(function () {
        var userSearch = $('#search').val();
        var userZip = $("#zip").val();
        geoCoding(userZip);
        getTopics(userSearch, userZip);
    });
    $("button#nav-go").click(function () {
        var userSearch = $('#search').val();
        var userZip = $("#nav_zip").val();
        geoCoding(userZip);
        getTopics(userSearch, userZip);
    });
}
/**
 * getTopics - using user-entered interest, generate topics and use first 2 urlkeys
 * @param {string} keyword - user-entered interest
 * @param {number} zipcode - user-entered zipcode
 */
function getTopics(keyword, zipcode) {
    console.log('get stuff');
    var userKeyword = keyword;
    $.ajax({
        dataType: 'jsonp',
        url: 'https://api.meetup.com/topics?search=' + userKeyword + '&page=5&key=702403fb782d606165f7638a242a&sign=true',
        method: 'get',
        success: function (response) {
            console.log('UrlKeys:', response.results);
            var topics = '';
            if(response.results.length > 0){
                console.log('Result is true');
                for(var i = 0; i < response.results.length; i++){
                    console.log('in for loop');
                    if(i !== response.results.length-1){
                        topics += response.results[i]['urlkey'] + ',';
                    }else{
                        topics += response.results[i]['urlkey'];
                    }
                }
            }
            console.log('Topics', topics);
            getEvents(topics, zipcode);
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
            var eventList = response.results; //limit to display only 20 events. Create divs and style later
            console.log('Event list', eventList);

            createEventCard(eventList);
        }
    });
}
function createEventCard(eventList) {
    $('#map-left').html('');
    for ( var i = 0; i < eventList.length; i++) {
        var eventName=eventList[i]['name'];
        var groupName=eventList[i].group.name;
        var date=new Date(eventList[i]['time']);
        var venueName=eventList[i].venue.name;
        var address=eventList[i].venue.address_1;
        var city=eventList[i].venue.city;
        var state=eventList[i].venue.state;

        var $title= $('<span>', {
            class: 'card-title',
            text: eventName+groupName
        });
        var $date = $('<p>', {
            text: date
        });
        var $venue = $('<p>', {
            text: venueName
        });
        var $address = $('<p>', {
            text: address + city + state
        });
        var $card = $('<div>',{
            class: 'card-content white-text'
        }).append($title, $date, $venue, $address);
        $('#map_left').append($card);
    }
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
                        width: 360, //originally 360, 260
                        height: 216, //originally 215, 155
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