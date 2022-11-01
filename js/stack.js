// Elements
const toolsContainers = document.querySelectorAll(".c-section__tool");
const cubeLayers = document.querySelectorAll(".cubes-container .layer");

// Imported
import { currentSection } from "./main.js"

// Global Variables
const layersCount = cubeLayers.length;

toolsContainers.forEach(container => {

  let openBtn = container.querySelector(".c-section__tool__open-btn");
  let closeBtn = container.querySelector(".c-section__tool__close-btn");

  let containerContent = container.querySelector(".c-section__tool__content p");

  // Add event listeners to the open and close buttons
  openBtn.addEventListener("click", () => {

    container.classList.add("js-grow");
    setTimeout(() => containerContent.style.transitionDelay = "0s");

  });

  closeBtn.addEventListener("click", () => {
    container.classList.remove("js-grow");
    setTimeout(() => containerContent.style.transitionDelay = "500ms");

  });

});


// Rotate the layers
(function rotateLayers() {

  setInterval(() => {

    // If the current section is not "stack", return (to imporve performance)
    if (currentSection !== "stack") return;

    // Get a random layer and a random angle for rotation
    let randomLayer = Math.floor(Math.random() * layersCount);
    let randomAngle = Math.ceil(Math.random() * 3);

    // If the chosen layer has a class of "js-rotate", remove the class => that will make it rotate backwards
    if (cubeLayers[randomLayer].classList.contains("js-rotate")) {

      cubeLayers[randomLayer].classList.remove("js-rotate");

    } else { // If not, add the class

      cubeLayers[randomLayer].style.setProperty("--random-angle", (randomAngle * 90) + "deg");
      setTimeout(() => cubeLayers[randomLayer].classList.add("js-rotate"));

    }

  }, 2500);

})();