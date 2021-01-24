var submitFromEl = document.querySelector("#submit-form");
var userNameEl = document.querySelector("#user-name");
var dateEl = document.querySelector("#date");
var moodEl = document.querySelector("#mood");

var userName = '';
var date = '';
var mood = '';

var changePage = function(event)
{
    event.preventDefault();

    console.log(moodEl);
    userName = userNameEl.value;
    date = dateEl.value;
    mood = moodEl.value;

    console.log(userName,date,mood);
    
    if(userName && date && mood) 
    {
        document.location.replace("./dateresults.html"+"?username="+userName+"&date="+date+"&mood="+mood);
    } 
    else 
    {
        console.log("error"); // replace with forum
    }
};

// Initialize datepicker
$("#date").datepicker(
{
    format: "dd-mm-yyyy",
    minDate : new Date(),
});

// Initialize select
$('select').formSelect();

submitFromEl.addEventListener("submit", changePage);



