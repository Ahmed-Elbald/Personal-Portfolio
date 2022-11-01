// Elements 
const emailForm = document.querySelector(".c-section__form");
const formElements = emailForm.querySelectorAll(".c-section__form__element");

const formMessageStatus = document.querySelector(".form-message-status");

// Imported
import { language } from "./language.js";

// Global Varibales
const translition = {
  "name": {
    "ar": "الأسم",
    "en": "Name",
  },
  "email": {
    "ar": "البريد الألكتروني",
    "en": "Email",
  },
  "message": {
    "ar": "رسالتك",
    "en": "Your message",
  },
  "submit": {
    "ar": "أرسل",
    "en": "Send",
  },
}

const MessageStatus = {
  sucsess: {
    "en": "<i class='fa-regular fa-circle-check'> </i> Your message was sent.",
    "ar": "<i class='fa-regular fa-circle-check'> </i> لقد تم ارسال رسالتك.",
  },
  failure: {
    "en": "<i class='fa-solid fa-circle-exclamation'> </i> Error sending your message. <br> Try again.",
    "ar": "<i class='fa-solid fa-circle-exclamation'> </i> حدث خطأ أثتاء ارسال رسالتك، حاول مجددا.",
  }
}


// A function to translate the placeholders and values of the form elements
export function translateForm(language) {

  formElements.forEach(element => { // For each element:

    // If it's the submit button, translate the "value" attribute
    if (element.getAttribute("type") == "submit") {

      element.setAttribute("value", translition["submit"][language]);

    } else { // If it's not, translate the "placeholder" attribute

      element.setAttribute("placeholder", translition[element.getAttribute("name")][language]);

    }

  });

}

// Get the Email.js Service data
fetch("./data/email-service-data.json").then(async response => {

  let serviceData = await response.json();

  // Initialize the service
  (function () {
    emailjs.init(serviceData.publicKey);
  })();

  // When the form gets submitted
  emailForm.addEventListener("submit", (e) => {

    // Prevent the normal behavior
    e.preventDefault();

    // Set the message content
    let MessageData = {
      name: emailForm.querySelector(".c-section__form__name").value,
      email: emailForm.querySelector(".c-section__form__email").value,
      message: emailForm.querySelector(".c-section__form__message").value,
    }

    // Send the mesaage
    emailjs.send(serviceData.serviceId, serviceData.templateId, MessageData).then(message => {

      // Show the staus of the message
      if (message.status === 200) {

        formMessageStatus.innerHTML = MessageStatus["sucsess"][language];

      } else {

        formMessageStatus.innerHTML = MessageStatus["failure"][language];

      }

      // Show up the confirmation message
      showConfirmationMessage();

    }).catch(() => { // If an error occured:

      formMessageStatus.innerHTML = MessageStatus["failure"][language];
      showConfirmationMessage();

    });

  });

})


function showConfirmationMessage() {
  formMessageStatus.classList.add("js-show-up");
  setTimeout(() => formMessageStatus.classList.remove("js-show-up"), 3000);
}