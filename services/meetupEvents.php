<?php
header('Content-type: application/json');
header("Access-Control-Allow-Origin: *");

require_once ('../apikeys.php');

$zip = filter_var($_GET['zip'], FILTER_SANITIZE_STRING);
$keyword = filter_var($_GET['keyword'], FILTER_SANITIZE_STRING);

$getEventsData = file_get_contents("https://api.meetup.com/2/open_events?key=".$meetupKey1."&zip=".$zip."&topic=".$keyword."&page=20");
print_r($getEventsData);
