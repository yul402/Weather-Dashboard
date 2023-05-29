function initPage() {

  var citySearch = document.getElementById("search-city");
  var searchButton = document.getElementById("search-button");
  var cityName = document.getElementById("city");
  var currentIconPic = document.getElementById("current-icon");
  var currentTemp = document.getElementById("temperature");
  var currentHumidity = document.getElementById("humidity");
  var currentWind = document.getElementById("wind-speed");
  var history = document.getElementById("history-button");
  var forecast = document.getElementById("future-weather");
  var todayWeather = document.getElementById("today-weather");
  var searchHistory = JSON.parse(localStorage.getItem("searchedCity")) || [];


  function displayWeather(city){
    var apiKey = "4786306beaefdfe7e651f9c9cd27e5ee"
    // Display today's weather
    var url = "https://api.openweathermap.org/data/2.5/weather?q=" + city +"&appid=" + apiKey + "&units=imperial"
    fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      todayWeather.classList.remove("d-none")
      // Parse response to display current weather
      var currentDate = new Date(data.dt * 1000)
      var day = currentDate.getDate()
      var month = currentDate.getMonth() + 1
      var year = currentDate.getFullYear()
      cityName.innerHTML =city + " (" + month + "/" + day + "/" + year + ") "
      var weatherIconId = data.weather[0].icon
      currentIconPic.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherIconId + "@2x.png");
      currentIconPic.setAttribute("alt", data.weather[0].description);
      currentTemp.innerHTML = "Temperature: " + data.main.temp + " &#176F";
      currentHumidity.innerHTML = "Humidity: " + data.main.humidity + "%";
      currentWind.innerHTML = "Wind Speed: " + data.wind.speed + " MPH";
    })

      //Display 5-Day Forcaset
      var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city +"&appid=" + apiKey + "&units=imperial"
      fetch(forecastUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        forecast.classList.remove("d-none")
        // Parse response to display future weather
        var forecastEls = document.querySelectorAll(".forecast-div")
        for (i=0; i <forecastEls.length; i++){
          //Display forecast date
          var forecastDate = new Date(data.list[i*8].dt * 1000)
          var day = forecastDate.getDate()
          var month = forecastDate.getMonth() + 1
          var year = forecastDate.getFullYear()
          forecastEls[i].querySelector('#forecastDate').innerHTML = month + "/" + day + "/" + year
          
          
          //Get weather icon
          var weatherIconId = data.list[i*8+4].weather[0].icon
          var forecastIcon = forecastEls[i].querySelector('#forecastIcon')
          forecastIcon.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherIconId + "@2x.png");
          forecastIcon.setAttribute("alt", data.list[+4].weather[0].description);
          
          //Get weather info
          var forecastTemp = "Temperature: " + data.list[i*8+4].main.temp + " &#176F";
          var forecastHumidity = "Humidity: " + data.list[i*8+4].main.humidity + "%";
          var forecastWind = "Wind Speed: " + data.list[i*8+4].wind.speed + " MPH";
          forecastEls[i].querySelector('#forecastInfo').innerHTML = forecastTemp + "<br />" + forecastHumidity+ "<br />"+ forecastWind
        }
      })
      }

  function SearchHistory(){
    for (let i = 0; i < searchHistory.length; i++) {
      var historyItem = document.createElement("button");
      historyItem.setAttribute("type", "button");
      historyItem.setAttribute("class", "btn btn-secondary m-2");
      historyItem.textContent = searchHistory[i]
      console.log(historyItem.textContent)
      historyItem.addEventListener("click", function () {
        displayWeather(historyItem.textContent);
      })
    }
    history.append(historyItem);
  }

  searchButton.addEventListener("click", function () {
    //Capitalize first letter for user input city name
    var cityDisplay = citySearch.value.split(" ") //Capitalize first letter for displayed city name 
    cityDisplay.forEach((word,idx)=>{cityDisplay[idx]=word[0].toUpperCase()+word.substring(1).toLowerCase()})
    var formatedCity=cityDisplay.join(" ")
    displayWeather(formatedCity)//citySearch.value);
    searchHistory.push(formatedCity)//citySearch.value);
    localStorage.setItem("searchedCity", JSON.stringify(searchHistory));
    SearchHistory();
  })

}

initPage()