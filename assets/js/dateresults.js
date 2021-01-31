// DOM element selectors
var nextBtnEl = document.querySelector("#next-btn");
var saveBtnEl = document.querySelector("#save-btn");
var movieMapContainerEl = document.querySelector("#movie-or-map-container");
var restaurantContainerEl = document.querySelector("#restaurant-info");
var favListEl = document.querySelector("#fav-list");
var menuHeader = document.querySelector("#menu-header");
var menuIntroText = document.querySelector("#menu-text");
var movieHeader = document.querySelector("#movie-header");
var movieIntroText = document.querySelector("#movie-text");
var introText = document.querySelector("#intro-paragraph");

var loadingModalInstance;
var messageModalInstance;

//API Keys
const ZOMATO_API_KEY = "4f647c578e863a28146038bc9b68f278";
const OWM_API_KEY = "ce455bd02a51e6ea3ab658a42367d8f2";
const TMDB_API_KEY = "5733f541d83befd903f222e59340f8b2";


// Extract parameters
var params = (new URL(document.location)).searchParams;
var username = params.get('username');
var date = params.get('date');
var mood = params.get('mood');
var latAttribute = parseFloat(params.get('lat'));
var lonAttribute = parseFloat(params.get('lon'));
var restCount = 0;


//variables
var userLocation = {
latitude:latAttribute,
longitude:lonAttribute
}; // stores user location

var genreList;
var temperature = "";
var controlTemp = 10;
var inOrOut = "DINE OUT";

var myFavList = [];

var fav =
{
    mood:"",
    restaurant:
    {
        img:"",
        name:"",
        inOrOut:"",
        address:"",
        cuisine:"",
        costForTwo:"",
        hours:"",
        phone:"",
        restLat:"",
        restLng:""
    }, 

    movie:
    {
        title :"",
        rate:"",
        genre:"",
        releaseDate:"",
        overview:"",
        img:""
    }

};



// helper function to format unix timestamp
let getDateFromTimeStamp = function(timeStamp, timezoneOffset, dateFormat) {
    return moment.unix(timeStamp + timezoneOffset).utc().format(dateFormat);
}

// helper function to capitalize first letter
var capitalizeFirstLetter = function(txt) {
    return txt.charAt(0).toUpperCase() + txt.slice(1)
}

//get weather data
//input : coordinates , date 
//output: tempreture
var getWeatherData = function() 
{
    let urlForecast = `https://api.openweathermap.org/data/2.5/onecall?lat=${parseFloat(userLocation.latitude)}&lon=${parseFloat(userLocation.longitude)}&units=metric&exclude=minutely,hourly,alerts&appid=${OWM_API_KEY}`;
    return fetch(urlForecast);
}

var generateIntroText = function () {
    if (inOrOut === "DINE OUT") {
        introText.textContent ="Grab your stuff, get all dressed up. Why? Because, we're hitting the town. Based on the weather in your city, we think it'd be a great night for you and your date to venture out in your city. Head to the restaurant. Then try a romantic walk around a near by park, see what movies are playing at a theatre near you. We've got you off to a great start. Where the rest of the night takes you... well, that's up to you!"
       } else {
        introText.textContent ="Ready to hunker down for the night? Based on the upcoming forecast, we think your date night would be best spent ordering in. Once you're done with dinner, get cuddly on the couch. Where the night takes you from there... well, that's up to you!"
       }
}

var generateWeatherCard = function(temperature, weatherDescription, weatherIcon, formattedDate) { 
    var cardEl = $("<div>")
        .addClass("card")
        .attr("id", "weather-card")
        .html(`
            <div class="card-panel">
                <h4>The forecast for ${formattedDate} </h4>
                <p> ${capitalizeFirstLetter(weatherDescription)}, with a chance of romance.</p>
                <div id="current-weather">
                    <div class="row">
                        <div class="col s5">
                            <img
                                src="https://openweathermap.org/img/wn/${weatherIcon}@2x.png"
                                alt=${weatherDescription}
                            </img>
                        </div>
                        <div class="col s7" id="div-temperature">
                            <span>${parseFloat(temperature).toFixed(0)}°C</span>
                        </div>
                    </div>
                </div>
            </div>
        `);
    
    $("#weather-container")
        .empty()
        .append(cardEl);
}

