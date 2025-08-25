// Time and Date Variables
const date = document.getElementById("nav-date");
const time = document.getElementById("nav-time");

// Get current date & time
function updateDateTime(){
    let getNewDate = new Date();

    // For Date Format(Current)
    const customDateSettings = { // Get the custom/preferred date format.
        month: "long",
        day: "2-digit",
        year: "numeric"
    }

    let newFormattedDate = getNewDate.toLocaleDateString("en-US", customDateSettings);
    date.textContent = newFormattedDate;


    // For Time Format(Current)
    let get24hour = getNewDate.getHours();
    let get12hour = (get24hour % 12 || 12).toString().padStart(2, "0");
    let getMinutes = getNewDate.getMinutes().toString().padStart(2, "0");
    let ampm = get24hour >= 12 ? 'PM' : 'AM';

    time.textContent = `${get12hour}:${getMinutes} ${ampm}`;


    // Updating the text greetings(eg. Good morning!, Good Afternoon, and Good Evening)
    const textGreetings = document.getElementById("greetings");

    if(get24hour < 12){
        textGreetings.textContent = "Good Morning!";
    } else if(get24hour < 18){
        textGreetings.textContent = "Good Afternoon!";
    } else {
        textGreetings.textContent = "Good Evening!";
    }
}

// Real-time update
updateDateTime();
setInterval(() => {
    updateDateTime();
}, 1000);



// WEATHER DATA SEARCH UPDATE

// Variables
const dashboardTemp = document.getElementById("dashboard-temp");
const sidebarTemp = document.getElementById("sidebar-temp");
const cityInput = document.getElementById("city-input");
const cityInputBtn = document.getElementById("submit-city-name");

// API URL and API key
const apikey = "b3d5b4a906d8fec941d49808cc265c6b";

function enterCityName(){
    let cityName = cityInput.value.toLowerCase();
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apikey}`;
    return apiURL;
}

async function handleCitySearch() {
    const loadApiUrl = enterCityName();
    const weatherInfo = await getWeatherData(loadApiUrl);

    // Select elements
    const weatherContents = document.querySelector(".weather-dashboard-contents");
    const sidebarWeatherTemp = document.querySelector(".sidebar-weather-temp");
    const sidebar15daysforcasts = document.querySelector(".fifty-days-forcast-wrapper");
    const dashboardSearchMessage = document.querySelector(".search-message");
    const sidebarSearchMessage = document.querySelector(".sidebar-search-message");

    // Only show dashboard if weatherInfo is valid
    if (weatherInfo && weatherInfo.cod === 200) {
        weatherContents.classList.remove("hide");
        sidebarWeatherTemp.classList.remove("hide");
        sidebar15daysforcasts.classList.remove("hide");
        dashboardSearchMessage.classList.add("hide");
        sidebarSearchMessage.classList.add("hide");
    }
}

// City Search Button
cityInputBtn.addEventListener("click", async () => {
    overlayBlur.classList.remove("open");
    sidebar.classList.remove("open");
    await handleCitySearch();

    if(cityInput.value === ""){
        alert("Please search a city name");
    }
});

cityInput.addEventListener("keydown", async (e) => {
    if (e.key === "Enter") {
        overlayBlur.classList.remove("open");
        sidebar.classList.remove("open");
        await handleCitySearch();
        e.preventDefault();
    }
});


async function getWeatherData(apiUrl){
    try {
        const response = await fetch(apiUrl);
        const weatherInfo = await response.json();
        console.log(weatherInfo);

        // 200 response
       if (weatherInfo.cod === 200) {
            const countryNames = await getFullCountryNames(); // Fetch the country names before updating
            updateWeatherTemp(weatherInfo);
            updateCountryNames(weatherInfo, countryNames);
            updateWeatherStatus(weatherInfo);
            updateWeatherVisibility(weatherInfo);
            updateAirPressure(weatherInfo);
            updateHumidity(weatherInfo);
            updateWindSpeedDirection(weatherInfo);

        } else if(weatherInfo.cod === "404"){ //404 response
            alert("Please enter the correct city name");
        }
        return weatherInfo;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        return null;
    }
}


// Update weather temp
function updateWeatherTemp(weatherData){
    let kelvinToCelcius = weatherData.main.temp - 273.15;
    let roundedCelcius = Math.round(kelvinToCelcius);
    dashboardTemp.textContent = roundedCelcius + "°C";
    sidebarTemp.textContent = roundedCelcius + "°C";
}



// Update Dashboard city name
const dashboardCity = document.querySelector(".city-name");
let countryNames = {};

// Fetch the country names from the isoCountries.json
async function getFullCountryNames(){
    try {
        const res = await fetch("./src/iso_country.json");
        const countryNameData = await res.json();
        countryNames = countryNameData;
        return countryNameData;

    } catch (error) {
        console.error(error);
    }
}


// Update Country names from the dashboard
function updateCountryNames(weatherData, countryNames){
     const weatherCountry = weatherData.sys.country;
     const countryName = countryNames[weatherCountry];

     if(countryName){
        dashboardCity.textContent = weatherData.name + ", " + countryName;
     }
}


// Weather Status Update
const weatherStatus = document.getElementById("weather-status");

function updateWeatherStatus(weatherData){
    const weatherDescription = weatherData.weather[0].description;
    weatherStatus.textContent = weatherDescription.charAt(0).toUpperCase() + weatherDescription.slice(1); // Makes the word capiltalize
}


// Visibility Update
const visibility = document.getElementById("weather-visibility");

function updateWeatherVisibility(weatherData){
    const meterToKm = weatherData.visibility / 1000;
    visibility.textContent = meterToKm + " km"
}


// Air Pressure Update
const airPressure = document.getElementById("weather-air-pressure");

function updateAirPressure(weatherData){
    airPressure.textContent = weatherData.main.pressure + " hPa";
}


// Humidity Update
const humidity = document.getElementById("weather-humidity");

function updateHumidity(weatherData){
    humidity.textContent = weatherData.main.humidity + " %";
}



// Wind Direction and Speed update(Sidebar/Aside)
const windSpeedDir = document.getElementById("wind-speed");

function updateWindSpeedDirection(weatherData){
    // Degrees To Cardinal Directions convertion
    const cardinalDirections = [
        "North", "Northeast", "East", "Southeast",
        "South", "Southwest", "West", "Northwest"
    ];

    const normalizeDegrees = weatherData.wind.deg % 360;
    const calculateDegToDir = Math.round(normalizeDegrees / 45) % 8; // Final Value for Converting Deg to Directions

    
    // Wind Speed Calculation
    const metricToImperial = weatherData.wind.speed * 2.23694;
    let getImperialUnit = metricToImperial.toFixed(2);


    // Combine the two converted values
    windSpeedDir.textContent = `${cardinalDirections[calculateDegToDir]}, ${getImperialUnit} mph`;
}