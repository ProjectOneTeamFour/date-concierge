// DOM element selectors
var submitFromEl = document.querySelector("#submit-form");
var userNameEl = document.querySelector("#user-name");
var dateEl = document.querySelector("#date");
var moodEl = document.querySelector("#mood");

// Variables
var userName = '';
var date = '';
var mood = '';
var lat = '';
var lon = '';

var today = new Date(); // for datepicker 
var nextWeek = new Date(today); // for datepicker 
nextWeek.setDate(nextWeek.getDate() + 7);

// performs validation check on user inputs (name, date and mood)
var performValidation = function()
{
    var errMsg = ""; // initialize error message 
    var elementList = []; // stores DOM elements with invalid inputs

    // check if user name is empty
    if ( userName === "" ) {
        errMsg += "<li>User name cannot be empty</li>";
        elementList.push(userNameEl);
    }

    // check if date input is invalid

    var datecheck = moment(date, "mm-dd-yyyy").toDate();

    if (!Date.parse(datecheck)){
        errMsg += "<li>Date is not valid</li>";
        elementList.push(dateEl);
    }

    // check if no mood option is selected
    if ( mood === "" ) {
        errMsg += "<li>Please select a mood type from the dropdown list</li>";
        elementList.push(moodEl);
    }

    return {
        errMsg: errMsg,
        elementList: elementList
    }
}

// form submit button handler
var getAttribute = function(event)
{
    event.preventDefault(); // prevents default behaviour (i.e. page refresh)

    // Obtain user inputs (name, date and mood)
    userName = userNameEl.value;
    date = dateEl.value;
    mood = moodEl.value;

    // check if user inputs are valid (name, date and mood)
    var validationResult = performValidation();
    
    // show error message for invalid inputs, otherwise collect user location info
    if ( validationResult.errMsg !== "" ) 
    {
        showMessage(validationResult.errMsg);
        clearInputs(validationResult.elementList);
    } 
    else 
    {
        // if "Your location" option is selected, then use Geolocation API to obtain user location
        // otherwise use "GeoApify" API to obtain user location based on city, country 
        if($('#GPS').is(':checked')) 
        { 
            getYourCoordinates();
        }

        if($('#cityRB').is(':checked')) 
        {
            getCityCoordinates($("#city-name").val());
        }
    }
};

// displays a modal with error messages 
var showMessage = function(msg) 
{
    // populate message container with msg
    $("#message") 
        .empty()
        .html(msg);
    
    messageModalInstance.open(); // display message modal
}

// clears input fields
var clearInputs = function (elementArr)
{
    elementArr.map( item => {
        item.value = "";
    });
}

// calls Geolocation API and returns a promise
var getYourLocation = function() 
{
    return new Promise(function(resolve, reject) 
    {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
}

// obtains user location using Geolocation API
var getYourCoordinates = function()
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
            })
            .catch(function(error)
            {
                showMessage("Could not obtain location info!");
            });
    }
}

// obtain user location based on city names
var getCityCoordinates = function(country)
{
    var geocoderURL = 'https://api.geoapify.com/v1/geocode/search?text='+encodeURIComponent(country)+'&apiKey=66581d18c13944d7b6795dd99dccd7a2';
    if(country === '')
    {
        showMessage("City name cannot be empty!");
    }
    else
    {
        fetch(geocoderURL)
        .then(function(response)
        {
            response.json().then(function(data)
            {
                if(data.features[0])
                {
                    lat = data.features[0].properties.lat;
                    lon = data.features[0].properties.lon;
                    changePage();
                }
                else //if searched city not available
                {
                    showMessage("Please enter a valid city name");
                }
            })
            

        })
        .catch(function(error)
        {
            showMessage("Cannot connect to the server");
        });
    }
};

var changePage = function()
{
    document.location.replace("./dateresults.html"+"?username="+userName+"&date="+date+"&mood="+mood+"&lat="+lat+"&lon="+lon);
};

// // Initialize datepicker
// $("#date").datepicker(
// {
//     format: "mm-dd-yyyy",
//     minDate : today,
//     maxDate : nextWeek
// });

// handles radio button functionality
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

$(document).ready(function()
{
    $('.modal').modal(); // initialize modal
    
    // Initialize datepicker
    $("#date").datepicker(
    {
        format: "mm-dd-yyyy",
        minDate : today,
        maxDate : nextWeek
    });
    // Get an instance of message modal
    messageModalInstance = M.Modal.getInstance($('#homepageMessageModal'));
    messageModalInstance.options.dismissible = false;
    
}); 

// Initialize select input field
$('select').formSelect();

submitFromEl.addEventListener("submit", getAttribute);