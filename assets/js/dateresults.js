// Elements
var nextBtnEl = document.querySelector("#next-btn");
var saveBtnEl = document.querySelector("#save-btn");
var movieMapContainerEl = document.querySelector("#movie-or-map-container");
var restaurantContainerEl = document.querySelector("#restaurant-info");
var temperature = "";
var loadingModalInstance;

//API Keys
const ZOMATO_API_KEY = "670c5f2e4824fb60c96ab79528421baf";
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
    return new Promise(function(resolve, reject) 
    {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    })
}

// helper function to format unix timestamp
let getDateFromTimeStamp = function(timeStamp, timezoneOffset) {
    return moment.unix(timeStamp + timezoneOffset).utc().format("DD-MM-YYYY");
}

//get weather data
//input : coordinates , date 
//output: tempreture
var getWeatherData = function() 
{
    let urlForecast = `https://api.openweathermap.org/data/2.5/onecall?lat=${parseFloat(userLocation.latitude)}&lon=${parseFloat(userLocation.longitude)}&units=metric&exclude=minutely,hourly,alerts&appid=${OWM_API_KEY}`;
    return fetch(urlForecast);
}

var generateWeatherCard = function(temperature, weatherDescription, weatherIcon) { 
    var cardEl = $("<div>")
        .addClass("card horizontal")
        .html(`
            <div class="card-stacked">
                <div class="card-content">
                    <span class="card-title">Selected Date: ${date} </span>
                    <p> ${weatherDescription}, with a chance of love ♥.</p>
                    <div id="current-weather">
                        <div>
                            <img
                                width="80px" 
                                src="https://openweathermap.org/img/wn/${weatherIcon}.png"
                                alt=${weatherDescription}
                            </img>
                            <h3>${parseFloat(temperature).toFixed(1)}°C</h3>
                        </div>
                        
                    </div>
                </div>
            </div>
        `);
    
    $("#weather-container")
        .empty()
        .append(cardEl);
}

