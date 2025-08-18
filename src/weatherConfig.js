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

cityInputBtn.addEventListener("click", async () => {
    const loadApiUrl = enterCityName();
    await getWeatherData(loadApiUrl);

    // From Menubar.js~
    overlayBlur.classList.remove("show");
    sidebar.classList.remove("show");
});

async function getWeatherData(apiUrl){
    try {
        const response = await fetch(apiUrl);
        const weatherInfo = await response.json();
        console.log(weatherInfo);

        // Fetch the country names before updating
        const countryNames = await getFullCountryNames();

        updateWeatherTemp(weatherInfo);
        updateCountryNames(weatherInfo, countryNames);
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