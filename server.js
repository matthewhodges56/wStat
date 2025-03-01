import "dotenv/config"
import express from "express"
import cors from "cors"
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
const PORT = 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const WEATHER_API_KEY = process.env.WEATHER_API_KEY

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.use(cors());
app.use(express.json());

// Weather API Endpoint
app.get("/api/weather", async (req, res) => {
    const city = req.query.city;
    
    if (!city) {
        return res.status(400).json({ error: "City is required" });
    }

    try {
        const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${city}&aqi=no`);
        const data = await response.json();
        
        if (data.error) {
            return res.status(400).json({ error: data.error.message });
        }

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch weather data" });
    }
});

app.post("/getWeatherSummary", async (req, res) => {
    try {
        const weatherData = req.body.weatherData;

        if (!weatherData || !weatherData.current) {
            return res.status(400).json({ error: "Invalid weather data received." });
        }

        const prompt = `Summarize this weather in a friendly way:\n
        - Location: ${weatherData.location.name}, ${weatherData.location.region}
        - Condition: ${weatherData.current.condition.text}
        - Temperature: ${weatherData.current.temp_f}°F
        - Feels Like: ${weatherData.current.feelslike_f}°F
        - High/Low: ${weatherData.forecast.forecastday[0].day.maxtemp_f}°F / ${weatherData.forecast.forecastday[0].day.mintemp_f}°F
        - Chance of Rain: ${weatherData.forecast.forecastday[0].day.daily_chance_of_rain}%
        - Wind Speed: ${weatherData.current.wind_mph} MPH
        - Provide a fun and engaging weather summary.`;

        const result = await model.generateContent(prompt);
        const summary = result.response.text(); // Get AI-generated text

        res.json({ summary });
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: "Error fetching summary" });
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
