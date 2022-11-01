// Elements
const mainGates = document.querySelectorAll("main .main__gate");

const aosElements = Array.from(document.getElementsByClassName("c-aos"));

const sections = document.querySelectorAll(".c-section");

const navToggleBtns = Array.from(document.getElementsByClassName("nav-toggle-btn"));

export const mobileNav = document.getElementById("mobile-nav");
export const mobileNavOverlay = document.querySelector(".mobile-nav-overlay");
const mobileNavLinks = document.querySelectorAll(".mobile-nav__links li");

const desktopNav = document.getElementById("desktop-nav")
  .querySelector(".desktop-nav__links");
const desktopNavLinks = desktopNav.querySelectorAll(".desktop-nav__link");
const desktopNavLinksIndicator = desktopNav.querySelector(".desktop-nav__links__indicator");

const projectsSectionBtn = document.querySelector(".js-projects-section-btn");

// Imported
import { windowWidth } from "./projects.js";

// Global Variables
let currentSectionIndex = 0;
export let currentSection = "home";

// == AOS EFFECT ==

// An intersectionObserver to make the "animate on scroll" animation
const aosObserver = new IntersectionObserver(animateElement, {
  threshold: .75,
});

// Observe all the elmenets that will animate on scroll
aosElements.forEach(element => aosObserver.observe(element));

function animateElement(entries, observer) {

  // If we're on desktop, stop the animation
  if (windowWidth > 1000) return;

  entries.forEach(entry => {

    if (entry.isIntersecting) { // If the element is intersecting

      // Put it back in its right place
      entry.target.classList.add("js-back-to-origin");

      // Stop observing it
      observer.unobserve(entry.target);

    }

  })

}

// == NAV TOGGLE BUTTONS  ==

navToggleBtns.forEach(btn => { // For each element that has a class of "nav-toggle-btn"

  btn.addEventListener("click", () => { // If the element gets clicked:

    // Specify whether it controls the desktop or mobile nav
    let type = btn.getAttribute("aria-controls");

    if (type == "#desktop-nav") { // If it's controling the desktop nav:

      btn.classList.toggle("js-closed");
      desktopNav.classList.toggle("js-hidden");

      // If it has an "aria-expanded" of true
      if (btn.getAttribute("aria-expanded") == "true") {
        btn.setAttribute("aria-expanded", "false");
      } else { // Otherwise:
        btn.setAttribute("aria-expanded", "true");
      }

    } else { // Else, if it's controling the mobile nav

      mobileNav.classList.toggle("js-show-up");
      mobileNavOverlay.classList.toggle("js-grow");
    }

  });

});


// == DESKTOP NAV LINKS ==

desktopNavLinks.forEach(link => { // For Each link:

  link.addEventListener("click", () => { // When it gets clicked:

    // Get the "--order" custom property
    let linkOrder = +getComputedStyle(link).getPropertyValue("--order");

    // Get the targeted section
    let targetedSection = link.querySelector("a").dataset.section;

    currentSection = targetedSection;

    // Move to the chosen section
    moveToChosenSection(link, targetedSection, linkOrder);

  });

});


// The button in the homeSection
projectsSectionBtn.addEventListener("click", () => {
  moveToChosenSection(desktopNavLinks[2], "projects", 2);
});


function moveToChosenSection(clickedLink, targetedSection, linkOrder) {

  // calculate how many sections we will move
  let difference = linkOrder - currentSectionIndex;

  // If the user clicked the current section button, do nothing
  if (difference === 0) return;

  // Close the two decorative divisions in the main
  mainGates.forEach(gate => gate.classList.add("js-close"));

  // Update the "currentSectionIndex" variable
  currentSectionIndex = linkOrder;

  // Remove the "js-current" class from all the links
  desktopNavLinks.forEach(element => element.classList.remove("js-current"));

  // Animate the "desktopNavLinksIndicator"
  desktopNavLinksIndicator.style.transitionDuration = Math.abs(difference * 250) + "ms";
  setTimeout(() => desktopNavLinksIndicator.style.setProperty("--state", linkOrder));

  // When the animation ends:
  desktopNavLinksIndicator.ontransitionend = () => {

    // Add the "js-current" class to the clicked link
    clickedLink.classList.add("js-current");

  };

  // Wait 500ms (for decoration purposes)
  setTimeout(() => {

    // Show up the targeted section
    sections.forEach(section => {

      section.classList.remove("js-show-up");

      if (section.id == targetedSection) {
        section.classList.add("js-show-up");
      }

    });

    // Open the two decorative divisions in the main
    mainGates.forEach(gate => gate.classList.remove("js-close"));

  }, 500);

}

// == MOBILE NAV LINKS ==

// Add the "js-current" class to the click link
mobileNavLinks.forEach(link => {

  link.addEventListener("click", () => {

    mobileNavLinks.forEach(link => link.classList.remove("js-current"));
    link.classList.add("js-current");

    link.ontransitionend = (e) => {

      if (e.propertyName === "opacity") {
        mobileNav.classList.remove("js-show-up");
        mobileNavOverlay.classList.remove("js-grow");
      }

    }

  });

})