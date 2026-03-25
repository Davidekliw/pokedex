let allPokemons = [];
let currentSpecies;
let currentPokemon;
let speciesURL;
let evolution;
let picture;
let offset = 1;
let loadRange = 0;
let types = [];
let ids = 0;

const SPECIESURL = "https://pokeapi.co/api/v2/pokemon-species/";
const POKEMONURL = "https://pokeapi.co/api/v2/pokemon/"
const STARTURL = "https://pokeapi.co/api/v2/pokemon?limit=20&offset=";
const ALLURL = "https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0";


let currentIndex = + -1; // Initial index for the dropdown
const dropdownInput = document.getElementById('search');
const dropdownList = document.getElementById('dropDownList');
const dropdownItems = document.getElementById('dropDownList').querySelectorAll('.dropDownListLine');

// Listen for keydown events
dropdownInput.addEventListener('keydown', function (e) {
    const dropdownItems = document.getElementById('dropDownList').querySelectorAll('.dropDownListLine');
    const key = e.key;

    if (key === 'ArrowDown') {
        currentIndex = (currentIndex + 1) % dropdownItems.length;
        highlightItem(currentIndex);
    } else if (key === 'ArrowUp') {
        currentIndex = (currentIndex - 1 + dropdownItems.length) % dropdownItems.length;
        highlightItem(currentIndex);
    } else if (key === 'Enter') {
        if (currentIndex >= 0) {
            dropdownItems[currentIndex].click();
        }
    }
});

function highlightItem(index) {
    document.getElementById('dropDownList').querySelectorAll('.dropDownListLine').forEach(item => item.classList.remove('active'));
    document.getElementById('dropDownList').querySelectorAll('.dropDownListLine')[index].classList.add('active');
}

/**
 * is used to load 20 Pokemon on the Main screen and next 20 after click the "load More" Button
 */
async function loadMore() {
    loadRange = loadRange + 20;
    toogleLoadScreen('flex');
    disableButton(true);
    await loadPokemon();
    disableButton(false);
    toogleLoadScreen('none');
}

/**
 * Function is used to initialize first Site load
 */
async function init() {
    await loadMore();
    await loadAllPokemon();
}

/**
 * is used to enlarge the first letter of a string
 * 
 * @param {String} toEnlarge - a String to enlarge the first letter
 * @returns {String} - the String with first letter in big
 */
function writeTheFirstBig(toEnlarge) {
    if (!toEnlarge) {
        return "nothing found";
    }
    else {
        let enlarged = toEnlarge.charAt(0).toUpperCase() + toEnlarge.slice(1);
        return enlarged;
    }
}

/**
 * function is used to search whether the entered string is in the array to be searched. Search will start after 3 letters insertet.
 * 
 * @param {String} params - inserted user letters to search
 */
function search(params) {
    params = params.replace(/[^a-zA-Z]/g, '');
    ddSearchList = document.getElementById('dropDownList');
    ddSearchList.innerHTML = "";
    ddSearchList.classList.add('d-flex');
    if (params.length >= 3) {
        let searchfield = allPokemons.filter(pokemon => pokemon.nameEN.toLowerCase().includes(params.toLowerCase()));
        for (let i = 0; i < searchfield.length; i++) {
            const element = searchfield[i];
            ddSearchList.innerHTML += `<div onclick=loadSearchElement(${element.id + 1}) class="dropDownListLine">${element.id + 1} - ${writeTheFirstBig(element.nameEN)}</div>`;
        }
    }
}

/**
 * is used to clear and close DropDown List and show the Detail Card
 * 
 * @param {Number} i - the Id of the Selected Pokemon
 */
async function loadSearchElement(i) {
    document.getElementById('dropDownList').classList.remove('d-flex');
    await renderCard(i);
    document.getElementById('search').value = "";
}

/**
 * is used to generate the main card. The Ground object to position the other elements on that card
 * 
 * @param {Number} i - is the id of the currently processed Pokemon
 * @returns 
 */
function createPosDiv(i) {
    const posDiv = document.createElement('div');
    posDiv.id = `posDiv${i}`;
    posDiv.className = "posDiv";
    return posDiv;
}

/**
 * used to generate a Fallback Option with other output on a error
 * 
 * @returns - a HTML Code
 */
function buildNameLine() {
    if (variablesAreNull()) {
        return `<div class="attention">Enton is not sure what\`s wrong, but there is nothing. Really nothing to view.</div>`;
    }
    else {
        return `${currentPokemon['id']} ${writeTheFirstBig(currentPokemon['name'])} <div class="smalerSize">(${writeTheFirstBig(currentSpecies['names'][5]['name'])})</div>`;
    }
}


