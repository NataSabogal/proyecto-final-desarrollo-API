<?php
session_start();
require_once 'conection.php';

$usuario_id = isset($_SESSION['usuario_id']) ? $_SESSION['usuario_id'] : 1;
$username = isset($_SESSION['usuario']) ? $_SESSION['usuario'] : 'Natalia';

$filter = isset($_GET['filter']) ? $_GET['filter'] : 'all';

$query = "SELECT p.score, p.fecha FROM puntajes p WHERE p.usuario_id = $usuario_id";

if ($filter === 'week') {
    $query .= " AND YEARWEEK(p.fecha, 1) = YEARWEEK(NOW(), 1)";
} else if ($filter === 'month') {
    $query .= " AND MONTH(p.fecha) = MONTH(NOW()) AND YEAR(p.fecha) = YEAR(NOW())";
}

$query .= " ORDER BY p.fecha DESC";
$resultado = mysqli_query($conexion, $query);

$puntajes = [];
$total_score = 0;
$max_score = 0;
$total_partidas = 0;

while ($row = mysqli_fetch_assoc($resultado)) {
    $puntajes[] = [
        'score' => intval($row['score']),
        'fecha' => $row['fecha']
    ];
    
    $total_score += intval($row['score']);
    if (intval($row['score']) > $max_score) {
        $max_score = intval($row['score']);
    }
    $total_partidas++;
}

$promedio = $total_partidas > 0 ? round($total_score / $total_partidas, 1) : 0;

$route = "/backend/get_reports.php?filter=" . $filter;
$desc = "Consulta de reportes interactivos realizada con el filtro: " . $filter;
$log_query = "INSERT INTO logs (event_type, route_accessed, description) VALUES ('Report Accessed', '$route', '$desc')";
mysqli_query($conexion, $log_query);

header('Content-Type: application/json');
echo json_encode([
    'stats' => [
        'total_score' => $total_score,
        'max_score' => $max_score,
        'promedio' => $promedio
    ],
    'username' => $username,
    'lista' => $puntajes
]);
exit();
?>