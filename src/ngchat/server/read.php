<?php 

require_once('config.php');

// bad config
if (!isset($CFG_CHAT_FILE_PATH)) {
	header('HTTP/1.1 500 Internal Server Error');
	exit;
}

if (file_exists($CFG_CHAT_FILE_PATH) && filesize($CFG_CHAT_FILE_PATH) > 0)
{
	header('HTTP/1.1 200 OK');
	echo file_get_contents($CFG_CHAT_FILE_PATH);
}
else {
	header('HTTP/1.1 204 No Content');
}