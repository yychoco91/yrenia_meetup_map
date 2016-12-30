<?php
header('Content-type: application/json');
header("Access-Control-Allow-Origin: *");

require_once ('apikeys.php');

$reverseGeoCodeData = file_get_contents("https://maps.googleapis.com/maps/api/geocode/json?latlng=".$_GET['lat'].",".$_GET['lng']."&key=".$googleKey);
print_r($reverseGeoCodeData);