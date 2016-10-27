/**
 * Created by LFZ C11 Hackathon TEAM 2 - Yrenia, Danh, Kevin, Dan, and Taylor on 10/26/2016.
 */

$(document).ready(click_handlers);


function click_handlers(){
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

function getEvents(keyword,zip){
    var userKeyword = keyword;
    var userZip = zip;
    $.ajax({
        dataType: 'jsonp',
        url: 'https://api.meetup.com/2/open_events?key=702403fb782d606165f7638a242a&zip='+userZip+'&topic='+userKeyword +'&page =20',
        method:'get',
        success: function(response){
            console.log(response);
        }
    });
}