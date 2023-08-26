// const navLinks = document.getElementById("menu-container");
// const body = document.querySelector("body");
// const buttonMenu = () => {
//   navLinks.classList.toggle("active");
//   body.classList.toggle("no-scroll");
// };

const body = document.querySelector("body");

function showAdd() {
  const data = document.querySelector(".form-project");
  data.classList.toggle("hidden");
  body.classList.toggle("overflow-y-hidden");
}
