var submitFromEl = document.querySelector("#submit-form");
var userNameEl = document.querySelector("#user-name");
var dateEl = document.querySelector("#date");
var moodEl = document.querySelector("#mood");

var userName = '';
var date = '';
var mood = '';

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

var changePage = function(event)
{
    event.preventDefault();

    // console.log(moodEl);
    userName = userNameEl.value;
    date = dateEl.value;
    mood = moodEl.value;

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
        document.location.replace("./dateresults.html"+"?username="+userName+"&date="+date+"&mood="+mood);
    }
    
    // if(userName && date && mood) 
    // {
    //     document.location.replace("./dateresults.html"+"?username="+userName+"&date="+date+"&mood="+mood);
    // } 
    // else 
    // {
    //     console.log("error"); // replace with forum
    // }
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

$(document).ready(function()
{
    $('.modal').modal(); // initialize modal
    // Get an instance of message modal
    messageModalInstance = M.Modal.getInstance($('#homepageMessageModal'));
    messageModalInstance.options.dismissible = false;
    
}); 

// Initialize select
$('select').formSelect();

submitFromEl.addEventListener("submit", changePage);