var generateMapCard = function(restLat, restLng) { 
    var lat = userLocation.latitude;
    var lng = userLocation.longitude;

    movieHeader.innerText = "Here's where you're heading"
    movieIntroText.innerText = "We wouldn't want you to get lost. Here are directions to the restaurant."
    var cardEl = $("<div>")
        //.addClass("card-content")
        .attr("id", "Map-Card")
        .html(`
            <div class="card-panel">
            <iframe src="https://www.google.com/maps/embed?pb=!1m26!1m12!1m3!1d11535.357946040902!2dv${restLng}!3d${restLat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1
            !4m11!3e6!4m4!2s${lat}%2C%20${lng}!3m2!1d${lat}!2d${lng}!4m4!2s${restLat}%2C$${restLng}!3m2!1d${restLat}!2d${restLng}!5e0!3m2!1sen!2sca!4v1611684305916
            !5m2!1sen!2sca" width="400px" height="520px" frameborder="0" style="border:0;" allowfullscreen="" aria-hidden="false" tabindex="0"></iframe>
        `);
    
    $("#movie-or-map-container")
        .empty()
        .append(cardEl);
}

var generateRestaurantCard = function(restaurant) { 
    restaurantContainerEl.innerHTML = '';

     //hayley add
    if (inOrOut === "DINE OUT") {
        menuIntroText.textContent ="Let's hit the town. Grab your phone, make a reservation and we're off."
    } else {
        menuIntroText.textContent ="Let's stay in. Get Cozy, and grab your phone. We're ordering takeout."
    }
    //end of add
    
    var x = Math.floor(Math.random() * (restaurant.length));
    if (restaurant[x].restImg) {
        var imageEl = document.createElement("img");
        imageEl.src = restaurant[x].restImg;
        imageEl.setAttribute("id", "restImg");

        var restNameEl = document.createElement("span");
        restNameEl.textContent =restaurant[x].restName;
        restNameEl.setAttribute("id", "restName");
        restNameEl.className = "card-title";

        var inOrOutEl = document.createElement("p");
        inOrOutEl.setAttribute("id", "restInOrOut");
        inOrOutEl.textContent =inOrOut;

        var addressEl = document.createElement("p");
        addressEl.setAttribute("id", "restAddress");
        addressEl.textContent =restaurant[x].address;

        var cuisineEl = document.createElement("p");
        cuisineEl.setAttribute("id", "restCuisine");
        cuisineEl.textContent =restaurant[x].cuisine;

        var costForTwoEl = document.createElement("p");
        costForTwoEl.setAttribute("id", "restCostForTwo");
        costForTwoEl.textContent ="Average cost for 2: $" + restaurant[x].costForTwo;

        var hoursEl = document.createElement("p");
        hoursEl.setAttribute("id", "restHours");
        hoursEl.textContent =restaurant[x].restHours;

        var phoneEl = document.createElement("p");
        phoneEl.setAttribute("id", "restHours");
        phoneEl.textContent =restaurant[x].phone;

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
        restDetailsEl.appendChild(phoneEl);

        fav.restaurant.img  = restaurant[x].restImg;  
        fav.restaurant.name = restaurant[x].restName;
        fav.restaurant.inOrOut = inOrOut;
        fav.restaurant.address = restaurant[x].address;
        fav.restaurant.cuisine =restaurant[x].cuisine;
        fav.restaurant.costForTwo ="Average cost for 2: $" + restaurant[x].costForTwo;
        fav.restaurant.hours =restaurant[x].restHours;
        fav.restaurant.phone =restaurant[x].phone;
        fav.restaurant.restLat=restaurant[x].restLat;
        fav.restaurant.restLng=restaurant[x].restLng;


        restaurantContainerEl.appendChild(restImgEl);
        restaurantContainerEl.appendChild(restDetailsEl);
        $("#restImg").css({
            "max-width":"100%",
            "max-height":"100%"
        });
        if (inOrOut === "DINE OUT"){
            generateMapCard(restaurant[x].restLat, restaurant[x].restLng);
        };  
    } else {
        if (restCount>19){
            
            showMessage("No Restuarants in your area available. Please change location.", true);
            
        }
        restCount++;
        console.log(mood, restCount);
        getRestaurantData();
    };
      
}

