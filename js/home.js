// Elements
export const homeSection = document.querySelector(".c-section--home");
const sectionDecorator = homeSection.querySelector(".c-decorator");
const sectionDecoratorSVG = sectionDecorator.querySelector("svg");
const homeSectionHeader = homeSection.querySelector(".c-section__header--home");
const homeSectionSubheader = homeSection.querySelector(".c-section__subheader");

// Imported
import { language } from "./language.js";
import { currentSection } from "./main.js";


// Global Vriables
let stopTyping = false;
let startPoint = 0;
const letterTimeout = 250;

const textSapn = homeSectionSubheader.querySelector(".c-section__subheader__text");
const caretSpan = homeSectionSubheader.querySelector(".c-section__subheader__caret");

let currentPhrase;
let currentPhraseIndex = 0;
let currentPhraseLength;
let currentLetterIndex;
let tempPhrase;

const subheaderPhrases = {
  ar: ["أسمي أحمد سعد", "مطور واجهات أمامية للمواقع"],
  en: ["I’m Ahmed", "Frontend developer"]
}

const headerPhrases = {
  en: "Hello There...",
  ar: "السلام عليكم.."
}

const homeSectionMiddleX = homeSection.clientWidth / 2;
const homeSectionMiddleY = homeSection.clientHeight / 2;


homeSection.addEventListener("mousemove", (e) => {
  if (currentSection !== "home") return;

  // requestAnimationFrame(move);

  // function move() {
  //   let xAxis = (e.offsetX - homeSectionMiddleX) * .2;
  //   let yAxis = (e.offsetY - homeSectionMiddleY) * .5;

  //   sectionDecoratorSVG.style.transform = `translate(${-xAxis}px, ${-yAxis}px)`;
  // }

  // requestAnimationFrame(move);

});


adjustSectionHeader("en");
export function adjustSectionHeader(currentLanguage) {

  // Empty the Section header
  homeSectionHeader.innerHTML = "";

  // Get the phrase according to the current language
  let currentPhrase = headerPhrases[currentLanguage];

  if (currentLanguage == "en") { // If the current language is English:

    // Split the phrase into letters to do the animation

    // Make a new element and assign it a class
    const headerLetter = document.createElement("span");
    headerLetter.classList = "c-section__header__letter";

    // For every letter in the phrase:
    for (let i of currentPhrase) {

      // Make a clone of the headerLetter
      let clone = headerLetter.cloneNode(true);
      clone.textContent = i;

      // Squeeze it when it's hovered
      clone.addEventListener("mouseover", () => {

        clone.classList.add("js-squeeze");

      });

      // When the squeezing animation ends, put the letter back to its normal
      clone.addEventListener("animationend", () => {

        clone.classList.remove("js-squeeze");

      });

      homeSectionHeader.appendChild(clone);

    }

  } else { // If the current language is Arabic, just insert the phrase as it is.

    homeSectionHeader.textContent = currentPhrase;

  }

}

// Waiting for the language variable to get initialized
setTimeout(() => {
  chooseNextPhrase()
  requestAnimationFrame(typeLetter);
})


function typeLetter(timestamp) {

  // If 250ms have elapsed since the last insertion of a letter
  if (timestamp - startPoint > letterTimeout && !stopTyping) {

    startPoint = timestamp; // Set our new startPoint to the current timestamp
    setNewContent(); // Set a new content

  }

  requestAnimationFrame(typeLetter)

}

function setNewContent() {

  // Set the tempPhrase to the last value plus another letter
  tempPhrase = currentPhrase.slice(0, ++currentLetterIndex);

  // Update the span's textContent
  textSapn.textContent = tempPhrase;

  // If it's the last letter in the phrase:
  if (currentLetterIndex === currentPhraseLength) {

    // Choose the next phrase
    chooseNextPhrase();

    // Adjust the element's style
    adjustElementStyle();

  };

}


export function chooseNextPhrase() {

  // If the current phrase is the last one, start over.
  if (currentPhraseIndex === subheaderPhrases[language].length) currentPhraseIndex = 0;

  // Update the currentPhrase variable
  currentPhrase = subheaderPhrases[language][currentPhraseIndex++];

  // Reset the variables related to it
  currentPhraseLength = currentPhrase.length;
  currentLetterIndex = 0;
  tempPhrase = currentPhrase[0];

}



async function adjustElementStyle() {

  // After the last letter of the currentPhrase was inserted:
  stopTyping = true;

  // Wait 800ms (For decoration Purposes) and then:
  // 1- Set the width of the ::before to 100%
  // 2- Set the backgroundColor of the caretSpan to transparent
  setTimeout(() => homeSectionSubheader.classList.add("js-fading"), 1000);

  // When the above transition ends, wait 800ms and then:
  // 1- Set the width of the ::before to 0 again
  // 2- Set the backgroundColor of the caretSpan to its default
  homeSectionSubheader.ontransitionend = () => {
    setTimeout(() => {

      // Make the transitoin sudden
      homeSectionSubheader.style.setProperty("--transition-duration", "0s");
      homeSectionSubheader.classList.remove("js-fading");

      // Put the transition back to be smooth
      setTimeout(() => {
        homeSectionSubheader.style.setProperty("--transition-duration", "2s");
      }, 100);

      // After adjusting the style of the element....
      stopTyping = false;

    }, 800);

  };

}