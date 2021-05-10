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
