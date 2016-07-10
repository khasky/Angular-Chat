<?php 
	require_once 'config.php';

	if(!isset($_POST["userId"]) || !isset($_POST["user"]) || !isset($_POST["message"]))
		exit();
	
	$history = null;
	
	// read chat history
	if(file_exists($CFG_CHAT_FILE_PATH)) {
		$history = json_decode(file_get_contents($CFG_CHAT_FILE_PATH), true);
	}
	
	// file not exists or encoding failed, create empty array
	if(!isset($history))
		$history = array();
	
	if(empty($history)) // push first message
	{
		// format history object
		$data = format($_POST["userId"], $_POST["user"], 1, $_POST["message"]);
		
		// add to the history array
		array_push($history, $data);
		
		// update history file
		file_put_contents($CFG_CHAT_FILE_PATH, json_encode($history, true));
		
		// return added history object
		echo json_encode($data, true);
	}
	else // push new message
	{
		// remove message from the beginning
		if(count($history) == $CFG_MAX_HISTORY_MESSAGES) {
			array_shift($history);
		}
		
		// get last item from history
		$lastItem = array_pop((array_slice($history, -1)));
		
		// format history object
		$data = format($_POST["userId"], $_POST["user"], intval($lastItem['messageId']) + 1, $_POST["message"]);

		// add to the history array
		array_push($history, $data);
		
		// update history file
		file_put_contents($CFG_CHAT_FILE_PATH, json_encode($history, true));
		
		// return added history object
		echo json_encode($data, true);
	}
	
	function format($userId, $user, $messageId, $message) {
		return 
			array(
				'userId' => $userId,
				'user' => $user,
				'messageId' => $messageId,
				'message' => $message,
				'date' => date(DATE_ATOM , time())
			);
	}
?>