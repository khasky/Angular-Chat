NgChat v0.3 - AngularJS chat module
===================

This chat module is based on auto and manual **refreshing**.  
Current version is written with PHP server-side and you could try it almost on any hosting.

[Live demo](http://khasky.com/demo/ng-chat)

![NgChat](https://github.com/khasky/NgChat/blob/master/screenshot.png)

## Features

* Easy to install and use
* Low requirements
* Users online status
* Chat history
* Smiley icon set

## Dependencies

 * AngularJS 1.5.0+ with ngSanitize

## Build (optional)

If you want to modify and/or rebuild NgChat, you should install [NodeJS](https://nodejs.org) and run **grunt** in command line.  
I've used LESS preprocessor and [Lessophy mixins](https://github.com/khasky/Lessophy) for work on CSS styles.

#### Used NodeJS modules

 * grunt-contrib-clean
 * grunt-contrib-copy
 * grunt-contrib-less
 * grunt-contrib-uglify

#### Directories

**src** - ng-chat source files  
**dist** - complete build, ready for production

## Installation

#### From scratch

 * Add dependencies (see above)
 * Add ng-chat styles:  
 ```<link rel="stylesheet" href="ngchat/ngchat.min.css" />```
 * Add ng-chat module script:  
 ```<script type="text/javascript" src="ngchat/ngchat.min.js"></script>```
 * Inject chat module to your AngularJS application:  
 ```var app = angular.module('app', ['ngChatModule']);```
 * Add directive to your AngularJS page:  
 ``` <ng-chat></ng-chat> ```  
  
#### Using demo files

If you have your own page with installed AngularJS:

 * Open **dist** directory
 * Copy **ngchat** folder and contents to your hosting
 * Check **index.html** and **app.js** as example
 
If AngularJS isn't installed:  

 * Open **dist** directory
 * Copy all files to your hosting
 * Open index.html in your browser

## Configuration

### Server side options - config.php

| Variable                     | Default value  | Description                                                  |
| ---------------------------- | -------------- | ------------------------------------------------------------ |
| $CFG_CHAT_FILE_PATH          | history.json   | [string] Chat history file name                              |
| $CFG_STATUS_FILE_PATH        | status.json    | [string] Online status file name                             |
| $CFG_MAX_HISTORY_MESSAGES    | 50             | [integer] Max. chat messages stored in history               |
| $CFG_MAX_ONLINE_TIME_MINUTES | 15             | [integer] Max. minutes for detecting if user is still online |

### Client side options - ng-chat.js (ngChatConfig)

| Variable                  | Default value          | Description                            |
| ------------------------- | ---------------------- | -------------------------------------- |
| maxNameLength             | 16                     | [integer] Max. characters in nickname  |
| maxReplyLength            | 255                    | [integer] Max. length of chat message  |
| minRefreshTime            | 5                      | [integer] Min. refresh time in seconds |
| maxRefreshTime            | 300                    | [integer] Max. refresh time in seconds |
| smiliesDirectory          | ngchat/smilies/        | [string] Path to smilies folder        |
| smiliesFormat             | .gif                   | [string] Smiley icons extension        |
| shortDateFormat           | HH:mm:ss               | [string] Display date format (short)   |
| shortDateFormat           | dd.mm.yyyy HH:mm:ss    | [string] Display date format (full)    |

## Data

List of data transferred between client and server. You can write your own server scripts following the listed format.

#### send.php (send chat message)

| HTTP  | Name     | Description              |
| ----- | -------- | ------------------------ |
| POST  | userId   | Unique user identifier  |
| POST  | user     | User nickname in chat    |
| POST  | message  | Chat message text        |

#### status.php (online users request)

| HTTP  | Name     | Description              |
| ----- | -------- | ------------------------ |
| POST  | userId   | Unique user identifier  |

## Coming soon

* Admin pages
* Quotes
* Toolbar
* Online users list
* Chat history archive
* Responsive design