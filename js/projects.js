// Elements
const galleryStillContainer = document.querySelector(".gallery");
const galleryMovingContainer = galleryStillContainer.querySelector(".gallery__moving-container");

const galleryIndicatorsContainer = document.querySelector(".gallery__indicators");
const galleryIndicators = [];

const nextSlideBtn = galleryStillContainer.querySelector(".gallery__next-btn");
const previousSlideBtn = galleryStillContainer.querySelector(".gallery__previous-btn");

export const loader = document.getElementById("page-loader");

// Imported
import { currentSection } from "./main.js";
import { certificateGallery, hideGallery } from "./about.js";

// Global Variables
export let windowWidth;
let intervalHandler;
let projectsLength;
let numberOfSlides;
let activeSlide = 1;
let itemsPerSlide;

const techologies = {
  "html": "fa-brands fa-html5",
  "css": "fa-brands fa-css3-alt",
  "js": "fa-brands fa-square-js",
  "scss": "fa-brands fa-sass"
}

window.onresize = () => adjustWindowResizing();

// Get the data of the projectsData
fetch("./data/projects.json").then(async response => {

  // Set the initial values of the variables
  let projectsData = await response.json();
  projectsLength = projectsData.length;


  let counter = 0;

  // Insert the projects into the gallery
  for (let i of projectsData) insertItem(i, counter++);

  // Add the indicators (buttons)
  addIndicators();

  // Adjust the appearance according to the window width
  adjustWindowResizing();

  // Move through the slide automatically
  autoSlide();

  // Make the page loader fade
  setTimeout(() => loader.classList.add("js-fade"), 1000);

  // Add event listeners to the next and previous buttons
  nextSlideBtn.addEventListener("click", () => {
    nextSlideBtn.style.pointerEvents = "none";
    moveToNext(1);
  });
  previousSlideBtn.addEventListener("click", () => {
    previousSlideBtn.style.pointerEvents = "none";
    moveToPrevious(1)
  });
});


const galleryItem = document.createElement("div");
galleryItem.className = "gallery__item";

function insertItem(data, counter) {

  // Make a clone of the galleryItem
  let galleryItemClone = galleryItem.cloneNode(true);
  galleryItemClone.dataset.id = counter;

  // Get the repository title
  let repoTitle = data.title;

  // Set the innerHTML of the galleryItemClone
  galleryItemClone.innerHTML =
    `
    <div class="c-triangle c-triangle--top" style="--dimention: 30px" data-lang=""></div>
    <div class="c-triangle c-triangle--bottom" style="--dimention: 30px" data-lang=""></div>
    <img src="images/${repoTitle}.webp" alt="" class="gallery__item__img">
    <div class="gallery__item__content">
      <h3 class="gallery__item__title">${repoTitle.replaceAll("-", " ")}</h3>
      <div class="gallery__item__links">
        <a href="https://ahmed-elbald.github.io/${repoTitle}/" target="_blank">
          <i class="fa-solid fa-eye" aria-hidden="true"></i>
          <span class="u-sr-only">Live Preview</span>
        </a>
        <a href="https://github.com/Ahmed-Elbald/${repoTitle}/" target="_blank">
          <i class="fa-brands fa-github" aria-hidden="true"></i>
          <span class="u-sr-only">Github Repository</span>
        </a>
      </div>
      <div class="gallery__item__technologies"></div>
    </div>
  `

  // Get the division that wraps the technologies and set its content
  let galleryItemTech = galleryItemClone.querySelector(".gallery__item__technologies");
  let icon = document.createElement("i");

  for (let i of data["technologies"]) {

    let iconClone = icon.cloneNode(true);
    iconClone.className = techologies[i];
    galleryItemTech.appendChild(iconClone);

  }

  // Append the item to the gallery
  galleryMovingContainer.appendChild(galleryItemClone)

}

function addIndicators() {

  // Empty the galleryIndicatorsContainer
  galleryIndicatorsContainer.innerHTML = "";

  // Update the numberOfSlides variable according to the screen size
  numberOfSlides = Math.floor(projectsLength / itemsPerSlide);

  // Insert a number of indicators equal to the number of slides
  let galleryIndicator = document.createElement("button");
  galleryIndicator.className = "gallery__indicator";

  for (let i = 0; i < numberOfSlides; i++) {

    // Get a clone of the galleryIndicator
    let galleryIndicatorClone = galleryIndicator.cloneNode(true);

    // Distinguish it with a unique "data-id" attribute
    galleryIndicatorClone.ariaLabel = `Slide ${i + 1}`;
    galleryIndicatorClone.dataset.id = i;

    // Add an event listener for when it's clicked
    galleryIndicatorClone.addEventListener("click", (e) => moveToChosenSlide(e));

    // Push it into the galleryIndicators array to use it later on
    galleryIndicators.push(galleryIndicatorClone);

    // Append it to the galleryIndicatorsContainer
    galleryIndicatorsContainer.appendChild(galleryIndicatorClone);

  }

  // Mark the Current Indicator
  adjustCurrentIndicator();

}


