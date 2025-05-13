<?php

session_start();

if (isset($_SESSION['user_id'])) {

    // falls wir eingeloggt sind, geben wir die Userdaten zurück
    echo json_encode([
        "status" => "success",
        "user_id" => $_SESSION['user_id'],
        "phone" => $_SESSION['phone'],
        "firstName" => $_SESSION['firstName']
    ]);

} else {
    echo json_encode([
        "status" => "error",
    ]);
    session_destroy();
}

