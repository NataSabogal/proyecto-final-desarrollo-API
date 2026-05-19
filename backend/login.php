<?php
session_start();

require_once 'conection.php'; 

$response = [];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = mysqli_real_escape_string($conexion, $_POST['username']);
    $password = $_POST['password']; 

    $query = "SELECT * FROM usuarios WHERE username = '$username'";
    $resultado = mysqli_query($conexion, $query);

    if (mysqli_num_rows($resultado) == 1) {
        $user_data = mysqli_fetch_assoc($resultado);
        
        if ($password === $user_data['password']) {
            $_SESSION['usuario_id'] = $user_data['id'];
            $_SESSION['usuario'] = $user_data['username'];

            $route = "/backend/login.php";
            $desc = "El usuario " . $user_data['username'] . " ha iniciado sesión exitosamente.";
            $log_query = "INSERT INTO logs (event_type, route_accessed, description) VALUES ('User Login', '$route', '$desc')";
            mysqli_query($conexion, $log_query);

            header("Location: ../frontend/index.html");
            exit();
        } else {
            $error_msg = "Contraseña incorrecta.";
        }
    } else {
        $error_msg = "El usuario no existe.";
    }
    
    header("Location: ../frontend/login.html?error=" . urlencode($error_msg));
    exit();
}
?>