var generateRestaurantCard = function(restaurant) { 
    restaurantContainerEl.innerHTML = '';
    var inOrOut = "DINE OUT";
    if (temperature < 10){
        inOrOut = "STAY IN";
    };
    var x = Math.floor(Math.random() * (restaurant.length));
    if (restaurant[x].restImg) {
        var imageEl = document.createElement("img");
        imageEl.src = restaurant[x].restImg;
        imageEl.setAttribute("id", "restImg");
        var restNameEl = document.createElement("span");
        restNameEl.textContent =restaurant[x].restName;
        restNameEl.className = "card-title";
        var inOrOutEl = document.createElement("p");
        inOrOutEl.textContent =inOrOut;
        var addressEl = document.createElement("p");
        addressEl.textContent =restaurant[x].address;
        var cuisineEl = document.createElement("p");
        cuisineEl.textContent =restaurant[x].cuisine;
        var costForTwoEl = document.createElement("p");
        costForTwoEl.textContent ="Average cost for 2: $" + restaurant[x].costForTwo;
        var hoursEl = document.createElement("p");
        hoursEl.textContent =restaurant[x].timings;
        var restImgEl = document.createElement("div");
        restImgEl.className= "card-image";
        restImgEl.appendChild(imageEl);

        var restDetailsEl = document.createElement("div");
        restDetailsEl.className = "card-content";
        restDetailsEl.appendChild(inOrOutEl);
        restDetailsEl.appendChild(restNameEl);
        restDetailsEl.appendChild(addressEl);
        restDetailsEl.appendChild(cuisineEl);
        restDetailsEl.appendChild(costForTwoEl);
        restDetailsEl.appendChild(hoursEl);

        restaurantContainerEl.appendChild(restImgEl);
        restaurantContainerEl.appendChild(restDetailsEl);
        $("#restImg").css({
            "max-width":"100%",
            "max-height":"100%"
        });
    } else {
        getRestaurantData();
    };
    
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
                    "Afghan-1035","Afghani-6","African-152","Arabian-4","Argentine-151","Armenian-175","Australian-131","Austrian-201",
                    "Bangladeshi-145","Brazilian-159","British-133","Bubble Tea-247","Burmese-22","Cajun-491","California-956","Cambodian-111",
                    "Cantonese-121","Caribbean-158","Central Asian-202","Colombian-287","Cuban-153","Dim Sum-411","Eastern European-651",
                    "Egyptian-146","Ethiopian-149","European-38","Filipino-112","First Nations-421","Fusion-274","Georgian-205","German-134",
                    "Greek-156","Hakka Chinese-441","Hawaiian-521","Hong Kong Style-791","Hungarian-228","Indian-148","Indonesian-114",
                    "International-154","Iranian-140","Irish-135","Israeli-218","Jamaican-207","Japanese-60","Jewish-265","Korean-67",
                    "Latin American-136","Lebanese-66","Malaysian-69","Mediterranean-70","Mexican-73","Middle Eastern-137",
                    "Modern European-294","Moldovan-591","Mongolian-74","Moroccan-147","Nepalese-117","New Mexican-995","Nigerian-296",
                    "North Indian-50","Northern Chinese-861","Oriental-278","Pacific Northwest-963","Pakistani-139","Pan Asian-209",
                    "Patisserie-183","Persian-81","Peruvian-162","Quebecois-511","Ramen-320","Russian-84","Salad-998","Salvadorean-601",
                    "Thai-95","Tibetan-93","Trinbagonian-631","Turkish-142","Ukrainian-451","Vegetarian-308","Venezuelan-641","Vietnamese",
                    "Vietnamese-99","Xinjiang-851","Yunnan-841","Polish-219","Portuguese-87","Swedish-211","Swiss-213","Syrian-212","Taiwanese-190",
                    "Tanzanian-621","South Indian-85","Southern-471","Southwestern-966","Spanish-89","Sri Lankan-86","Shanghai-831",
                    "Sichuan-128","Singaporean-119","Somali-611","Scottish-210"
                    ]
    };
    var relaxed = 
    {
        genres : ["Animation","Comedy","Family","Music","TV Movie"],
        cuisines : [
                    "American-1","Asian-3","Asian Fusion-401","BBQ-193","Bagels-955","Bakery-5","Bar Food-227","Beverages-270",
                    "Brasserie-195","Breakfast-182","Burger-168","Cafe-30","Chinese-25","Coffee and Tea-161","Canadian-381",
                    "Continental-35","Deli-192","Desserts-100","Diner-541","Donuts-959","Drinks Only-268","Fast Food-40","Finger Food-271",
                    "Fish and Chips-298","Frozen Yogurt-501","Grill-181","Healthy Food-143","Ice Cream-233","Juices-164","Kebab-178",
                    "Pizza-82","Pub Food-983","Salad-998","Sandwich-304","Tea-163","Tex-Mex-150","Soul Food-461"
                    ]
    };
    var romantic = 
    {
        genres : ["Romance"],
        cuisines : ["Steak-141","Sushi-177","French-45","Crepes-881","Italian-55","Tapas-179","Seafood-83"]
    };
    var spontaneous = 
    {
        genres : adventurous.genres.concat(relaxed.genres,romantic.genres),
        cuisines : adventurous.cuisines.concat(relaxed.cuisines,romantic.cuisines)
    };

    var result =
    {
        genre : "",
        cuisine : ""
    };

    switch(mood)
    {
        case "spontaneous":
            result.genre = spontaneous.genres[Math.floor(Math.random()*spontaneous.genres.length)];
            result.cuisine = spontaneous.cuisines[Math.floor(Math.random()*spontaneous.cuisines.length)];
            return result;

        case "adventurous":
            result.genre = adventurous.genres[Math.floor(Math.random()*adventurous.genres.length)];
            result.cuisine = adventurous.cuisines[Math.floor(Math.random()*adventurous.cuisines.length)];
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
    var restaurant = [{restName:"", cuisine:"", address:"", restImg:"", costForTwo:"", restHours:""}];
    var lat = userLocation.latitude;
    var lng = userLocation.longitude;
    var cuisine = getMoodTypes().cuisine;
    var cuisineID = cuisine.split("-");
    var searchRadius = 2500;
    
    console.log(cuisine);
    console.log(cuisineID);
    var url = `https://developers.zomato.com/api/v2.1/search?entity_type=metro&lat=${lat}&lon=${lng}&radius=${searchRadius}&cuisines=${cuisineID}&sort=rating`;
    //https://developers.zomato.com/api/v2.1/search?entity_type=metro&lat=43.7080973&lon=-79.395311499&radius=2500&cuisines=142&sort=rating
    //var urlcuisines = "https://developers.zomato.com/api/v2.1/cuisines?city_id=89"
    console.log(url);
    var config = 
    {
        headers: 
        {
            "user-key": ZOMATO_API_KEY
        }
    };
    fetch(url, config).then(function(response) {
        // request was successful
        if (response.ok) {
          response.json().then(function(data) {
            console.log(data);
            //displayCuisine(data);

            for(var i =0; i < data.restaurants.length; i++){
                restaurant[i] = {
                  restName: data.restaurants[i].restaurant.name,
                  cuisine: data.restaurants[i].restaurant.cuisines,
                  address: data.restaurants[i].restaurant.location.address,
                  restImg: data.restaurants[i].restaurant.featured_image,
                  costForTwo: data.restaurants[i].restaurant.average_cost_for_two,
                  restHours: data.restaurants[i].restaurant.timings
                };
                if (i===4) {
                    break;
                };
                
           //console.log(data.cuisines[i].cuisine.cuisine_name,"-"+data.cuisines[i].cuisine.cuisine_id);
            };
            console.log(restaurant);
            generateRestaurantCard(restaurant);
          });
        } else {
            alert("Error: " + response.statusText);
        }
    })
    .catch(function(error) {
            alert("Unable to get data");
    });
    
};

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
    if(navigator.geolocation) 
    {
        getLocation()
            .then(function(location)
            {
                userLocation.latitude = location.coords.latitude;
                userLocation.longitude = location.coords.longitude;
                return getWeatherData();
            })
            .then(function(response) 
            {
                if(response.ok)
                {
                    return response.json();
                } 
                else 
                {
                    alert("Error:" + response.statusText); // TO-DO: need to convert this to a modal
                }
            })
            .then(function(data) 
            {
                if(!data)
                {
                    return;
                }
                data.daily.map((item, ind) => {
                    var tempDate = getDateFromTimeStamp(item.dt, data.timezone_offset);
                    if (tempDate === date) {
                        // console.log(item.temp.eve, item.weather[0].description, item.weather[0].icon, ind);
                        temperature = item.temp.eve;
                        generateWeatherCard(item.temp.eve, item.weather[0].description, item.weather[0].icon);
                    }
                });
                // generateWeatherCard()
                loadingModalInstance.close();
                console.log("Weather Data", data);
                //NOT SURE IF THIS IS WHERE IT SHOULD GO<< BUT PLACING HERE FOR NOW
                getRestaurantData();


                // return getWeatherData();
            })
            // .then(function(response) 
            // {
            //     if(response.ok)
            //     {
            //         return response.json();
            //     } 
            //     else 
            //     {
            //         alert("Error:" + response.statusText); // TO-DO: need to convert this to a modal
            //     }
            // })
            // .then(function(data) 
            // {
            //     if(!data)
            //     {
            //         return;
            //     }
            //     console.log("Weather Data", data);
            //     document.location.replace("./dateresults.html"+"?username="+userName+"&date="+date+"&mood="+mood);
            // })
            .catch(error => console.log(error));
    }       
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
$(document).ready(function()
{
    $('.modal').modal(); // initialize modal
    // open loading modal with spinner
    loadingModalInstance = M.Modal.getInstance($('#loadingModal')); 
    loadingModalInstance.options.dismissible = false;
    loadingModalInstance.open();
}); 

displayResults();

// getMovieData();
nextBtnEl.addEventListener("click", nextBtnHandler);
saveBtnEl.addEventListener("click", addToList);


