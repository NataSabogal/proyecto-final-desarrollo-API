
document.addEventListener("DOMContentLoaded", () => {
    // Cargamos los logs automáticamente al abrir la página de auditoría
    cargarLogsAuditoria();
});

async function cargarLogsAuditoria() {
    const url = "../backend/get_logs.php";
    const container = document.getElementById("logs-wrapper");
    
    if (!container) {
        console.error("No se encontró el contenedor logs-wrapper en el HTML");
        return;
    }

    try {
        const respuesta = await fetch(url);
        if (!respuesta.ok) throw new Error("Error al obtener los logs del servidor");
        
        const listaLogs = await respuesta.json();
        
        // Limpiamos el contenedor por completo
        container.innerHTML = "";

        if (listaLogs.length === 0) {
            container.innerHTML = `<p style="text-align: center; color: #94a3b8; width: 100%; padding: 40px;">No hay registros de auditoría en la base de datos.</p>`;
            return;
        }

        // Recorremos cada log de la base de datos y replicamos TU estructura exacta de HTML
        listaLogs.forEach(log => {
            // Creamos el artículo de la tarjeta
            const card = document.createElement("article");
            card.className = "log-card";

            // Estilo dinámico opcional por si quieres que el tipo de evento resalte en color,
            // si no, el CSS original de tus <p> se encargará del resto.
            let eventColor = "#3b82f6"; // Azul por defecto
            if (log.event_type === 'User Login') eventColor = "#10b981"; // Verde
            if (log.event_type === 'Score Inserted') eventColor = "#f59e0b"; // Naranja
            if (log.event_type === 'Report Accessed') eventColor = "#8b5cf6"; // Morado

            card.innerHTML = `
                <div class="log-item">
                    <h3>Event Type</h3>
                    <p style="color: ${eventColor}; font-weight: bold;">${log.event_type}</p>
                </div>

                <div class="log-item">
                    <h3>Route Accessed</h3>
                    <p style="font-family: monospace; color: #f43f5e;">${log.route_accessed}</p>
                </div>

                <div class="log-item">
                    <h3>Timestamp</h3>
                    <p>${log.fecha}</p>
                </div>

                <div class="log-item">
                    <h3>Description</h3>
                    <p>${log.description}</p>
                </div>
            `;
            
            container.appendChild(card);
        });

    } catch (error) {
        console.error("Error al renderizar los logs:", error);
        container.innerHTML = `<p style="text-align: center; color: #ef4444; width: 100%; padding: 40px;">Error al conectar con el servidor de base de datos.</p>`;
    }
}