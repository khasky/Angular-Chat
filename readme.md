NgChat v0.1 - AngularJS REST chat module
===================

This chat module is based on auto and manual **refreshing**.  
Current version is written with PHP server-side and you could try it almost on any hosting.

## Features

* Easy to install and use
* Low requirements
* Adjustable chat history
* User's online status
* Smiley icon set
* Admin actions (under development)
* You can use all the code for any of your own purposes

## Dependencies

 * AngularJS 1.5.0+ (with ngSanitize module)
 * jQuery 2.2.3+
 * lodash 4.11.1+
 * Bootstrap-Grid-Only 3.2.0 [link](https://github.com/zirafa/bootstrap-grid-only)

## Build (optional)

If you want to modify and/or rebuild NgChat, you should install [NodeJS](https://nodejs.org) and run **grunt** in commandline.  
I've used LESS preprocessor and [Lessophy mixins](https://github.com/khasky/Lessophy) for work on CSS styles.

#### Used NodeJS modules

 * grunt-contrib-clean
 * grunt-contrib-copy
 * grunt-contrib-less
 * grunt-contrib-uglify

#### Directories

**src** - ng-chat source files  
**dist** - complete build of grunt project for production

## Installation

#### From scratch

 * Add dependencies (see above)
 * Add ng-chat styles:  
 ```<link rel="stylesheet" href="css/grid100.min.css" />
	<link rel="stylesheet" href="ngchat/ng-chat.min.css" />```
 * Add ng-chat module:  
 ```<script type="text/javascript" src="ngchat/ng-chat.min.js"></script>```
 * Inject chat module to your AngularJS application:  
 ```var app = angular.module('app', ['ngChatModule']);```
 * Add directive to your AngularJS page:  
 ```<ng-chat></ng-chat>```

#### Using demo files

If you have your own page with angular application:

 * Open **dist** directory
 * Copy **css**, **js**, **ngchat** folders to your hosting
 * Check **index.html** and **app.js** and copy dependencies and includes to your page

And if you have not:

 * Open **dist** directory
 * Copy all files to your hosting

## Configuration

### config.php (server-side options)

| Variable                  | Default value  | Description                                                  |
| ------------------------- | -------------- | ------------------------------------------------------------ |
| $CFG_CHAT_FILE_PATH       | history.json   | (string) Chat history file name                              |
| $CFG_STATUS_FILE_PATH     | status.json    | (string) Online status file name                             |
| $CFG_MAX_HISTORY_MESSAGES | 50             | (integer) Max. chat messages in history                      |
| $CFG_MAX_ONLINE_TIME      | 15             | (integer) Max. minutes for detecting if user is still online |
| $CFG_ADMIN_USER_IDS       |                | (string array) List of Admin users' IDs                      |

### ng-chat.js (client-side options)

| Variable                  | Default value          | Description                                        |
| ------------------------- | ---------------------- | -------------------------------------------------- |
| MAX_NAME_LENGTH           | 16                     | (integer) Max. length of nicknames                 |
| MAX_REPLY_LENGTH          | 255                    | (integer) Max. length of chat message              |
| MIN_REFRESH_TIME          | 5                      | (integer) Min. refresh time in seconds             |
| MAX_REFRESH_TIME          | 300                    | (integer) Max. refresh time in seconds             |
| CLASSNAME_RESIZER         | .ng-chat-resizer       | (string) CSS class of resizer element              |
| CLASSNAME_HISTORY         | .ng-chat-history       | (string) CSS class of history element              |
| SMILIES_SRC               | ngchat/smilies/        | (string) Path to the folder with smilies           |
| SMILIES_FORMAT            | .gif                   | (string) Smiley icons extension                    |
| $scope.smilies            | (look into ng-chat.js) | (array of objects) Smilies [{code, emotion}]       |
| $scope.dateFormat         | dd.mm.yyyy HH:mm:ss    | (string) Display date format                       |

More options coming soon.

## Data

List of data which passed between client<->server.

You can write your own server scripts on any language which supports HTTP requests.

#### send.php _(send chat message request)_

| HTTP  | Name     | Description              |
| ----- | -------- | ------------------------ |
| POST  | userId   | Unique user indentifier  |
| POST  | user     | User nickname in chat    |
| POST  | message  | Chat message text        |

#### status.php _(online users request)_

| HTTP  | Name     | Description              |
| ----- | -------- | ------------------------ |
| POST  | userId   | Unique user indentifier  |

#### admin.php _(admin command request)_

| HTTP  | Name     | Description                      |
| ----- | -------- | -------------------------------- |
| POST  | userId   | Unique user indentifier          |
| POST  | action   | Command to execute               |
| POST  | args     | Command arguments (object)       |

## Bugs / To do

 * Bug: Paste larger message than max. reply length from clipboard to the reply textarea (can't use backspace anymore)
 * Finish admin commands
 * Prevent refresh flooding

## Future improvements

 * Ctrl+Enter reply sending
 * Anti-spam: captcha for first message
 * Responsive styles
 * Online users list
 * Toolbar:  
  - Selected text styling (bold, italic, strikethrough)  
  - Possibility to insert images  
  - Possibility to insert links  
  - Possibility to quote messages  
 * MOTD
 * Admin announcements
 * Chat history archive
 * Users' avatars
 * Chat rooms