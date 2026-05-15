CREATE DATABASE IF NOT EXISTS pokemon_random CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE pokemon_random;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS puntajes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    score INT NOT NULL DEFAULT 0,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- LLAVE FORÁNEA: Vincula el puntaje a un usuario real
    CONSTRAINT fk_puntajes_usuarios 
        FOREIGN KEY (usuario_id) 
        REFERENCES usuarios(id) 
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL,
    route_accessed VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_timestamp (timestamp)
) ENGINE=InnoDB;


INSERT INTO usuarios (id, username, password) 
VALUES (1, 'Natalia', '12345')
ON DUPLICATE KEY UPDATE username=username;

INSERT INTO puntajes (usuario_id, score, fecha) VALUES 
(1, 120, NOW()),
(1, 350, DATE_SUB(NOW(), INTERVAL 3 DAY))
ON DUPLICATE KEY UPDATE score=score;

INSERT INTO logs (event_type, route_accessed, description) 
VALUES ('User Login', '/login.html', 'User Natalia logged into the application successfully.')
ON DUPLICATE KEY UPDATE event_type=event_type;