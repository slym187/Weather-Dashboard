

// Function to fetch weather data for a city
async function fetchWeatherData(city) {
    const apiKey = 'eb92cee44c00c7e76d5af5b8e02c602c';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
}



function displayCurrentWeather(weatherData) {
    const currentWeatherDiv = document.getElementById('current-weather');
    const temperatureFahrenheit = (weatherData.main.temp - 273.15) * 9/5 + 32; // Convert temperature to Fahrenheit
    currentWeatherDiv.innerHTML = `
        <h2>${weatherData.name}</h2>
        <p>Date: ${new Date(weatherData.dt * 1000).toDateString()}</p>
        <img src="http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png" alt="Weather Icon">
        <p>Temperature: ${temperatureFahrenheit.toFixed(2)}°F</p>
        <p>Humidity: ${weatherData.main.humidity}%</p>
        <p>Wind Speed: ${weatherData.wind.speed} m/s</p>
    `;
}


// Function to fetch forecast data for a city
async function fetchForecastData(city) {
    const apiKey = 'eb92cee44c00c7e76d5af5b8e02c602c';
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
}

// Function to display forecast for the next 5 days
function displayForecast(forecastData, weatherData) {
    const forecastDiv = document.getElementById('forecast');
    forecastDiv.innerHTML = ''; // Clear previous forecast
    
    const currentDate = new Date();
    const nextFiveDays = [];
    
    // Get forecast data for the next 5 days
    forecastData.list.forEach(forecast => {
        const forecastDate = new Date(forecast.dt * 1000);
        if (forecastDate.getDate() !== currentDate.getDate() && nextFiveDays.length < 5) {
            nextFiveDays.push(forecast);
        }
    });
    
    // Display forecast for the next 5 days
    nextFiveDays.forEach(forecast => {
        const forecastDate = new Date(forecast.dt * 1000).toDateString();
        const forecastIcon = `http://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;
        const temperatureFahrenheit = (forecast.main.temp - 273.15) * 9/5 + 32; // Convert temperature to Fahrenheit
        const forecastWindSpeed = forecast.wind.speed;
        const forecastHumidity = forecast.main.humidity;

        // Create forecast card
        const forecastCard = document.createElement('div');
        forecastCard.classList.add('forecast-card');
        forecastCard.innerHTML = `
            <p>Date: ${forecastDate}</p>
            <img src="${forecastIcon}" alt="Weather Icon">
            <p>Temperature: ${temperatureFahrenheit.toFixed(2)}°F</p> 
            <p>Wind Speed: ${forecastWindSpeed} m/s</p>
            <p>Humidity: ${forecastHumidity}%</p>
        `;

        // Append forecast card to forecast div
        forecastDiv.appendChild(forecastCard);
    });
}


// Function to add searched city to search history and local storage
function addToSearchHistory(city) {
    const searchHistory = document.getElementById('search-history');
    const cityElement = document.createElement('div');
    cityElement.textContent = city;
    searchHistory.appendChild(cityElement);

    // Save searched city to local storage
    const cities = JSON.parse(localStorage.getItem('cities')) || [];
    cities.push(city);
    localStorage.setItem('cities', JSON.stringify(cities));
}

// Function to add searched city to search history and local storage
async function addToSearchHistory(city) {
    const searchHistory = document.getElementById('search-history');
    const currentWeather = await fetchWeatherData(city);
    const forecast = await fetchForecastData(city);

    const cityElement = document.createElement('div');
    cityElement.textContent = city;
    cityElement.classList.add('searched-city'); 
    cityElement.addEventListener('click', () => displayWeather({ currentWeather, forecast }));
    searchHistory.appendChild(cityElement);

    // Save searched city and its weather data to local storage
    const cities = JSON.parse(localStorage.getItem('cities')) || [];
    cities.push({ city, currentWeather, forecast });
    localStorage.setItem('cities', JSON.stringify(cities));
}

// Function to load search history from local storage
function loadSearchHistory() {
    const searchHistory = document.getElementById('search-history');
    const cities = JSON.parse(localStorage.getItem('cities')) || [];
    cities.forEach(cityData => {
        const cityElement = document.createElement('div');
        cityElement.textContent = cityData.city;
        cityElement.classList.add('searched-city'); 
        cityElement.addEventListener('click', () => displayWeather(cityData));
        searchHistory.appendChild(cityElement);
    });
}


// Function to display weather data
function displayWeather(weatherData) {
    displayCurrentWeather(weatherData.currentWeather);
    displayForecast(weatherData.forecast, weatherData.currentWeather);
}


// Event listener for form submission
document.getElementById('search-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const city = document.getElementById('city-input').value;

    // Fetch current weather data
    const currentWeather = await fetchWeatherData(city);
    // Display current weather
    displayCurrentWeather(currentWeather);

    // Fetch forecast data
    const forecast = await fetchForecastData(city);
    // Display forecast
    displayForecast(forecast, currentWeather); 
    // Add searched city to search history and local storage
    addToSearchHistory(city);
});

