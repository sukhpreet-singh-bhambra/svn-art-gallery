"use strict";
$(document).ready(() => {
  const $artistScroller = $("#artistScroller");
  const $artistButtons = $(".artistScrollButton");
  const $artistProgressBar = $("#artistScrollProgressBar");

  function getArtistScrollAmount() {
    const $firstCard = $artistScroller.find("li").first();
    return $firstCard.outerWidth(true) || 420;
  }

  function updateArtistScrollerState() {
    const scrollLeft = $artistScroller.scrollLeft();
    const maxScroll = $artistScroller[0].scrollWidth - $artistScroller.outerWidth();
    const progress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 100;

    $artistProgressBar.css("width", `${Math.max(0, Math.min(100, progress))}%`);
    $artistButtons.filter('[data-direction="-1"]').prop("disabled", scrollLeft <= 2);
    $artistButtons.filter('[data-direction="1"]').prop("disabled", scrollLeft >= maxScroll - 2);
  }

  $(".artistScrollButton").on("click", function () {
    const direction = Number.parseInt($(this).data("direction"), 10);
    $artistScroller.stop().animate(
      {
        scrollLeft: $artistScroller.scrollLeft() + direction * getArtistScrollAmount(),
      },
      420,
      updateArtistScrollerState
    );
  });

  $artistScroller.on("wheel", function (event) {
    if (Math.abs(event.originalEvent.deltaY) <= Math.abs(event.originalEvent.deltaX)) {
      return;
    }

    event.preventDefault();
    $(this).scrollLeft($(this).scrollLeft() + event.originalEvent.deltaY);
  });

  $artistScroller.on("scroll", updateArtistScrollerState);
  $(window).on("resize", updateArtistScrollerState);
  updateArtistScrollerState();

  // Activate Accordion on Services Section
  $("#accordion").accordion({
    heightStyle: "content",
    collapsible: true,
  });

  const currYear = new Date().getFullYear();
  $("#displayCurrentYear").text(currYear);
});