/**
 * create a h2 HTML Element and set the nameline with id, name and german name
 * 
 * @param {Number} i - is the id of the currently processed Pokemon
 * @returns 
 */
function createPokName(i) {
    const pokName = document.createElement('h2');
    pokName.className = "names";
    pokName.innerHTML = buildNameLine();
    return pokName;
}

/**
 * create a img HTML Element to position the picture of Pokemon
 * 
 * @param {Number} i - is the id of the currently processed Pokemon
 * @returns 
 */
function createBildElement(i) {
    const bildElement = document.createElement('img');
    bildElement.src = checkForPicturePath();
    bildElement.id = i;
    bildElement.classList = 'singlePoke';
    return bildElement;
}

/**
 * create a div HTML Element and set a id to position the types img elements later
 * 
 * @param {Number} i - is the id of the currently processed Pokemon
 * @returns 
 */
function createTypesDiv(i) {
    const typesDiv = document.createElement('div');
    typesDiv.id = `typesDiv${i}`;
    typesDiv.className = "typesDiv";
    return typesDiv;
}

/**
 * create a div HTML Element, set id and add a special border as a SVG Element. that are used to show the different Pokemon Colors
 * 
 * @param {Number} i - is the id of the currently processed Pokemon
 * @returns 
 */
async function createPosDivSVG(i) {
    const posDivSVG = document.createElement('div');
    posDivSVG.id = `svg-container${i}`;
    posDivSVG.className = "imgSize";
    posDivSVG.innerHTML = await getBorder();
    return posDivSVG;
}

/**
 * is used to check the variables for a zero value
 * 
 * @returns - true ore fals
 */
function variablesAreNull() {
    if ((currentSpecies || currentPokemon) === null) {
        return true;
    }
    return false;
}

/**
 * used to create the HTML Trestle for the Pokemoncards on load Screen
 * 
 * @param {Number} numb - is the id of the currently processed Pokemon
 */
async function createHTMLTrestle(i) {
    let posDiv = createPosDiv(i);
    let pokName = createPokName(i);
    let bildElement = createBildElement(i);
    let typesDiv = createTypesDiv(i);
    let posDivSVG = await createPosDivSVG(i);
    posDiv.append(pokName, bildElement, typesDiv, posDivSVG);
    document.getElementById('allPoke').appendChild(posDiv);
    document.getElementById(`svg-container${i}`).querySelector('svg').style.stroke = setBackgroundColor();
}

/**
 * is used to check for valid Variables as a Fallback Option. if its not valid shows a error
 * 
 * @param {Number} numb - is the id of the currently processed Pokemon
 */
async function checkkForValidDataAndRender(i) {
    await fetchAndSetPokeData(i);
    await createHTMLTrestle(i);
    if (!variablesAreNull()) {
        generateTypesArraySRC(i);
        setProgressbarProgress(i);
        document.getElementById(`posDiv${i}`).onclick = () => renderCard(i);
    }
}

/**
 * is used to show a card with more details of a selected pokemon
 * 
 * @param {Number} numb - is the id of the currently processed Pokemon
 */
async function renderCard(numb) {
    closeWindow();
    toogleLoadScreen('flex');
    document.getElementById('body').style.overflow = "hidden";
    await fetchAndSetPokeData(numb);
    if (variablesAreNull()) {
        closeWindow();
        alert("Something went wrong. No Data found.");
        toogleLoadScreen('none');
        return;
    }
    changeFlavorText();
    toogleLoadScreen('none');
    document.getElementById('dialog').style.display = 'flex';
    document.getElementById('position').style.display = 'flex';
    document.getElementById('pokemonName').innerHTML = generateNameLineHTML('Card');
    document.getElementById('pokemonCard').style.backgroundColor = setBackgroundColor();
    generateTypesArray();
    getStats();
    document.getElementById('basic').innerHTML = generateHTMLBasicsList();
    setPictureAfterAnimation();
    toggleOpacity();
    await fetchEvolution();
    await getEvolution();
}

/**
 * is used to add or subtract the pokemon id zu get the next or previous Pokemon
 * 
 * @param {String} direction - possible Values are back or forward
 * @returns 
 */
function generateSelectedPokemonId(direction) {
    let currentPokemonId = document.getElementById('currentViewIdCard').innerHTML;
    if (direction == 'back') {
        newPokemonId = --currentPokemonId;
    }
    if (direction == 'forward') {
        newPokemonId = ++currentPokemonId;
    }
    return newPokemonId;
}

/**
 * i used to load the next or previous Pokemon Detail Card
 * 
 * @param {String} direction - possible Values are back or forward
 */
