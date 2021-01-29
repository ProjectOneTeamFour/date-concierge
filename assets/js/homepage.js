var submitFromEl = document.querySelector("#submit-form");
var userNameEl = document.querySelector("#user-name");
var dateEl = document.querySelector("#date");
var moodEl = document.querySelector("#mood");

var userName = '';
var date = '';
var mood = '';
var lat = '';
var lon = '';

var getAttribute = function(event)
{
    event.preventDefault();

    userName = userNameEl.value;
    date = dateEl.value;
    mood = moodEl.value;

    if($('#GPS').is(':checked')) 
    { 
        getYourCordinates();
    }

    if($('#cityRB').is(':checked')) 
    {
        getCityCoordinates($("#city-name").val());
    }
};


var getYourCordinates = function()
{
    if(navigator.geolocation) 
    {
        getYourLocation()
            .then(function(location)
            {
                lat = location.coords.latitude;
                lon = location.coords.longitude;
                console.log(lat , lon);
                changePage();
            });
    }
}

var getYourLocation = function() 
{
    return new Promise(function(resolve, reject) 
    {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
}

var getCityCoordinates = function(country)
{
    var weatherURL = "https://api.openweathermap.org/data/2.5/weather?appid=274cbbc7cb2cf2adbf2edf074233aaec&q=" + country;
    fetch(weatherURL)
        .then(function(response)
        {
            if(response.ok) //if city available
            {
                response.json().then(function(data)
                {
                    lat = data.coord.lat; //get city altitude 
                    lon = data.coord.lon; //get city logtitude
                    changePage();
                })
            }
            else //if searched city not available
            {
                console.log("Please enter a valid city");
            }
        })
        .catch(function(error)
        {

        })
};

var changePage = function()
{
    if(userName && date && mood && lat && lon) 
    {
        // console.log(userName, date, mood, lat, lon);
        document.location.replace("./dateresults.html"+"?username="+userName+"&date="+date+"&mood="+mood+"&lat="+lat+"&lon="+lon);
    } 
    else 
    {
        console.log("error"); // replace with forum
    }
}


var today = new Date();
var nextWeek = new Date(today);
nextWeek.setDate(nextWeek.getDate() + 7);
// Initialize datepicker
$("#date").datepicker(
{
    format: "mm-dd-yyyy",
    minDate : today,
    maxDate : nextWeek,
    // autoclose: true
    onSelect: function(date) 
    {
      
    }
});


$('#cityRB').click(function() 
{
    if($('#cityRB').is(':checked')) 
    { 
        $("#city-name").prop('disabled', false);
    }
 });

 $('#GPS').click(function() 
{
    if($('#GPS').is(':checked')) 
    { 
        $("#city-name").prop('disabled', true);
        $("#city-name").val("");
    }
});

// Initialize select
$('select').formSelect();

submitFromEl.addEventListener("submit", getAttribute);