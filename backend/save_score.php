<?php

session_start();
require_once 'conection.php';

$usuario_id = isset($_SESSION['usuario_id']) ? $_SESSION['usuario_id'] : 1;
$username = isset($_SESSION['usuario']) ? $_SESSION['usuario'] : 'Natalia';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $score = isset($_POST['score']) ? intval($_POST['score']) : 0;

    $query_max = "SELECT MAX(score) as mejor FROM puntajes WHERE usuario_id = $usuario_id";
    $res_max = mysqli_query($conexion, $query_max);
    $row_max = mysqli_fetch_assoc($res_max);
    $mejor_anterior = $row_max['mejor'] ? intval($row_max['mejor']) : 0;

    $query_score = "INSERT INTO puntajes (usuario_id, score) VALUES ($usuario_id, $score)";
    $resultado_score = mysqli_query($conexion, $query_score);

    if ($resultado_score) {
        $nuevo_record = false;
        $mejor_score_actualizado = $mejor_anterior;

        if ($score > $mejor_anterior) {
            $nuevo_record = true;
            $mejor_score_actualizado = $score;
        }

        $route = "/backend/save_score.php";
        $description = "Usuario: " . $username . " | Puntaje insertado: " . $score . ($nuevo_record ? " (¡NUEVO RÉCORD!)" : "");
        $query_log = "INSERT INTO logs (event_type, route_accessed, description) VALUES ('Score Inserted', '$route', '$description')";
        mysqli_query($conexion, $query_log);

        header('Content-Type: application/json');
        echo json_encode([
            "status" => "success", 
            "nuevo_record" => $nuevo_record,
            "mejor_score" => $mejor_score_actualizado,
            "message" => "Puntaje procesado con éxito"
        ]);
    } else {
        header('Content-Type: application/json');
        echo json_encode(["status" => "error", "message" => "Error en la inserción"]);
    }
    exit();
}
?>