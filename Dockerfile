FROM nginx:alpine 
#uses a small Nginx web server image.

COPY . /usr/share/nginx/html 
#copies your website files into Nginx’s public web folder.

EXPOSE 80
#tells Docker that the website runs on port 80 inside the container.