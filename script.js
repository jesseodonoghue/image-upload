const imageEl = document.querySelector(".image");
const btnEl = document.querySelector(".btn");

btnEl.addEventListener("click", () => {
    console.log("Working");
    if (imageEl.src === "https://via.placeholder.com/250") {
        imageEl.setAttribute("src", "https://via.placeholder.com/500");
    } else {
        imageEl.setAttribute("src", "https://via.placeholder.com/250");
    }
});