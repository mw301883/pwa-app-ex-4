import { config } from "./config.js";

export async function fetchWeather(city) {
    try {
        const res = await fetch(`${config.weatherApiBaseUrl}?key=${config.weatherApiKey}&q=${city}`);
        if (!res.ok) {
            throw new Error(`Error: ${res.status} - ${res.statusText}`);
        }
        const data = await res.json();
        if (data.error) {
            throw new Error(`API Error: ${data.error.message}`);
        }
        return data;
    } catch (error) {
        console.error("Weather fetch error:", error.message);
        return { error: error.message };
    }
}
