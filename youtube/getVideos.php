<?php
/**
 * Created by PhpStorm.
 * User: kevin
 * Date: 12/29/16
 * Time: 5:53 PM
 */

//Need key file
require_once('../apikeys.php');

$output = [
    'success'=>false
];

$arrContextOptions=array(
    "ssl"=>array(
        "verify_peer"=>false,
        "verify_peer_name"=>false,
    ),
);
header('Content-type: application/json');
header("Access-Control-Allow-Origin: *");


//print_r($_GET["userQuery"]);
$searchQuery = $_POST["q"];
$searchAmount =$_POST["maxResults"];

if($youtubeData = file_get_contents("https://www.googleapis.com/youtube/v3/search?part=snippet&key=$youtubeKey&q=$searchQuery&maxResults=$searchAmount&type=video&videoDefinition=high", false, stream_context_create($arrContextOptions))){
    $decoded = json_decode($youtubeData);
    //print_r($decoded->items[0]->snippet);

    $videos = [];

    foreach($decoded->items as $videoItem){
        $videos[] =[
            'title'=>$videoItem->snippet->title,
            'id'=>$videoItem->id->videoId
        ];
    }
    //print_r($output);
    $output=[
        'success'=>true,
        'video'=>$videos
    ];
}

print_r(json_encode($output));
