"use strict";

$(document).ready(function () {
  $("#artTabs").tabs();

  const descriptions = {
    "Mountain with Rings":
      "A surreal mountain landscape with luminous circular forms, ideal for collectors who prefer calm, architectural compositions.",
    "Woman On Horse":
      "A moonlit figurative piece with cinematic contrast, soft movement, and a strong romantic focal point.",
    "Skull With Flames":
      "A bold dramatic work with high contrast and intense color, created for spaces that can carry a powerful statement.",
    "Majestic Mountains":
      "A refined landscape study with atmospheric depth, layered peaks, and a peaceful sense of scale.",
    "Flower Painting":
      "A vibrant floral composition that brings warmth, color, and an inviting focal point to a room.",
    "Autumn Tree":
      "A quiet seasonal work built around texture, negative space, and the reflective mood of late autumn.",
    Anime:
      "A curated set of expressive character artworks with polished color, stylized portraiture, and strong visual energy.",
    Animals:
      "A collection of wildlife portraits that balances realism, personality, and decorative impact.",
    Cars:
      "A dynamic automotive collection featuring performance, polish, and clean gallery-ready presentation.",
    Birds:
      "A bright collection of bird studies with varied color, movement, and natural detail.",
    Fruits:
      "A playful still-life collection with saturated color and clean, modern presentation.",
    "Modern Art":
      "A contemporary abstract collection with bold shapes, layered color, and flexible styling for modern interiors.",
  };

  $(".artGridCell").each(function (index) {
    const $card = $(this);
    const title = $card.find(".artHeading").text().trim();
    const rating = index % 3 === 1 ? "\u2605\u2605\u2605\u2605\u2605" : "\u2605\u2605\u2605\u2605\u2606";

    $card.find(".artInformation").text(descriptions[title] || descriptions["Modern Art"]);
    $card.find(".artReview").text(rating);
    $card.find(".artSelectQuantity").attr("id", `quantityProduct${index + 1}`);
    $card.find(".artLabelQuantity").attr("for", `quantityProduct${index + 1}`);
  });

  const slideshows = [
    { image: "#artCollectionImageOne", links: "#imageListOne a", speed: 5000 },
    { image: "#artCollectionImageTwo", links: "#imageListTwo a", speed: 6000 },
    { image: "#artCollectionImageThree", links: "#imageListThree a", speed: 7000 },
    { image: "#artCollectionImageFour", links: "#imageListFour a", speed: 8000 },
    { image: "#artCollectionImageFive", links: "#imageListFive a", speed: 9000 },
    { image: "#artCollectionImageSix", links: "#imageListSix a", speed: 10000 },
  ];

  slideshows.forEach(({ image, links, speed }) => {
    const $image = $(image);
    const imageCache = $(links)
      .map(function () {
        const img = new Image();
        img.src = this.href;
        return img;
      })
      .get();
    let counter = 0;

    if (!$image.length || imageCache.length === 0) {
      return;
    }

    setInterval(() => {
      counter = (counter + 1) % imageCache.length;
      $image.fadeOut(500, () => {
        $image.attr("src", imageCache[counter].src).fadeIn(500);
      });
    }, speed);
  });

  function createCartId(title) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  $(".artAddToCartButton").on("click", function () {
    const $artDetailsCard = $(this).closest(".artDetails");
    const artTitle = $artDetailsCard.find(".artHeading").text().trim();
    const artPrice = Number.parseInt(
      $artDetailsCard.find(".artPrice").text().replace(/[^0-9]/g, ""),
      10
    );
    const artQuantity = Number.parseInt(
      $artDetailsCard.find(".artSelectQuantity").val(),
      10
    );

    if (artQuantity > 0 && artQuantity < 11) {
      window.SVNStore.addToCart({
        id: createCartId(artTitle),
        title: artTitle,
        price: artPrice,
        quantity: artQuantity,
      });

      Swal.fire({
        title: "Added to Cart",
        html: `${artTitle} quantity x${artQuantity} has been added.`,
        icon: "success",
        showDenyButton: true,
        confirmButtonText: "Continue Shopping",
        denyButtonText: "View Cart",
        reverseButtons: true,
      }).then((result) => {
        if (result.isDenied) {
          window.location.href = "cart.html";
        }
      });

      $artDetailsCard.effect("highlight", {}, 1200);
      $artDetailsCard.find(".artSelectQuantity").val(0);
    } else {
      Swal.fire({
        title: "Cart Update Error",
        text: "Quantity must be between 1 and 10.",
        icon: "error",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  });

  $("#displayCurrentYear").text(new Date().getFullYear());
});
