
/**
 * used to load all ids, Pokemon Names and there Links. that information are used for search function
 */
async function loadAllPokemon() {
    try {
        const response = await fetch(ALLURL);
        const resultAllPokemons = await response.json();
        ids = resultAllPokemons.results.map(p => {
            const parts = p.url.split('/').filter(Boolean);
            return Number((parts[parts.length - 1]));
        });
        for (let i = 0; i < resultAllPokemons['results'].length; i++) {
            allPokemons.push({
                'id': ids[i],
                'nameEN': resultAllPokemons.results[i]['name'],
                'link': resultAllPokemons.results[i]['url']
            });
        }
    } catch (error) {
        console.error(error);
    }
}

/**
 * is used to load Detail Informations of the current selectet Pokemon to generate the pokemon List as a Card on Main Screen. 
 */
async function loadPokemon() {
    let url = STARTURL + offset;
    let response = await fetch(url);
    let currentPokemons = await response.json();
    for (let i = 0; i < currentPokemons['results'].length; i++) {
        await checkkForValidDataAndRender(offset);
        offset++;
    }
}

/**
 * is used to check a fetch response where object state is ok and throw error if its not ok. to stop next action
 * 
 * @param {Object} response - answer from Respons fetch
 */
function checkResponse(response) {
    if (!response.ok) {
        throw new error("Fehler bei der API-Anfrage:");
    }
}

/**
 * is used to get informations of a single Pokemon in to array Variables
 * 
 * @param {Number} i - the Number of current Pokemon
 * @returns - currentPokemon and currentSpecies Informations as 2 Arrays
 */
async function fetchPokeData(i) {
    try {
        const responsePokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`).then(r => r.json());
        const responseSpecies = await fetch(responsePokemon.species.url).then(r => r.json());
        return { responsePokemon, responseSpecies };
    }
    catch (innerError) {
        return { currentPokemon: null, currentSpecies: null };

    }
}

/**
 * used to get informations from fetchpokedate and set them to Variables
 * 
 * @param {Number} i - the Number of current Pokemon
 */
async function fetchAndSetPokeData(i) {
    try {
        const result = await fetchPokeData(i);
        currentPokemon = result.responsePokemon;
        currentSpecies = result.responseSpecies;
    }
    catch (innerError) {
        console.error("Fehler in fetchPokeData:", error);
        return { currentPokemon: null, currentSpecies: null };
    }
}

/**
 * is used to add the border corners on the start screen
 * 
 * @returns - a svg element as text
 */
async function getBorder() {
    const response = await fetch('./img/border.svg');
    const data = await response.text();
    return data;
}

/**
 * Calculates the last usable Pokémon ID. latest number minus 277 (that are the positions in database are cant use)
 * updated 277 to 326. currently the last 326 items in database are not useable
 * 
 * @returns - a calculatet number
 */
async function generateLastPokemonID() {
    lastId = ids[ids.length-1];
    return lastId;
}

/**
 * is used to fetch the informations from the evolutionchain Link and push them informations to the global evolution Variable
 * 
 */
async function fetchEvolution() {
    try {
        let responseSpeciesEvolution = await fetch(getSpeciesEvolutionURL());
        let responseSpeciesEvolutionAsJson = await responseSpeciesEvolution.json();
        evolution = responseSpeciesEvolutionAsJson
    } catch (error) {
        console.error(error);
    }
}