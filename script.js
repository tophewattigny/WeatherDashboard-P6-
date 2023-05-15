//API //
const apiKey = 'e42025e293369a041c53b96eb66c2f61';
const apiUrl = 'https://api.openweathermap.org/data/2.5/';
//VARIABLES//
const form = document.querySelector('form');
const cityInput = document.querySelector('#city-input');
const currentWeather = document.querySelector('#current-weather');
const forecast = document.querySelector('#forecast');
const searchHistory = document.querySelector('#search-history');
//FORM//
form.addEventListener('submit', event => {
    event.preventDefault();
    const city = cityInput.value.trim();
    if (!city) {
        alert('Please enter a city name');
        return;
    }
    getWeatherData(city);
});
//CALL//
async function getWeatherData(city) {
    const currentWeatherUrl = `${apiUrl}weather?q=${city}&units=imperial&appid=${apiKey}`;
    const forecastUrl = `${apiUrl}forecast?q=${city}&units=imperial&appid=${apiKey}`;

    try {
        const [currentResponse, forecastResponse] = await Promise.all([
            fetch(currentWeatherUrl),
            fetch(forecastUrl)
        ]);

        if (!currentResponse.ok || !forecastResponse.ok) {
            throw new Error('Failed to retrieve weather data. Please try again later.');
        }

        const currentData = await currentResponse.json();
        const forecastData = await forecastResponse.json();

        displayCurrentWeather(currentData);
        displayForecast(forecastData);
        addToSearchHistory(city);
    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

//CURRENT WEATHER// 

function displayCurrentWeather(data) {
    const weatherDescription = data.weather[0].description;
    let weatherStatus, weatherIcon;

    if (weatherDescription.includes("rain")) {
        weatherStatus = "Raining";
        weatherIcon = "10d"; 
    } else if (weatherDescription.includes("cloud")) {
        weatherStatus = "Cloudy";
        weatherIcon = "03d"; 
    } else {
        weatherStatus = "Sunny";
        weatherIcon = "01d"; 
    }

    const weatherInfo = document.querySelector('#weather-info');
    weatherInfo.innerHTML = `
      <h3>${data.name} (${new Date().toLocaleDateString()}) <img src="https://openweathermap.org/img/wn/${weatherIcon}.png" alt="${weatherStatus}" /></h3>
      <p>Temperature: ${data.main.temp}&deg;F</p>
      <p>Wind Speed: ${data.wind.speed} mph</p>
      <p>Humidity: ${data.main.humidity}%</p>
    `;
    weatherInfo.classList.remove('hidden');
}

//HISTORY//
function addToSearchHistory(city) {
    const li = document.createElement('li');
    li.textContent = city;
    searchHistory.appendChild(li);
}
const historyContainer = document.querySelector('#historyContainer');

historyContainer.addEventListener('click', event => {
    if (event.target.tagName === 'LI') {
        const city = event.target.textContent;
        cityInput.value = city;
        getWeatherData(city);
    }
});

//FORECAST//
function displayForecast(data) {
    forecast.innerHTML = '';
    const dailyData = data.list.filter((item, index) => index % 8 === 0);

    dailyData.forEach(item => {
        const date = new Date(item.dt_txt).toLocaleDateString();
        const weather = item.weather[0].main;
        const temp = item.main.temp;
        const humidity = item.main.humidity;
        const weatherIcon = item.weather[0].icon;

        const box = document.createElement('div');
        box.classList.add('forecast-box');
        box.innerHTML = `
        <p>${date}</p>
        <p>Weather: ${weather} <img src="https://openweathermap.org/img/w/${weatherIcon}.png" alt="${weather}"></p>
        <p>Temperature: ${temp}&deg;F</p>
        <p>Humidity: ${humidity}%</p>
      `;

        forecast.appendChild(box);
        var forecastHeading = document.querySelector("#forecastContainer h2");

        forecastHeading.style.visibility = "visible";
    });
}



