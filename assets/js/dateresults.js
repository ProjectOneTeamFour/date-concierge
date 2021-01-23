const ZOMATO_API_KEY = '670c5f2e4824fb60c96ab79528421baf';
const OPEN_WEATHER_MAP_API_KEY = '';

var attribites = document.location.search;
console.log(attribites);

// Extract parameters
var params = (new URL(document.location)).searchParams;
var username = params.get('username');
var date = params.get('date');
var mood = params.get('mood');

var userLocation = {};

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

getRestaurantList();

// $("#search").on("click", getList);

