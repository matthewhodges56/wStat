const API_KEY = '5456a54926974019979233955252602'
const typingDelay = 750; // Delay in milliseconds (0.75s)
let city, weatherData, typingTimer

function updateWeatherUI() {
    let conditionText = weatherData.current.condition.text;
    let temp = weatherData.current.temp_f; // Temperature in Fahrenheit
    let feelsLike = weatherData.current.feelslike_f; // Feels like temperature
    let conditionIcon = "";
    let tempIcon = "";
    let feelsLikeIcon = "";
    let faviconURL = "";

    // Condition Icons & Favicons
    if (conditionText.includes("Sunny")) {
        conditionIcon = "☀️";
        faviconURL = "https://emojicdn.elk.sh/☀️"; 
    } else if (conditionText.includes("Cloudy")) {
        conditionIcon = "☁️";
        faviconURL = "https://emojicdn.elk.sh/☁️";
    } else if (conditionText.includes("Partly cloudy")) {
        conditionIcon = "⛅";
        faviconURL = "https://emojicdn.elk.sh/⛅";
    } else if (conditionText.includes("Rain") || conditionText.includes("Drizzle")) {
        conditionIcon = "🌧️";
        faviconURL = "https://emojicdn.elk.sh/🌧️";
    } else if (conditionText.includes("Thunderstorm")) {
        conditionIcon = "⛈️";
        faviconURL = "https://emojicdn.elk.sh/⛈️";
    } else if (conditionText.includes("Light snow")) {
        conditionIcon = "🌨️";
        faviconURL = "https://emojicdn.elk.sh/🌨️";
    } else if (conditionText.includes("Heavy snow")) {
        conditionIcon = "❄️❄️";
        faviconURL = "https://emojicdn.elk.sh/❄️";
    } else if (conditionText.includes("Snow")) {
        conditionIcon = "❄️";
        faviconURL = "https://emojicdn.elk.sh/❄️";
    } else if (conditionText.includes("Fog") || conditionText.includes("Mist")) {
        conditionIcon = "🌫️";
        faviconURL = "https://emojicdn.elk.sh/🌫️";
    } else {
        conditionIcon = "🌎";
        faviconURL = "https://emojicdn.elk.sh/🌎"; // Default Earth icon
    }

    // Temperature Icons
    if (temp >= 90) {
        tempIcon = "🔥";
    } else if (temp >= 75) {
        tempIcon = "🌞";
    } else if (temp >= 50) {
        tempIcon = "🌤️";
    } else if (temp >= 32) {
        tempIcon = "🧥";
    } else {
        tempIcon = "❄️";
    }

    // Feels Like Icons
    if (feelsLike >= 90) {
        feelsLikeIcon = "🥵";
    } else if (feelsLike >= 75) {
        feelsLikeIcon = "😎";
    } else if (feelsLike >= 50) {
        feelsLikeIcon = "🙂";
    } else if (feelsLike >= 32) {
        feelsLikeIcon = "🧥";
    } else {
        feelsLikeIcon = "🥶";
    }

    // Update UI Elements
    document.getElementById("condition").innerHTML = `<strong>Condition:</strong> ${conditionIcon} ${conditionText}`;
    document.getElementById("temp").innerHTML = `<strong>Temperature:</strong> ${tempIcon} ${temp}°F`;
    document.getElementById("feelsLike").innerHTML = `<strong>Feels Like:</strong> ${feelsLikeIcon} ${feelsLike}°F`;
    document.getElementById("windSpeed").innerHTML  = `<strong>Wind Speed</strong>: 💨 ${weatherData.current.wind_mph} MPH`;

    // Update Tab Title
    document.title = `${conditionText} - ${temp}°F`;

    // Update Favicon
    let favicon = document.querySelector("link[rel='icon']") || document.createElement("link");
    favicon.rel = "icon";
    favicon.href = faviconURL;
    document.head.appendChild(favicon);
}

function showWeather() {
    $("#getWeather").fadeOut(function () {
        $("#showWeather").fadeIn();
    });
    // Change Title
    document.title = `${weatherData.location.name}, ${weatherData.location.region} Weather`;
    // Header
    document.getElementById("weatherFor").textContent  = `Weather for ${weatherData.location.name}, ${weatherData.location.region}`;
    updateWeatherUI()
}

function getWeather(city) {
    fetch(`http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&aqi=no`)
    .then(response => response.json())
    .then(data => {
        weatherData = data; 
        showWeather()
        console.log(weatherData); 
    })
    .catch(error => console.error("Error fetching weather data: ", error));
}

document.getElementById("txtCity").addEventListener("input", function() {
    city = this.value

    // Clear the previous timer if the user types again
    clearTimeout(typingTimer);

    // Set a new timer to wait before executing the function
    typingTimer = setTimeout(() => {
        getWeather(city);
    }, typingDelay);
})
