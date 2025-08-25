// Menu bar 
const overlayBlur = document.querySelector(".overlay-blur");
const sidebar = document.querySelector(".sidebar");
const menubar = document.getElementById("menubar");


menubar.addEventListener("click", () => { // Open the menubar
    sidebar.classList.toggle("open");
    overlayBlur.classList.toggle("open");
});

overlayBlur.addEventListener("click", () => { // Close the menubar
    sidebar.classList.remove("open");
    overlayBlur.classList.remove("open");
});



