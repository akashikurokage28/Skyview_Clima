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

    if(get24hour <= 12){
        textGreetings.textContent = "Good Morning!";
    } else if(get24hour >= 12){
        textGreetings.textContent = "Good Afternoon!";
    } else if(get24hour == 18){
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
const dashboardCity = document.querySelector(".dashboard-city");
const cityInput = document.getElementById("city-input");
const cityInputBtn = document.querySelector(".city-input-btn");
const getWeatherData = {};

// API URL and API key
const api = "b3d5b4a906d8fec941d49808cc265c6b";
const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput.value}&appid=${api}`;

async function fetchWeatherData(){
    try{
        const res = await fetch(apiURL);
        const weatherData = await res.json();
        console.log(weatherData);
    } catch(error){
        console.error(error);
    }
}
fetchWeatherData();


// Search city to get weather data
cityInputBtn.addEventListener("click", () => {
    dashboardCity.textContent = cityInput.value;
});