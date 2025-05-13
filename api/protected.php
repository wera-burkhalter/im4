<?php
session_start();

if (isset($_SESSION['user_id'])) {
    echo json_encode([
        "status" => "success",
        "user_id" => $_SESSION['user_id'],
        "phone" => $_SESSION['phone'],
        "firstName" => $_SESSION['firstName'],
        "profilbild" => $_SESSION['profilbild'] ?? "assets/standard_avatar.png"
    ]);
} else {
    echo json_encode(["status" => "error"]);
    session_destroy();
}