//get types of restaurants and movies based on the mood
//input : user mood
//output: movie category , food type
var getMoodTypes = function() 
{
    var adventurous = 
    {
        genres : ["Action","Adventure","Crime","Documentary","History","Horror","Mystery","Science Fiction","Thriller","War","Western","Drama","Fantasy"],
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


//get restaurants data
//input : coordinates, food type
//output: All restaurant data
var getRestaurantData = function() 
{
    var restaurant = [{restName:"", cuisine:"", address:"", restImg:"", costForTwo:"", restHours:"", restLat:"", restLng:"", phone:""}];
    var lat = userLocation.latitude;
    var lng = userLocation.longitude;
    if (restCount>9){
        mood = "spontaneous";
    }
    var cuisine = getMoodTypes().cuisine;
    var cuisineID = cuisine.split("-");
    var searchRadius = 500000;
    
    var url = `https://developers.zomato.com/api/v2.1/search?entity_type=metro&lat=${lat}&lon=${lng}&radius=${searchRadius}&cuisines=${cuisineID}&sort=rating`;
    
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
            //displayCuisine(data);
            console.log(data);
            for(var i =0; i < data.restaurants.length; i++){
                restaurant[i] = {
                  restName: data.restaurants[i].restaurant.name,
                  cuisine: data.restaurants[i].restaurant.cuisines,
                  address: data.restaurants[i].restaurant.location.address,
                  restImg: data.restaurants[i].restaurant.featured_image,
                  costForTwo: data.restaurants[i].restaurant.average_cost_for_two,
                  restHours: data.restaurants[i].restaurant.timings,
                  restLat: data.restaurants[i].restaurant.location.latitude,
                  restLng: data.restaurants[i].restaurant.location.longitude,
                  phone: data.restaurants[i].restaurant.phone_numbers
                };
                if (i===4) {
                    break;
                };
            };
            generateRestaurantCard(restaurant);
          });
        } else {
            showMessage("Error: " + response.statusText, true);
        }
    })
    .catch(function(error) {
        if(loadingModalInstance){
            loadingModalInstance.close();
        }
        showMessage("Unable to get data", true);
    });
};

//get movie data
//input : movie category
//output: All movie data
var getMovieData = function() 
{
    //placed this here so its not created if the weather is triggered
    if (temperature < controlTemp){
        // inOrOut = "STAY IN";
        var movieGenre = getMoodTypes().genre;
        fetch("https://api.themoviedb.org/3/genre/movie/list?api_key="+ TMDB_API_KEY +"&language=en-US")
        .then(function(response)
        {
            return response.json()
        })
        .then(function(data)
        {
            var genres = data.genres;
            var pageNo = Math.floor(Math.random() * (50))+1;
            for(var i =0; i<genres.length; i++)
            {
                if (genres[i].name === movieGenre)
                {
                    return fetch("https://api.themoviedb.org/3/discover/movie?api_key="+ TMDB_API_KEY +
                                "&with_genres="+ genres[i].id +
                                "&with_original_language=en" +
                                "&include_adult=exclude" +
                                "&sort_by=popularity.desc" +
                                "&vote_average.gte=6"+
                                "&page=" + pageNo +
                                "&primary_release_date.gte=1990-01-01");
                }
            }
        })
        .then(function(response)
        {
            return response.json();
        })
        .then(function(data)
        {
            movieHeader.innerText = "Now playing"
            movieIntroText.innerText = "Grab the popcorn. Hit the couch. And snuggle in for this great flick."


            var x = Math.floor(Math.random() * (data.results.length));
            var movie = data.results[x];

            var imageEl = document.createElement("img");
            imageEl.id = "movie-img";
            var imgURL =  movie.poster_path || movie.backdrop_path;
            // while(!imgURL)
            // {
            //     x = Math.floor(Math.random() * (data.results.length));
            //     movie = data.results[x];
            //     imgURL =  movie.poster_path || movie.backdrop_path;
            // }
            console.log(imgURL,movie.poster_path,movie.backdrop_path);
            imageEl.src = "https://image.tmdb.org/t/p/w200" + imgURL;


            var titleEl = document.createElement("span");
            titleEl.id = "movie-title";
            titleEl.classList = "card-title";
            titleEl.textContent =movie.title;

            var voteEl = document.createElement("p");
            voteEl.id = "movie-vote";
            voteEl.textContent ="Rating: " + movie.vote_average + "/10";

            var genreEl = document.createElement("p");
            genreEl.id = "movie-genre";
            genreEl.textContent ="Genre:";
            genreList = movie.genre_ids;

            var releaseDateEl = document.createElement("p");
            releaseDateEl.id = "movie-releaseDate"
            releaseDateEl.textContent ="Release Date: " + movie.release_date;     
            
            var overviewEl = document.createElement("p");
            overviewEl.id = "movie-overview";
            overviewEl.textContent ="Overview: " +movie.overview;

            var movieImgEl = document.createElement("div");

            movieImgEl.className= "card-image";
            movieImgEl.appendChild(imageEl);

            var movieDetailsEl = document.createElement("div");
            movieDetailsEl.className = "card-content";

            movieDetailsEl.appendChild(titleEl);
            movieDetailsEl.appendChild(releaseDateEl);
            movieDetailsEl.appendChild(genreEl);
            movieDetailsEl.appendChild(voteEl);
            movieDetailsEl.appendChild(overviewEl);

            movieMapContainerEl.appendChild(movieImgEl);
            movieMapContainerEl.appendChild(movieDetailsEl);

            fav.movie.title = movie.title;
            fav.movie.rate = "Rating: " + movie.vote_average + "/10";
            fav.movie.releaseDate = "Release Date: " + movie.release_date; 
            fav.movie.overview ="Overview: " +movie.overview;
            fav.movie.img ="https://image.tmdb.org/t/p/w200" + imgURL;

            return fetch("https://api.themoviedb.org/3/genre/movie/list?api_key="+ TMDB_API_KEY +"&language=en-US");
        })
        .then(function(response)
        {
            return response.json()
        })
        .then(function(data)
        {
            var movieGenreNames = "";
            var allGenres = data.genres;
            for(var i =0; i<genreList.length; i++)
            {
                for(var j =0; j<allGenres.length; j++)
                {
                    if (genreList[i] === allGenres[j].id)
                    {
                        movieGenreNames += " " + allGenres[j].name+",";
                        break;
                    }
                }
            }

            var genreEl= document.querySelector("#movie-genre")
            genreEl.textContent += movieGenreNames;
            fav.movie.genre = genreEl.textContent;

        });
    };
}


