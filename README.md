# SVN Art Gallery

SVN Art Gallery is a responsive static website for a contemporary art gallery. It includes gallery information, exhibition content, product browsing, cart functionality, checkout validation, contact form validation, and a professional shared footer.

This is a group project created by **Victor Ferreira Araujo, Sukhpreet Singh Bhambra, and Nirali Patel** in Semester 1 of the Web Development program at Conestoga College.

## Pages

- **Home**: Professional landing page, featured artists carousel, gallery services accordion, and collection preview.
- **Exhibition**: Current exhibition details, featured works, past exhibition accordion sections, and newsletter signup.
- **Products**: Artwork collection with tabs, product cards, quantity selection, add-to-cart popup, and cart navigation.
- **Cart**: Selected artwork summary, checkout form, credit card validation, order confirmation popup, and timed redirect.
- **About Us**: Hero section, team cards, LinkedIn profile buttons, story content, and selected gallery moments.
- **Contact Us**: Contact information and validated inquiry form.

## Key Features

- Responsive layout for desktop, tablet, and mobile screens.
- Shared navigation and professional footer across all pages.
- Clickable `SVN Art Gallery` brand link to return to the Home page.
- Embedded map in the footer.
- jQuery-based carousel and accordions.
- Product add-to-cart flow with SweetAlert popup.
- Persistent cart using `localStorage`.
- Checkout form with field-level validation.
- Order confirmation popup with redirect to Products after 5 seconds.
- Contact form validation with success messaging.
- Exhibition signup validation.

## Technologies Used

- HTML5
- CSS3
- JavaScript
- jQuery
- jQuery UI
- SweetAlert2
- Lightbox
- Google Maps embed

## Project Structure

```text
.
+-- index.html
+-- pages/
|   +-- aboutUs.html
|   +-- cart.html
|   +-- contactUs.html
|   +-- exhibition.html
|   +-- products.html
+-- css/
|   +-- aboutUs.css
|   +-- cart.css
|   +-- contactUs.css
|   +-- exhibition.css
|   +-- index.css
|   +-- products.css
|   +-- site-header.css
+-- js/
|   +-- aboutUs.js
|   +-- cart.js
|   +-- contactUs.js
|   +-- exhibition.js
|   +-- index.js
|   +-- products.js
|   +-- site.js
+-- images/
```

## Page Credits

- **Home**: Victor Ferreira Araujo
- **Contact Us**: Victor Ferreira Araujo
- **Products**: Sukhpreet Singh Bhambra
- **Cart**: Sukhpreet Singh Bhambra
- **About Us**: Nirali Patel
- **Exhibition**: Nirali Patel

## How To Run

Because this is a static website, no build step is required.

1. Clone or download the repository.
2. Open `index.html` in a browser.
3. Navigate through the site using the header or footer links.

For the most consistent experience, run a local static server:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Testing Summary

The project was tested with:

- JavaScript syntax checks using `node --check`.
- Local link, script, stylesheet, image, and CSS asset validation.
- Headless Chrome browser testing at desktop, tablet, and mobile widths.
- Functional checks for cart, checkout, contact form, exhibition signup, accordions, carousel, footer map, and responsive layout.

Latest test result: **114 / 114 checks passed**.

## Notes

- Cart data is stored in the browser using `localStorage`.
- Checkout payment validation is for demo/browser-side validation only.
- External libraries are loaded through CDN links, so an internet connection is recommended.
