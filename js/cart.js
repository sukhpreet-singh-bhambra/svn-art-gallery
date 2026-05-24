"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const taxRate = 0.13;
  const standardShipping = 25;
  const freeShippingMinimum = 1000;
  const redirectDelayMs = 5 * 1000;
  const cartItems = document.querySelector("#cartItems");
  const cartPanelCount = document.querySelector("#cartPanelCount");
  const cartSubtotal = document.querySelector("#cartSubtotal");
  const cartShipping = document.querySelector("#cartShipping");
  const cartTax = document.querySelector("#cartTax");
  const cartTotal = document.querySelector("#cartTotal");
  const checkoutButton = document.querySelector("#checkoutButton");
  const checkoutForm = document.querySelector("#checkoutForm");
  const checkoutMessage = document.querySelector("#checkoutMessage");
  const displayCurrentYear = document.querySelector("#displayCurrentYear");
  const orderPopup = document.querySelector("#orderPopup");
  const orderPopupMessage = document.querySelector("#orderPopupMessage");
  const orderRedirectMessage = document.querySelector("#orderRedirectMessage");
  const orderPopupButton = document.querySelector("#orderPopupButton");
  let redirectTimerId = null;
  let redirectCountdownId = null;

  const fields = {
    checkoutName: {
      error: "checkoutNameError",
      validate: (value) =>
        /^[A-Za-z][A-Za-z\s'.-]{1,79}$/.test(value.trim())
          ? ""
          : "Enter a valid full name.",
    },
    checkoutEmail: {
      error: "checkoutEmailError",
      validate: (value) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())
          ? ""
          : "Enter a valid email address.",
    },
    checkoutPhone: {
      error: "checkoutPhoneError",
      validate: (value) => {
        const digits = value.replace(/\D/g, "");
        const normalized = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;

        return normalized.length === 10
          ? ""
          : "Enter a valid 10-digit phone number.";
      },
    },
    checkoutAddress: {
      error: "checkoutAddressError",
      validate: (value) =>
        /^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(value.trim())
          ? ""
          : "Enter a street address with a number and street name.",
    },
    checkoutCity: {
      error: "checkoutCityError",
      validate: (value) =>
        /^[A-Za-z][A-Za-z\s'.-]{1,59}$/.test(value.trim()) ? "" : "Enter a valid city.",
    },
    checkoutProvince: {
      error: "checkoutProvinceError",
      validate: (value) => (value ? "" : "Select a province or state."),
    },
    checkoutPostal: {
      error: "checkoutPostalError",
      validate: (value) => {
        const postal = value.trim();
        const canada = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
        const usa = /^\d{5}(-\d{4})?$/;
        return canada.test(postal) || usa.test(postal)
          ? ""
          : "Enter a valid postal or ZIP code.";
      },
    },
    cardName: {
      error: "cardNameError",
      validate: (value) =>
        /^[A-Za-z][A-Za-z\s'.-]{1,79}$/.test(value.trim())
          ? ""
          : "Enter the name exactly as it appears on the card.",
    },
    cardNumber: {
      error: "cardNumberError",
      validate: (value) => {
        const digits = value.replace(/\D/g, "");

        if (!/^\d{13,19}$/.test(digits)) {
          return "Enter a card number with 13 to 19 digits.";
        }

        return passesLuhnCheck(digits) ? "" : "Enter a valid card number.";
      },
    },
    cardExpiry: {
      error: "cardExpiryError",
      validate: (value) => {
        const match = value.trim().match(/^(\d{2})\/(\d{2})$/);

        if (!match) {
          return "Use MM/YY format.";
        }

        const month = Number.parseInt(match[1], 10);
        const year = 2000 + Number.parseInt(match[2], 10);
        const now = new Date();
        const expiryDate = new Date(year, month, 0);

        if (month < 1 || month > 12) {
          return "Enter a valid expiry month.";
        }

        return expiryDate >= new Date(now.getFullYear(), now.getMonth(), 1)
          ? ""
          : "Card expiry date must be current or future.";
      },
    },
    cardCvv: {
      error: "cardCvvError",
      validate: (value) => (/^\d{3,4}$/.test(value.trim()) ? "" : "Enter a 3 or 4 digit CVV."),
    },
    checkoutTerms: {
      error: "checkoutTermsError",
      validate: (_value, input) => (input.checked ? "" : "Confirm the order details before checkout."),
    },
  };

  function formatCurrency(value) {
    return value.toLocaleString("en-CA", {
      style: "currency",
      currency: "CAD",
    });
  }

  function createTextElement(tagName, className, text) {
    const element = document.createElement(tagName);
    element.className = className;
    element.textContent = text;
    return element;
  }

  function redirectToProducts() {
    window.location.href = "products.html";
  }

  function formatRedirectTime(totalSeconds) {
    return `${totalSeconds} ${totalSeconds === 1 ? "sec" : "secs"}`;
  }

  function startProductsRedirect() {
    let remainingSeconds = redirectDelayMs / 1000;

    clearTimeout(redirectTimerId);
    clearInterval(redirectCountdownId);
    orderRedirectMessage.textContent = `You will be redirected to Products in ${formatRedirectTime(remainingSeconds)}.`;

    redirectCountdownId = setInterval(() => {
      remainingSeconds -= 1;
      orderRedirectMessage.textContent = `You will be redirected to Products in ${formatRedirectTime(remainingSeconds)}.`;

      if (remainingSeconds <= 0) {
        clearInterval(redirectCountdownId);
      }
    }, 1000);

    redirectTimerId = setTimeout(redirectToProducts, redirectDelayMs);
  }

  function showOrderPopup(customerName, orderNumber, total) {
    orderPopupMessage.textContent = `${customerName}, your order ${orderNumber} was placed successfully. Total paid: ${formatCurrency(total)}.`;
    orderPopup.hidden = false;
    orderPopupButton.focus();
    startProductsRedirect();
  }

  function getOrderTotals() {
    const subtotal = window.SVNStore.getCartTotal();
    const itemCount = window.SVNStore.getCartCount();
    const shipping = itemCount === 0 || subtotal >= freeShippingMinimum ? 0 : standardShipping;
    const tax = (subtotal + shipping) * taxRate;

    return {
      subtotal,
      shipping,
      tax,
      total: subtotal + shipping + tax,
    };
  }

  function passesLuhnCheck(cardNumber) {
    let sum = 0;
    let shouldDouble = false;

    for (let index = cardNumber.length - 1; index >= 0; index -= 1) {
      let digit = Number.parseInt(cardNumber[index], 10);

      if (shouldDouble) {
        digit *= 2;

        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
  }

  function setFieldState(input, message) {
    const errorElement = document.querySelector(`#${fields[input.id].error}`);

    errorElement.textContent = message;
    input.setAttribute("aria-invalid", String(Boolean(message)));
    input.classList.toggle("is-invalid", Boolean(message));
    input.classList.toggle("is-valid", !message && getInputValue(input));
  }

  function getInputValue(input) {
    return input.type === "checkbox" ? input.checked : input.value.trim();
  }

  function validateField(input) {
    const field = fields[input.id];

    if (!field) {
      return true;
    }

    const message = field.validate(input.value, input);
    setFieldState(input, message);
    return !message;
  }

  function validateForm() {
    let isValid = true;

    Object.keys(fields).forEach((id) => {
      const input = document.querySelector(`#${id}`);
      const fieldValid = validateField(input);
      isValid = fieldValid && isValid;
    });

    return isValid;
  }

  function formatPhone(value) {
    let digits = value.replace(/\D/g, "");

    if (digits.length === 11 && digits.startsWith("1")) {
      digits = digits.slice(1);
    }

    digits = digits.slice(0, 10);
    const parts = [];

    if (digits.length > 0) {
      parts.push(`(${digits.slice(0, 3)}`);
    }

    if (digits.length >= 4) {
      parts[0] += ")";
      parts.push(` ${digits.slice(3, 6)}`);
    }

    if (digits.length >= 7) {
      parts.push(`-${digits.slice(6, 10)}`);
    }

    return parts.join("");
  }

  function formatCardNumber(value) {
    return value
      .replace(/\D/g, "")
      .slice(0, 19)
      .replace(/(\d{4})(?=\d)/g, "$1 ");
  }

  function formatExpiry(value) {
    const digits = value.replace(/\D/g, "").slice(0, 4);

    if (digits.length < 3) {
      return digits;
    }

    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }

  function renderCart() {
    const cart = window.SVNStore.getCart();
    const itemCount = window.SVNStore.getCartCount();
    const totals = getOrderTotals();

    cartPanelCount.textContent = `${itemCount} ${itemCount === 1 ? "item" : "items"}`;
    cartSubtotal.textContent = formatCurrency(totals.subtotal);
    cartShipping.textContent = totals.shipping === 0 ? "Free" : formatCurrency(totals.shipping);
    cartTax.textContent = formatCurrency(totals.tax);
    cartTotal.textContent = formatCurrency(totals.total);
    checkoutButton.disabled = itemCount === 0;
    cartItems.innerHTML = "";

    if (cart.length === 0) {
      cartItems.append(
        createTextElement(
          "p",
          "cartEmpty",
          "Your cart is empty. Add artwork from the Products page to begin checkout."
        )
      );
      return;
    }

    cart.forEach((item) => {
      const cartItem = document.createElement("article");
      const details = document.createElement("div");
      const controls = document.createElement("div");
      const quantity = document.createElement("input");
      const subtotal = document.createElement("strong");
      const removeButton = document.createElement("button");

      cartItem.className = "cartItem";
      cartItem.dataset.cartId = item.id;
      controls.className = "cartItemControls";

      quantity.className = "cartQuantityInput";
      quantity.type = "number";
      quantity.min = "1";
      quantity.max = "10";
      quantity.value = String(item.quantity);
      quantity.setAttribute("aria-label", `${item.title} quantity`);

      subtotal.textContent = formatCurrency(item.price * item.quantity);
      removeButton.className = "cartRemoveButton";
      removeButton.type = "button";
      removeButton.textContent = "Remove";

      details.append(
        createTextElement("p", "cartItemTitle", item.title),
        createTextElement("span", "cartItemMeta", `${formatCurrency(item.price)} each`)
      );
      controls.append(quantity, subtotal, removeButton);
      cartItem.append(details, controls);
      cartItems.append(cartItem);
    });
  }

  function resetFormState() {
    checkoutForm.reset();
    Object.keys(fields).forEach((id) => {
      const input = document.querySelector(`#${id}`);
      input.classList.remove("is-valid", "is-invalid");
      input.removeAttribute("aria-invalid");
      document.querySelector(`#${fields[id].error}`).textContent = "";
    });
  }

  cartItems.addEventListener("change", (event) => {
    if (!event.target.classList.contains("cartQuantityInput")) {
      return;
    }

    const cartId = event.target.closest(".cartItem").dataset.cartId;
    const nextQuantity = Number.parseInt(event.target.value, 10);
    const cart = window.SVNStore.getCart();
    const item = cart.find((cartItem) => cartItem.id === cartId);

    if (!item || Number.isNaN(nextQuantity)) {
      renderCart();
      return;
    }

    item.quantity = Math.min(10, Math.max(1, nextQuantity));
    window.SVNStore.setCart(cart);
    renderCart();
  });

  cartItems.addEventListener("click", (event) => {
    if (!event.target.classList.contains("cartRemoveButton")) {
      return;
    }

    const cartId = event.target.closest(".cartItem").dataset.cartId;
    const cart = window.SVNStore.getCart().filter((item) => item.id !== cartId);

    window.SVNStore.setCart(cart);
    renderCart();
  });

  checkoutForm.addEventListener("input", (event) => {
    const input = event.target;

    if (input.id === "checkoutPhone") {
      input.value = formatPhone(input.value);
    }

    if (input.id === "cardNumber") {
      input.value = formatCardNumber(input.value);
    }

    if (input.id === "cardExpiry") {
      input.value = formatExpiry(input.value);
    }

    if (input.id === "cardCvv") {
      input.value = input.value.replace(/\D/g, "").slice(0, 4);
    }

    validateField(input);
  });

  checkoutForm.addEventListener("change", (event) => {
    validateField(event.target);
  });

  checkoutForm.addEventListener("submit", (event) => {
    event.preventDefault();
    checkoutMessage.className = "checkoutMessage";

    const cart = window.SVNStore.getCart();

    if (cart.length === 0) {
      checkoutMessage.textContent = "Your cart is empty.";
      checkoutMessage.classList.add("error");
      return;
    }

    if (!validateForm()) {
      checkoutMessage.textContent = "Please fix the highlighted fields before placing your order.";
      checkoutMessage.classList.add("error");
      document.querySelector(".is-invalid")?.focus();
      return;
    }

    const customerName = document.querySelector("#checkoutName").value.trim();
    const orderNumber = `SVN-${Date.now().toString().slice(-6)}`;
    const totals = getOrderTotals();

    window.SVNStore.clearCart();
    renderCart();
    resetFormState();
    checkoutMessage.textContent = `Thank you, ${customerName}. Order ${orderNumber} was placed successfully. Total paid: ${formatCurrency(totals.total)}.`;
    checkoutMessage.classList.add("success");
    showOrderPopup(customerName, orderNumber, totals.total);
  });

  orderPopupButton.addEventListener("click", redirectToProducts);
  window.addEventListener("svn:cartChanged", renderCart);
  renderCart();
  displayCurrentYear.textContent = new Date().getFullYear();
});
