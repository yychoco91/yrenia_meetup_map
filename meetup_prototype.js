/**
 * Created by kevin on 10/26/16.
 */
$(document).ready(click_handlers);

console.log('in click handlers');
$('button').click(function () {
    console.log('Clicked!');
    var userSearch = $('#search').val();
    var userZip = $('#zip').val();
    console.log(userSearch, userZip);
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
        url: 'https://api.meetup.com/2/open_events?key=702403fb782d606165f7638a242a&zip=' + userZip + '&topic=' + userKeyword + '&page =20',
        method: 'get',
        success: function (response) {
            console.log(response);
        }
    });
}