// choose indoor or outdoor then display the results
var displayResults = function() 
{
    getWeatherData()
        .then(function(response) 
        {
            if(response.ok)
            {
                return response.json();
            } 
            else 
            {
                showMessage("Error: " + response.statusText, true);
            }
        })
        .then(function(data) 
        {
            if(!data)
            {
                return;
            }
            // Populate weather data
            data.daily.map((item, ind) => 
            {
                var tempDate = getDateFromTimeStamp(item.dt, data.timezone_offset, "MM-DD-YYYY");
                if (tempDate === date) 
                {
                    temperature = item.temp.eve;
                    var formattedDate = getDateFromTimeStamp(item.dt, data.timezone_offset, "dddd MMM DD, YYYY");
                    generateWeatherCard(item.temp.eve, item.weather[0].description, item.weather[0].icon, formattedDate);
                    if(temperature < controlTemp)
                    {
                        inOrOut = "STAY IN"
                        getMovieData();
                    }
                    else
                    {
                        inOrOut = "DINE OUT"
                    }
                }
            });
            loadingModalInstance.close();

            //NOT SURE IF THIS IS WHERE IT SHOULD GO<< BUT PLACING HERE FOR NOW (CURTIS)
            getRestaurantData();

            //not sure if this is where it should go, but here it is for now.
            generateIntroText();
        })
        .catch(function(error)
        {
            loadingModalInstance.close();
            showMessage("Could not complete operation", true);
        });
     
}

// show next movie and restaurant
var nextBtnHandler = function()
{
    movieMapContainerEl.innerHTML ="";
    var headerEl = document.querySelector(".main-section-copy");
    headerEl.style.display ="block";
    var weatherEl = document.querySelector("#weather-container");
    weatherEl.style.display ="block";

    var historyEl = document.querySelector("#history");
    historyEl .style.display ="none";
    getMovieData();
    getRestaurantData();
}

//save list
var addToList = function()
{

    loadFavList();
    fav.mood = mood;
    myFavList.unshift(fav);

    saveFavlist();
    showMessage("Woo hoo! We've added this date night suggestion to your ♥ List!");
}


