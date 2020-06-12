<?php

	$to = "yourmailhere";
	$from = 'email';
	$name = 'name';
	$headers = "From: $from";
	$subject = "You have a message.";

	$fields = array();
	$fields{"name"} = "First Name";
	$fields{"email"} = "Email";
	$fields{"phone"} = "Phone Numner";
	$fields{"subject"} = "Subject";
	$fields{"message"} = "Your Message";

	$body = "Here is what was sent:\n\n"; foreach($fields as $a => $b){ $body .= sprintf("%20s:%s\n",$b,$_REQUEST[$a]); }

	$send = mail($to, $subject, $body, $headers, $message);

?>