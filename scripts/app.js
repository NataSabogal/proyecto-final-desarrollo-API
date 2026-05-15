// scripts/app.js

document.addEventListener("DOMContentLoaded", () => {
    const generateBtn = document.querySelector(".generate-button");
    
    if (generateBtn) {
        generateBtn.addEventListener("click", jugarRondaPokemon);
    }
});

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
            scoreTexts[0].textContent = puntajeTotalRonda; 
        }


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