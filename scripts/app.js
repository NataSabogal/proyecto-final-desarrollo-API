// scripts/app.js

document.addEventListener("DOMContentLoaded", () => {
    const generateBtn = document.querySelector(".generate-button");

    if (generateBtn) {
        generateBtn.addEventListener("click", jugarRondaPokemon);
    }

    cargarMejorPuntajeAlIniciar();
});

async function cargarMejorPuntajeAlIniciar() {
    const url = "../backend/get_best_score.php";
    try {
        const respuesta = await fetch(url);
        if (!respuesta.ok) throw new Error("Error al traer el récord");
        
        const data = await respuesta.json();
        const scoreTexts = document.querySelectorAll(".score-card p");
        
        if (scoreTexts.length >= 2) {
            scoreTexts[1].textContent = data.best_score;
        }
    } catch (error) {
        console.error("No se pudo cargar el mejor puntaje inicial:", error);
    }
}

function getRandomNumber() {
    return Math.floor(Math.random() * 151) + 1;
}

async function getPokemonData(id) {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Error en la PokeAPI");
    return await response.json();
}

async function jugarRondaPokemon() {
    const container = document.querySelector(".pokemon-container");
    if (!container) return;

    container.innerHTML = "";
    let puntajeTotalRonda = 0;

    try {
        for (let i = 0; i < 5; i++) {
            const id = getRandomNumber();
            const pokemon = await getPokemonData(id);

            const nombre = pokemon.name.toUpperCase();
            const imagen = pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;
            const peso = (pokemon.weight / 10) + " kg";
            const tipos = pokemon.types.map(t => t.type.name);

            const hp = pokemon.stats[0].base_stat;
            puntajeTotalRonda += hp;

            const cardHTML = crearTarjetaPokemon(nombre, imagen, tipos, peso, hp);
            container.innerHTML += cardHTML;
        }

        const scoreTexts = document.querySelectorAll(".score-card p");
        if (scoreTexts.length > 0) {
            scoreTexts[0].textContent = puntajeTotalRonda; // Cambia el Current Score
        }

        guardarPuntajeEnBaseDeDatos(puntajeTotalRonda);

    } catch (error) {
        console.error("Error al cargar la ronda:", error);
        alert("Hubo un problema al conectar con la PokeAPI. Inténtalo de nuevo.");
    }
}

function crearTarjetaPokemon(nombre, imagen, tipos, peso, hp) {
    let tiposHTML = "";
    tipos.forEach(tipo => {
        tiposHTML += `<span class="type ${tipo}">${tipo.toUpperCase()}</span>`;
    });

    const porcentajeHp = Math.min((hp / 250) * 100, 100);

    return `
        <div class="pokemon-card">
            <div class="pokemon-image">
                <img src="${imagen}" alt="${nombre}">
            </div>
            <div class="pokemon-name">${nombre}</div>
            <div class="pokemon-types">
                ${tiposHTML}
            </div>
            <div class="pokemon-weight">Weight: ${peso}</div>
            <div class="pokemon-hp">
                <p>HP <span>${hp}/250</span></p>
                <div class="hp-bar">
                    <div class="hp-fill" style="width: ${porcentajeHp}%;"></div>
                </div>
            </div>
        </div>
    `;
}

async function guardarPuntajeEnBaseDeDatos(puntajeTotal) {
    const url = "../backend/save_score.php";
    const datos = new FormData();
    datos.append("score", puntajeTotal);

    try {
        const respuesta = await fetch(url, {
            method: "POST",
            body: datos
        });

        if (!respuesta.ok) throw new Error("Error en el servidor");

        const resultado = await respuesta.json();

        if (resultado.status === "success") {
            const scoreTexts = document.querySelectorAll(".score-card p");

            if (scoreTexts.length >= 2) {
                scoreTexts[1].textContent = resultado.mejor_score;
            }

            if (resultado.nuevo_record === true) {
                Swal.fire({
                    title: '¡NUEVO RÉCORD! 🎉',
                    text: `¡Felicidades! Has superado tu marca anterior. Tu nuevo mejor puntaje es de ${puntajeTotal} pts.`,
                    icon: 'success',
                    background: '#1e293b',
                    color: '#ffffff',
                    confirmButtonColor: '#ff0000',
                    confirmButtonText: '¡Súper!'
                });
            }
        }

    } catch (error) {
        console.error("No se pudo registrar el puntaje en la BD:", error);
    }
}