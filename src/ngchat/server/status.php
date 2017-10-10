<?php 

require_once 'config.php';

$json = '[]';

// read online users
if (file_exists($CFG_STATUS_FILE_PATH)) {
	$json = file_get_contents($CFG_STATUS_FILE_PATH);
}

// decode JSON to PHP object
$obj = json_decode($json, true);

// decoding error or file is empty, create empty array
if (!isset($obj)) {
	$obj = array();
}

// check and add current user to online list
if (isset($_POST["userId"]) && strlen($_POST["userId"]) > 0)
{
	$exists = false;
	
	// check if user is already in online list
	foreach ($obj as $o) {
		if (strcasecmp($o['userId'], $_POST["userId"]) == 0) {
			$exists = true;
			break;
		}
	}
	
	if (!$exists) {
		array_push($obj, array(
			'userId' => $_POST["userId"],
			'time' => time() // UNIX timestamp
		));
		
		file_put_contents($CFG_STATUS_FILE_PATH, json_encode($obj, true));
	}
}

$obj2 = array();

// check elapsed time according to $CFG_MAX_ONLINE_TIME and remove inactive users from online list
if (count($obj) > 0)
{
	foreach ($obj as $o) {
		if (!isset($o['time']))
			continue;
		$minsDiff = (time() - $o['time']) / 60;
		
		if($minsDiff < $CFG_MAX_ONLINE_TIME) {
			array_push($obj2, $o);
		}
	}
	
	// update online users file
	file_put_contents($CFG_STATUS_FILE_PATH, json_encode($obj2, true));
}
else
{
	// do nothing
	$obj2 = $obj;
}

// return online users list
echo json_encode($obj2, true);