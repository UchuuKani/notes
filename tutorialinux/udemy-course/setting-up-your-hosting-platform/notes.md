# Setting Up Your Hosting Platform

Will configure core services and end up with a platform ready for running modern php web apps. Among these services are

- web server (nginx)
- interpreter (php + php-fpm)
- database (mysql)

Also will cover the following skills:

- text editing in cli
- linux users + groups
- how http and modern web applications work
- unix interprocess communication
- how relational databases work

Note these resources linked with the vid:

- https://github.com/groovemonkey/hands_on_linux-self_hosted_wordpress_for_linux_beginners/blob/master/1-advanced-command-line.md
- https://learnxinyminutes.com/docs/bash/
- http://tiswww.case.edu/php/chet/bash/bashref.html

---

## Advanced Bash Shell Usage

- `ls -a` - list all contents in directory including hidden files

### Output Redirection

Can redirect stout (I think this is the term?) into a file by using the `>` in bash, e.g.

`echo "henlo world" > greeting.txt` - will create the `greeting.txt` file if not already created, and write `henlo world` to it. However, if `greeting.txt` already exists and has text, this command will overwrite it

To append to `greeting.txt`, we have to use `>>`, e.g. `echo "more henloooo" >> greeting.txt` will append the echo'd text to the file

Can also take input from a file by using the `<` symbol, e.g. `mail -s "important greetings" dave@tutorialinux.com < greeting.txt`

- this will email with the subject `important greetings` to `dave@tutorialinux.com` with the message body taken from `greeting.txt`

There is a program, `date` that we can invoke from the command line which prints out the current timestamp like so:

- `date` -> `Sun 27 Dec 2020 08:39:36 PM EST`

We can actually invoke the `date` command as part of input passed to `echo` that gets evaluated, e.g.

- `echo "$(/bin/date) - hi there" >> greeting.txt`
  - here, anything in the `$()` gets evaluated - also note, we used the full path to the `date` program and so did the video. However, just running `$(date)` also works
  - as a more robust way of determining the absolute path to a program, can run the `which` program
    - `which date` -> `/bin/date`

The `$()` syntax is called command substitution. Can also nest them like so:

- `echo "$($(which date)) into the date nao" >> test.txt` -> `Sun 27 Dec 2020 08:59:03 PM EST into the date nao`

### Logical Operators

Have access to `&&` and `||` logical operators in bash as well - examples of falsey values that can evaluate to boolean false are errors, such as trying to use a non-existent command, or trying to invoke a command that requires `sudo` privilege with `sudo`. I guess anything that outputs to sterr (standard error)?

- then again, I don't really understand output/input/error streams

### grep

very useful for parsing text, makes use of regular expressions :pensive:

along with `grep`, usage of piping using the `|` character is very useful

---

## How Configuration Files Work in Linux

In Linux, most configuration files are in `/etc/<programName>`. Config files allow you to change application defaults, and can be overriden by command line arguments. In our case, our web server will need to be configured to talk with our php interpreter, the php interpreter will need to know how to talk to our database, and wordpress will need to know which database credentials to use and the database name

We'll look at some configuration files, first starting with `ssh`: found at `/etc/ssh/sshd_config`

### ssh config

the `d` in `sshd_config` stand for daemon. We use `less` to read from the config on our VPS

- `less` will automatically put us at the top of the file, and we can move throughout it. Can also use a case-sensitive search by typing `/` followed by text to search for

Some observations:

- default port for ssh is `22`
- `PermitRootLogin` - set to `no` by default. If set to `yes`, prevents `root` from logging in through ssh
- `PublicKeyAuthentication` set to `yes` by default, allows you to stop using passwords to log in (something we want to do as it is more secure than using a password, and will get around to before end of course) - I already set this up because seeing random people trying to connect with `journalctl` was freaking me out

### nginx config

Looking at `/etc/nginx/nginx.conf` with less. Some observations:

- `user` (that our web process runs as) - www-data
- `worker_processes` - set to auto by default. Ideally would be equal to number of virtual cores that the server can see?

---

## Creating a System User: Linux Users and Groups

Can use the `adduser` command to interactively add a user

- can use `useradd` command to add a user without interaction. Can specify things such as user id, group id, default shell, etc using flags

--

## Changing Ownership and Permissions

- 0 = nothing
- 1 = execute
- 2 = write
- 4 = read

- 0 = no permissions
- 1 = execute only
- 2 = write only
- 3 = write/execute
- 4 = read only
- 5 = read/execute
- 6 = read/write
- 7 = read/write/execute

---

## Basic nginx Webserver Configuration

We will make a backup of /etc/nginx/nginx.conf by renaming it as /etc/nginx/nginx.conf.ORIG, then will create a new one as nginx.conf

- this is the main nginx config file. For each site we run, will have a specific file
- there is a line in this file in the `http` block which specifies where we will put all our site-specific config files: `include /etc/nginx/conf.d/*.conf;`

Tutorial mentions a directive for fastcgi caching which doesn't seem to be part of the default `nginx.conf` file at present (May 2021) at `/usr/share/nginx/cache/fcgi`, but will make the directory anyway - maybe I will add this caching later

- command is: `mkdir -p /usr/share/nginx/cache/fcgi`

Can use `nginx -t` command to validate the nginx config file. After this, can reload nginx using systemd: `systemctl reload nginx`

---

## HTTP Basics

What even are headers

---

## Basic php-fpm configuration

Follow this (from course files) instead of video

- https://github.com/groovemonkey/hands_on_linux-self_hosted_wordpress_for_linux_beginners/blob/master/5-basic-phpfpm-and-php-configuration.md

We set up our php interpreter to handle requests that need to run php code

Need to install:

- php7.4-json - done -> remove and add php-json
- php7.4-xmlrpc - done -> remove and add php-xmlrpc - removed
- php7.4-curl - done -> remove and add php-curl - removed
- php7.4-gd - done -> remove and add php-gd - removed
- php-xml-rss - can't find. is this totally needed?
- add `php-xml`, `php-mbstring`

Then, create directory for php-fpm sockets (webserver -> php): `mkdir /run/php-fpm`

Then make sure directory for php-fpm pool configuration exists: `mkdir -p /etc/php7.4/fpm/pool.d` (in my case, `/etc/php/7.4/fpm/pool.d/` already exists so don't run command)

- essentially, we have a pool of php processes that can handle requests that need to run php code since we don't want to only have one running process to process those requests

Then create our default pool configuration in: `/etc/php/7.4/fpm/pool.d/www.conf`

- remove this file, then create a new www.conf file with content:

```
[default]
security.limit_extensions = .php
listen = /run/php/yourserverhostname.sock
listen.owner = www-data
listen.group = www-data
listen.mode = 0660
user = www-data
group = www-data
pm = dynamic
pm.max_children = 75
pm.start_servers = 8
pm.min_spare_servers = 5
pm.max_spare_servers = 20
pm.max_requests = 500
```

Then edit our top-level php config files:

- first create a backup `mv /etc/php/7.4/fpm/php.ini /etc/php/7.4/fpm/php.ini.ORIG`
- then edit the file `nano /etc/php/7.4/fpm/php.ini`
  - note the `cgi.fix_pathinfo=0` - tells php to not try to guess at incorrect php file names that get requested

Overview: we installed php extensions to run a basic Wordpress site, verified our php-fpm socket directory exists that nginx and php-fpm will use to communicate, created main php-fpm config file and default pool config file, and configured php itself

Finally, restart php-fpm process using systemctl: `systemctl restart php7.4-fpm`

---

## Interprocess Communication (IPC) and UNIX/Linux Filetypes
