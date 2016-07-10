<?php 
	require_once 'config.php';

	if(!isset($_POST["userId"]) || (isset($_POST["userId"]) && !in_array($_POST["userId"], $CFG_ADMIN_USER_IDS))) {
		echo '[]';
	}
	else {
		if (isset($_POST["action"])) {
			if(strcasecmp($_POST["action"], 'GET') == 0) {
				echo json_encode($CFG_ADMIN_USER_IDS, true);
			}
			if(strcasecmp($_POST["action"], 'DELETE') == 0) {
				// $_POST["args"]
			}
			if(strcasecmp($_POST["action"], 'EDIT') == 0) {
				// $_POST["args"]
			}
		}
	}
?>