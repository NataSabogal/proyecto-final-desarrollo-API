<?php
// backend/get_logs.php

session_start();
require_once 'conection.php'; // o conexion.php según tengas tu archivo

error_reporting(E_ALL);
ini_set('display_errors', 1);

// Cambiamos 'fecha' por 'timestamp' en la consulta SQL
$query = "SELECT id, event_type, route_accessed, description, timestamp FROM logs ORDER BY timestamp DESC";
$resultado = mysqli_query($conexion, $query);

$logs = [];

if ($resultado) {
    while ($row = mysqli_fetch_assoc($resultado)) {
        $logs[] = [
            'id' => $row['id'],
            'event_type' => $row['event_type'],
            'route_accessed' => $row['route_accessed'],
            'description' => $row['description'],
            'fecha' => $row['timestamp'] // Guardamos 'timestamp' dentro del espacio 'fecha' que espera JS
        ];
    }
}

header('Content-Type: application/json');
echo json_encode($logs);
exit();
?>