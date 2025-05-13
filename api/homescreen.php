<?php

session_start();

if (isset($_SESSION['user_id'])) {
    echo "User eingeloggt, ID:" . $_SESSION
    ['user_id'] . ", Name:" . $_SESSION['firstName'];
    ['username'] . "Handy-Nr.:" . $_SESSION['phone'];
    
} else {
    echo "User nicht eingeloggt";
}

