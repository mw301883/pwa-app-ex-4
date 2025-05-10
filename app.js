import {fetchWeather} from "./weatherApi.js";
import {saveLocation, getLocations, deleteLocation} from './db.js';

window.addEventListener('hashchange', render);
window.addEventListener('load', render);

async function render() {
    const app = document.getElementById('app');
    const hash = location.hash || '#home';

    if (hash === '#home') {
        const locations = await getLocations();
        app.innerHTML = '<h2>Saved Locations</h2><ul>' +
            locations.map(loc => `
        <li>
            <span>${loc.name}</span>
            <div class="actions">
                <button data-id="${loc.id}" class="forecast-btn" title="Show forecast">🌤️</button>
                <button data-id="${loc.id}" class="delete-btn" title="Delete">🗑️</button>
            </div>
        </li>
    `).join('') +
            '</ul>';

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                await deleteLocation(id);
                render();
            });
        });

        document.querySelectorAll('.forecast-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                localStorage.setItem('selectedLocationId', id);
                location.hash = '#forecast';
            });
        });
    }

    if (hash === '#add') {
        app.innerHTML = `
      <h2>Add City</h2>
      <form id="addForm">
        <input type="text" name="city" placeholder="Enter city" required />
        <button type="submit">Save</button>
      </form>
    `;
        document.getElementById('addForm').onsubmit = async (e) => {
            e.preventDefault();
            const city = e.target.city.value;
            await saveLocation(city);
            location.hash = '#home';
        };
    }

    if (hash === '#forecast') {
        app.innerHTML = '<h2>Forecast</h2><div id="forecastData">Loading...</div>';

        const locations = await getLocations();
        if (locations.length === 0) {
            document.getElementById('forecastData').innerText = 'No saved cities.';
            return;
        }

        const selectedId = parseInt(localStorage.getItem('selectedLocationId'));
        const locationToUse = locations.find(loc => loc.id === selectedId) || locations[0];
        const data = await fetchWeather(locationToUse.name);

        if (data.error) {
            console.log(data.error);
            document.getElementById('forecastData').innerHTML = `
        <p><strong>Sorry, could not fetch weatherapi.com API response.</strong></p>
    `;
            return ;
        }

        document.getElementById('forecastData').innerHTML = `
        <p><strong>City:</strong> ${data.location.name}, ${data.location.country}</p>
        <p><strong>Temperature:</strong> ${data.current.temp_c} °C</p>
        <p><strong>Weather:</strong> ${data.current.condition.text}</p>
        <img src="${data.current.condition.icon}" alt="${data.current.condition.text}">
        <p><strong>Wind:</strong> ${data.current.wind_kph} km/h ${data.current.wind_dir}</p>
        <p><strong>Humidity:</strong> ${data.current.humidity}%</p>
    `;
        localStorage.removeItem('selectedLocationId');
    }
}
