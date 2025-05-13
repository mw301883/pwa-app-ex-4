import { config } from "./config.js";

export async function fetchWeather(city) {
    const cacheKey = `weatherData_${city.toLowerCase()}`;

    try {
        const res = await fetch(`${config.weatherApiBaseUrl}?key=${config.weatherApiKey}&q=${city}`);
        if (!res.ok) {
            throw new Error(`Error: ${res.status} - ${res.statusText}`);
        }
        const data = await res.json();
        if (data.error) {
            throw new Error(`API Error: ${data.error.message}`);
        }

        localStorage.setItem(cacheKey, JSON.stringify({
            timestamp: Date.now(),
            data
        }));

        return data;

    } catch (error) {
        console.warn("Weather fetch failed, loading cached version…", error.message);

        const cached = localStorage.getItem(cacheKey);
        if (cached) {
            const parsed = JSON.parse(cached);
            return parsed.data;
        }

        return { error: "No data available offline" };
    }
}
