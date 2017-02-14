<?php
header('Content-type: application/json');
header("Access-Control-Allow-Origin: *");

require_once ('../apikeys.php');

$zip = filter_var($_GET['zip'], FILTER_SANITIZE_STRING);

$geoCodeData = file_get_contents("https://maps.googleapis.com/maps/api/geocode/json?address=".$zip."&key=".$googleKey);
print_r($geoCodeData);
