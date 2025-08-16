// Time and Date Variables
const date = document.querySelector('.date');
const time = document.querySelector(".time");

// Get current date & time
function updateDateTime(){
    let getNewDate = new Date();

    // For Date Format(Current)
    const customDateSettings = { // Get the custom/preferred date format
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
}

updateDateTime();
setInterval(() => {
    updateDateTime();
}, 1000);