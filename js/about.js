// Global variables
const myBirthday = "2004/11/23";
const myAge = Math.trunc(
  (new Date() - new Date(myBirthday)) / (1000 * 3600 * 24 * 365)
);

setMyAge();
export function setMyAge() {

  const myAgeSpan = document.querySelector(".js-my-age");
  myAgeSpan.textContent = myAge;

}