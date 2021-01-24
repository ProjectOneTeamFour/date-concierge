// Elements
var nextBtnEl = document.querySelector("#next-btn");
var saveBtnEl = document.querySelector("#save-btn");


//API Keys
const ZOMATO_API_KEY = '670c5f2e4824fb60c96ab79528421baf';
const OWM_API_KEY = "ce455bd02a51e6ea3ab658a42367d8f2";


// Extract parameters
var params = (new URL(document.location)).searchParams;
var username = params.get('username');
var date = params.get('date');
var mood = params.get('mood');


//variables
var userLocation = {}; // stores user location



//get location function
//input : user accept
//output: coordinates
var getLocation = function() 
{
    // return new Promise(function(resolve, reject) 
    // {
    //     navigator.geolocation.getCurrentPosition(resolve, reject);
    // })
}


//get weather data
//input : coordinates , date 
//output: tempreture
var getWeatherData = function() 
{
    // let urlForecast = `https://api.openweathermap.org/data/2.5/onecall?lat=${parseFloat(userLocation.lat)}&lon=${parseFloat(userLocation.lng)}&units=metric&exclude=minutely,hourly,alerts&appid=${OWM_API_KEY}`;
    // return fetch(urlForecast);
}


//get types of resturants and movies based on the mood
//input : user mood
//output: movie category , food type
var getMoodTypes = function() 
{

}


//get resturants data
//input : coordinates, food type
//output: All resturant data
var getRestaurantData = function() 
{
    // var lat = location.coords.latitude;
    // var lng = location.coords.longitude;
    // var searchRadius = 1000;

    // userLocation = 
    // {
    //     lat: location.coords.latitude,
    //     lng: location.coords.longitude
    // };

    // var url = `https://developers.zomato.com/api/v2.1/search?lat=${lat}&lon=${lng}&radius=${searchRadius}`;
    // var config = 
    // {
    //     headers: 
    //     {
    //         "user-key": ZOMATO_API_KEY
    //     }
    // };
    // return fetch(url, config);
}


//get resturants data
//input : movie category
//output: All movie data
var getMovieData = function() 
{

}


// choose indoor or outdoor then display the results
var displayResults = function() 
{
    // if(navigator.geolocation) 
    // {
    //     getLocation()
    //         .then(getRestaurantList)
    //         .then(function(response) 
    //         {
    //             if(response.ok)
    //             {
    //                 return response.json();
    //             } 
    //             else 
    //             {
    //                 alert("Error:" + response.statusText); // TO-DO: need to convert this to a modal
    //             }
    //         })
    //         .then(function(data) 
    //         {
    //             if(!data)
    //             {
    //                 return;
    //             }
    //             console.log("Restaurant Data", data);
    //             return getWeatherData();
    //         })
    //         .then(function(response) 
    //         {
    //             if(response.ok)
    //             {
    //                 return response.json();
    //             } 
    //             else 
    //             {
    //                 alert("Error:" + response.statusText); // TO-DO: need to convert this to a modal
    //             }
    //         })
    //         .then(function(data) 
    //         {
    //             if(!data)
    //             {
    //                 return;
    //             }
    //             console.log("Weather Data", data);
    //             document.location.replace("./dateresults.html"+"?username="+userName+"&date="+date+"&mood="+mood);
    //         })
    //         .catch(error => console.log(error));
    // }       
}

// show next movie and resturant
var nextBtnHandler = function()
{

}

//save list
var addToList = function()
{
    
}

//load list
var loadList = function()
{
    
}

//open Modal

// document.addEventListener('DOMContentLoaded', function() 
// {
//     var elems = document.querySelectorAll('.modal');
//   //  var instances = M.Modal.init(elems, options);
//     // instances.open();
// });
// // Or with jQuery
// $(document).ready(function()
// {
//     $('.modal').modal();
//     // instance.open();
// });
          
nextBtnEl.addEventListener("click", nextBtnHandler);
saveBtnEl.addEventListener("click", addToList);


