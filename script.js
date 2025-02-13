document.addEventListener("DOMContentLoaded", () => {
    getWeather("Delhi");
    fetchOtherCitiesWeather(["London", "New York", "Tokyo", "Delhi", "Sydney"]); 
});

const API_KEY = "7f9aa77453mshea8d55828cd4639p15f78fjsn3c4aad8b7046";
const API_HOST = "weather-api138.p.rapidapi.com";
const API_URL = "https://weather-api138.p.rapidapi.com/weather?city_name=";


function kelvinToCelsius(kelvin) {
    return (kelvin - 273.15).toFixed(2);
}


function formatTime(timestamp) {
    return new Date(timestamp * 1000).toLocaleTimeString();
}

async function getWeather(city) {
    document.getElementById("cityName").textContent = city;

    try {
        const response = await fetch(`${API_URL}${city}`, {
            method: "GET",
            headers: {
                "x-rapidapi-key": API_KEY,
                "x-rapidapi-host": API_HOST
            }
        });

        if (!response.ok) throw new Error("Failed to fetch data");

        const data = await response.json();

        if (!data.main || !data.wind || !data.sys) {
            throw new Error("Incomplete weather data received");
        }

        document.getElementById("temp").textContent = kelvinToCelsius(data.main.temp);
        document.getElementById("temp2").textContent = kelvinToCelsius(data.main.temp);
        document.getElementById("temp_min").textContent = kelvinToCelsius(data.main.temp_min);
        document.getElementById("temp_max").textContent = kelvinToCelsius(data.main.temp_max);
        document.getElementById("pressure").textContent = data.main.pressure;
        document.getElementById("humidity").textContent = data.main.humidity;
        document.getElementById("wind_speed").textContent = data.wind.speed;
        document.getElementById("wind_deg").textContent = data.wind.deg;
        document.getElementById("sunrise").textContent = formatTime(data.sys.sunrise);
        document.getElementById("sunset").textContent = formatTime(data.sys.sunset);
    } catch (error) {
        console.error("Error fetching main city data:", error);
    }
}

async function fetchOtherCitiesWeather(cities) {
    const tableBody = document.getElementById("weatherTable");
    tableBody.innerHTML = ""; 

    for (const city of cities) {
        try {
            const response = await fetch(`${API_URL}${city}`, {
                method: "GET",
                headers: {
                    "x-rapidapi-key": API_KEY,
                    "x-rapidapi-host": API_HOST
                }
            });

            if (!response.ok) throw new Error(`Failed to fetch data for ${city}`);

            const data = await response.json();

            if (!data.main || !data.wind || !data.sys) {
                throw new Error(`Incomplete weather data received for ${city}`);
            }

            tableBody.innerHTML += `
                <tr>
                    <th>${city}</th>
                    <td>${kelvinToCelsius(data.main.temp)}°C</td>
                    <td>${kelvinToCelsius(data.main.temp_min)}°C</td>
                    <td>${kelvinToCelsius(data.main.temp_max)}°C</td>
                    <td>${data.main.pressure} hPa</td>
                    <td>${data.main.humidity}%</td>
                    <td>${data.wind.speed} km/h</td>
                    <td>${data.wind.deg}°</td>
                    <td>${formatTime(data.sys.sunrise)}</td>
                    <td>${formatTime(data.sys.sunset)}</td>
                </tr>`;
        } catch (error) {
            console.error(`Error fetching data for ${city}:`, error);
        }
    }
}

document.getElementById("submit").addEventListener("click", (e) => {
    e.preventDefault();
    const city = document.getElementById("city").value;
    if (city) {
        getWeather(city);
        fetchOtherCitiesWeather(["London", "New York", "Tokyo", "Delhi", "Sydney"]); 
    }
});
