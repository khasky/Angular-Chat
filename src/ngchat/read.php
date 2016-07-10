<?php 
	require_once 'config.php';
	
	// history file not exists
	if(!file_exists($CFG_CHAT_FILE_PATH)) {
		echo '[]'; // return empty JSON array
		exit();
	}
	
	// read chat history
	$json = file_get_contents($CFG_CHAT_FILE_PATH);
	
	// encoding errors or history is empty
	if(!isset($json)) {
		echo '[]'; // return empty JSON array
		exit();
	}
	
	// encode JSON to PHP object
	$data = json_decode($json, true);
	
	// return data if it's in correct format
	if(isset($data) && count($data) > 0)
		echo $json;
	else // otherwise return empty JSON array
		echo '[]';
?>