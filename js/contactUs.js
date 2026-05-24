"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactUsForm");
  const successMessage = document.getElementById("successMessage");
  const requiredFields = [
    "firstName",
    "lastName",
    "gender",
    "email",
    "phone",
    "address1",
    "country",
    "message",
  ];
  const allErrorFields = [...requiredFields, "company", "address2"];

  document.getElementById("submitForm").addEventListener("click", (event) => {
    event.preventDefault();
    clearAllErrors();
    successMessage.style.display = "none";
    successMessage.textContent = "";

    const firstName = getValue("firstName");
    const lastName = getValue("lastName");
    const gender = document.querySelector('input[name="gender"]:checked');
    const email = getValue("email");
    const phone = getValue("phone");
    const company = getValue("company");
    const address1 = getValue("address1");
    const address2 = getValue("address2");
    const country = getValue("country");
    const message = getValue("message");

    let isValid = true;

    if (!isValidName(firstName)) {
      showError("firstName", "Enter 2-50 letters.");
      isValid = false;
    }

    if (!isValidName(lastName)) {
      showError("lastName", "Enter 2-50 letters.");
      isValid = false;
    }

    if (!gender) {
      showError("gender", "Please select a gender.");
      isValid = false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email)) {
      showError("email", "Enter a valid email address.");
      isValid = false;
    }

    if (phone.replace(/\D/g, "").length !== 10) {
      showError("phone", "Enter a valid 10-digit phone number.");
      isValid = false;
    }

    if (company && company.length > 80) {
      showError("company", "Company name must be 80 characters or less.");
      isValid = false;
    }

    if (address1.length < 5 || address1.length > 120) {
      showError("address1", "Enter a valid street address.");
      isValid = false;
    }

    if (address2.length > 120) {
      showError("address2", "Address 2 must be 120 characters or less.");
      isValid = false;
    }

    if (!country) {
      showError("country", "Please select a country.");
      isValid = false;
    }

    if (message.length < 10 || message.length > 500) {
      showError("message", "Message must be 10-500 characters.");
      isValid = false;
    }

    if (isValid) {
      successMessage.textContent = "Form submitted successfully!";
      successMessage.style.display = "block";
      form.reset();
      clearAllErrors();
    }
  });

  document.getElementById("resetForm").addEventListener("click", () => {
    clearAllErrors();
    successMessage.style.display = "none";
    successMessage.textContent = "";
  });

  function getValue(inputId) {
    return document.getElementById(inputId).value.trim();
  }

  function isValidName(value) {
    return /^[A-Za-z][A-Za-z\s'-]{1,49}$/.test(value);
  }

  function showError(inputId, message) {
    const errorElement = document.getElementById(`${inputId}Error`);
    if (errorElement) {
      errorElement.textContent = message;
    }
    setInvalidState(inputId, true);
  }

  function clearError(inputId) {
    const errorElement = document.getElementById(`${inputId}Error`);
    if (errorElement) {
      errorElement.textContent = requiredFields.includes(inputId) ? "*" : "";
    }
    setInvalidState(inputId, false);
  }

  function clearAllErrors() {
    allErrorFields.forEach(clearError);
  }

  function setInvalidState(inputId, isInvalid) {
    const field =
      inputId === "gender"
        ? document.querySelector(".radioInputs")
        : document.getElementById(inputId);

    if (field) {
      field.classList.toggle("fieldInvalid", isInvalid);
    }
  }

  document.getElementById("displayCurrentYear").innerText =
    new Date().getFullYear();
});
