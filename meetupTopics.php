<?php
header('Content-type: application/json');
header("Access-Control-Allow-Origin: *");

require_once ('apikeys.php');

$getTopicsData = file_get_contents("https://api.meetup.com/topics?search=".$_GET['keyword']."&page=5&key=".$meetupKey1."&sign=true");
print_r($getTopicsData);