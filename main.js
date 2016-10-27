/**
 * Created by LFZ C11 Hackathon TEAM 2 - Yrenia, Danh, Kevin, Dan, and Taylor on 10/26/2016.
 */

// Danh's Section
$(document).ready(function(){

    $("button").click(function(){
        var q = $("#input").val();
        geoCoding(q);
    });

});

function geoCoding(query) {
    $.ajax({
        dataType:'JSON',
        method: 'GET',
        url: "https://maps.googleapis.com/maps/api/geocode/json?address="+query+"&key=AIzaSyDa6lkpC-bOxXWEbrWaPlw_FneCpQhlgNE",
        success: function(response){
            if (response) {
                var output = response.results[0].geometry.location;
                console.log("response", output);
                initMap(output);
                $(".intro-top").toggle();
            }
        }
    })
}
// Danh's Section End