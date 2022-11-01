// Imported
import { windowWidth } from "./projects.js";

// Global variables
export let currentImg;
const myBirthday = "2004/11/23";
const myAge = Math.trunc(
  (new Date() - new Date(myBirthday)) / (1000 * 3600 * 24 * 365)
);

export const certificateGallery = document.querySelector(".c-section--about .c-section__certificate-gallery");
const certificateImgs = certificateGallery.querySelectorAll("img");
const closeBtn = certificateGallery.querySelector(".close-btn");


setMyAge();
export function setMyAge() {

  const myAgeSpan = document.querySelector(".js-my-age");
  myAgeSpan.textContent = myAge;

}


closeBtn.addEventListener("click", () => certificateGallery.classList.remove("js-grow"));

manageGallery();
export function manageGallery() {

  // Get the certificateBtns
  // (I'm redeclaring it everytime the function gets triggered because they get changed while transilating the document)
  const certificateBtns = document.querySelectorAll(".c-section--about .certificate-btn");

  certificateBtns.forEach(btn => { // For each button:

    btn.addEventListener("click", (e) => { // When the button gets clicked:

      // Get the image it targets
      let btnTargetedImg = btn.dataset.img;

      // If it's the image that's currently opened:
      if (currentImg === btnTargetedImg) {

        // Hide it and return
        hideGallery();
        return;

      }

      // Update the currentImg variable
      currentImg = btnTargetedImg;

      // Show up the targeted img
      certificateImgs.forEach(img => {

        img.classList.remove("js-visible");
        if (img.dataset.img === btnTargetedImg) img.classList.add("js-visible");

      });

      // If we're on desktop, adjust the gallery position to be right above the button
      if (windowWidth > 1000) {

        certificateGallery.style.top = e.clientY + "px";
        certificateGallery.style.left = e.clientX + "px";

      }

      // Show up the gallery
      certificateGallery.classList.add("js-grow");

    });
  })

}

export function hideGallery() {

  certificateGallery.classList.remove("js-grow");
  currentImg = null;

}