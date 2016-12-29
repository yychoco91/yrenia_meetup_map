<?php
header('Content-type: application/json');
header("Access-Control-Allow-Origin: *");

require_once ('meetupkeys.php');

$getEventsData = file_get_contents("https://api.meetup.com/2/open_events?key=".$meetupKey1."&zip=".$_GET['zip']."&topic=".$_GET['keyword']."&page=20");
print_r($getEventsData);
?>
