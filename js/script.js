// Toggle
const navbarNav = document.querySelector(".navbar-nav");

document.querySelector("#hamburger-menu").onclick = () => {
  navbarNav.classList.toggle("active");
  event.preventDefault();
};

// Back to Top
window.onscroll = function () {
  const navBar = document.querySelector(".navbar");
  const navOffset = navBar.offsetTop;
  const toTop = document.querySelector(".to-top");
  if (window.scrollY > navOffset) {
    toTop.classList.add("flex");
    toTop.classList.remove("hidden");
  } else {
    toTop.classList.add("hidden");
    toTop.classList.remove("flex");
  }
};

// Shopping Cart
const shoppingCart = document.querySelector(".shopping-cart");

document.querySelector("#shopping-cart-btn").onclick = () => {
  shoppingCart.classList.toggle("active");
  event.preventDefault();
};

// Shopping Cart All Btn
// scBtn.forEach((btn) => {
//     btn.onclick = (e) => {
//         shoppingCart.classList.toggle('active');
//         event.preventDefault();
//     };
// });

// Tutup Sidebar
const hamburgerMenu = document.querySelector("#hamburger-menu");
const scBtn = document.querySelector("#shopping-cart-btn");

document.addEventListener("click", function (e) {
  if (!hamburgerMenu.contains(e.target) && !navbarNav.contains(e.target)) {
    navbarNav.classList.remove("active");
  }

  if (!scBtn.contains(e.target) && !shoppingCart.contains(e.target)) {
    shoppingCart.classList.remove("active");
  }
});
