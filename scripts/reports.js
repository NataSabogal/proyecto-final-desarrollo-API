
document.addEventListener("DOMContentLoaded", () => {
    cargarReportes('all');

    const botones = document.querySelectorAll(".filter-section button");

    if (botones.length >= 3) {
        botones[0].addEventListener("click", () => cambiarFiltro(botones, 0, 'all'));
        botones[1].addEventListener("click", () => cambiarFiltro(botones, 1, 'week'));
        botones[2].addEventListener("click", () => cambiarFiltro(botones, 2, 'month'));
    }
});

function cambiarFiltro(botones, indiceActivo, tipoFiltro) {
    botones.forEach(btn => {
        btn.style.backgroundColor = "var(--white-color)";
        btn.style.color = "#475569";
        btn.style.borderColor = "var(--border-color)";
    });

    botones[indiceActivo].style.backgroundColor = "var(--primary-color)";
    botones[indiceActivo].style.color = "white";
    botones[indiceActivo].style.borderColor = "var(--primary-color)";

    cargarReportes(tipoFiltro);
}

async function cargarReportes(filtro) {
    const url = `../backend/get_reports.php?filter=${filtro}`;

    try {
        const respuesta = await fetch(url);
        if (!respuesta.ok) throw new Error("Error al obtener los reportes");

        const data = await respuesta.json();

        const statsCards = document.querySelectorAll(".stats-card p");
        if (statsCards.length >= 3) {
            statsCards[0].textContent = data.stats.total_score; // Total Acumulado
            statsCards[1].textContent = data.stats.max_score;     // Record Máximo
            statsCards[2].textContent = data.stats.promedio;      // Promedio por Ronda
        }

        const tbody = document.querySelector(".table-section table tbody");
        if (!tbody) return;

        tbody.innerHTML = "";

        if (data.lista.length === 0) {
            tbody.innerHTML = `<tr><td colspan="3" style="text-align: center; color: var(--gray-text);">No hay registros de puntajes en este periodo de tiempo.</td></tr>`;
            return;
        }

        data.lista.forEach((item) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
        <td>${data.username}</td> <td><strong>${item.score} pts</strong></td>
        <td>${item.fecha}</td>
    `;
            tbody.appendChild(tr);
        });

    } catch (error) {
        console.error("Error en el reporte:", error);
    }
}