var searchHistory = [];
// returns search history
function getItems() {
    var storedCities = JSON.parse(localStorage.getItem("searchHistory"));
    if (storedCities !== null) {
        searchHistory = storedCities;
    };
    for (i = 0; i < searchHistory.length; i++) {
        if (i == 8) {
            break;
          }
        //  makes saved searches buttons
        cityListButton = $("<a>").attr({
            class: "list-group-item list-group-item-action",
            href: "#"
        });
        cityListButton.text(searchHistory[i]);
        $(".list-group").append(cityListButton);
    }
};
var city;
var mainCard = $(".card-body");
getItems();
// main card
function getData() {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=50a54389d26a7e277a86df024285563d"
    mainCard.empty();
    $("#weeklyForecast").empty();
    
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        var date = moment().format(" MM/DD/YYYY");
        var iconCode = response.weather[0].icon;
        var iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";
        var name = $("<h3>").html(city + date);
        // displays name in main card
        mainCard.prepend(name);
        mainCard.append($("<img>").attr("src", iconURL));
        // converts K and removes decimals
        var temp = Math.round((response.main.temp - 273.15) * 1.80 + 32);
        mainCard.append($("<p>").html("Temperature: " + temp + " &#8457"));
        var humidity = response.main.humidity;
        mainCard.append($("<p>").html("Humidity: " + humidity));
        var windSpeed = response.wind.speed;
        mainCard.append($("<p>").html("Wind Speed: " + windSpeed));
        // takes from the response and creates a variable
        var lat = response.coord.lat;
        var lon = response.coord.lon;
        // request for UV index
        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/uvi?appid=50a54389d26a7e277a86df024285563d&lat=" + lat + "&lon=" + lon,
            method: "GET"
        // displays UV
        }).then(function (response) {
            mainCard.append($("<p>").html("UV Index: <span>" + response.value + "</span>")); 
            if (response.value <= 2) {
                $("span").attr("class", "btn btn-outline-success");
            };
            if (response.value > 2 && response.value <= 5) {
                $("span").attr("class", "btn btn-outline-warning");
            };
            if (response.value > 5) {
                $("span").attr("class", "btn btn-outline-danger");
            };
        })
        
        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=50a54389d26a7e277a86df024285563d",
            method: "GET"
        // displays 5 separate columns from the forecast response
        }).then(function (response) {
            for (i = 0; i < 5; i++) {
                var newCard = $("<div>").attr("class", "col fiveDay bg-primary text-white rounded-lg p-2");
                $("#weeklyForecast").append(newCard);
                var myDate = new Date(response.list[i * 8].dt * 1000);
                newCard.append($("<h4>").html(myDate.toLocaleDateString()));
                var iconCode = response.list[i * 8].weather[0].icon;
                var iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";
                // displays icon
                newCard.append($("<img>").attr("src", iconURL));
                var temp = Math.round((response.list[i * 8].main.temp - 273.15) * 1.80 + 32);
                // displays temp
                newCard.append($("<p>").html("Temp: " + temp + " &#8457"));
                var humidity = response.list[i * 8].main.humidity;
                // displays humidity
                newCard.append($("<p>").html("Humidity: " + humidity));
            }
        })
    })
};
// searches and adds to history
$("#searchCity").click(function() {
    city = $("#city").val();
    getData();
    var checkArray = searchHistory.includes(city);
    if (checkArray == true) {
        return
    }
    else {
        searchHistory.push(city);
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
        var cityListButton = $("<a>").attr({
            class: "list-group-item list-group-item-action",
            href: "#"
        });
        cityListButton.text(city);
        $(".list-group").append(cityListButton);
    };
});

$(".list-group-item").click(function() {
    city = $(this).text();
    getData();
});