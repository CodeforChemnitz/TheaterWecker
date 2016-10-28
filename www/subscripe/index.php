<?php

$possibleLocations = [
  'oper',
  'schauspiel',
  'philharmonie',
  'ballett',
  'sonstiges',
  'figurentheater'
];

$logDir = '/var/data/theaterwecker/';

$category = [];
$time = 15;
$email = null;

if(isset($_POST['category'])) {
  foreach ($_POST['category'] as $value) {
    if(in_array($value, $possibleLocations)) {
      $category[] = $value;
    }
  }
}

if(isset($_POST['time']) && in_array($_POST['time'], [15, 30, 60])) {
  $time = intval($_POST['time']);
}

if(isset($_POST['email']) && filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)){
  $email = $_POST['email'];
}

function writeToFile($logDir, $name, $data) {
  $fp = fopen($logDir . $name, 'a');
  if(is_resource($fp)) {
    fwrite($fp, json_encode($data) . PHP_EOL);
    fclose($fp);
  } else {
    throw new Exception('could not open file');
  }
}

if($category !== [] && !is_null($email)) {
  $success = false;
  $data = [
    'timestamp' => strftime('%H:%M:%S'),
    'time' => $time,
    'category' => $category,
    'email' => $email,
    'useragent' => isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : '',
  ];
  $name = date('Y-m-d') . '.log';
  try {
    writeToFile($logDir, $name, $data);
    $success = true;
  } catch(\Exception $e) {
    sleep(1);
    try {
      writeToFile($logDir, $name, $data);
      $success = true;
    } catch(\Exception $e) {
      // we can't do anything
    }
  }

  if ($success === true) {
    header('Location: /danke.html');
  } else {
    header('Location: /fehler.html');
  }
} else {
  if($category === []) {
    header('Location: /fehler-kategorie.html');
  } elseif (is_null($email)) {
    header('Location: /fehler-email.html');
  } else {
    header('Location: /fehler.html');
  }
}
