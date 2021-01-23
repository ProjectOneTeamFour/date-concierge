var submitFromEl = document.querySelector("#submit-form");
var userNameEl = document.querySelector("#user-name");
var dateEl = document.querySelector("#date");
var moodEl = document.querySelector("#date-mood");

const ZOMATO_API_KEY = '670c5f2e4824fb60c96ab79528421baf';
const OWM_API_KEY = "ce455bd02a51e6ea3ab658a42367d8f2";
var userLocation = {}; // stores user location
var userName = '';
var date = '';
var mood = '';


document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems);
  });

var getLocation = function() {
    return new Promise(function(resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    })
}

var getRestaurantList = function(location) {
    var lat = location.coords.latitude;
    var lng = location.coords.longitude;
    var searchRadius = 1000;

    userLocation = {
        lat: location.coords.latitude,
        lng: location.coords.longitude
    };

    var url = `https://developers.zomato.com/api/v2.1/search?lat=${lat}&lon=${lng}&radius=${searchRadius}`;
    var config = {
        headers: {
            "user-key": ZOMATO_API_KEY
        }
    };
    return fetch(url, config);
}

var getWeatherData = function() {
    let urlForecast = `https://api.openweathermap.org/data/2.5/onecall?lat=${parseFloat(userLocation.lat)}&lon=${parseFloat(userLocation.lng)}&units=imperial&exclude=minutely,hourly,alerts&appid=${OWM_API_KEY}`;
    return fetch(urlForecast);
}

var getData = function() {
    if(navigator.geolocation) {
        getLocation()
            .then(getRestaurantList)
            .then(function(response) {
                if(response.ok){
                    return response.json();
                } else {
                    alert("Error:" + response.statusText); // TO-DO: need to convert this to a modal
                }
            })
            .then(function(data) {
                if(!data){
                    return;
                }
                console.log("Restaurant Data", data);
                return getWeatherData();
            })
            .then(function(response) {
                if(response.ok){
                    return response.json();
                } else {
                    alert("Error:" + response.statusText); // TO-DO: need to convert this to a modal
                }
            })
            .then(function(data) {
                if(!data){
                    return;
                }
                console.log("Weather Data", data);
                document.location.replace("./dateresults.html"+"?username="+userName+"&date="+date+"&mood="+mood);
            })
            .catch(error => console.log(error));
    }       
}

var changePage = function(event)
{
    event.preventDefault();

    userName = userNameEl.value;
    date = dateEl.value;
    mood = moodEl.value;
    
    if(userName && date && mood) {
        getData();
        // document.location.replace("./dateresults.html"+"?username="+userName+"&date="+date+"&mood="+mood);
    } else {
        console.log("error");
    }
};


// Initialize datepicker
$(function(){
    $("#date").datepicker();
});

// Initialize select
$(document).ready(function(){
    $('select').formSelect();
});

submitFromEl.addEventListener("submit", changePage);