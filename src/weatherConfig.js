// Time and Date Variables
const date = document.querySelector('.date');
const time = document.querySelector(".time");

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
    const textGreetings = document.querySelector(".text-greeting");

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
const dashboardTemp = document.querySelector(".dashboard-temperature");
const sidebarTemp = document.querySelector(".sidebar-temp");
const cityInput = document.getElementById("city-input");
const cityInputBtn = document.querySelector(".city-input-btn");

// API URL and API key
const apikey = "b3d5b4a906d8fec941d49808cc265c6b";

function enterCityName(){
    let cityName = cityInput.value.toLowerCase();
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apikey}`;
    return apiURL;
}

// City Search Button
cityInputBtn.addEventListener("click", async () => {
    const loadApiUrl = enterCityName();
    await getWeatherData(loadApiUrl);

    // From Menubar.js~
    overlayBlur.classList.remove("show");
    sidebar.classList.remove("show");
});

cityInput.addEventListener("keydown", async (e) => {
    if(e.key === "Enter"){
        const loadApiUrl = enterCityName();
        await getWeatherData(loadApiUrl);

        // From Menubar.js~
        overlayBlur.classList.remove("show");
        sidebar.classList.remove("show");

        e.preventDefault();
    }
})


async function getWeatherData(apiUrl){
    try {
        const response = await fetch(apiUrl);
        const weatherInfo = await response.json();
        console.log(weatherInfo);

        const countryNames = await getFullCountryNames(); // Fetch the country names before updating

        updateWeatherTemp(weatherInfo); // Weather Temp Update
        updateCountryNames(weatherInfo, countryNames); // Weather Country Update
        updateWeatherStatus(weatherInfo); // Update Weather Status
        updateWeatherVisibility(weatherInfo); // Update Weather Visibility 
        updateAirPressure(weatherInfo); // Update Air Pressure
        updateHumidity(weatherInfo); // Update Humidity
        updateWindSpeedDirection(weatherInfo); // Update Wind Speed and Directions
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
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
const dashboardCity = document.querySelector(".dashboard-city");
let countryNames = {};

// Fetch the country names from the isoCountries.json
async function getFullCountryNames(){
    try {
        const res = await fetch("./src/isoCountries.json");
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
const weatherHumidity = document.getElementById("weatherStatus-value");

function updateWeatherStatus(weatherData){
    const weatherDescription = weatherData.weather[0].description;
    weatherHumidity.textContent = weatherDescription.charAt(0).toUpperCase() + weatherDescription.slice(1); // Makes the word capiltalize
}


// Visibility Update
const visibility = document.getElementById("visibility-value");

function updateWeatherVisibility(weatherData){
    const meterToKm = weatherData.visibility / 1000;
    visibility.textContent = meterToKm + " km"
}


// Air Pressure Update
const airPressure = document.getElementById("airPressure-value");

function updateAirPressure(weatherData){
    airPressure.textContent = weatherData.main.pressure + " hPa";
}


// Humidity Update
const humidity = document.getElementById("humidity-value");

function updateHumidity(weatherData){
    humidity.textContent = weatherData.main.humidity + " %";
}



// Wind Direction and Speed update(Sidebar/Aside)
const windSpeedDir = document.querySelector(".wind-speed-desc");

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