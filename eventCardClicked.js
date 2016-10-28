/**
 * Created by kevin on 10/27/16.
 */
$('#map_left').on('click','.card', function(){
    var $eventName=$('<h1>',{
        text:eventList[i]['name']
        });
    var $groupName=$('<h5>',{
        text:eventList[i].group.name
    })
    var $eventDate= $('<h4>',{
        text: new Date(eventList[i]['time'])
    });
    var $eventAddress= $('<h4>',{
        text:eventList[i].venue.address_1 +eventList[i].venue.city +eventList[i].venue.state
    });
    var $eventDescription=$('<p>',{
        text:eventList[i]['description']
    });

    var $eventDetail=$('<div>',{
        class:"event-details"
    }).append($eventName,$groupName,$eventDate,$eventAddress,$eventDescription);

    var $eventPage=$('<div>',{
        class:'details-wrapper white',
    }).append($eventDetail);

});

function createEventCard(eventList) {
    $('#map_left').html('');
    console.log('creating event cards', eventList);
    $('#map-left').html('');
    for ( var i = 0; i < eventList.length; i++){
        if(eventList[i].hasOwnProperty("venue")){
            var eventName = eventList[i]['name'];
            var groupName = eventList[i].group.name;
            var date = new Date(eventList[i]['time']);
            var venueName = eventList[i].venue.name;
            var address = eventList[i].venue.address_1;
            var city = eventList[i].venue.city;
            var state = eventList[i].venue.state;

            var $title = $('<span>', {
                class: 'card-title',
                text: eventName + groupName
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
            var $cardContent = $('<div>', {
                class: 'card-content white-text'
            }).append($title, $date, $venue, $address);

            var $card = $('<div>',{
                class: 'card red lighten-1'
            }).append($cardContent);
            $('#map_left').append($card);
        }
    }
}