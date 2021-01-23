var submitFromEl = document.querySelector("#submit-form");
var userNameEl = document.querySelector("#user-name");
var dateEl = document.querySelector("#date");
var moodEl = document.querySelector("#date-mood");

var changePage = function(event)
{
    event.preventDefault();

    var userName = userNameEl.value;
    var date = dateEl.value;
    var mood = moodEl.value;

    if(userName && date && mood)
    {
        document.location.replace("./dateresults.html"+"?username="+userName+"&date="+date+"&mood="+mood);
    }
    else
    {
        console.log("error");
    }
};

submitFromEl.addEventListener("submit",changePage);