function moveToNext(difference) {

  // If the last move was done, return (Recursive function)
  if (difference === 0) return;

  // Make the transition smooth
  galleryMovingContainer.style.transition = `transform 700ms`;
  galleryMovingContainer.classList.add("js-move-to-next");

  // Increase the activeSlide
  activeSlide++;

  // If it's the last slide, start over
  if (activeSlide === numberOfSlides) {
    activeSlide = 0;
  }

  // Mark the current indicator
  adjustCurrentIndicator();

  // When the transition ends
  galleryMovingContainer.ontransitionend = (e) => {

    if (e.propertyName == "transform") {

      // Get the first 1, 2 or 3 (according to the numberOfSlides) elements in the gallery and insert them to the back
      for (let i = 0; i < itemsPerSlide; i++) {

        galleryMovingContainer.insertAdjacentElement("beforeend", galleryMovingContainer.firstElementChild);

      }

      // Put the gallery back to it's original position but suddenly
      galleryMovingContainer.style.transition = `transform 0s`;
      galleryMovingContainer.classList.remove("js-move-to-next");

      // Activate the nextSlideBtn again
      nextSlideBtn.style.pointerEvents = "all";

      // Trigger the function again
      setTimeout(() => moveToNext(difference - 1, true));

    }

  }

}

function moveToPrevious(difference) {

  // If the last move was done, return (Recursive function)
  if (difference === 0) return;

  // Make the transition smooth
  galleryMovingContainer.style.transition = `transform 700ms`;
  galleryMovingContainer.classList.add("js-move-to-previous");

  // Increase the activeSlide
  activeSlide--

  // If it's the last slide, start over
  if (activeSlide === -1) {
    activeSlide = numberOfSlides - 1;
  }

  // Mark the current indicator
  adjustCurrentIndicator();

  // When the transition ends
  galleryMovingContainer.ontransitionend = (e) => {

    if (e.propertyName == "transform") {

      // Get the first 1, 2 or 3 (according to the numberOfSlides) elements in the gallery and insert them to the back
      for (let i = 0; i < itemsPerSlide; i++) {

        galleryMovingContainer.insertAdjacentElement("afterbegin", galleryMovingContainer.lastElementChild);

      }

      // Put the gallery back to it's original position but suddenly
      galleryMovingContainer.style.transition = `transform 0s`;
      galleryMovingContainer.classList.remove("js-move-to-previous");

      // Activate the nextSlideBtn again
      previousSlideBtn.style.pointerEvents = "all";

      // Trigger the function again
      setTimeout(() => moveToPrevious(difference - 1, true));

    }

  }

}

function moveToChosenSlide(event) {

  // Stop the autoSlide
  clearInterval(intervalHandler);

  // Get the chosen slide and calcualte the difference between it and the current slide
  let chosenSlide = +event.target.dataset.id;
  let difference = chosenSlide - activeSlide;

  if (difference > 0) { // If the difference is a positive integer:

    // Move forwards
    moveToNext(difference, true)

  } else if (difference < 0) {

    // Move backwards
    moveToPrevious(-difference, true);

  }
}


function adjustCurrentIndicator() {

  galleryIndicators.forEach(indicator => {

    indicator.classList.remove("js-active");

    if (+indicator.dataset.id === activeSlide) {

      indicator.classList.add("js-active");

    }

  });

}

function autoSlide() {

  // If the galleryStillContainer gets hoverd, stop the auto sliding
  galleryStillContainer.onmouseenter = () => clearInterval(intervalHandler);

  intervalHandler = setInterval(() => {

    if (windowWidth > 1000) {
      if (currentSection === "projects") moveToNext(1);
    } else {
      moveToNext(1);
    }

  }, 2000)
}

function adjustWindowResizing() {

  // Hide the gallery of the about section (Not related to the projectSection)
  hideGallery();


  windowWidth = window.innerWidth;
  // Set the itemsPerSlide variable according to the screen size
  if (windowWidth > 1300) {
    itemsPerSlide = 3;
  } else {
    if (windowWidth < 1000) {
      certificateGallery.style.top = "50%";
      certificateGallery.style.left = "50%";
    }
    if (windowWidth > 700) {
      itemsPerSlide = 2;
    } else {
      itemsPerSlide = 1;
    }
  }

  // Set the "items-per-slide" custom property to use in order to lay out elements properly
  galleryMovingContainer.style.setProperty("--items-per-slide", itemsPerSlide);

  // Get the active slide
  activeSlide = Math.ceil((galleryMovingContainer.children[2].dataset.id) / 2);

  // If it's the last one, start over
  if (activeSlide === numberOfSlides) activeSlide = 0;

  // Add the indicators according to the screen size
  addIndicators();

}