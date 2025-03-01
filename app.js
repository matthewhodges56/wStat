const typingDelay = 750; // Delay in milliseconds (0.75s)
let city, weatherData, typingTimer
let faviconURL = "https://emojicdn.elk.sh/🌎";

// Update Favicon
let favicon = document.querySelector("link[rel='icon']") || document.createElement("link");
favicon.rel = "icon";
favicon.href = faviconURL;
document.head.appendChild(favicon);

async function getGeminiSummary(weatherData) {
    try {
        const response = await fetch("http://localhost:3000/getWeatherSummary", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ weatherData })
        });

        const data = await response.json();

        if (data.error) {
            console.error("AI Summary Error:", data.error);
            document.getElementById("weatherSummary").innerText = "Couldn't generate summary.";
            return;
        }

        document.getElementById("weatherSummary").innerText = data.summary;
    } catch (error) {
        console.error("Request Error:", error);
        document.getElementById("weatherSummary").innerText = "Failed to fetch summary.";
    }
}

function updateWeatherUI() {
    let conditionText = weatherData.current.condition.text;
    let high = weatherData.forecast.forecastday[0].day.maxtemp_f
    let low = weatherData.forecast.forecastday[0].day.mintemp_f
    let rainChance = weatherData.forecast.forecastday[0].day.daily_chance_of_rain
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
    } else if (conditionText.includes("Cloudy") || conditionText.includes("Overcast")) {
        conditionIcon = "☁️";
        faviconURL = "https://emojicdn.elk.sh/☁️";
    } else if (conditionText.includes("Partly cloudy")) {
        conditionIcon = "⛅";
        faviconURL = "https://emojicdn.elk.sh/⛅";
    } else if (conditionText.includes("Rain") || conditionText.includes("Drizzle") || conditionText.includes("Patchy rain nearby")) {
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
    document.getElementById("highLow").innerHTML = `<strong>High/Low</strong>: 🌡️ ${high}°F / ${low}°F`;
    document.getElementById("rainChance").innerHTML = `<strong>Rain Chance</strong>: 🌧️ ${rainChance}%`
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

    getGeminiSummary(weatherData)
}

function showWeather() {
    $("#getWeather").fadeOut(function () {
        $("#showWeather").fadeIn();
    });
    // Header
    document.getElementById("weatherFor").textContent  = `Weather for ${weatherData.location.name}, ${weatherData.location.region}`;
    updateWeatherUI()
}

function getWeather(city) {
    fetch(`http://localhost:3000/api/weather?city=${city}`)
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error("Error fetching weather data:", data.error);
            return;
        }
        weatherData = data;
        showWeather();
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

function resetWeatherUI() {
    document.getElementById("highLow").innerHTML = "";
    document.getElementById("rainChance").innerHTML = "";
    document.getElementById("condition").innerHTML = "";
    document.getElementById("temp").innerHTML = "";
    document.getElementById("feelsLike").innerHTML = "";
    document.getElementById("windSpeed").innerHTML  = "";
    document.getElementById("weatherSummary").innerText = "";
}

$("#anotherWeather").on("click", function(){
    $("#showWeather").fadeOut(function () {
        document.getElementById("txtCity").value = "";
        // Reset Tab Title and Favicon
        document.title = "wStat";
        let favicon = document.querySelector("link[rel='icon']") || document.createElement("link");
        favicon.rel = "icon";
        favicon.href = "https://emojicdn.elk.sh/🌎";
        document.head.appendChild(favicon);
        $("#getWeather").fadeIn(function(){
            resetWeatherUI();
        });
    });
})