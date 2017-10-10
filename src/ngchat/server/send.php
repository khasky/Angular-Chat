<?php 

require_once('config.php');

// bad config
if (!isset($CFG_CHAT_FILE_PATH)) {
	header('HTTP/1.1 500 Internal Server Error');
	exit;
}

// wrong post data
if (empty($_POST["userId"]) || empty($_POST["user"]) || empty($_POST["message"])) {
	header('HTTP/1.1 400 Bad Request');
	exit;
}

$message = $CFG_ALLOW_HTML_TAGS ? $_POST["message"] : strip_tags($_POST["message"], '<br>');

if (empty($message)) {
	header('HTTP/1.1 400 Bad Request');
	exit;
}

$content = array();

if (file_exists($CFG_CHAT_FILE_PATH) && filesize($CFG_CHAT_FILE_PATH) > 0)
	$content = file_get_contents($CFG_CHAT_FILE_PATH);

$handle = fopen($CFG_CHAT_FILE_PATH, "w");

if ($handle && flock($handle, LOCK_EX))
{
	$history = array();
	$messageId = 1;
	
	// push new message
	if (!empty($content)) {
		$history = json_decode($content, true);
		
		// remove message from the beginning
		if (count($history) == $CFG_MAX_HISTORY_MESSAGES) {
			array_shift($history);
		}
		
		// get last item from history
		$items = array_slice($history, -1);
		$lastItem = array_pop($items);
		
		$messageId += intval($lastItem['messageId']);
	}
	else {
		// push first message
	}
	
	$data = array(
		'userId' => $_POST["userId"],
		'user' => $_POST["user"],
		'messageId' => $messageId,
		'message' => $message,
		'date' => date(DATE_ATOM , time())
	);
	
	array_push($history, $data);
	
	// update history file
	fwrite($handle, json_encode($history, true));
	
	// return added history object
	header('HTTP/1.1 200 OK');
	echo json_encode($data, true);
	
	flock($handle, LOCK_UN);
}
// sync error
else {
	header('HTTP/1.1 409 Conflict');
}

fclose($handle);