var showFavList = function()
{
    loadFavList();
    
    if (myFavList)
    {
        favListEl.innerHTML = "";
        for(var i =0; i <myFavList.length;i++)
        {
            var favContEl = document.createElement("div");
            favContEl.classList = "col";
            var btnContEl = document.createElement("div");
            btnContEl.classList = "col right modal-btn";

            var moodEl = document.createElement("h5");
            moodEl.textContent = myFavList[i].mood[0].toUpperCase() + myFavList[i].mood.slice(1,mood.length) + " Date" //change mood from localstorage

            var dinnerEl = document.createElement("p");
            dinnerEl.textContent = "Dinner: " + myFavList[i].restaurant.name;

            var movieEl = document.createElement("p");
            if(myFavList[i].movie.title)
            {
                movieEl.textContent = "Movies: " +  myFavList[i].movie.title;
            }

            var seeDetailsBtnEl = document.createElement("button");
            seeDetailsBtnEl.setAttribute("fav-date-id", i);
            seeDetailsBtnEl.name = "seeDetailsBtn";
            seeDetailsBtnEl.textContent = "See the details";
            seeDetailsBtnEl.classList.add("waves-effect", "waves-light", "btn", "nav-button-background", "m-2px-lr");

            var deleteBtnEl = document.createElement("button");
            deleteBtnEl.setAttribute("fav-date-id", i);
            deleteBtnEl.name = "deleteBtn";
            deleteBtnEl.textContent = "Delete";
            deleteBtnEl.classList.add("waves-effect", "waves-light", "btn", "nav-button-background", "m-2px-lr");
        
            var favEl = document.createElement("li");
            favEl.classList = "collection-item row";

            favContEl.appendChild(moodEl);
            favContEl.appendChild(dinnerEl);
            favContEl.appendChild(movieEl);
            btnContEl.appendChild(seeDetailsBtnEl);
            btnContEl.appendChild(deleteBtnEl);

            favEl.appendChild(favContEl);
            favEl.appendChild(btnContEl);
    
            favListEl.appendChild(favEl);
        }
    }
    else
    {
        favListEl.innerHTML = "You do not have any saved dates yet.";
    }
}

var favListBtnHandler = function(event)
{
    var target = event.target;
    if(target.matches("[name='seeDetailsBtn']"))
    {
        var id =target.getAttribute('fav-date-id');

        //restaurants
        var restImageEl = document.querySelector("#restImg");
        restImageEl.src = myFavList[id].restaurant.img;
        var restNameEl = document.querySelector("#restName");
        restNameEl.textContent = myFavList[id].restaurant.name;
        var inOrOutEl = document.querySelector("#restInOrOut");
        inOrOutEl.textContent =  myFavList[id].restaurant.inOrOut;
        var addressEl = document.querySelector("#restAddress");
        addressEl.textContent = myFavList[id].restaurant.address;
        var cuisineEl = document.querySelector("#restCuisine");
        cuisineEl.textContent = myFavList[id].restaurant.cuisine;
        var costForTwoEl = document.querySelector("#restCostForTwo");
        costForTwoEl.textContent =myFavList[id].restaurant.costForTwo ;
        var hoursEl = document.querySelector("#restHours");
        hoursEl.textContent = myFavList[id].restaurant.hours;

        //movies
        var movieContainerEl = document.querySelector("#movie-or-map-container");
        var cardImageEl = document.querySelector("#card-image");
        var cardcontEl = document.querySelector("#card-content");
        var mapCardEl = document.querySelector("#Map-Card");



        if(myFavList[id].movie.title) //if this indoor date
        {
            console.log("If mapCardEl",mapCardEl);
            if(mapCardEl)
            {
                mapCardEl.style.display ="none";   
            }

            console.log("If cardImageEl",cardImageEl);
            if (cardImageEl)
            {
                cardImageEl.style.display ="block";
                cardcontEl.style.display ="block";
                var movieImageEl = document.querySelector("#movie-img");
                var titleEl = document.querySelector("#movie-title");
                var voteEl = document.querySelector("#movie-vote");
                var genreEl= document.querySelector("#movie-genre");
                var releaseDateEl = document.querySelector("#movie-releaseDate");
                var overviewEl = document.querySelector("#movie-overview");
            }
            else
            {
                var cardImageEl = document.createElement('div');
                cardImageEl.id = 'card-image';
                cardImageEl.className = 'card-image';
                var movieImageEl = document.createElement('img');
                movieImageEl.id = 'movie-img';
                cardImageEl.appendChild(movieImageEl);
    
                var cardContentEl = document.createElement('div');
                cardContentEl.id = 'card-content';
                cardContentEl.className = 'card-content';
                var titleEl = document.createElement('span');
                titleEl.id = 'movie-title';
                titleEl.className = "movie-title";
                var voteEl = document.createElement('p');
                voteEl.id="movie-vote";
                var genreEl= document.createElement('p');
                genreEl.id="movie-genre";
                var releaseDateEl = document.createElement('p');
                releaseDateEl.id="movie-releaseDate";
                var overviewEl = document.createElement('p');
                overviewEl.id="movie-overview";

                cardContentEl.appendChild(titleEl);
                cardContentEl.appendChild(voteEl);
                cardContentEl.appendChild(genreEl);
                cardContentEl.appendChild(releaseDateEl);
                cardContentEl.appendChild(overviewEl);
    
                movieContainerEl.appendChild(cardImageEl);
                movieContainerEl.appendChild(cardContentEl);         
            }
            movieImageEl.src = myFavList[id].movie.img;
            titleEl.textContent = myFavList[id].movie.title;
            voteEl.textContent =myFavList[id].movie.rate;
            genreEl.textContent =myFavList[id].movie.genre;
            releaseDateEl.textContent = myFavList[id].movie.releaseDate;
            overviewEl.textContent =myFavList[id].movie.overview;
        }
        else
        {
            console.log("Else cardImageEl",cardImageEl);
            if(cardImageEl)
            {
                cardImageEl.style.display ="none";
                cardcontEl.style.display ="none";
            }   
            console.log("Else mapCardEl",mapCardEl);
            if(mapCardEl)
            {
                mapCardEl.style.display ="block";   
            }
            generateMapCard(myFavList[id].restaurant.restLat, myFavList[id].restaurant.restLng);
        }

        var headerEl = document.querySelector(".main-section-copy");
        headerEl.style.display ="none";
        var weatherEl = document.querySelector("#weather-container");
        weatherEl.style.display ="none";

        var historyEl = document.querySelector("#history");
        historyEl.style.display ="block";
        historyEl.innerHTML = "";

        var historyContentEl = document.createElement("h2");
        historyContentEl.textContent = "Favorite "+ myFavList[id].mood +":";
        historyEl.appendChild(historyContentEl);

        lovelistModalInstance = M.Modal.getInstance($('#lovelistmodal')); 
        lovelistModalInstance.close();
    }


    else if(target.matches("[name='deleteBtn']"))
    {
        var id =target.getAttribute('fav-date-id');
        myFavList.splice(id,1);
        saveFavlist();
        showFavList();
    }
};

