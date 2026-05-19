<?php
$host = "localhost";
$user = "root";       
$password = "";       
$database = "pokemon_random"; 

$conexion = mysqli_connect($host, $user, $password, $database);

if (!$conexion) {
    die("Error crítico: No se pudo conectar a la base de datos. " . mysqli_connect_error());
}

mysqli_set_charset($conexion, "utf8mb4");

?>