async function loadACard(direction) {
    let selectedPokemon = generateSelectedPokemonId(direction);
    let lastPokemonId = await generateLastPokemonID();
    if (selectedPokemon > 0 && selectedPokemon <= lastPokemonId) {
        await renderCard(selectedPokemon);
    }
    else if (selectedPokemon <= 0) {
        await renderCard(lastPokemonId);
    }
    else {
        await renderCard('1');
    }
    // document.querySelector('.imageContainer').classList.add('active');
}

/**
 * is used to gett all types of a Pokemon and push them in a array
 * 
 */
function generateTypesArray() {
    types = [];
    for (let i = 0; i < currentPokemon['types'].length; i++) {
        const type = currentPokemon['types'][i]['type']['name'];
        types.push(type);
    }
}

/**
 * is used to generate a HTML code with one or more icons which represent the types of a Pokemon
 * 
 * @param {Number} i - is the id of the currently processed Pokemon
 */
function generateTypesArraySRC(i) {
    generateTypesArray();
    let currentSelectedDiv = document.getElementById(`typesDiv${i}`);
    for (let i = 0; i < types.length; i++) {
        const element = types[i];
        let createdElement = document.createElement('img');
        createdElement.src = `./icons/${element}.png`
        currentSelectedDiv.appendChild(createdElement);
    }
}

/**
 * is used to check whether path is available. if it not available choice a other path
 * 
 * @returns - a Picture Path
 */
function checkForPicturePath() {
    return currentPokemon?.sprites?.other?.dream_world?.front_default
        || currentPokemon?.sprites?.other?.home?.front_default
        || currentPokemon?.sprites?.other['official-artwork']?.front_default
        || "img/nothing.png";
}

/**
 * is used to check whether a german genera is available. if it not available choice a English genera and if that is not available too show a hint Text (nothing found).
 * 
 * @returns - the genera of a Pokemon or a text if there is nothing found
 */
function checkForGenera() {
    const foundGenera = currentSpecies.genera.find(
        entry => entry.language.name === "de"
    ) || currentSpecies.genera.find(
        entry => entry.language.name === "en"
    );
    return foundGenera ? foundGenera.genus : "nothing found";
}

/**
 * is used to check whether a german flavor text is available. if it not available choice a English flavor text and if that is not available show a hint text (nothing found)
 * 
 */
function changeFlavorText() {
    const foundEntry = currentSpecies?.flavor_text_entries.find(
        entry => entry.language.name === "de"
    ) ||
        currentSpecies?.flavor_text_entries.find(
            entry => entry.language.name === "en"
        );
    return foundEntry ? foundEntry.flavor_text : "nothing found";
}

/**
 * is used to get a the Evolution Chain Link URL
 * 
 * @returns - a url
 */
function getSpeciesEvolutionURL() {
    speciesURL = currentSpecies['evolution_chain']['url'];
    return speciesURL;
}

/**
 * is used to extract the Pokemon id out of the URL from the current Evolution chain
 * 
 * @param {String} evolutionURL - needs the URL of the Pokemon in the current evolution chain
 * @returns - the extractet Pokemon id
 */
function extractIdfromUrl(evolutionURL) {
    let lastDigits = undefined;
    if (evolutionURL !== undefined) {
        const parts = evolutionURL.split('/');
        lastDigits = parts[parts.length - 2];
    }
    return lastDigits;
}

/**
 * check the array chain to prepare the evolution chain links and get the pokemon id number
 * 
 */
async function getEvolution() {
    document.getElementById('evolution').innerHTML = "";
    let evolutionOneURL = evolution?.chain?.species?.url;
    let evolutionOneNmb = extractIdfromUrl(evolutionOneURL);
    let evolutionTwoURL = evolution?.chain?.evolves_to[0]?.species?.url;
    let evolutionTwoNmb = extractIdfromUrl(evolutionTwoURL);
    let evolutionThreeURL = evolution?.chain?.evolves_to[0]?.evolves_to[0]?.species?.url;
    let evolutionThreeNmb = extractIdfromUrl(evolutionThreeURL);
    let evolutionFourURL = evolution?.chain?.evolves_to[0]?.evolves_to[0]?.evolves_to[0]?.species?.url;
    let evolutionFourNmb = extractIdfromUrl(evolutionFourURL);
    await generateEvolutionTemplate(evolutionOneNmb);
    await generateEvolutionTemplate(evolutionTwoNmb);
    await generateEvolutionTemplate(evolutionThreeNmb);
    await generateEvolutionTemplate(evolutionFourNmb);
}
