## Database features
Seba can optionally use a MySQL database for extra features. These features are disabled by default unless `dbConfig.json` exists.

Supported features include:
* `getuser` command for execs to get verified members' information from the database
* `alias` command for execs to get verified members' username history
* Persistent verification: a verified user will retain the role if they leave and rejoin server

## Installation
Install the `mysql-server` package.
```sh
$ sudo apt update
$ sudo apt install mysql-server
```

It is recommended that you run the included security script and accept the default options with `y`. 
```sh
$ mysql_secure_installation
```

In this directory, run the `setup` script to set up the database. You can replace `seba_db` with any name you want for the database.
```sh
$ ./setup seba_db
```

Lastly, follow [these instructions](https://github.com/mtsev/seba-form-script#database) to set up database access for the Google script. **If the script's access is not set up, database features will not work properly.** If you can't set up access for the script, delete `dbConfig.json` to disable database features for the bot.

## Configuration
If you set up the database with the `setup` script, this will already be configured for you. 

Otherwise, copy `dbConfig.json.example` to `dbConfig.json` and set the following values:

* `host` is the hostname of the database
* `port` is the port number to connect to
* `user` is the MySQL user to authenticate as
* `password` is the password of that MySQL user
* `database` is the name of the database to use
