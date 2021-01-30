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

var showMessage = function(msg) 
{
    // populate message container with msg
    $("#message") 
        .empty()
        .html(msg);
    
    messageModalInstance.open(); // display message modal
}

var clearInputs = function (elementArr)
{
    elementArr.map( item => {
        item.value = "";
    });
}

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
    var geocoderURL = 'https://api.geoapify.com/v1/geocode/search?text='+country+'&apiKey=66581d18c13944d7b6795dd99dccd7a2';
    if(country==='')
    {
        showMessage("City name cannot be empty");
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
                    // console.log(data.features[0].properties.formatted)
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

var changePage = function(event)
{
    // Validation
    var errMsg = ""; // initialize error message 
    var elementList = []; // initialize DOM elements to be reset

    if ( userName === "" ) {
        errMsg += "User name cannot be empty<br />";
        elementList.push(userNameEl);
    }

    if (!moment(date).isValid()){
        errMsg += "Date is not valid<br />";
        elementList.push(dateEl);
    }

    if ( mood === "" ) {
        errMsg += "Please select a mood type from the dropdown list<br />";
        elementList.push(moodEl);
    }
    
    if ( errMsg !== "" ) {
        showMessage(errMsg);
        clearInputs(elementList);
    } else {
        document.location.replace("./dateresults.html"+"?username="+userName+"&date="+date+"&mood="+mood+"&lat="+lat+"&lon="+lon);
    }
    
};

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
    // onSelect: function(date) 
    // {
      
    // }
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

$(document).ready(function()
{
    $('.modal').modal(); // initialize modal
    // Get an instance of message modal
    messageModalInstance = M.Modal.getInstance($('#homepageMessageModal'));
    messageModalInstance.options.dismissible = false;
    
}); 

// Initialize select
$('select').formSelect();

submitFromEl.addEventListener("submit", getAttribute);