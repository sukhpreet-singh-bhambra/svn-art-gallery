"use strict";

(function () {
  const cartKey = "svnArtGalleryCartItems";
  const oldUserKey = "svnArtGallerySignedInUser";
  const isInnerPage = window.location.pathname.includes("/pages/");
  const cartPath = isInnerPage ? "cart.html" : "pages/cart.html";

  localStorage.removeItem(oldUserKey);

  function readJson(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key)) || fallback;
    } catch (error) {
      return fallback;
    }
  }

  function saveJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function getCart() {
    return readJson(cartKey, []);
  }

  function setCart(cart) {
    saveJson(cartKey, cart);
    window.dispatchEvent(new Event("svn:cartChanged"));
  }

  function addToCart(item) {
    const cart = getCart();
    const existing = cart.find((cartItem) => cartItem.id === item.id);

    if (existing) {
      existing.quantity = Math.min(10, existing.quantity + item.quantity);
    } else {
      cart.push(item);
    }

    setCart(cart);
  }

  function getCartCount() {
    return getCart().reduce((total, item) => total + item.quantity, 0);
  }

  function getCartTotal() {
    return getCart().reduce((total, item) => total + item.price * item.quantity, 0);
  }

  function clearCart() {
    setCart([]);
  }

  function createCartLink() {
    const navLinks = document.querySelector(".navLinks");

    if (!navLinks || document.querySelector(".siteCartLink")) {
      return;
    }

    const cartItem = document.createElement("li");
    const isCartPage = window.location.pathname.toLowerCase().endsWith("/cart.html");
    cartItem.innerHTML = `<a class="siteCartLink${isCartPage ? " active" : ""}" href="${cartPath}">Cart <span class="siteCartCount">0</span></a>`;
    navLinks.append(cartItem);
  }

  function updateCartCount() {
    const countBadge = document.querySelector(".siteCartCount");

    if (countBadge) {
      countBadge.textContent = String(getCartCount());
    }
  }

  window.SVNStore = {
    addToCart,
    clearCart,
    getCart,
    getCartCount,
    getCartTotal,
    setCart,
  };

  document.addEventListener("DOMContentLoaded", () => {
    createCartLink();
    updateCartCount();
    window.addEventListener("svn:cartChanged", updateCartCount);
  });
})();
