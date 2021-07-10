# Wordpress Application Setup

We will:

- create an nginx vhost config file: /etc/nginx/conf.d/yoursitename.conf
- disable default nginx vhost
- create php-fpm vhost pool config file: /etc/php/7.4/fpm/pool.d/yoursitename.conf (maybe outdated? directory?)
- create log file: /home/yourusername/logs/phpfpm.log
- create database + DB user
- install Wordpress
- do web-based wordpress config (in a dashboard)
- seeding the database with basic values
- enable some extra options
  - auto updates
  - debugging
  - allow repair

---

## Configuring an nginx Virtual Host for Your Website

- updated instructions for commands: https://github.com/groovemonkey/hands_on_linux-self_hosted_wordpress_for_linux_beginners/blob/master/7-set-up-wordpress-site.md

Create our user that will "own" our WP site

```bash
# create our user through a wizard
adduser alexcodes # (go through add-user wizard, or use the 'useradd' command to do this noninteractively)
# create the directory where our user's logs will be stored
mkdir -p /home/alexcodes/logs
# set user permissions to our createdd user, and users in www-data will have group permissions
chown alexcodes:www-data /home/alexcodes/logs/
```

We are going to going to create /etc/nginx/conf.d/yoursitename.conf, disable default nginx vhost, create our php-fpm vhost pool config file (/etc/php7.4/fpm/pool.d/yoursitename.conf - our site needs a pool config file. Going to run each site in a separate pool for security and resource management reasons), create our log file for phpfpm, create DB and DB user, and install Wordpress

- for now, will create the vhost config file for our site: `nano /etc/nginx/conf.d/alexcodes.conf` with the following config:

```
server {
    listen       80;
    server_name  www.alexcodes.me;

    client_max_body_size 20m;

    index index.php index.html index.htm;
    root   /home/alexcodes/public_html;

    location / {
        try_files $uri $uri/ /index.php?q=$uri&$args;
    }

    # pass the PHP scripts to FastCGI server
    location ~ \.php$ {
            # Basic
            try_files $uri =404;
            fastcgi_index index.php;

            # Create a no cache flag
            set $no_cache "";

            # Don't ever cache POSTs
            if ($request_method = POST) {
              set $no_cache 1;
            }

            # Admin stuff should not be cached
            if ($request_uri ~* "/(wp-admin/|wp-login.php)") {
              set $no_cache 1;
            }

            # WooCommerce stuff should not be cached
            if ($request_uri ~* "/store.*|/cart.*|/my-account.*|/checkout.*|/addons.*") {
              set $no_cache 1;
            }

            # If we are the admin, make sure nothing
            # gets cached, so no weird stuff will happen
            if ($http_cookie ~* "wordpress_logged_in_") {
              set $no_cache 1;
            }

            # Cache and cache bypass handling
            fastcgi_no_cache $no_cache;
            fastcgi_cache_bypass $no_cache;
            fastcgi_cache microcache;
            fastcgi_cache_key $scheme$request_method$server_name$request_uri$args;
            fastcgi_cache_valid 200 60m;
            fastcgi_cache_valid 404 10m;
            fastcgi_cache_use_stale updating;


            # General FastCGI handling
            fastcgi_pass unix:/var/run/php/alexcodes.sock;
            fastcgi_pass_header Set-Cookie;
            fastcgi_pass_header Cookie;
            fastcgi_ignore_headers Cache-Control Expires Set-Cookie;
            fastcgi_split_path_info ^(.+\.php)(/.+)$;
            fastcgi_param SCRIPT_FILENAME $request_filename;
            fastcgi_intercept_errors on;
            include fastcgi_params;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|woff|ttf|svg|otf)$ {
            expires 30d;
            add_header Pragma public;
            add_header Cache-Control "public";
            access_log off;
    }

    # deny access to .htaccess files, if Apache's document root
    # concurs with nginx's one
    #
    #location ~ /\.ht {
    #    deny  all;
    #}
}

server {
    listen       80;
    server_name  alexcodes.me;
    rewrite ^/(.*)$ http://www.alexcodes.me/$1 permanent;
}
```

Notice this server block at the bottom - this block is used as a redirect. Performs a redirect from `alexcodes.me` to `http:www.alexcodes.me` in case a user tries to hit `alexcodes.me`

```
server {
    listen       80;
    server_name  alexcodes.me;
    rewrite ^/(.*)$ http://www.alexcodes.me/$1 permanent;
}
```

Our main server block is seen above the redirect block. Points of interest include:

- `server_name alexcodes.me` - the name we identify our site as
- `root /home/alexcodes/public_html;` - we will have a username on our webserver that contains our website files. Most hosting companies call this directory `public_html` so we will keep that standard
- general fastcgi handling - `fastcgi_pass unix:/var/run/php/alexcodes.sock;`. When nginx has to pass a request for a php file to the fastcgi process, use the specified socket to handle the request
  - on the php-fpm side, we'll also have a config option telling it to use this socket file
- `location ~* \.(js|css|png|jpg|jpeg|gif|ico|woff|ttf|svg|otf)$` - the options passed in this block adds some headers so browsers can handle the specified files more cleverly - as in, telling browsers to cache these file types for 30 days

---

## Removing the default nginx vhost configuration

We do this to remove the default site that's living in `/etc/nginx/sites-enabled/default` directory - run `rm /etc/nginx/sites-enabled/default`

Note: tried to run `nginx -t` to verify the config file was valid, but was met with the following error:

- `nginx[1735]: nginx: [emerg] "fastcgi_cache" zone "microcache" is unknown in /etc/nginx/nginx.conf:63`. Trying to see what this means...
  - if I set the "zone" from `microcache` to `off`, then `nginx -t` seems to run successfully...for now setting to `off` and will figure out why `microcache` does not work later
  - see this for definition of a "zone" - https://stackoverflow.com/questions/38295426/what-does-the-shared-memory-zone-mean-in-nginx

