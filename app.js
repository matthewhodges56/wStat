const API_KEY = '5456a54926974019979233955252602'
const typingDelay = 500; // Delay in milliseconds (0.5s)
let city, weatherData, typingTimer

function changeFavicon(url) {
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
    }
    link.href = url;
}

function getWeather(city) {
    fetch(`http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&aqi=no`)
    .then(response => response.json())
    .then(data => {
        weatherData = data; 
        console.log(weatherData); 

        document.title = `${weatherData.location.name}, ${weatherData.location.region} Weather`;
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
