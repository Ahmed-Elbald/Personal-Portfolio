// Elements
const languageBtns = document.querySelectorAll(".c-language-btn");

// Imported
import { loader } from "./projects.js"
import { adjustSectionHeader, chooseNextPhrase } from "./home.js";
import { setMyAge, manageGallery, certificateGallery, currentImg, hideGallery } from "./about.js";
import { translateForm } from "./contact.js";
import { mobileNav, mobileNavOverlay } from "./main.js";

// Global Variables
export let language = "en";
let translation;

languageBtns.forEach((btn) => {

  btn.addEventListener("click", () => { // When one of the "languageBtns" gets clicked:

    // Get elements related to the language
    const languageRelatedElments = document.querySelectorAll("[data-lang]");

    // Show up the page loader
    loader.classList.remove("js-fade");

    // Close the mobile nav and the overlay
    mobileNav.classList.remove("js-show-up");
    mobileNavOverlay.classList.remove("js-grow");

    // Get the translition
    translation = getTranslition();

    let btnsAriaLabel;

    // Wait 1500ms (for decoration purposes) and then:
    setTimeout(() => {

      if (language === "en") { // If current language is English:

        language = "ar"; // Convert it to Arabic
        btnsAriaLabel = "English"; // Change the "aria-label" attribute of the "languageBtns"
        document.documentElement.style.fontSize = "15px"; // Change the page's font-size
        document.body.classList.add("js-arabic"); // Add "js-arabic" class to the "body"

      } else { // If it's Arabic, do the contrary

        language = "en"
        btnsAriaLabel = "Arabic"
        document.documentElement.style.fontSize = "16px";
        document.body.classList.remove("js-arabic");

      }

      // Change the "aria-label" attribute of the "languageBtns"
      languageBtns.forEach(languageBtn => {
        languageBtn.ariaLabel = `Change Site Language To ${btnsAriaLabel}`;
      });

      // Translate the contact form
      translateForm(language);

      // Translate and adjust the HomeSection' header
      adjustSectionHeader(language);

      // Adjust the HomeSection's subheader
      chooseNextPhrase();


      // Add the "js-ltr" class for "languageRelatedElements" and translate their content
      translation.then(response => {

        languageRelatedElments.forEach(element => {

          element.classList.toggle("js-ltr");

          // If it has a valid "languageKey" then it has a translition
          let languageKey = element.getAttribute("data-lang");
          if (languageKey != "" && languageKey != null) {

            element.innerHTML = response[languageKey][language]

          }

        });


        // Set my age in the AboutSection
        setMyAge();

        // Hide the gallery and add event listeners to its buttons in the aboutSection
        hideGallery();
        manageGallery();

        // Make the loader Fade
        loader.classList.add("js-fade");

      });
    }, 2500)

  });
});

async function getTranslition() {

  if (localStorage.translation) { // If the localStorage has the translition, return it

    return JSON.parse(localStorage.translation);

  } else { // Otherwise:

    // Make a new request
    return await fetch("./data/translition.json")
      .then(async (result) => {

        let response = await result.json();
        localStorage.translation = JSON.stringify(response);
        return response;

      });
  }

}