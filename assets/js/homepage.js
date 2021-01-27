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

var today = new Date();
var nextWeek = new Date(today);
nextWeek.setDate(nextWeek.getDate() + 7);
// Initialize datepicker
$("#date").datepicker(
{
    format: "dd-mm-yyyy",
    minDate : today,
    maxDate : nextWeek,
    // autoclose: true
    onSelect: function(date) 
    {
      
    }
});

// Initialize select
$('select').formSelect();

submitFromEl.addEventListener("submit", changePage);



