# Your First Linux Server

These are notes for the second module in the course - sections will be divided by the subheadings as seen in the section, e.g. `Linux Command Line: The Absolute Basics`

---

## Connecting to Your Server: Basic SSH

SSH works with a client-server protocol. To connect to the VM we provisioned, can use SSH.

Note that in linux, remember that a bash prompt has a string like `username@host-name` is how bash tells you which machine you're on. Run ssh command as follows (note that anything in `< >` is placeholder):

`ssh root@<machine ip>`

Will see below when first logging in. For now, just accept the prompt (maybe read about ssh later)

```bash
The authenticity of host '64.225.49.126 (64.225.49.126)' can't be established.
ECDSA key fingerprint is SHA256:BpbJ/mzhZznITiWWMx+OombJFtXspSbmxzga/ZQUKPE.
Are you sure you want to continue connecting (yes/no/[fingerprint])?
```

after accepting the prompt, I was exited, but video was prompted for password. I just ran ssh command again and was asked for root password, and was able to log in. Another discrepancy found is that video was immediately prompted to change root pass, whereas I was not. For now, just keeping same root password.

---

## Updating and Installing Software on Ubuntu

Note, this resource was included with video: `https://github.com/groovemonkey/hands_on_linux-self_hosted_wordpress_for_linux_beginners/blob/master/2-Installing-software-hosting-platform.md`

In general, most software is compiled from source code into a binary and then that binary is able to be run on a machine. Most modern linux distros have servers that host precompiled binaries so users don't have to compile the source code themselves. There are some distros which make users compile software themselves, but Ubuntu is not one of them

Precompiled packages of software are called repositories. In other words, collections of compiled binaries are called repositories or repos in this context.

### Updating Software on Ubuntu

Need root access to update and install software, so will be using `sudo`. The `apt` program in Debian-based distos is used to update the repository listing and upgrade software

- `apt update` - fetches updates/can see what software has been updated since this command was last ran
- `apt upgrade` - upgrades binaries on your system with new versions from repositories. Can add a `-y` flag to upgrade and automatically selecting `yes` for prompts

### Installing New Software

A few commands to know for this:

- `apt install <software name>` - to install new software
- `apt remove <software name>` - to remove software
- `apt-cache search <search keyword>` - searches for software that can be downloaded from a repository

Note: can use `ctrl + w` to delete previous word in command line

Note: instead of how software you installed in Windows must be updated individually, in linux any software installed with a package manager gets upgraded automatically when running `apt upgrade command`

---

## Installing Required Software for our Hosting Platform

Core software we'll be installing to run our Wordpress server/hosting platform:

- mysql-server
- php-mysql
- php-fpm
- monit - for monitoring
- nginx

Also will talk about custom repositories. You can add personal software repos (aka PPAs)

First we ssh into our vps and run `apt update` and `apt upgrade` to install any out of date software, then run `apt install` command to first install `mysql-server`, then also `nginx php-mysql php-fpm monit` - note that it seems commands and methods of installing the software seem to vary slightly between video and included github repo resource of the video, probably because things have changed since the course was first released

Note, `mysql-server` will prompt you for a password during installation. For now, can use a simple password, because in the next lesson we'll "harden" permissions a bit for more security (probably)

- actually, just installing `mysql-server` didn't prompt me for anything when I installed. Curious...
- also note that, as part of the installs going on, Ubuntu starts some of the software processes

### Custom Repositories

As mentioned previously, probably not going to install software from a PPA myself in this lesson as the Github resource for this section installs `nginx` directly from the repository instead of adding a PPA for nginx, but will still highlight how the process works here

We can add third-party repositories ourself by running (with `nginx` repo as an example here):

- `add-apt-repository ppa:nginx/stable`
- `apt update`
- `apt install nginx`

During this process, the cryptographic key for the repo will be downloaded and imported. Basically means a malicious third-party can't uploaded a malicious nginx package/binary as the server/machine we are working on will check to make sure the package has been signed by the developers themselves

After installing nginx, can run command `netstat -tupln` to see that nginx is started and running on port 80

- had to first install `netstat` by running `apt install net-tools`

After nginx is up, we can actually visit the live server by entering its IP address into a browser. Can get the IP of our vps that we are ssh'd into by running `ifconfig` and looking for the `inet` field under `eth0` section (no idea what any of this really means right now)

---

## Linux Services Overview

In this lesson, going to discuss software, services and daemons. Also going to enable and activate all the services necessary for setting up our wordpress hosting platform and website

- software: a program, running as a `process` on your OS
- service/daemon: a long running process that provides a service, usually designed to interact with something outside of it, e.g. web server, monitoring tool, database

Main way to manage services is by using `systemd` command. Two utility programs to manage services with systemd are:

- `systemctl` for managing services
- `journalctl` for managing logs

---

## Service Management with systemd

With services, can start, restart, reload configuration files, or stop the service

- also can enable or disable them at boot time (unrelated to starting or stopping at the moment)

`systemd` is the modern way to handle this, but for some machines this might not be available so will also see how to use the older method of doing so

command looks like `systemctl status <service name>`. In older distros, don't have access to systemctl so have to use the `service` command. Command looks like `servoce <service name> status`

We will start a few services in our VPS:

- `mysql`
- `nginx`
- `monit`
- `php-fpm`

Note, before even doing anything in my case, all of these were already active besides `php-fpm`. For this service, can't seem to start it by running `systemctl start php-fpm` - get error: `Failed to start php-fpm.service: Unit php-fpm.service not found.` - thought maybe have to specify a version like `php5-fpm` like video does, but so far have not found any version of php that starts the service like so: `php<ver number>-fpm` (this is as of 12/26/2020)

- went and ran `cat /etc/init.d/php7.4-fpm`, per answer here: `https://serverfault.com/questions/189940/how-do-you-restart-php-fpm` to see contents of `/etc/init.d/php7.4-fpm` and saw that there was a name `php7.4-fpm` - tried running `systemctl start php7.4-fpm` and seems the service was started!
- ran `status php7.4-fpm` and saw the service was started

Note, starting a service does not "enable" it - starting starts the service in this moment, while `enable` tells the service to start at boot time

- `start` and `stop`
- `enable` and `disable`

For our wordpress stack, want to make sure the following services are enabled:

- mysql
- nginx
- php7.4-fpm
- monit

Some `systemctl` commands we can run:

- enable - makes sure this unit always starts at boot
- disable - opposite of enable
- start - starts this unit now (will not automatically start at boot)
- stop - stops a running unit (will not prevent from running at boot, if enabled)
- reload - re-read the program configuration file (config updates)
- restart - kill the process and start it again, re-reading from configuration file
- status - check status of unit, show last few lines of log output

Some `journalctl` commands we can try out:

- `journalctl -xn`
- `journalctl -u <unit>`
- `journalctl -b`
- `journalctl -f`
- `journalctl --since "10 min ago"`

Running some of these commands on my VPS made it apparent people/bots (Whichever) are trying to constantly log into my server. Investigating how to set up ssh key-based auth for my VPS instead of a regular password

- https://www.digitalocean.com/community/tutorials/how-to-configure-ssh-key-based-authentication-on-a-linux-server
- https://www.digitalocean.com/community/tutorials/how-to-set-up-ssh-keys-on-ubuntu-20-04
  - set up ssh key login for VPS using above article
