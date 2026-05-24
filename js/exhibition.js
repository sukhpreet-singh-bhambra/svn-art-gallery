"use strict";

$(document).ready(function () {
  $(".exhibitionImageBox").each(function () {
    const title = $(this).data("title");
    $(this)
      .attr({
        role: "group",
        tabindex: "0",
        "aria-label": title,
      })
      .find(".exhibitionOverlay")
      .text(title);
  });

  $(".exhibitionAccordion").attr({
    role: "button",
    tabindex: "0",
    "aria-expanded": "false",
  });

  function toggleAccordion($accordion) {
    const $panel = $accordion.next(".exhibitionPanel");
    const isOpen = $accordion.hasClass("active");

    $(".exhibitionAccordion")
      .not($accordion)
      .removeClass("active")
      .attr("aria-expanded", "false")
      .next(".exhibitionPanel")
      .slideUp(280);

    $accordion.toggleClass("active", !isOpen).attr("aria-expanded", String(!isOpen));
    $panel.stop(true, true)[isOpen ? "slideUp" : "slideDown"](280);
  }

  $(".exhibitionAccordion").on("click", function () {
    toggleAccordion($(this));
  });

  $(".exhibitionAccordion").on("keydown", function (event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleAccordion($(this));
    }
  });

  $("#signupForm").on("submit", function (event) {
    event.preventDefault();

    const email = $("#email").val().trim();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

    if (!isValidEmail) {
      $("#signupMessage").text("Please enter a valid email address.");
      return;
    }

    $("#signupMessage").text("Thank you for signing up for exhibition updates.");
    $(this).trigger("reset");
  });

  $("#displayCurrentYear").text(new Date().getFullYear());
});
