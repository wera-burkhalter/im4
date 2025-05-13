<?php

session_start();

if (isset($_SESSION['user_id'])) {
    echo "User eingeloggt";
} else {
    echo "User nicht eingeloggt";
}

