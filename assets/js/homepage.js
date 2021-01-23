var submitFromEl = document.querySelector("#submit-form");
var userNameEl = document.querySelector("#user-name");
var dateEl = document.querySelector("#date");
var moodEl = document.querySelector("#date-mood");

var changePage = function(event)
{
    event.preventDefault();

    var userName = userNameEl.value;
    var date = dateEl.value;
    var mood = moodEl.value;
    console.log(date);
    if(userName && date && mood)
    {
        document.location.replace("./dateresults.html"+"?username="+userName+"&date="+date+"&mood="+mood);
    }
    else
    {
        console.log("error");
    }
};

var getLocation = function() {
    return new Promise(function(resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    })
}

var getRestaurantList = function(lat, lng, searchRadius) {
    if(navigator.geolocation) {
        getLocation()
            .then(function(location) {
                var lat = location.coords.latitude;
                var lng = location.coords.longitude;
                userLocation = {
                    lat: location.coords.latitude,
                    lng: location.coords.longitude,
                }
                
                console.log(userLocation);

                var url = `https://developers.zomato.com/api/v2.1/search?lat=${lat}&lon=${lng}&radius=${searchRadius}`;
                var config = {
                    headers: {
                        "user-key": ZOMATO_API_KEY
                    }
                };
                return fetch(url, config)
            })
            .then(function(response) {
                if(response.ok){
                    return response.json();
                } else {
                    alert("Error:" + response.statusText); // TO-DO: need to convert this to modal
                }
            })
            .then(function(data) {
                if(!data){
                    return;
                }
                console.log(data);
            })
            .catch(error => console.log(error));
    }       
}

// getRestaurantList();


$(function(){
    $("#date").datepicker();
});

$(document).ready(function(){
    $('select').select();
});

submitFromEl.addEventListener("submit",changePage);