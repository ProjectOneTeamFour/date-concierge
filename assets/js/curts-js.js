
var cityID = 89 //toronto
 var apiUrl = "https://developers.zomato.com/api/v2.1/cuisines?city_id=" + cityID;
var apiKey = "4f647c578e863a28146038bc9b68f278"


fetch(apiUrl, { headers: { "user-key": apiKey } }).then(function(response) {
    // request was successful
    if (response.ok) {
      response.json().then(function(data) {
        displayCuisine(data);

        
      });
    } 
  });

  var displayCuisine = function(cuisine) {
    // if (issues.length === 0) {
    //   issueContainerEl.textContent = "No !";
    //   return;
    // }
    console.log(cuisine(0));
    //console.log(cuisine[1].cuisine_name);
    // loop over given issues
    for (var i = 0; i < cuisine.length; i++) {
      console.log(i);
     
      
  
      
    }
  };
  