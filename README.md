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
- Docker
- Docker Compose
- Docker named volumes
- Nginx
- Docker Hub
- Git and GitHub
- Vercel

## Project Structure

```text
.
+-- index.html
+-- Dockerfile
+-- docker-compose.yml
+-- docker-compose.volume.yml
+-- .dockerignore
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

## Docker Setup

The project can also run inside a Docker container using Nginx. This is useful when we want everyone to run the website in the same server environment instead of opening the HTML files directly.

### Dockerfile

The `Dockerfile` uses the lightweight `nginx:alpine` image:

```dockerfile
FROM nginx:alpine
COPY . /usr/share/nginx/html
EXPOSE 80
```

Nginx serves static websites from `/usr/share/nginx/html`, so the project files are copied into that folder. We do not need a `WORKDIR` for this project because there is no build command, package install, or app startup command that depends on a working directory.

### Docker Compose

The `docker-compose.yml` file builds and runs the website with these settings:

- **Image name**: `sukhbhambra/svn-art-gallery:prod-v1.0.1`
- **Container name**: `svn-art-gallery-web-prod-v1.0.1-container`
- **Host port**: `8081`
- **Container port**: `80`
- **Web root inside container**: `/usr/share/nginx/html`

The Compose file also uses read-only bind mounts:

```yaml
volumes:
  - ./index.html:/usr/share/nginx/html/index.html:ro
  - ./css:/usr/share/nginx/html/css:ro
  - ./images:/usr/share/nginx/html/images:ro
  - ./js:/usr/share/nginx/html/js:ro
  - ./pages:/usr/share/nginx/html/pages:ro
```

These mounts map the local website files into the running container. When we edit HTML, CSS, JavaScript, or image files locally, the container serves those updated files without needing to rebuild the image.

Because the Compose file includes both `build` and `image`, Docker builds the image from the local `Dockerfile` and tags it as `sukhbhambra/svn-art-gallery:prod-v1.0.1`.

### Run With Docker

```bash
docker compose up --build
```

Then open:

```text
http://localhost:8081
```

To run the container in the background:

```bash
docker compose up --build -d
```

To stop and remove the container and network:

```bash
docker compose down
```

To check the running container:

```bash
docker ps
```

To view container logs:

```bash
docker logs svn-art-gallery-web-prod-v1.0.1-container
```

### Docker Hub Note

The image name uses a Docker Hub repository format:

```text
sukhbhambra/svn-art-gallery:prod-v1.0.1
```

If the image is pushed to Docker Hub, other users can pull and run that image. The current Compose setup is best for local development because it uses bind mounts. Those mounted local files override the files copied into the image while the container is running.

To test only the pushed Docker Hub image, run without local bind mounts, for example:

```bash
docker run --name svn-art-gallery-web-prod-v1.0.1-container -p 8081:80 sukhbhambra/svn-art-gallery:prod-v1.0.1
```

### Docker Volume Practice

The `docker-compose.volume.yml` file is included for practicing Docker named volumes. It is separate from the main `docker-compose.yml` file so the normal project setup stays simple.

This practice file includes three services:

- `web`: runs the SVN Art Gallery site and mounts a named volume into Nginx's web root.
- `backup`: creates a compressed backup of the named volume.
- `restore`: restores the named volume from the backup file.

The named volume is:

```text
svn-art-gallery-volume
```

Start the volume-practice website:

```bash
docker compose -f docker-compose.volume.yml up -d web
```

Then open:

```text
http://localhost:8082
```

Create a backup of the named volume:

```bash
docker compose -f docker-compose.volume.yml --profile backup run --rm backup
```

This creates a backup file in:

```text
volume-backups/svn-art-gallery-volume-backup.tar.gz
```

Stop the practice container and remove the Compose-managed volume:

```bash
docker compose -f docker-compose.volume.yml down -v
```

Recreate the empty volume by starting the practice website again:

```bash
docker compose -f docker-compose.volume.yml up -d web
```

Restore the volume from the backup file:

```bash
docker compose -f docker-compose.volume.yml --profile restore run --rm restore
```

Restart the website container after restoring:

```bash
docker compose -f docker-compose.volume.yml restart web
```

The `volume-backups/` folder is generated locally and is ignored by Git because backup archives should not usually be committed to the repository.

### Port Notes

The site is mapped to `8081:80` because port `8080` was already being used on the host machine. If `8081` is also unavailable, change only the left side of the port mapping in `docker-compose.yml`:

```yaml
ports:
  - "8082:80"
```

Then open `http://localhost:8082`.

For the volume-practice file, port `8082` is already used by `docker-compose.volume.yml`. If that port is unavailable, change the left side of this mapping in `docker-compose.volume.yml`:

```yaml
ports:
  - "8083:80"
```

Then open `http://localhost:8083`.

### Docker Ignore

The `.dockerignore` file keeps development-only files out of the Docker image, such as `.git`, `README.md`, `Dockerfile`, `docker-compose.yml`, `docker-compose.volume.yml`, and the original source image folder. This keeps the image cleaner and prevents non-website files from being served by Nginx.

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