---

## Configuring the php-fpm Pool for your Website

Will execute the following command to edit our config file `nano /etc/php/7.4/fpm/pool.d/tutorialinux.conf` and use the following config:

```bash
[alexcodes]
listen = /var/run/php/alexcodes.sock
listen.owner = alexcodes
listen.group = www-data
listen.mode = 0660
user = alexcodes
group = www-data
pm = dynamic
pm.max_children = 75
pm.start_servers = 8
pm.min_spare_servers = 5
pm.max_spare_servers = 20
pm.max_requests = 500

php_admin_value[upload_max_filesize] = 25M
php_admin_value[error_log] = /home/alexcodes/logs/phpfpm_error.log
php_admin_value[open_basedir] = /home/alexcodes:/tmp
```

- notice `listen = /var/run/php/alexcodes.sock` is telling php-fpm where to find the socket file nginx is reading and writing to

---

## Creating a System User for your Website

in our site's user's /home directory, we will make `logs` and `public_html` directories (for user `alexcodes` - note we already made the `logs` directory earlier)

- need to also give our user permissions on these directories. Can use `chmod user:group` to change permissions on a file/directory. Earlier, on the `logs` directory we gave `chmod alexcodes:www-data /home/alexcodes/logs` to the `logs` directory. Should do the same for `public_html`? Actually, the github gist doesn't create `public_html`, so maybe not needed?
  - also note, by default, whichever user created a directory/file has permissions assigned to that directory/file, so since we created these files as `root`, then `root` owns them, which is why we use `chown`

---

## Earlier step in Github Gist: Clean up the original php-fpm pool config file

We've kept this around just to prevent errors while restarting php-fpm. Since we just created a new php-fpm pool config file, let's clean the old one up:

`rm /etc/php/7.4/fpm/pool.d/www.conf`

---

## Earlier step in Github Gist: Create the php-fpm logfile

We run the following command:

`sudo -u alexcodes touch /home/alexcodes/logs/phpfpm_error.log`

- I guess we do the `sudo -u` command first so that our site user will own the log file to begin with

---

## Create a Database and DB User in MySQL

Now we will start a mysql shell as root, and create a database and user to use for our wordpress site. First, we'll create a pretty secure password by doing some stuff I don't understand with the `/dev/urandom` directory:

`echo -n @ && cat /dev/urandom | env LC_CTYPE=C tr -dc [:alnum:] | head -c 15 && echo`

And now we log into our mysql shell as the root user using the password we created in the same manner before when first setting up mysql:

`mysql -u root -p`

Now we will create our mysql user and the database we will use for our Wordpress site:

```sql
# Log into mysql
CREATE DATABASE alexcodes; # create our database
CREATE USER 'alexcodes'@'localhost' IDENTIFIED BY 'passwordwecreatedbeforewithdevurandomtrick'; # create our user
GRANT ALL PRIVILEGES ON alexcodes.* TO alexcodes@localhost; # give our user permissions for the created database
FLUSH PRIVILEGES; # I have no idea what this means
```

- from this site `https://www.interserver.net/tips/kb/mysql-flush-commands/`, running `FLUSH PRIVILEGES` will enable the permission changes (the `GRANG` portion in our sql statement) we specified to take effect without reloading or restarting the mysql service

---

## Downloading and Installing the WordPress Application

First we change to our site user and download the WordPress application (guess we change users so any files/directories we create will automatically be owned by the user?):

```bash
su - alexcodes
cd
wget https://wordpress.org/latest.tar.gz
```

Then we extract the archive (and clean up)

```bash
tar zxf latest.tar.gz
rm latest.tar.gz
```

Then we rename the extracted "wordpress" directory to `public_html` - guess I should delete the existing `public_html` directory then

```bash
mv wordpress public_html
```

The core wp directories are:

- wp-includes
- wp-content: where themes and user content like images are kept
- wp-admin: the admin dashboard code?

If we say our user can have 5 wordpress sites and you don't want to make a new system user for each site, can move the `wordpress` directory to the "sitename" directory. Not entirely sure what this means yet

Restart all our relevant services bc we made changes: `systemctl restart php7.4-fpm mysql nginx`

### Set proper file permissions on your site files:

```bash
cd /home/alexcodes/public_html
chown -R alexcodes:www-data .
find . -type d -exec chmod 755 {} \;
find . -type f -exec chmod 644 {} \;
```

- what I assume these commands do:
  - cd to our `public_html` directory
  - change ownership of all files and directories to user: alexcodes, and group www-data
  - change all directories to rwx user, rx group, rx everyone else
  - change all fies to rw user, r group, r everyone else
    - actually not sure what the `find` commands are all doing

### Optional: Set up DNS

- Log into your registrar's dashboard (wherever you purchased your domain name, usually) and point your domain at the WordPress server's IP.

Set the following:

Type: A Record, Host: @, Value: IPv4 of my vps - type of @ indicates the root domain? Not sure what this means. Maybe just the alexcodes.me part?
Type: A Record, Host: www, Value: IPv4 of my vps

### Go through WP Wizard front end

Can now visit our site at the IP address of the vps (or domain name if set up) and begin setup of our wordpress site using the provided wizard

- `wp-config.php` is the file that runs to do our wp site config on the front end

If you wanted to, could script the set up for a whole other site based on what we've done up until now

---

## Ownership and Permissions for your Site

This portion goes over the following (Which was already mentioned in the github gist):

```bash
cd /home/alexcodes/public_html
chown -R alexcodes:www-data .
find . -type d -exec chmod 755 {} \;
find . -type f -exec chmod 644 {} \;
```
