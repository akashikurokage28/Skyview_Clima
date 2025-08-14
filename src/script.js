// Menu bar Variable
const menubar = document.getElementById("menu-bar");
const sidebar = document.querySelector(".weather-sidebar");
const overlayBlur = document.querySelector(".dashboard-overlay-blur");

// Open menubar
menubar.addEventListener("click", () => {
    overlayBlur.classList.toggle("show");
    sidebar.classList.toggle("show");
});

// Close Menubar
overlayBlur.addEventListener("click", () => {
    overlayBlur.classList.remove("show");
    sidebar.classList.remove("show");
})