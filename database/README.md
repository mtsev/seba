## Database features
Seba can optionally use a MySQL database for extra features. These features are disabled by default unless `dbConfig.json` exists. 

Supported features include:
* Command for execs to get any verified member's information from the database

## Installation
Install the `mysql-server` package.
```sh
$ sudo apt update
$ sudo apt install mysql-server
```

It is recommended that you run the included security script. 
```sh
$ mysql_secure_installation
```

Run the `setup` script to set up the database. You can replace `seba_db` with any name you want for the database.
```sh
$ ./setup seba_db
```

## Configuration
If you set up the database with the `setup` script, this will already be configured for you. 

Otherwise, copy `dbConfig.json.example` to `dbConfig.json` and set the following values:

* `host` is the hostname of the database
* `user` is the MySQL user to authenticate as
* `password` is the password of that MySQL user
* `database` is the name of the database to use