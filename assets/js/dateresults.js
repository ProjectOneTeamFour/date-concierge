// Elements
var nextBtnEl = document.querySelector("#next-btn");
var saveBtnEl = document.querySelector("#save-btn");
var movieMapContainerEl = document.querySelector("#movie-or-map-container");


//API Keys
const ZOMATO_API_KEY = '670c5f2e4824fb60c96ab79528421baf';
const OWM_API_KEY = "ce455bd02a51e6ea3ab658a42367d8f2";
const TMDB_API_KEY = "5733f541d83befd903f222e59340f8b2";


// Extract parameters
var params = (new URL(document.location)).searchParams;
var username = params.get('username');
var date = params.get('date');
var mood = params.get('mood');


//variables
var userLocation = {}; // stores user location
var counter = 0;



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
    var adventurous = 
    {
        genres : ["Action","Adventure","Crime","Documentary","History","Horro","Mystery","Science Fiction","Thriller","War","Western","Drama","Fantasy"],
        cuisines : [
                    "Afghan","Afghani","African","Arabian","Argentine","Armenian","Australian","Austrian",
                    "Bangladeshi","Brazilian","British","Bubble Tea","Burmese","Cajun","California","Cambodian",
                    "Cantonese","Caribbean","Central Asian","Colombian","Cuban","Dim Sum","Eastern European",
                    "Egyptian","Ethiopian","European","Filipino","First Nations","Fusion","Georgian","German",
                    "Greek","Hakka Chinese","Hawaiian","Hong Kong Style","Hungarian","Indian","Indonesian",
                    "International","Iranian","Irish","Israeli","Jamaican","Japanese","Jewish","Korean",
                    "Latin American","Lebanese","Malaysian","Mediterranean","Mexican","Middle Eastern",
                    "Modern European","Moldovan","Mongolian","Moroccan","Nepalese","New Mexican","Nigerian",
                    "North Indian","Northern Chinese","Oriental","Pacific Northwest","Pakistani","Pan Asian",
                    "Patisserie","Persian","Peruvian","Quebecois","Ramen","Russian","Salad","Salvadorean",
                    "Thai","Tibetan","Trinbagonian","Turkish","Ukrainian","Vegetarian","Venezuelan","Vietnamese",
                    "West Indian","Xinjiang","Yunnan","Polish","Portuguese","Swedish","Swiss","Syrian","Taiwanese",
                    "Tanzanian","South Indian","Southern","Southwestern","Spanish","Sri Lankan","Shanghai",
                    "Sichuan","Singaporean","Somali","Scottish"
                    ]
    };
    var relaxed = 
    {
        genres : ["Animation","Comedy","Family","Music","TV Movie"],
        cuisines : [
                    "American","Asian","Asian Fusion","BBQ","Bagels","Bakery","Bar Food","Beverages",
                    "Brasserie","Breakfast","Burger","Cafe","Chinese","Coffee and Tea","Canadian",
                    "Continental","Deli","Desserts","Diner","Donuts","Drinks Only","Fast Food","Finger Food",
                    "Fish and Chips","Frozen Yogurt","Grill","Healthy Food","Ice Cream","Juices","Kebab",
                    "Pizza","Pub Food","Salad","Sandwich","Tea","Tex-Mex","Soul Food"
                    ]
    };
    var romantic = 
    {
        genres : ["Romance"],
        cuisines : ["Steak","Sushi","French","Crepes","Italian","Tapas","Seafood"]
    };
    var spontaneous = 
    {
        genres : adventurous.genres.concat(relaxed.genres,romantic.genres),
        cuisines : adventurous.cuisines.concat(relaxed.cuisines,romantic.cuisines)
    };

    var result =
    {
        genres : "",
        cuisines : ""
    };

    switch(mood)
    {
        case "spontaneous":
            result.genre = spontaneous.genres[Math.floor(Math.random()*spontaneous.genres.length)];
            result.cuisine = spontaneous.cuisines[Math.floor(Math.random()*spontaneous.cuisines.length)];
            return result;

        case "adventurous":
            result.genre = adventurous.genres[Math.floor(Math.random()*adventurous.genres.length)];
            result.cuisine = adventurouss.cuisines[Math.floor(Math.random()*adventurous.cuisines.length)];
            return result;

        case "relaxed":
            result.genre = relaxed.genres[Math.floor(Math.random()*relaxed.genres.length)];
            result.cuisine = relaxed.cuisines[Math.floor(Math.random()*relaxed.cuisines.length)];
            return result;

        case "romantic":
            result.genre = romantic.genres[Math.floor(Math.random()*romantic.genres.length)];
            result.cuisine = romantic.cuisines[Math.floor(Math.random()*romantic.cuisines.length)];
            return result;
    }
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
    var movieGenre = getMoodTypes().genre;//"Comedy"; //remove and add genre from getMoodTypes() function
    console.log(movieGenre);
    fetch("https://api.themoviedb.org/3/genre/movie/list?api_key="+ TMDB_API_KEY +"&language=en-US")
    .then(function(response)
    {
        return response.json()
    })
    .then(function(data)
    {
        var genres = data.genres;
        for(var i =0; i<genres.length; i++)
        {
            if (genres[i].name === movieGenre)
            {
                return fetch("https://api.themoviedb.org/3/discover/movie?api_key="+ TMDB_API_KEY +
                             "&with_genres="+genres[i].id+"&with_original_language=en&include_adult=exclude&sort_by=popularity.desc&release_date.gte=1990");
            }
        }
    })
    .then(function(response)
    {
        return response.json();
    })
    .then(function(data)
    {
        var movie = data.results[counter];
        var imageEl = document.createElement("img");
        var imgURL =  movie.poster_path || movie.backdrop_path;
        imageEl.src = "https://image.tmdb.org/t/p/original" + imgURL;
        var titleEl = document.createElement("span");
        titleEl.textContent =movie.title;
        titleEl.className = "card-title";
        var voteEl = document.createElement("p");
        voteEl.textContent ="Rate: " + movie.vote_average + "/10";

        var genreEl = document.createElement("p");
        genreEl.textContent ="Genre: " + movieGenre;

        var releaseDateEl = document.createElement("p");
        releaseDateEl.textContent ="Release Date: " + movie.release_date;     
        var overviewEl = document.createElement("p");
        overviewEl.textContent ="Overview: " + movie.overview;

        var movieImgEl = document.createElement("div");
        movieImgEl.className= "card-image";
        movieImgEl.appendChild(imageEl);

        var movieDetailsEl = document.createElement("div");
        movieDetailsEl.className = "card-content";
        movieDetailsEl.appendChild(titleEl);
        movieDetailsEl.appendChild(releaseDateEl);
        movieDetailsEl.appendChild(voteEl);
        movieDetailsEl.appendChild(genreEl);
        movieDetailsEl.appendChild(overviewEl);

        movieMapContainerEl.appendChild(movieImgEl);
        movieMapContainerEl.appendChild(movieDetailsEl);
    });
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
    counter++;
    movieMapContainerEl.innerHTML ="";
    // getMovieData();
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

// getMovieData();
nextBtnEl.addEventListener("click", nextBtnHandler);
saveBtnEl.addEventListener("click", addToList);


