<?php
header('Content-type: application/json');
header("Access-Control-Allow-Origin: *");

require_once ('apikeys.php');

$geoCodeData = file_get_contents("https://maps.googleapis.com/maps/api/geocode/json?address=".$_GET['zip']."&key=".$googleKey);
print_r($geoCodeData);