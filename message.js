function showLoadingAlert() {
  Swal.fire({
    icon: "info",
    title: "Loading...",
    showConfirmButton: false,
    allowOutsideClick: false,
    willOpen: () => {
      Swal.showLoading();
    },
  });
}

function showSuccessAlert() {
  Swal.fire({
    icon: "success",
    title: "Pesan telah terkirim!",
    showConfirmButton: false,
    timer: 1500,
    customClass: {
      title: "custom-title-class2",
    },
    didClose: () => {
      location.reload(); //refresh halaman setelah alert sukses ditutup
    },
  });
}

function handleSubmit() {
  const fullNameInput = document.querySelector('input[placeholder="Full Name"]');
  const emailInput = document.querySelector('input[placeholder="Email Address"]');
  const messageInput = document.querySelector('textarea[placeholder="Your Message"]');
  const fullName = fullNameInput.value;
  const email = emailInput.value;
  const message = messageInput.value;

  // Validasi penulisan email
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (fullName && email && message) {
    if (emailPattern.test(email)) {
      showLoadingAlert();

      const scriptURL = "https://script.google.com/macros/s/AKfycbzDIzl5a61ecSJdvWU2vCxR24nSXuh1N4fLGMaaDXUGwKICvlEmPfsGI_XAfUFmYExs/exec";
      const form = document.forms["gioks-contact-form"];

      fetch(scriptURL, { method: "POST", body: new FormData(form) })
        .then((response) => {
          console.log("Success!", response);
          closeLoadingAlert();
          showSuccessAlert();
        })
        .catch((error) => {
          console.error("Error!", error.message);
          closeLoadingAlert();
        });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: 'Mohon gunakan karakter "@" dalam penulisan email',
        confirmButtonText: "OK",
      });
    }
  } else {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Mohon isi semua pesan sebelum mengirim",
      confirmButtonText: "OK",
    });
  }
}

function closeLoadingAlert() {
  Swal.close();
}
