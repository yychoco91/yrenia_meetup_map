/**
 * Created by kevin on 10/26/16.
 */
$(document).ready(click_handlers);


function click_handlers(){
    console.log('in click handlers');
    $('button').click(function(){
        console.log('Clicked!');
        var userSearch = $('input').val();
        console.log(userSearch);
        getCategories(userSearch);
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