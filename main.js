//toggle icon navbar
let menuIcon = document.querySelector("#menu-icon");
let navbar = document.querySelector(".navbar");

menuIcon.onclick = () => {
  menuIcon.classList.toggle("bx-x");
  navbar.classList.toggle("active");
};

// Keep each section's reveal animation after its first appearance.
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("header nav a[href^='#']");
const updateScrollState = () => {
  sections.forEach((sec) => {
    let top = window.scrollY;
    let offset = sec.offsetTop - 100;
    let height = sec.offsetHeight;
    let id = sec.getAttribute("id");

    if (top + window.innerHeight > sec.offsetTop + 80) sec.classList.add("show-animate");
    if (top >= offset && top < offset + height) {
      navLinks.forEach((links) => {
        links.classList.remove("active");
        if (links.getAttribute("href") === `#${id}`) links.classList.add("active");
      });
    }
  });

  document.querySelector("header").classList.toggle("sticky", window.scrollY > 100);
  menuIcon.classList.remove("bx-x");
  navbar.classList.remove("active");

  if (window.innerHeight + window.scrollY >= document.scrollingElement.scrollHeight - 2) {
    document.querySelector("footer").classList.add("show-animate");
  }
};
window.addEventListener("scroll", updateScrollState, { passive: true });
window.addEventListener("load", updateScrollState);

function showAlert() {
  Swal.fire({
      icon: 'info',
      title: 'Maaf, Sekarang aku belum punya Twitter hehe',
      showConfirmButton: false,
      timer: 20000,
      customClass : {
        title: 'custom-tittle-class'
      }
  });
}

function showGreetingAlert() {
  Swal.fire({
      icon: 'error',
      title: 'Lagi males ngomong',
      confirmButtonText: 'OK'
  });
}

function showReminderAlert() {
  Swal.fire({
      icon: 'warning',
      title: 'Jangan pelit senyum :D',
      confirmButtonText: 'OK'
  });
}