var loadFavList = function ()
{
    myFavList = localStorage.getItem("myFavList");
    if(myFavList)
    {
        myFavList = JSON.parse(myFavList); 
    }
    else
    {
        myFavList = [];
    }
} 

var saveFavlist = function()
{
    localStorage.setItem("myFavList", JSON.stringify(myFavList));
}

// initialize page view
var initializePageView = function() 
{
    loadFavList();
    $("#user-name").text(username);
        displayResults();
}

var showMessage = function(msg, err = false) 
{
    // populate message container with msg
    $("#message") 
        .empty()
        .text(msg);
    
    // update color class
    $("#messageModal")
        .removeClass("color-error color-success")
        .addClass(err ? "color-error" : "color-success");
    
    messageModalInstance.open(); // display message modal
    setTimeout(function(){
        messageModalInstance.close(); // close message modal
        if (err) {
            document.location.replace("./index.html");
        }
    }, 2000); 
}

//open Modal

$(document).ready(function()
{
    $('.modal').modal(); // initialize modal
    
    $('.sidenav').sidenav(); // initialize sidenav

    // Get an instance of message modal
    messageModalInstance = M.Modal.getInstance($('#messageModal'));
    messageModalInstance.options.dismissible = false;
    
    // open loading modal with spinner
    loadingModalInstance = M.Modal.getInstance($('#loadingModal')); 
    loadingModalInstance.options.dismissible = false;
    loadingModalInstance.open();
}); 

// Favourite list Navbar link click event handler
var favListClickEventHandler = function(event) 
{
    event.preventDefault();
    showFavList();
    $('.modal').modal(); // initialize modal
    lovelistModalInstance = M.Modal.getInstance($('#lovelistmodal')); 
    lovelistModalInstance.options.dismissible = true;
    lovelistModalInstance.open();
}

// Change details navbar link click event handler
var changeInputClickEventHandler = function(event) 
{
    event.preventDefault();
    document.location.replace("./index.html"); 
}

$('#fav-list-nav').click(favListClickEventHandler);
$('#fav-list-nav-sidenav').click(favListClickEventHandler);

$('#change-input').click(changeInputClickEventHandler);
$('#change-input-sidenav').click(changeInputClickEventHandler);

nextBtnEl.addEventListener("click", nextBtnHandler);
saveBtnEl.addEventListener("click", addToList);
favListEl.addEventListener('click',favListBtnHandler);

initializePageView();