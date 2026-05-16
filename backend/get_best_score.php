<?php

session_start();
require_once 'conection.php';

$usuario_id = isset($_SESSION['usuario_id']) ? $_SESSION['usuario_id'] : 1;

$query = "SELECT MAX(score) as mejor FROM puntajes WHERE usuario_id = $usuario_id";
$resultado = mysqli_query($conexion, $query);
$row = mysqli_fetch_assoc($resultado);

$mejor_score = $row['mejor'] ? intval($row['mejor']) : 0;

header('Content-Type: application/json');
echo json_encode(["best_score" => $mejor_score]);
exit();